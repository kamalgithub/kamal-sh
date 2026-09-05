<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		/** A small section mark, set above the headline rather than beside it so it never
		 *  competes with --text-display's scale. Reserved for the site's secondary/meta
		 *  pages (architecture, security, costs, postmortems) — not the core narrative
		 *  pages, where the serif headline itself already carries the identity. */
		icon: Component<{ size?: number }>;
		heading: string;
	}

	let { icon: Icon, heading }: Props = $props();
</script>

<div>
	<span
		class="mb-4 flex h-11 w-11 items-center justify-center rounded-sm border border-border-strong text-accent"
	>
		<Icon size={22} />
	</span>
	<h1 class="font-display text-display font-medium text-text">{heading}</h1>
</div>
