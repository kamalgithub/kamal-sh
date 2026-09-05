<script lang="ts">
	import posts from '$lib/content/writing/posts.generated.json';
	import videos from '$lib/content/youtube/videos.generated.json';
	import { profile } from '$lib/content/profile';
	import { aicademy } from '$lib/content/products/aicademy';
	import { writingCopy } from '$lib/content/copy/writing';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import IconPen from '$lib/components/icons/IconPen.svelte';
	import WritingFeed from '$lib/components/writing/WritingFeed.svelte';
	import VideoFeed from '$lib/components/writing/VideoFeed.svelte';
	import IconArrowUpRight from '$lib/components/icons/IconArrowUpRight.svelte';

	const LINK_CLASS =
		'inline-flex items-center gap-1 text-small text-accent transition-colors duration-(--duration-fast) ease-standard hover:text-text';

	// The blog itself is Aicademy's — sourced from that product's own links, not duplicated here.
	const blogUrl = aicademy.links.find((link) => link.label === 'Blog')?.url;
</script>

<SeoHead title="Writing | Kamal Kumar" description={writingCopy.intro} />
<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="Kamal Kumar Writing" href="/rss.xml" />
</svelte:head>

<Section tint={1}>
	<Container>
		<PageHeading icon={IconPen} heading={writingCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{writingCopy.intro}</p>
	</Container>
</Section>
<Section>
	<Container>
		<div class="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
			<h2 class="font-display text-h2 font-medium text-text">{writingCopy.readHeading}</h2>
			{#if blogUrl}
				<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
				<a href={blogUrl} target="_blank" rel="noreferrer" class={LINK_CLASS}>
					{writingCopy.readAllLabel}
					<IconArrowUpRight size={14} />
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			{/if}
		</div>
		<WritingFeed {posts} />
	</Container>
</Section>
<Section>
	<Container>
		<div class="mb-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
			<h2 class="font-display text-h2 font-medium text-text">{writingCopy.watchHeading}</h2>
			<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
			<a href={profile.links.youtube} target="_blank" rel="noreferrer" class={LINK_CLASS}>
				{writingCopy.watchChannelLabel}
				<IconArrowUpRight size={14} />
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		</div>
		<VideoFeed {videos} />
	</Container>
</Section>
