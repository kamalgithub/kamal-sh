<script lang="ts">
	import type { Stat } from '$lib/content/stats.types';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';

	let { stats }: { stats: Stat[] } = $props();
</script>

<Section>
	<Container>
		<dl class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-8">
			{#each stats as stat (stat.label)}
				<div class="flex flex-col gap-1">
					<dt class="text-small text-text-muted">{stat.label}</dt>
					<dd class="font-display text-h2 font-medium text-text">{stat.value}</dd>
				</div>
			{/each}
		</dl>
	</Container>
</Section>
