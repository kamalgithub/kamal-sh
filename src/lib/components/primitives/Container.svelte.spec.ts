import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Container from './Container.svelte';

describe('Container.svelte', () => {
	it('renders its children', async () => {
		const children = createRawSnippet(() => ({ render: () => `<p>content</p>` }));
		await render(Container, { children });

		await expect.element(page.getByText('content')).toBeInTheDocument();
	});

	it('constrains width and centers itself', async () => {
		const children = createRawSnippet(() => ({ render: () => `<p>content</p>` }));
		const { container } = await render(Container, { children });

		const wrapper = container.querySelector('div');
		expect(wrapper?.className).toContain('max-w-6xl');
		expect(wrapper?.className).toContain('mx-auto');
	});
});
