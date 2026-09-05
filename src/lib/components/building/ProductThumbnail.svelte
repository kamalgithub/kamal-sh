<script lang="ts">
	import IconImage from '$lib/components/icons/IconImage.svelte';
	import type { ContentImage } from '$lib/content/image.types';

	let { image, label }: { image?: ContentImage; label: string } = $props();

	const IMG_CLASS = 'aspect-square w-16 shrink-0 rounded-sm border border-border object-cover';
</script>

{#if image}
	{#if image.darkSrc}
		<img src={image.src} alt={image.alt} loading="lazy" class="theme-image-light {IMG_CLASS}" />
		<img src={image.darkSrc} alt={image.alt} loading="lazy" class="theme-image-dark {IMG_CLASS}" />
	{:else}
		<img src={image.src} alt={image.alt} loading="lazy" class={IMG_CLASS} />
	{/if}
{:else}
	<div
		class="flex aspect-square w-16 shrink-0 items-center justify-center rounded-sm border border-dashed border-border bg-surface text-text-muted"
		role="img"
		aria-label={label}
	>
		<IconImage size={18} />
	</div>
{/if}
