import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Figure from './Figure.svelte';

describe('Figure.svelte', () => {
	it('renders the real image when data provides one', async () => {
		await render(Figure, {
			image: { src: '/images/example.jpg', alt: 'Example' },
			width: 800,
			height: 600,
			label: 'Example'
		});

		const img = page.getByAltText('Example');
		await expect.element(img).toBeInTheDocument();
		await expect.element(img).toHaveAttribute('src', '/images/example.jpg');
		await expect.element(img).toHaveAttribute('width', '800');
		await expect.element(img).toHaveAttribute('height', '600');
	});

	it('renders a labeled placeholder — never a broken layout — when no image is provided', async () => {
		await render(Figure, { width: 800, height: 600, label: 'Portrait pending' });

		const placeholder = page.getByRole('img', { name: 'Portrait pending' });
		await expect.element(placeholder).toBeInTheDocument();
		await expect.element(page.getByText('Portrait pending')).toBeInTheDocument();
	});

	it('renders both variants, theme-toggled by CSS, when a dark variant is provided', async () => {
		const { container } = await render(Figure, {
			image: { src: '/images/portrait.jpg', darkSrc: '/images/portrait-dark.jpg', alt: 'Kamal' },
			width: 480,
			height: 480,
			label: 'Kamal'
		});

		const images = container.querySelectorAll('img');
		expect(images).toHaveLength(2);
		expect(images[0].getAttribute('src')).toBe('/images/portrait.jpg');
		expect(images[0].className).toContain('theme-image-light');
		expect(images[1].getAttribute('src')).toBe('/images/portrait-dark.jpg');
		expect(images[1].className).toContain('theme-image-dark');
	});
});
