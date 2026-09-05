import { page } from 'vitest/browser';
import { describe, expect, it, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ThemeToggle from './ThemeToggle.svelte';

describe('ThemeToggle.svelte', () => {
	afterEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	it('defaults to the system option pressed', async () => {
		await render(ThemeToggle);
		await expect
			.element(page.getByRole('button', { name: 'Match system theme' }))
			.toHaveAttribute('aria-pressed', 'true');
	});

	it('sets data-theme and updates pressed state when dark is chosen', async () => {
		await render(ThemeToggle);
		const darkButton = page.getByRole('button', { name: 'Dark theme' });
		await darkButton.click();

		await expect.element(darkButton).toHaveAttribute('aria-pressed', 'true');
		expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
		expect(localStorage.getItem('theme')).toBe('dark');
	});
});
