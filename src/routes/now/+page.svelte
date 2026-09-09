<script lang="ts">
	import { nowStatus } from '$lib/content/now';
	import { nowCopy } from '$lib/content/copy/now';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import IconCircleDot from '$lib/components/icons/IconCircleDot.svelte';
	import NowList from '$lib/components/now/NowList.svelte';
</script>

<SeoHead title="Now" description={nowCopy.intro} />

<Section tint={1}>
	<Container>
		<PageHeading icon={IconCircleDot} heading={nowCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{nowCopy.intro}</p>
		<p class="mt-4 text-small text-text-muted">{nowCopy.updatedLabel}: {nowStatus.updatedAt}</p>
	</Container>
</Section>
<Section>
	<Container>
		<NowList items={nowStatus.items} />
	</Container>
</Section>
