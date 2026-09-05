<script lang="ts">
	import { products } from '$lib/content/products/products';
	import { buildingCopy } from '$lib/content/copy/building';
	import { ctaCopy } from '$lib/content/copy/cta';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import BuildingShowcase from '$lib/components/building/BuildingShowcase.svelte';
	import ClosingCta from '$lib/components/cta/ClosingCta.svelte';
</script>

<svelte:head>
	<title>Building | Kamal Kumar</title>
	<meta name="description" content={buildingCopy.intro} />
</svelte:head>

<Section tint={3}>
	<Container>
		<h1 class="font-display text-display font-medium text-text">{buildingCopy.heading}</h1>
		<p class="mt-3 max-w-2xl text-body text-text-muted">{buildingCopy.intro}</p>
	</Container>
</Section>
<BuildingShowcase {products} linkLabel={buildingCopy.linkLabel} />
<ClosingCta copy={ctaCopy} />
