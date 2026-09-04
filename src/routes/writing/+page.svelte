<script lang="ts">
	import posts from '$lib/content/writing/posts.generated.json';
	import videos from '$lib/content/youtube/videos.generated.json';
	import { writingCopy } from '$lib/content/copy/writing';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import WritingFeed from '$lib/components/writing/WritingFeed.svelte';
	import VideoFeed from '$lib/components/writing/VideoFeed.svelte';
</script>

<svelte:head>
	<title>Writing | Kamal Kumar</title>
	<meta name="description" content={writingCopy.intro} />
	<link rel="alternate" type="application/rss+xml" title="Kamal Kumar Writing" href="/rss.xml" />
</svelte:head>

<Section>
	<Container>
		<h1 class="font-display text-display font-medium text-text">{writingCopy.heading}</h1>
		<p class="mt-3 max-w-2xl text-body text-text-muted">{writingCopy.intro}</p>
	</Container>
</Section>
<Section>
	<Container>
		<h2 class="mb-6 font-display text-h2 font-medium text-text">{writingCopy.readHeading}</h2>
		<WritingFeed {posts} />
	</Container>
</Section>
<Section>
	<Container>
		<h2 class="mb-6 font-display text-h2 font-medium text-text">{writingCopy.watchHeading}</h2>
		<VideoFeed {videos} />
	</Container>
</Section>
