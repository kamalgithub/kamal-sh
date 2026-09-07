<script lang="ts">
	import type { CareerTimelineEntry } from '$lib/utils/buildCareerTimeline';
	import IconBriefcase from '$lib/components/icons/IconBriefcase.svelte';
	import IconGraduationCap from '$lib/components/icons/IconGraduationCap.svelte';
	import IconCheckCircle from '$lib/components/icons/IconCheckCircle.svelte';

	let { entries }: { entries: CareerTimelineEntry[] } = $props();

	const ICONS = {
		experience: IconBriefcase,
		education: IconGraduationCap,
		certification: IconCheckCircle
	} as const;
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each entries as entry (entry.kind + entry.label)}
		{@const Icon = ICONS[entry.kind]}
		<li class="flex items-start gap-3 py-3">
			<span class="mt-0.5 shrink-0 text-text-muted">
				<Icon size={16} />
			</span>
			<div
				class="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
			>
				<p class="text-small text-text">{entry.label}</p>
				<p class="shrink-0 text-small text-text-muted">{entry.year}</p>
			</div>
		</li>
	{/each}
</ul>
