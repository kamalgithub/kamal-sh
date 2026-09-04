import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Section from './Section.svelte';

describe('Section.svelte', () => {
	it('renders its children inside a <section>', async () => {
		const children = createRawSnippet(() => ({ render: () => `<p>content</p>` }));
		const { container } = await render(Section, { children });

		await expect.element(page.getByText('content')).toBeInTheDocument();
		expect(container.querySelector('section')).not.toBeNull();
	});

	it('applies vertical rhythm spacing', async () => {
		const children = createRawSnippet(() => ({ render: () => `<p>content</p>` }));
		const { container } = await render(Section, { children });

		const wrapper = container.querySelector('section');
		expect(wrapper?.className).toContain('py-16');
		expect(wrapper?.className).toContain('md:py-24');
	});
});
