<script lang="ts">
	import { usesCategories } from '$lib/content/uses';
	import { usesCopy } from '$lib/content/copy/uses';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import IconTool from '$lib/components/icons/IconTool.svelte';
	import UsesList from '$lib/components/uses/UsesList.svelte';
</script>

<SeoHead title="Uses | Kamal Kumar" description={usesCopy.intro} />

<Section tint={2}>
	<Container>
		<PageHeading icon={IconTool} heading={usesCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{usesCopy.intro}</p>
	</Container>
</Section>
<Section>
	<Container>
		<UsesList categories={usesCategories} />
	</Container>
</Section>
