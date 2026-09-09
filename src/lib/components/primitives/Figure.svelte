<script lang="ts">
	import IconImage from '$lib/components/icons/IconImage.svelte';
	import type { ContentImage } from '$lib/content/image.types';

	interface Props {
		/** Absent until a real asset is dropped in — renders a labeled placeholder instead of breaking layout. */
		image?: ContentImage;
		width: number;
		height: number;
		/** What the pending image will show — doubles as the placeholder's accessible label. */
		label: string;
		/** Override the default sizing/border classes — for a caller framing the image itself
		 *  (see Hero.svelte's portrait, which wraps this in its own matte/border treatment). */
		class?: string;
		/** 'eager' + fetchpriority 'high' only for a genuine LCP candidate above the fold
		 *  (Hero's portrait) — every other Figure stays the default 'lazy'. See
		 *  conventions.md's "Above-the-fold images" rule before changing this on a new caller. */
		loading?: 'lazy' | 'eager';
	}

	let {
		image,
		width,
		height,
		label,
		class: className = 'h-auto w-full rounded-sm border border-border object-cover',
		loading = 'lazy'
	}: Props = $props();

	const fetchpriority = $derived(loading === 'eager' ? 'high' : 'auto');
</script>

{#if image}
	{#if image.darkSrc}
		<img
			src={image.src}
			alt={image.alt}
			{width}
			{height}
			{loading}
			{fetchpriority}
			decoding="async"
			class="theme-image-light {className}"
		/>
		<img
			src={image.darkSrc}
			alt={image.alt}
			{width}
			{height}
			{loading}
			{fetchpriority}
			decoding="async"
			class="theme-image-dark {className}"
		/>
	{:else}
		<img
			src={image.src}
			alt={image.alt}
			{width}
			{height}
			{loading}
			{fetchpriority}
			decoding="async"
			class={className}
		/>
	{/if}
{:else}
	<div
		class="flex w-full flex-col items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-surface px-4 text-text-muted"
		style:aspect-ratio="{width} / {height}"
		role="img"
		aria-label={label}
	>
		<IconImage size={28} />
		<span class="max-w-[85%] text-center text-small">{label}</span>
	</div>
{/if}
