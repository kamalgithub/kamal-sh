<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { profile } from '$lib/content/profile';
	import { nav } from '$lib/content/nav';
	import Nav from '$lib/components/nav/Nav.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Nav links={nav} name="kamal.sh" />
<main>
	{@render children()}
</main>
<Footer {profile} />
