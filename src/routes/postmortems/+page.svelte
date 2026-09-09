<script lang="ts">
	import { postmortems } from '$lib/content/postmortems';
	import { postmortemsCopy } from '$lib/content/copy/postmortems';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import PostmortemList from '$lib/components/postmortems/PostmortemList.svelte';
	import IconActivity from '$lib/components/icons/IconActivity.svelte';
</script>

<SeoHead title="Postmortems" description={postmortemsCopy.intro} />

<Section tint={1}>
	<Container>
		<PageHeading icon={IconActivity} heading={postmortemsCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{postmortemsCopy.intro}</p>
	</Container>
</Section>
<Section>
	<Container>
		<PostmortemList {postmortems} copy={postmortemsCopy} />
	</Container>
</Section>
