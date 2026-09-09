<script lang="ts">
	import { architectureNodes } from '$lib/content/architecture';
	import { architectureCopy } from '$lib/content/copy/architecture';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import ArchitectureDiagram from '$lib/components/architecture/ArchitectureDiagram.svelte';
	import IconLayers from '$lib/components/icons/IconLayers.svelte';
</script>

<SeoHead title="Architecture" description={architectureCopy.intro} />

<Section tint={2}>
	<Container>
		<PageHeading icon={IconLayers} heading={architectureCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{architectureCopy.intro}</p>
	</Container>
</Section>
<Section>
	<Container>
		<ArchitectureDiagram nodes={architectureNodes} copy={architectureCopy} />
	</Container>
</Section>
