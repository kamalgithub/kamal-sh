<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '$lib/utils/reveal';

	let { children }: { children: Snippet } = $props();
</script>

<section class="py-16 md:py-24" use:reveal>
	{@render children()}
</section>
