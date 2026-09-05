<script lang="ts">
	import type { SecurityPostureItem } from '$lib/content/security.types';
	import IconCheckCircle from '$lib/components/icons/IconCheckCircle.svelte';

	let { items }: { items: SecurityPostureItem[] } = $props();
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each items as item (item.label)}
		<li class="flex gap-3 py-4">
			<span class="mt-0.5 shrink-0 text-accent"><IconCheckCircle size={18} /></span>
			<div>
				<p class="text-body font-medium text-text">{item.label}</p>
				<p class="mt-1 text-body text-text-muted">{item.description}</p>
			</div>
		</li>
	{/each}
</ul>
