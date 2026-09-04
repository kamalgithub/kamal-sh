<script lang="ts">
	import type { NavLink } from '$lib/content/nav.types';
	import NavMobile from './NavMobile.svelte';
	import NavDesktop from './NavDesktop.svelte';

	let { links, name }: { links: NavLink[]; name: string } = $props();
</script>

<div class="md:hidden">
	<NavMobile {links} {name} />
</div>
<div class="hidden md:block">
	<NavDesktop {links} {name} />
</div>
