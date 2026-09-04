<script lang="ts">
	import type { CaseStudyBlock } from '$lib/content/case-studies.types';

	let { blocks }: { blocks: CaseStudyBlock[] } = $props();
</script>

<div class="flex flex-col gap-8">
	{#each blocks as block, i (i)}
		{#if block.type === 'narrative'}
			<div>
				<h2 class="font-display text-h2 font-semibold text-text">{block.heading}</h2>
				<p class="mt-3 text-body text-text-muted">{block.body}</p>
			</div>
		{:else if block.type === 'stat-grid'}
			<dl
				class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-6 rounded-2xl border border-(--surface-glass-border) bg-(--surface-glass-bg) p-6 backdrop-blur-(--surface-glass-blur)"
			>
				{#each block.stats as stat (stat.label)}
					<div>
						<dt class="text-small text-text-muted">{stat.label}</dt>
						<dd class="font-display text-h2 font-semibold text-text">{stat.value}</dd>
					</div>
				{/each}
			</dl>
		{/if}
	{/each}
</div>
