<script lang="ts">
	import IconImage from '$lib/components/icons/IconImage.svelte';

	let { src, alt }: { src: string; alt: string } = $props();
	let failed = $state(false);
</script>

{#if failed}
	<div
		class="flex aspect-[4/3] w-24 shrink-0 items-center justify-center rounded-sm border border-dashed border-border bg-surface text-text-muted"
		role="img"
		aria-label={alt}
	>
		<IconImage size={18} />
	</div>
{:else}
	<img
		{src}
		{alt}
		loading="lazy"
		onerror={() => (failed = true)}
		class="aspect-[4/3] w-24 shrink-0 rounded-sm object-cover"
	/>
{/if}
