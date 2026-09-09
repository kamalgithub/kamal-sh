<script lang="ts">
	import { changelog } from '$lib/content/changelog';
	import { changelogCopy } from '$lib/content/copy/changelog';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import IconGitCommit from '$lib/components/icons/IconGitCommit.svelte';
	import ChangelogList from '$lib/components/changelog/ChangelogList.svelte';
</script>

<SeoHead title="Changelog" description={changelogCopy.intro} />

<Section tint={1}>
	<Container>
		<PageHeading icon={IconGitCommit} heading={changelogCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{changelogCopy.intro}</p>
	</Container>
</Section>
<Section>
	<Container>
		<ChangelogList entries={changelog} copy={changelogCopy} />
	</Container>
</Section>
