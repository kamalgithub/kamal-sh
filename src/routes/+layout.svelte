<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { profile } from '$lib/content/profile';
	import { nav, footerLinks } from '$lib/content/nav';
	import { site } from '$lib/content/site';
	import { buildPersonJsonLd } from '$lib/utils/buildPersonJsonLd';
	import { toJsonLdScript } from '$lib/utils/jsonLd';
	import Nav from '$lib/components/nav/Nav.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';
	import CommandPalette from '$lib/components/command-palette/CommandPalette.svelte';

	let { children } = $props();
	const personJsonLd = toJsonLdScript(buildPersonJsonLd(profile));
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- toJsonLdScript escapes every "<" itself; content is our own static profile data, never user input -->
	{@html personJsonLd}
</svelte:head>
<a
	href="#main-content"
	class="sr-only rounded-sm bg-text px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
>
	{site.skipToContentLabel}
</a>
<CommandPalette />
<Nav links={nav} name="kamal.sh" />
<main id="main-content" class="flex-1">
	{@render children()}
</main>
<Footer {profile} {footerLinks} />
