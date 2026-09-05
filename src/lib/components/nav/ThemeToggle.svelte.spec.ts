import { page } from 'vitest/browser';
import { describe, expect, it, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ThemeToggle from './ThemeToggle.svelte';

describe('ThemeToggle.svelte', () => {
	afterEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	it('is a single trigger with the menu closed by default', async () => {
		await render(ThemeToggle);
		await expect
			.element(page.getByRole('button', { name: 'Change theme (currently system)' }))
			.toBeInTheDocument();
		await expect.element(page.getByRole('menu')).not.toBeInTheDocument();
	});

	it('opens the menu on click and selecting an option applies and closes it', async () => {
		await render(ThemeToggle);
		await page.getByRole('button', { name: 'Change theme (currently system)' }).click();
		await expect.element(page.getByRole('menu')).toBeInTheDocument();

		await page.getByRole('menuitemradio', { name: 'Dark' }).click();

		expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
		expect(localStorage.getItem('theme')).toBe('dark');
		await expect.element(page.getByRole('menu')).not.toBeInTheDocument();
	});

	it('closes the menu on an outside click without changing the theme', async () => {
		await render(ThemeToggle);
		await page.getByRole('button', { name: 'Change theme (currently system)' }).click();
		await expect.element(page.getByRole('menu')).toBeInTheDocument();

		document.body.click();

		await expect.element(page.getByRole('menu')).not.toBeInTheDocument();
		expect(localStorage.getItem('theme')).toBeNull();
	});
});
