<script lang="ts">
	import type { EducationEntry } from '$lib/content/education.types';

	let { entries }: { entries: EducationEntry[] } = $props();
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each entries as entry (entry.institution + entry.startDate)}
		<li class="py-4">
			<p class="font-display text-body font-semibold text-text">{entry.degree}</p>
			<p class="text-small text-text-muted">{entry.institution}</p>
			<p class="text-small text-text-muted">{entry.startDate} to {entry.endDate}, {entry.gpa}</p>
		</li>
	{/each}
</ul>
