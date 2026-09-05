<script lang="ts">
	import { page } from '$app/state';
	import { site } from '$lib/content/site';
	import { profile } from '$lib/content/profile';

	/** Centralizes every page's <title>/description/canonical/Open Graph/Twitter Card tags
	 *  — previously each +page.svelte set its own <title> and description and nothing
	 *  else, so links shared anywhere (Slack, iMessage, Twitter) had no preview at all. */
	let { title, description, image }: { title: string; description: string; image?: string } =
		$props();

	const canonicalUrl = $derived(`${site.url}${page.url.pathname}`);
	// Falls back to the real portrait rather than shipping no image at all — every other
	// page-level image (a case study, a product screenshot) is passed in explicitly.
	const resolvedImagePath = $derived(image ?? profile.photo?.src);
	const ogImage = $derived(resolvedImagePath ? `${site.url}${resolvedImagePath}` : undefined);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={profile.name} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	{#if ogImage}
		<meta property="og:image" content={ogImage} />
		<meta property="og:image:alt" content={title} />
	{/if}

	<meta name="twitter:card" content={ogImage ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if ogImage}
		<meta name="twitter:image" content={ogImage} />
	{/if}
</svelte:head>
