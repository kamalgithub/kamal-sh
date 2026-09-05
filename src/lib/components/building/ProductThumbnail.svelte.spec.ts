import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ProductThumbnail from './ProductThumbnail.svelte';

describe('ProductThumbnail.svelte', () => {
	it('renders a placeholder when no image is set', async () => {
		const { container } = await render(ProductThumbnail, { label: 'Aicademy' });

		expect(container.querySelector('img')).toBeNull();
		expect(container.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Aicademy');
	});

	it('renders a single image when no dark variant is set', async () => {
		const { container } = await render(ProductThumbnail, {
			image: { src: '/images/product.png', alt: 'Aicademy screenshot' },
			label: 'Aicademy'
		});

		const images = container.querySelectorAll('img');
		expect(images.length).toBe(1);
		expect(images[0].getAttribute('src')).toBe('/images/product.png');
	});

	it('renders both variants when a dark image is set', async () => {
		const { container } = await render(ProductThumbnail, {
			image: {
				src: '/images/product-light.png',
				darkSrc: '/images/product-dark.png',
				alt: 'Aicademy screenshot'
			},
			label: 'Aicademy'
		});

		expect(container.querySelectorAll('img').length).toBe(2);
	});
});
