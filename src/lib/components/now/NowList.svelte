<script lang="ts">
	import type { NowItem } from '$lib/content/now.types';

	let { items }: { items: NowItem[] } = $props();
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each items as item (item.label)}
		<li class="flex flex-col gap-1 py-6 sm:flex-row sm:gap-8">
			<p class="text-small text-accent sm:w-32 sm:shrink-0">{item.label}</p>
			<p class="text-body text-text-muted">{item.detail}</p>
		</li>
	{/each}
</ul>
