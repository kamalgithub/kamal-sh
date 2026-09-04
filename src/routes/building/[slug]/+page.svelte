<script lang="ts">
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import ProductDetail from '$lib/components/building/ProductDetail.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.product.name} | Kamal Kumar</title>
	<meta name="description" content={data.product.tagline} />
</svelte:head>

<Section>
	<Container>
		<h1 class="font-display text-display font-medium text-text">{data.product.name}</h1>
		<ProductDetail product={data.product} />
	</Container>
</Section>
