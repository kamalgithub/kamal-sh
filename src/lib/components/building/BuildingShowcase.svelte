<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Product } from '$lib/content/products/product.types';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import ProductThumbnail from './ProductThumbnail.svelte';

	let {
		products,
		heading,
		linkLabel
	}: { products: Product[]; heading?: string; linkLabel: string } = $props();
</script>

<Section>
	<Container>
		{#if heading}
			<h2 class="mb-8 font-display text-h2 font-semibold text-text">{heading}</h2>
		{/if}
		<ul class="flex flex-col divide-y divide-border border-t border-border">
			{#each products as product (product.slug)}
				<li
					class="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between md:gap-8"
				>
					<div class="flex items-center gap-4 md:max-w-md">
						<ProductThumbnail image={product.image} label={product.name} />
						<div>
							<h3 class="font-display text-h2 font-medium text-text">{product.name}</h3>
							<p class="mt-2 text-body text-text-muted">{product.tagline}</p>
						</div>
					</div>
					<a
						href={resolve('/building/[slug]', { slug: product.slug })}
						class="flex shrink-0 items-center gap-1 text-small text-accent transition-colors duration-(--duration-fast) ease-standard hover:text-text"
					>
						{linkLabel}
						<IconArrowRight size={14} />
					</a>
				</li>
			{/each}
		</ul>
	</Container>
</Section>
