<script lang="ts">
	import IconImage from '$lib/components/icons/IconImage.svelte';

	interface FigureImage {
		src: string;
		alt: string;
	}

	interface Props {
		/** Absent until a real asset is dropped in — renders a labeled placeholder instead of breaking layout. */
		image?: FigureImage;
		width: number;
		height: number;
		/** What the pending image will show — doubles as the placeholder's accessible label. */
		label: string;
	}

	let { image, width, height, label }: Props = $props();
</script>

{#if image}
	<img
		src={image.src}
		alt={image.alt}
		{width}
		{height}
		loading="lazy"
		class="h-auto w-full rounded-sm border border-border object-cover"
	/>
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
