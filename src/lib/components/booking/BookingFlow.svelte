<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { getBookableDates } from '$lib/utils/getBookableDates';
	import { getTimeSlotsForDate } from '$lib/utils/getTimeSlotsForDate';
	import { buildCalendarWeeks } from '$lib/utils/buildCalendarWeeks';
	import { getMonthDates, addMonths } from '$lib/utils/getMonthDates';
	import { getIstCalendarDate, type CalendarDate } from '$lib/utils/ist';
	import { countryCallingCodesForSelect } from '$lib/content/countryCodes';
	import type { BookingCopy } from '$lib/content/copy/booking.types';
	import Button from '$lib/components/primitives/Button.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';

	const BOOKABLE_DAYS = 14;
	const DURATIONS_MINUTES = [15, 30, 45, 60];
	const STEPS = ['date', 'duration', 'details'] as const;
	// Covers the whole step area — content AND footer share this one budget (the content
	// is flex-1, the footer sits after it) so the footer reuses space that would otherwise
	// go unused on shorter steps, instead of adding its own height on top.
	const STEP_AREA_MIN_HEIGHT = 'min-h-[24rem]';

	interface BookingFormState {
		bookingSuccess?: boolean;
		bookingLocation?: string;
		bookingConflict?: boolean;
		bookingRateLimited?: boolean;
		bookingErrors?: {
			name?: string;
			email?: string;
			notes?: string;
			phone?: string;
			message?: string;
		};
		bookingValues?: {
			name?: string;
			email?: string;
			notes?: string;
			location?: string;
			phoneCountry?: string;
			phoneNumber?: string;
		};
	}

	let {
		copy,
		bookingUrl,
		turnstileSiteKey,
		form
	}: {
		copy: BookingCopy;
		bookingUrl: string;
		turnstileSiteKey: string;
		form?: BookingFormState;
	} = $props();

	// Shown as a fallback when the API path is unconfigured, rate-limited, or fails outright
	// — the visitor is never left with no way to book at all.
	const fallbackBookingUrl = $derived(`${bookingUrl}/meet`);

	// Computed client-side only (onMount never runs during prerender/SSR) so "today"
	// always reflects the real visitor's clock, not a stale build-time snapshot.
	let now = $state<Date | undefined>(undefined);
	onMount(() => {
		now = new Date();

		// Distinct global callback names from ContactForm's/NewsletterSubscribeForm's —
		// all three can in principle render a Turnstile widget on the same page.
		const withCallbacks = window as typeof window & {
			onBookingTurnstileSuccess?: () => void;
			onBookingTurnstileExpired?: () => void;
		};
		withCallbacks.onBookingTurnstileSuccess = () => {
			turnstileVerified = true;
		};
		withCallbacks.onBookingTurnstileExpired = () => {
			turnstileVerified = false;
		};

		return () => {
			delete withCallbacks.onBookingTurnstileSuccess;
			delete withCallbacks.onBookingTurnstileExpired;
		};
	});

	let step = $state<(typeof STEPS)[number]>('date');
	let selectedDate = $state<CalendarDate | undefined>(undefined);
	let selectedDuration = $state<number | undefined>(undefined);
	let selectedSlot = $state<Date | undefined>(undefined);
	let monthOffset = $state(0);
	// The one open tooltip at a time, keyed "year-month-day" — shared by hover and tap so
	// clicking a disabled date shows the exact same message a mouse user gets on hover.
	let openTooltipKey = $state<string | undefined>(undefined);
	let submitting = $state(false);
	let turnstileVerified = $state(false);
	// Turnstile's script + widget only load once the visitor actually starts filling in
	// the details step, not on page load — most visitors browsing /contact never book at
	// all, so loading Cloudflare's script and rendering a widget unconditionally wastes a
	// request and a moment of layout work for nearly everyone who lands here.
	let turnstileRequested = $state(false);
	let locationChoice = $state<'google-meet' | 'phone'>('google-meet');
	// Defaults to India (Kamal's own country) rather than an arbitrary first-in-list
	// entry — countryCallingCodesForSelect is already ordered that way, this just makes
	// the intent explicit here too.
	let phoneCountry = $state(form?.bookingValues?.phoneCountry || 'IN');

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

	// Stays on the same 'duration' step — picking a duration just reveals the matching
	// time slots below it, rather than navigating to a separate page. Re-picking a
	// different duration after a slot's already showing just recomputes `slots`
	// (already $derived off selectedDuration) in place.
	function selectDuration(minutes: number) {
		selectedDuration = minutes;
	}

	function selectSlot(slot: Date) {
		selectedSlot = slot;
		step = 'details';
	}

	function goBack() {
		if (step === 'details') step = 'duration';
		else step = 'date';
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

<svelte:head>
	{#if turnstileSiteKey && turnstileRequested}
		<!-- eslint-disable svelte/no-navigation-without-resolve -- external script, not an internal route -->
		<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{/if}
</svelte:head>

<div>
	<h2 class="mb-4 font-display text-h2 font-medium text-text">{copy.heading}</h2>

	{#if form?.bookingSuccess}
		<p class="text-body text-text" role="status">{copy.successMessage}</p>
	{:else if !now}
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
							class="flex h-10 w-10 items-center justify-center rounded-sm text-text-muted transition-theme hover:text-text disabled:pointer-events-none disabled:opacity-30"
						>
							<span class="block rotate-180"><IconArrowRight size={16} /></span>
						</button>
						<p class="font-display text-body font-medium text-text">{monthLabel}</p>
						<button
							type="button"
							onclick={goToNextMonth}
							disabled={monthOffset >= maxMonthOffset}
							aria-label={copy.nextMonthLabel}
							class="flex h-10 w-10 items-center justify-center rounded-sm text-text-muted transition-theme hover:text-text disabled:pointer-events-none disabled:opacity-30"
						>
							<IconArrowRight size={16} />
						</button>
					</div>
					<div class="grid grid-cols-7 gap-1 text-center">
						{#each copy.weekdayLabels as weekday (weekday)}
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
												class="aspect-square w-full rounded-sm border border-border-strong text-small text-text transition-theme hover:border-accent"
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
				{:else if step === 'duration' && selectedDate}
					<p class="mb-3 text-small text-text-muted">{copy.durationStepLabel}</p>
					<div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
						{#each DURATIONS_MINUTES as minutes (minutes)}
							<button
								type="button"
								onclick={() => selectDuration(minutes)}
								aria-pressed={selectedDuration === minutes}
								class="rounded-sm border px-3 py-3 text-small text-text transition-theme {selectedDuration ===
								minutes
									? 'border-accent'
									: 'border-border-strong hover:border-accent'}"
							>
								{copy.durationLabelTemplate.replace('{minutes}', String(minutes))}
							</button>
						{/each}
					</div>

					{#if selectedDuration}
						<p class="mt-6 mb-3 text-small text-text-muted">{copy.timeStepLabel}</p>
						{#if slots.length === 0}
							<p class="text-small text-text-muted">{copy.noSlotsMessage}</p>
						{:else}
							<div class="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2">
								{#each slots as slot (slot.toISOString())}
									<button
										type="button"
										onclick={() => selectSlot(slot)}
										class="rounded-sm border border-border-strong px-3 py-3 text-center text-small text-text transition-theme hover:border-accent hover:bg-surface"
									>
										{formatTimeLabel(slot)}
									</button>
								{/each}
							</div>
						{/if}
					{/if}
				{:else if step === 'details' && selectedDate && selectedDuration && selectedSlot}
					<p class="mb-3 text-small text-text-muted">{copy.detailsStepLabel}</p>

					{#if form?.bookingConflict}
						<p class="mb-3 text-small text-error" role="alert">{copy.conflictError}</p>
						<Button variant="secondary" onclick={() => (step = 'duration')}>{copy.backLabel}</Button
						>
					{:else}
						<form
							method="POST"
							action="?/book"
							onfocusin={() => (turnstileRequested = true)}
							use:enhance={() => {
								submitting = true;
								return async ({ update }) => {
									await update();
									submitting = false;
								};
							}}
							class="flex flex-col gap-3"
						>
							<input type="hidden" name="duration" value={selectedDuration} />
							<input type="hidden" name="start" value={selectedSlot.toISOString()} />

							<div>
								<label for="booking-name" class="text-small text-text-muted">{copy.nameLabel}</label
								>
								<input
									id="booking-name"
									name="name"
									type="text"
									required
									minlength="2"
									maxlength="100"
									value={form?.bookingValues?.name ?? ''}
									aria-invalid={form?.bookingErrors?.name ? 'true' : undefined}
									aria-describedby={form?.bookingErrors?.name ? 'booking-name-error' : undefined}
									class="mt-1 w-full rounded-sm border border-border-strong bg-transparent px-3 py-2 text-text transition-theme focus:border-accent focus:outline-hidden"
								/>
								{#if form?.bookingErrors?.name}
									<p id="booking-name-error" class="mt-1 text-small text-error">
										{form.bookingErrors.name}
									</p>
								{/if}
							</div>

							<div>
								<label for="booking-email" class="text-small text-text-muted"
									>{copy.emailLabel}</label
								>
								<input
									id="booking-email"
									name="email"
									type="email"
									required
									maxlength="254"
									value={form?.bookingValues?.email ?? ''}
									aria-invalid={form?.bookingErrors?.email ? 'true' : undefined}
									aria-describedby={form?.bookingErrors?.email ? 'booking-email-error' : undefined}
									class="mt-1 w-full rounded-sm border border-border-strong bg-transparent px-3 py-2 text-text transition-theme focus:border-accent focus:outline-hidden"
								/>
								{#if form?.bookingErrors?.email}
									<p id="booking-email-error" class="mt-1 text-small text-error">
										{form.bookingErrors.email}
									</p>
								{/if}
							</div>

							<div>
								<label for="booking-notes" class="text-small text-text-muted"
									>{copy.notesLabel}</label
								>
								<textarea
									id="booking-notes"
									name="notes"
									required
									maxlength="500"
									rows="2"
									aria-invalid={form?.bookingErrors?.notes ? 'true' : undefined}
									aria-describedby={form?.bookingErrors?.notes ? 'booking-notes-error' : undefined}
									class="mt-1 max-h-40 min-h-16 w-full resize-none overflow-y-auto rounded-sm border border-border-strong bg-transparent px-3 py-2 text-text transition-theme focus:border-accent focus:outline-hidden"
									>{form?.bookingValues?.notes ?? ''}</textarea
								>
								{#if form?.bookingErrors?.notes}
									<p id="booking-notes-error" class="mt-1 text-small text-error">
										{form.bookingErrors.notes}
									</p>
								{/if}
							</div>

							<fieldset>
								<legend class="text-small text-text-muted">{copy.locationLabel}</legend>
								<div role="radiogroup" class="mt-1 grid grid-cols-2 gap-2">
									<button
										type="button"
										role="radio"
										aria-checked={locationChoice === 'google-meet'}
										onclick={() => (locationChoice = 'google-meet')}
										class="rounded-sm border px-3 py-2 text-small transition-theme {locationChoice ===
										'google-meet'
											? 'border-accent text-text'
											: 'border-border-strong text-text-muted hover:border-accent'}"
									>
										{copy.locationGoogleMeetLabel}
									</button>
									<button
										type="button"
										role="radio"
										aria-checked={locationChoice === 'phone'}
										onclick={() => (locationChoice = 'phone')}
										class="rounded-sm border px-3 py-2 text-small transition-theme {locationChoice ===
										'phone'
											? 'border-accent text-text'
											: 'border-border-strong text-text-muted hover:border-accent'}"
									>
										{copy.locationPhoneLabel}
									</button>
								</div>
								<input type="hidden" name="location" value={locationChoice} />
							</fieldset>

							{#if locationChoice === 'phone'}
								<div>
									<label for="booking-phone" class="text-small text-text-muted"
										>{copy.phoneLabel}</label
									>
									<input
										id="booking-phone"
										name="phone"
										type="tel"
										required
										maxlength="20"
										value={form?.bookingValues?.phone ?? ''}
										aria-invalid={form?.bookingErrors?.phone ? 'true' : undefined}
										aria-describedby={form?.bookingErrors?.phone
											? 'booking-phone-error'
											: undefined}
										class="mt-1 w-full rounded-sm border border-border-strong bg-transparent px-3 py-2 text-text transition-theme focus:border-accent focus:outline-hidden"
									/>
									{#if form?.bookingErrors?.phone}
										<p id="booking-phone-error" class="mt-1 text-small text-error">
											{form.bookingErrors.phone}
										</p>
									{/if}
								</div>
							{/if}

							<!-- Honeypot — hidden from sighted users, invisible to real visitors, filled in only by bots. -->
							<div class="hidden" aria-hidden="true">
								<label for="booking-company">Company</label>
								<input
									id="booking-company"
									name="company"
									type="text"
									tabindex="-1"
									autocomplete="off"
								/>
							</div>

							{#if form?.bookingErrors?.message}
								<p class="text-small text-error" role="alert">{form.bookingErrors.message}</p>
								<!-- eslint-disable svelte/no-navigation-without-resolve -- external cal.com URL, not an internal route -->
								<a
									href={fallbackBookingUrl}
									target="_blank"
									rel="noopener"
									class="text-small text-accent transition-theme hover:text-text"
								>
									{fallbackBookingUrl}
								</a>
								<!-- eslint-enable svelte/no-navigation-without-resolve -->
							{/if}
							{#if form?.bookingRateLimited}
								<p class="text-small text-text-muted" role="status">{copy.conflictError}</p>
							{/if}

							{#if turnstileSiteKey && turnstileRequested}
								<!-- "flexible" adapts its width to the container instead of rendering at a
								     fixed box — this form sits inside a Card on a single mobile column. -->
								<div
									class="cf-turnstile"
									data-sitekey={turnstileSiteKey}
									data-callback="onBookingTurnstileSuccess"
									data-expired-callback="onBookingTurnstileExpired"
									data-size="flexible"
								></div>
							{/if}

							<Button
								type="submit"
								disabled={submitting || (turnstileSiteKey !== '' && !turnstileVerified)}
							>
								{submitting ? copy.confirmingLabel : copy.confirmLabel}
							</Button>
						</form>
					{/if}
				{/if}
			</div>

			{#if step !== 'details' || form?.bookingConflict}
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
			{/if}
		</div>
	{/if}
</div>
