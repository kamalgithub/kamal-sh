<script lang="ts">
	import type { EducationEntry } from '$lib/content/education.types';

	let { entries }: { entries: EducationEntry[] } = $props();
</script>

<ul class="flex flex-col gap-4">
	{#each entries as entry (entry.institution + entry.startDate)}
		<li>
			<p class="font-display text-body font-semibold text-text">{entry.degree}</p>
			<p class="text-small text-text-muted">
				{entry.institution} · {entry.startDate} — {entry.endDate}
			</p>
			<p class="text-small text-text-muted">{entry.gpa}</p>
		</li>
	{/each}
</ul>
