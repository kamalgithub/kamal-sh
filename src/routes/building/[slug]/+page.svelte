<script lang="ts">
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import Figure from '$lib/components/primitives/Figure.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import ProductDetail from '$lib/components/building/ProductDetail.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SeoHead
	title="{data.product.name} | Kamal Kumar"
	description={data.product.tagline}
	image={data.product.image?.src ?? `/images/og/products/${data.product.slug}.png`}
/>

<Section>
	<Container>
		<h1 class="font-display text-display font-medium text-text">{data.product.name}</h1>
		<div class="mt-6">
			<Figure
				image={data.product.image}
				width={1200}
				height={750}
				label="Screenshot — {data.product.name}"
			/>
		</div>
		<div class="mt-8">
			<ProductDetail product={data.product} />
		</div>
	</Container>
</Section>
