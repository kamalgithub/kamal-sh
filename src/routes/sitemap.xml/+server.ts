import { caseStudies } from '$lib/content/case-studies';
import { products } from '$lib/content/products/products';
import { site, siteRoutes } from '$lib/content/site';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const routes = [
		...siteRoutes,
		...caseStudies.map((study) => `/work/${study.slug}`),
		...products.map((product) => `/building/${product.slug}`)
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((path) => `\t<url><loc>${site.url}${path}</loc></url>`).join('\n')}
</urlset>
`;

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
