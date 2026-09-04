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
		'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-5 text-small font-medium transition-[background-color,border-color,box-shadow,opacity] duration-(--duration-fast) ease-standard focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50';

	const variants = {
		primary: 'bg-accent text-white hover:bg-(--color-accent-hover)',
		secondary: 'border border-border bg-transparent text-text hover:bg-surface'
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
