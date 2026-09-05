<script lang="ts">
	import { onMount } from 'svelte';
	import { getBookableDates } from '$lib/utils/getBookableDates';
	import { getTimeSlotsForDate } from '$lib/utils/getTimeSlotsForDate';
	import { buildCalComUrl } from '$lib/utils/buildCalComUrl';
	import { buildCalendarWeeks } from '$lib/utils/buildCalendarWeeks';
	import type { CalendarDate } from '$lib/utils/ist';
	import type { BookingCopy } from '$lib/content/copy/booking.types';
	import Button from '$lib/components/primitives/Button.svelte';

	const BOOKABLE_DAYS = 14;
	const DURATIONS_MINUTES = [15, 30, 45, 60];
	const STEPS = ['date', 'duration', 'time'] as const;
	const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	// Tall enough for the calendar step (its worst case: a header row + up to three
	// 7-column weeks) so the footer (Back button + step dots) lands in the same place
	// no matter which step is showing — that's the point of this fixed reservation.
	const CONTENT_MIN_HEIGHT = 'min-h-[22rem]';

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

	const dates = $derived(now ? getBookableDates(now, BOOKABLE_DAYS) : []);
	const calendarWeeks = $derived(buildCalendarWeeks(dates));
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

	// The day number alone is ambiguous across a month boundary, so the first bookable
	// day and the 1st of any later month also show a short month name.
	function formatDayLabel(date: CalendarDate): string {
		const isRangeStart = dates.length > 0 && isSameDate(date, dates[0]);
		if (isRangeStart || date.day === 1) {
			return new Date(Date.UTC(date.year, date.month, date.day)).toLocaleDateString(undefined, {
				month: 'short',
				day: 'numeric',
				timeZone: 'UTC'
			});
		}
		return String(date.day);
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
</script>

<div>
	<h2 class="mb-4 font-display text-h2 font-medium text-text">{copy.heading}</h2>

	{#if !now}
		<p class="text-small text-text-muted">{copy.loadingLabel}</p>
	{:else}
		<div class={CONTENT_MIN_HEIGHT}>
			{#if step === 'date'}
				<p class="mb-3 text-small text-text-muted">{copy.dateStepLabel}</p>
				<div class="grid grid-cols-7 gap-1 text-center">
					{#each WEEKDAY_LABELS as weekday (weekday)}
						<span class="py-1 text-small text-text-muted">{weekday}</span>
					{/each}
					{#each calendarWeeks as week, weekIndex (weekIndex)}
						{#each week as date, dayIndex (dayIndex)}
							{#if date}
								<button
									type="button"
									onclick={() => selectDate(date)}
									aria-label={formatDateAriaLabel(date)}
									class="aspect-square rounded-sm border border-border-strong text-small text-text transition-colors duration-(--duration-fast) ease-standard hover:border-accent"
								>
									{formatDayLabel(date)}
								</button>
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

		<div class="mt-6 flex flex-col items-center gap-4">
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
	{/if}
</div>
