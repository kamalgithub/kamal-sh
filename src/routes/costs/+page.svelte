<script lang="ts">
	import { costLineItems } from '$lib/content/costs';
	import { costsCopy } from '$lib/content/copy/costs';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import CostList from '$lib/components/costs/CostList.svelte';
</script>

<svelte:head>
	<title>Costs | Kamal Kumar</title>
	<meta name="description" content={costsCopy.intro} />
</svelte:head>

<Section>
	<Container>
		<h1 class="font-display text-display font-medium text-text">{costsCopy.heading}</h1>
		<p class="mt-3 max-w-2xl text-body text-text-muted">{costsCopy.intro}</p>
	</Container>
</Section>
<Section>
	<Container>
		<CostList items={costLineItems} />
		<div class="mt-8 flex items-baseline justify-between border-t border-border pt-6">
			<p class="text-body text-text-muted">{costsCopy.totalLabel}</p>
			<p class="font-display text-h2 font-medium text-text">{costsCopy.totalEstimate}</p>
		</div>
	</Container>
</Section>
