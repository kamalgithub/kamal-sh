<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		/** A small section mark, set above the headline rather than beside it so it never
		 *  competes with --text-display's scale. Used on every page's opening heading
		 *  except Home, which has its own photo-based Hero layout instead — see
		 *  docs/design-tokens.md's Icons section for why Home stays the exception. */
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
	<h1 class="mb-3 font-display text-display font-medium text-text">{heading}</h1>
</div>
