<script lang="ts">
	import { onMount } from 'svelte';
	import { getBookableDates } from '$lib/utils/getBookableDates';
	import { getTimeSlotsForDate } from '$lib/utils/getTimeSlotsForDate';
	import { buildCalComUrl } from '$lib/utils/buildCalComUrl';
	import { buildCalendarWeeks } from '$lib/utils/buildCalendarWeeks';
	import { getMonthDates, addMonths } from '$lib/utils/getMonthDates';
	import { getIstCalendarDate, type CalendarDate } from '$lib/utils/ist';
	import type { BookingCopy } from '$lib/content/copy/booking.types';
	import Button from '$lib/components/primitives/Button.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';

	const BOOKABLE_DAYS = 14;
	const DURATIONS_MINUTES = [15, 30, 45, 60];
	const STEPS = ['date', 'duration', 'time'] as const;
	const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	// Covers the whole step area — content AND footer share this one budget (the content
	// is flex-1, the footer sits after it) so the footer reuses space that would otherwise
	// go unused on shorter steps, instead of adding its own height on top.
	const STEP_AREA_MIN_HEIGHT = 'min-h-[20rem]';

	let { copy, bookingUrl }: { copy: BookingCopy; bookingUrl: string } = $props();

	// cal.com's username is derived from the existing booking URL rather than duplicated here.
	const calComUsername = $derived(new URL(bookingUrl).pathname.replace(/^\//, ''));

	// Computed client-side only (onMount never runs during prerender/SSR) so "today"
	// always reflects the real visitor's clock, not a stale build-time snapshot.
	let now = $state<Date | undefined>(undefined);
	onMount(() => {
		now = new Date();
	});

	let step = $state<(typeof STEPS)[number]>('date');
	let selectedDate = $state<CalendarDate | undefined>(undefined);
	let selectedDuration = $state<number | undefined>(undefined);
	let monthOffset = $state(0);
	// The one open tooltip at a time, keyed "year-month-day" — shared by hover and tap so
	// clicking a disabled date shows the exact same message a mouse user gets on hover.
	let openTooltipKey = $state<string | undefined>(undefined);

	const dates = $derived(now ? getBookableDates(now, BOOKABLE_DAYS) : []);
	const today = $derived(now ? getIstCalendarDate(now) : undefined);
	// Bounded to months that actually contain a bookable date — navigating further would
	// only ever show an entirely faded, unbookable month, which is just noise.
	const maxMonthOffset = $derived(
		today && dates.length > 0
			? (dates[dates.length - 1].year - today.year) * 12 +
					(dates[dates.length - 1].month - today.month)
			: 0
	);
	const viewedMonth = $derived(today ? addMonths(today.year, today.month, monthOffset) : undefined);
	const monthWeeks = $derived(
		viewedMonth ? buildCalendarWeeks(getMonthDates(viewedMonth.year, viewedMonth.month)) : []
	);
	const monthLabel = $derived(
		viewedMonth
			? new Date(Date.UTC(viewedMonth.year, viewedMonth.month, 1)).toLocaleDateString(undefined, {
					month: 'long',
					year: 'numeric',
					timeZone: 'UTC'
				})
			: ''
	);
	const slots = $derived(
		now && selectedDate && selectedDuration
			? getTimeSlotsForDate(selectedDate, selectedDuration, now)
			: []
	);
	const stepProgressText = $derived(
		copy.stepProgressLabel
			.replace('{current}', String(STEPS.indexOf(step) + 1))
			.replace('{total}', String(STEPS.length))
	);

	function isSameDate(a: CalendarDate, b: CalendarDate): boolean {
		return a.year === b.year && a.month === b.month && a.day === b.day;
	}

	function dateKey(date: CalendarDate): string {
		return `${date.year}-${date.month}-${date.day}`;
	}

	// The month is now always shown separately in the header above, so a day cell only
	// ever needs its own number — no more "Sep 5" special-casing at range/month starts.
	function isBookable(date: CalendarDate): boolean {
		return dates.some((d) => isSameDate(d, date));
	}

	function formatDateAriaLabel(date: CalendarDate): string {
		return new Date(Date.UTC(date.year, date.month, date.day)).toLocaleDateString(undefined, {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC'
		});
	}

	function formatTimeLabel(slot: Date): string {
		return slot.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
	}

	function selectDate(date: CalendarDate) {
		selectedDate = date;
		step = 'duration';
	}

	function selectDuration(minutes: number) {
		selectedDuration = minutes;
		step = 'time';
	}

	function goBack() {
		step = step === 'time' ? 'duration' : 'date';
	}

	// Click toggles (so tapping the same date again dismisses it); hover shows/hides via
	// the CSS below independently — either way the visitor sees the identical message.
	function toggleTooltip(date: CalendarDate) {
		const key = dateKey(date);
		openTooltipKey = openTooltipKey === key ? undefined : key;
	}

	function goToPreviousMonth() {
		if (monthOffset > 0) monthOffset -= 1;
	}

	function goToNextMonth() {
		if (monthOffset < maxMonthOffset) monthOffset += 1;
	}
</script>

<div>
	<h2 class="mb-4 font-display text-h2 font-medium text-text">{copy.heading}</h2>

	{#if !now}
		<p class="text-small text-text-muted">{copy.loadingLabel}</p>
	{:else}
		<div class="flex {STEP_AREA_MIN_HEIGHT} flex-col gap-6">
			<div class="flex-1">
				{#if step === 'date'}
					<p class="mb-3 text-small text-text-muted">{copy.dateStepLabel}</p>
					<!-- Month named here, once, instead of buried in the date cells (was ambiguous
					     on mobile where a first-of-month cell easily gets missed/cropped). -->
					<div class="mb-2 flex items-center justify-between">
						<button
							type="button"
							onclick={goToPreviousMonth}
							disabled={monthOffset <= 0}
							aria-label={copy.previousMonthLabel}
							class="flex h-10 w-10 items-center justify-center rounded-sm text-text-muted transition-colors duration-(--duration-fast) ease-standard hover:text-text disabled:pointer-events-none disabled:opacity-30"
						>
							<span class="block rotate-180"><IconArrowRight size={16} /></span>
						</button>
						<p class="font-display text-body font-medium text-text">{monthLabel}</p>
						<button
							type="button"
							onclick={goToNextMonth}
							disabled={monthOffset >= maxMonthOffset}
							aria-label={copy.nextMonthLabel}
							class="flex h-10 w-10 items-center justify-center rounded-sm text-text-muted transition-colors duration-(--duration-fast) ease-standard hover:text-text disabled:pointer-events-none disabled:opacity-30"
						>
							<IconArrowRight size={16} />
						</button>
					</div>
					<div class="grid grid-cols-7 gap-1 text-center">
						{#each WEEKDAY_LABELS as weekday (weekday)}
							<span class="py-1 text-small text-text-muted">{weekday}</span>
						{/each}
						{#each monthWeeks as week, weekIndex (weekIndex)}
							{#each week as date, dayIndex (dayIndex)}
								{#if date}
									{@const bookable = isBookable(date)}
									{@const key = dateKey(date)}
									<div class="group relative">
										{#if bookable}
											<button
												type="button"
												onclick={() => selectDate(date)}
												aria-label={formatDateAriaLabel(date)}
												class="aspect-square w-full rounded-sm border border-border-strong text-small text-text transition-colors duration-(--duration-fast) ease-standard hover:border-accent"
											>
												{date.day}
											</button>
										{:else}
											<button
												type="button"
												onclick={() => toggleTooltip(date)}
												aria-label="{formatDateAriaLabel(date)} — {copy.outsideWindowTooltip}"
												aria-disabled="true"
												class="aspect-square w-full rounded-sm border border-border text-small text-text-muted/60"
											>
												{date.day}
											</button>
											<span
												role="tooltip"
												class="pointer-events-none absolute top-full z-10 mt-1 w-36 max-w-[calc(100vw-2rem)] rounded-sm border border-border-strong bg-surface px-2 py-1 text-left text-small text-text opacity-0 shadow-none transition-opacity duration-(--duration-fast) ease-standard group-hover:opacity-100 {dayIndex <=
												1
													? 'left-0'
													: dayIndex >= 5
														? 'right-0'
														: 'left-1/2 -translate-x-1/2'} {openTooltipKey === key
													? 'opacity-100'
													: ''}"
											>
												{copy.outsideWindowTooltip}
											</span>
										{/if}
									</div>
								{:else}
									<span></span>
								{/if}
							{/each}
						{/each}
					</div>
				{:else if step === 'duration'}
					<p class="mb-3 text-small text-text-muted">{copy.durationStepLabel}</p>
					<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
						{#each DURATIONS_MINUTES as minutes (minutes)}
							<button
								type="button"
								onclick={() => selectDuration(minutes)}
								class="rounded-sm border border-border-strong px-3 py-3 text-small text-text transition-colors duration-(--duration-fast) ease-standard hover:border-accent"
							>
								{minutes} min
							</button>
						{/each}
					</div>
				{:else if step === 'time' && selectedDate && selectedDuration}
					<p class="mb-3 text-small text-text-muted">{copy.timeStepLabel}</p>
					{#if slots.length === 0}
						<p class="text-small text-text-muted">{copy.noSlotsMessage}</p>
					{:else}
						<div class="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2">
							{#each slots as slot (slot.toISOString())}
								<!-- eslint-disable svelte/no-navigation-without-resolve -- external cal.com URL, not an internal route -->
								<a
									href={buildCalComUrl(calComUsername, selectedDuration, slot)}
									target="_blank"
									rel="noopener"
									class="rounded-sm border border-border-strong px-3 py-3 text-center text-small text-text transition-colors duration-(--duration-fast) ease-standard hover:border-accent hover:bg-surface"
								>
									{formatTimeLabel(slot)}
								</a>
								<!-- eslint-enable svelte/no-navigation-without-resolve -->
							{/each}
						</div>
					{/if}
				{/if}
			</div>

			<div class="flex flex-col items-center gap-4">
				{#if step !== 'date'}
					<Button variant="secondary" onclick={goBack}>{copy.backLabel}</Button>
				{/if}
				<div class="flex items-center gap-2">
					<span class="sr-only">{stepProgressText}</span>
					{#each STEPS as s (s)}
						<span
							aria-hidden="true"
							class="h-1.5 w-1.5 rounded-full {step === s ? 'bg-accent' : 'bg-border-strong'}"
						></span>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>
