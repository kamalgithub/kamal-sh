<script lang="ts">
	import type { Snippet } from 'svelte';
	import { reveal } from '$lib/utils/reveal';

	/** Purely decorative — a faint per-page hero identity. Omit for every other Section on
	 *  a page; only the page's opening one should carry it. See tokens.css for the values. */
	let { tint, children }: { tint?: 1 | 2 | 3; children: Snippet } = $props();

	const TINT_CLASS: Record<1 | 2 | 3, string> = {
		1: 'bg-tint-1',
		2: 'bg-tint-2',
		3: 'bg-tint-3'
	};
</script>

<section class="py-16 md:py-24 {tint ? TINT_CLASS[tint] : ''}" use:reveal>
	{@render children()}
</section>
