<script lang="ts">
	import { onMount } from 'svelte';
	import { getBookableDates } from '$lib/utils/getBookableDates';
	import { getTimeSlotsForDate } from '$lib/utils/getTimeSlotsForDate';
	import { buildCalComUrl } from '$lib/utils/buildCalComUrl';
	import type { CalendarDate } from '$lib/utils/ist';
	import type { BookingCopy } from '$lib/content/copy/booking.types';
	import Button from '$lib/components/primitives/Button.svelte';

	const BOOKABLE_DAYS = 14;
	const DURATIONS_MINUTES = [15, 30, 45, 60];

	let { copy, bookingUrl }: { copy: BookingCopy; bookingUrl: string } = $props();

	// cal.com's username is derived from the existing booking URL rather than duplicated here.
	const calComUsername = $derived(new URL(bookingUrl).pathname.replace(/^\//, ''));

	// Computed client-side only (onMount never runs during prerender/SSR) so "today"
	// always reflects the real visitor's clock, not a stale build-time snapshot.
	let now = $state<Date | undefined>(undefined);
	onMount(() => {
		now = new Date();
	});

	let step = $state<'date' | 'duration' | 'time'>('date');
	let selectedDate = $state<CalendarDate | undefined>(undefined);
	let selectedDuration = $state<number | undefined>(undefined);

	const dates = $derived(now ? getBookableDates(now, BOOKABLE_DAYS) : []);
	const slots = $derived(
		now && selectedDate && selectedDuration
			? getTimeSlotsForDate(selectedDate, selectedDuration, now)
			: []
	);

	function formatDateLabel(date: CalendarDate): string {
		return new Date(Date.UTC(date.year, date.month, date.day)).toLocaleDateString(undefined, {
			weekday: 'short',
			month: 'short',
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
</script>

<div>
	<h2 class="mb-4 font-display text-h2 font-medium text-text">{copy.heading}</h2>

	{#if !now}
		<p class="text-small text-text-muted">{copy.loadingLabel}</p>
	{:else}
		{#if step === 'date'}
			<p class="mb-3 text-small text-text-muted">{copy.dateStepLabel}</p>
			<div class="grid grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-2">
				{#each dates as date (`${date.year}-${date.month}-${date.day}`)}
					<button
						type="button"
						onclick={() => selectDate(date)}
						class="rounded-sm border border-border-strong px-3 py-3 text-small text-text transition-colors duration-(--duration-fast) ease-standard hover:border-accent"
					>
						{formatDateLabel(date)}
					</button>
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
			<div class="mt-4">
				<Button variant="secondary" onclick={() => (step = 'date')}>{copy.backLabel}</Button>
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
			<div class="mt-4">
				<Button variant="secondary" onclick={() => (step = 'duration')}>{copy.backLabel}</Button>
			</div>
		{/if}
	{/if}
</div>
