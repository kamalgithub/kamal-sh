import { error } from '@sveltejs/kit';
import { products } from '$lib/content/products/products';
import type { EntryGenerator, PageLoad } from './$types';

export const entries: EntryGenerator = () => products.map((product) => ({ slug: product.slug }));

export const load: PageLoad = ({ params }) => {
	const product = products.find((p) => p.slug === params.slug);
	if (!product) error(404, 'Product not found');
	return { product };
};
