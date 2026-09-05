<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { profile } from '$lib/content/profile';
	import { nav, footerLinks } from '$lib/content/nav';
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
<CommandPalette />
<Nav links={nav} name="kamal.sh" />
<main>
	{@render children()}
</main>
<Footer {profile} {footerLinks} />
