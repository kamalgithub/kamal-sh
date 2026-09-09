<script lang="ts">
	import { costLineItems } from '$lib/content/costs';
	import { costsCopy } from '$lib/content/copy/costs';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import CostList from '$lib/components/costs/CostList.svelte';
	import IconGauge from '$lib/components/icons/IconGauge.svelte';
</script>

<SeoHead title="Costs" description={costsCopy.intro} />

<Section tint={3}>
	<Container>
		<PageHeading icon={IconGauge} heading={costsCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{costsCopy.intro}</p>
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
