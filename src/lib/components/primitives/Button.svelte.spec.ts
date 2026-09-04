// src/lib/components/primitives/Button.svelte.spec.ts
import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Button from './Button.svelte';

describe('Button.svelte', () => {
	const label = createRawSnippet(() => ({ render: () => `<span>Click me</span>` }));

	it('renders as a button and fires onclick', async () => {
		const onclick = vi.fn();
		await render(Button, { children: label, onclick });

		await page.getByRole('button', { name: 'Click me' }).click();

		expect(onclick).toHaveBeenCalledOnce();
	});

	it('renders as a link when href is given', async () => {
		await render(Button, { children: label, href: 'https://example.com' });

		await expect.element(page.getByRole('link', { name: 'Click me' })).toBeInTheDocument();
	});

	it('never uses a transform-based hover/interaction effect', async () => {
		const { container } = await render(Button, { children: label });

		const element = container.querySelector('button');
		expect(element?.className).not.toContain('scale-');
		expect(element?.className).not.toContain('translate-');
	});
});
