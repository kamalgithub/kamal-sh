import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Card from './Card.svelte';

describe('Card.svelte', () => {
	it('renders its children inside a glass surface', async () => {
		const children = createRawSnippet(() => ({ render: () => `<p>content</p>` }));
		const { container } = await render(Card, { children });

		await expect.element(page.getByText('content')).toBeInTheDocument();
		const wrapper = container.querySelector('div');
		expect(wrapper?.className).toContain('bg-(--surface-glass-bg)');
		expect(wrapper?.className).toContain('backdrop-blur-(--surface-glass-blur)');

		// Proves the glass tokens actually compiled to real CSS, not just present class names.
		const styles = getComputedStyle(wrapper!);
		expect(styles.backdropFilter).not.toBe('none');
		expect(styles.backgroundColor).not.toBe('');
		expect(styles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
	});
});
