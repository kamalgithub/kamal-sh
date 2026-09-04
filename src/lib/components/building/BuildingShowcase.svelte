<script lang="ts">
	import type { Product } from '$lib/content/products/product.types';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import Card from '$lib/components/primitives/Card.svelte';

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
		<div class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
			{#each products as product (product.slug)}
				<Card>
					<h3 class="mb-2 font-display text-body font-semibold text-text">{product.name}</h3>
					<p class="mb-4 text-small text-text-muted">{product.tagline}</p>
					<!-- eslint-disable svelte/no-navigation-without-resolve -- route added later this pass; revisited with resolve() once it exists -->
					<a
						href="/building/{product.slug}"
						class="text-small text-accent transition-colors duration-(--duration-fast) ease-standard hover:text-accent-hover"
					>
						{linkLabel}
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				</Card>
			{/each}
		</div>
	</Container>
</Section>
