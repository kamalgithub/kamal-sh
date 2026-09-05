import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import WritingThumbnail from './WritingThumbnail.svelte';

describe('WritingThumbnail.svelte', () => {
	it('renders the image by default', async () => {
		const { container } = await render(WritingThumbnail, {
			src: 'https://blog.aicademy.ac/assets/img/example.webp',
			alt: 'Example post'
		});
		expect(container.querySelector('img')).not.toBeNull();
	});

	it('falls back to a placeholder icon when the image fails to load', async () => {
		const { container } = await render(WritingThumbnail, {
			src: 'https://example.invalid/missing.webp',
			alt: 'Broken post'
		});

		container.querySelector('img')?.dispatchEvent(new Event('error'));

		await expect.poll(() => container.querySelector('img')).toBeNull();
		expect(container.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Broken post');
	});
});
