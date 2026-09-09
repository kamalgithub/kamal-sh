import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import SeoHead from './SeoHead.svelte';

function metaContent(property: string): string | null {
	return (
		document.head
			.querySelector(`meta[property="${property}"], meta[name="${property}"]`)
			?.getAttribute('content') ?? null
	);
}

describe('SeoHead.svelte', () => {
	it('composes the " | Kamal Kumar" suffix onto a bare page title', async () => {
		await render(SeoHead, { title: 'Work', description: 'Case studies.' });

		expect(document.title).toBe('Work | Kamal Kumar');
		expect(metaContent('description')).toBe('Case studies.');
		expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toContain(
			'https://kamal.sh'
		);
	});

	it('uses fullTitle verbatim, with no suffix appended', async () => {
		await render(SeoHead, {
			fullTitle: 'Kamal Kumar | Builder',
			description: 'Intro.'
		});

		expect(document.title).toBe('Kamal Kumar | Builder');
	});

	it('mirrors the resolved title/description onto Open Graph and Twitter Card tags', async () => {
		await render(SeoHead, { title: 'Work', description: 'Case studies.' });

		expect(metaContent('og:title')).toBe('Work | Kamal Kumar');
		expect(metaContent('og:description')).toBe('Case studies.');
		expect(metaContent('twitter:title')).toBe('Work | Kamal Kumar');
	});

	it('falls back to the real profile photo when no image is given', async () => {
		await render(SeoHead, { title: 'Home', description: 'Intro.' });

		expect(metaContent('og:image')).toContain('/images/portrait.jpg');
		expect(metaContent('twitter:card')).toBe('summary_large_image');
	});

	it('uses a page-specific image when one is given', async () => {
		await render(SeoHead, {
			title: 'A Product',
			description: 'A thing I built.',
			image: '/images/products/example.png'
		});

		expect(metaContent('og:image')).toContain('/images/products/example.png');
	});
});
