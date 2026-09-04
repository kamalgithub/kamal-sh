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

	// Primary is a solid "ink stamp" fill — bg/text swap the already-guaranteed-readable
	// text/bg pair, so no separate high-contrast fill color is needed. No accent color on
	// buttons at all — accent is reserved for text links and rules elsewhere.
	const variants = {
		primary: 'bg-text text-bg hover:opacity-90',
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
