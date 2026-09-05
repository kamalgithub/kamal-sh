<script lang="ts">
	import type { NavLink } from '$lib/content/nav.types';
	import NavMobile from './NavMobile.svelte';
	import NavDesktop from './NavDesktop.svelte';

	let { links, name }: { links: NavLink[]; name: string } = $props();
</script>

<NavMobile {links} {name} />
<NavDesktop {links} {name} />
