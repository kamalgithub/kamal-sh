<script lang="ts">
	import type { CaseStudyBlock } from '$lib/content/case-studies.types';

	let { blocks }: { blocks: CaseStudyBlock[] } = $props();
</script>

<div class="flex flex-col gap-8">
	{#each blocks as block, i (i)}
		{#if block.type === 'narrative'}
			<div>
				<h2 class="font-display text-h2 font-medium text-text">{block.heading}</h2>
				<p class="mt-3 text-body text-text-muted">{block.body}</p>
			</div>
		{:else if block.type === 'stat-grid'}
			<dl
				class="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-6 border-y border-border py-8"
			>
				{#each block.stats as stat (stat.label)}
					<div>
						<dt class="text-small text-text-muted">{stat.label}</dt>
						<dd class="font-display text-h2 font-medium text-text">{stat.value}</dd>
					</div>
				{/each}
			</dl>
		{:else if block.type === 'tradeoffs'}
			<div>
				<h2 class="font-display text-h2 font-medium text-text">{block.heading}</h2>
				<ul class="mt-4 flex flex-col divide-y divide-border border-t border-border">
					{#each block.considered as tradeoff (tradeoff.option)}
						<li class="py-4">
							<p class="text-body font-medium text-text">{tradeoff.option}</p>
							<p class="mt-1 text-body text-text-muted">{tradeoff.rejectedBecause}</p>
						</li>
					{/each}
				</ul>
				<p class="mt-6 border-l-2 border-accent pl-4 text-body text-text-muted">
					{block.whatIdChangeNow}
				</p>
			</div>
		{/if}
	{/each}
</div>
