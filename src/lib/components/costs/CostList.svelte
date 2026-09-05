<script lang="ts">
	import type { CostLineItem } from '$lib/content/costs.types';

	let { items }: { items: CostLineItem[] } = $props();
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each items as item (item.label)}
		<li class="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
			<div class="sm:max-w-md">
				<p class="text-body font-medium text-text">{item.label}</p>
				<p class="mt-1 text-small text-text-muted">{item.note}</p>
			</div>
			<p class="shrink-0 font-display text-h2 font-medium text-text">{item.monthlyEstimate}</p>
		</li>
	{/each}
</ul>
