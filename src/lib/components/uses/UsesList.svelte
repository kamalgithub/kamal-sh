<script lang="ts">
	import type { UsesCategory } from '$lib/content/uses.types';

	let { categories }: { categories: UsesCategory[] } = $props();
</script>

<div class="flex flex-col gap-12">
	{#each categories as category (category.heading)}
		<div>
			<h2 class="mb-4 font-display text-h2 font-medium text-text">{category.heading}</h2>
			<ul class="flex flex-col divide-y divide-border border-t border-border">
				{#each category.tools as tool (tool.name)}
					<li class="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8">
						<p class="text-body font-medium text-text sm:w-48 sm:shrink-0">{tool.name}</p>
						<p class="text-small text-text-muted">{tool.detail}</p>
					</li>
				{/each}
			</ul>
		</div>
	{/each}
</div>
