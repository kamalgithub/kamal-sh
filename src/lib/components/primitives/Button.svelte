<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary';
		href?: string;
		type?: 'button' | 'submit';
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		href,
		type = 'button',
		disabled = false,
		onclick,
		children
	}: Props = $props();

	const base =
		'inline-flex min-h-11 min-w-11 items-center justify-center rounded-sm px-6 text-small font-medium transition-[background-color,border-color,color,opacity] duration-(--duration-fast) ease-standard focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50';

	// Primary is a solid accent fill. Text uses --color-bg (not a fixed black/white) because
	// that's the one token verified to contrast well against accent in *both* themes: dark
	// mode's accent (#5C82FF) needs near-black text (~5.7:1), light mode's accent (#2544B0)
	// needs near-white text (~7.9:1) — --color-bg happens to already flip between exactly
	// those two values for the page background, so it doubles as the correct button-text
	// color with no new token. See docs/design-tokens.md for the verified ratios.
	const variants = {
		primary: 'bg-accent text-bg hover:opacity-90',
		secondary: 'border border-text text-text hover:bg-text hover:text-bg'
	} as const;

	const classes = $derived(`${base} ${variants[variant]}`);
</script>

{#if href}
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a {href} {onclick} class={classes}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} {onclick} class={classes}>
		{@render children()}
	</button>
{/if}
