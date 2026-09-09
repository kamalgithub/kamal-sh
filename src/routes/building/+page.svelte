<script lang="ts">
	import { products } from '$lib/content/products/products';
	import { buildingCopy } from '$lib/content/copy/building';
	import { ctaCopy } from '$lib/content/copy/cta';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import IconTool from '$lib/components/icons/IconTool.svelte';
	import BuildingShowcase from '$lib/components/building/BuildingShowcase.svelte';
	import ClosingCta from '$lib/components/cta/ClosingCta.svelte';
</script>

<SeoHead title="Building" description={buildingCopy.intro} />

<Section tint={3}>
	<Container>
		<PageHeading icon={IconTool} heading={buildingCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{buildingCopy.intro}</p>
	</Container>
</Section>
<BuildingShowcase {products} linkLabel={buildingCopy.linkLabel} />
<ClosingCta copy={ctaCopy} />
