import { page } from 'vitest/browser';
import { describe, expect, it, afterEach } from 'vitest';
import { render } from 'vitest-browser-svelte';
import CommandPalette from './CommandPalette.svelte';
import { requestCommandPaletteOpen } from '$lib/utils/commandPaletteEvent';

describe('CommandPalette.svelte', () => {
	afterEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	it('is closed until asked to open', async () => {
		await render(CommandPalette);
		await expect
			.element(page.getByRole('dialog', { includeHidden: true }))
			.not.toHaveAttribute('open');

		requestCommandPaletteOpen();
		await expect.element(page.getByRole('dialog')).toHaveAttribute('open');
	});

	it('filters commands as the query changes', async () => {
		await render(CommandPalette);
		requestCommandPaletteOpen();

		await page.getByPlaceholder('Type a command or search').fill('theme');
		await expect.element(page.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
		await expect.element(page.getByRole('button', { name: 'Home' })).not.toBeInTheDocument();
	});

	it('shows an empty state when nothing matches', async () => {
		await render(CommandPalette);
		requestCommandPaletteOpen();

		await page.getByPlaceholder('Type a command or search').fill('zzz-no-match');
		await expect.element(page.getByText('No matching commands.')).toBeInTheDocument();
	});

	it('running the theme-toggle command cycles the theme and closes the palette', async () => {
		await render(CommandPalette);
		requestCommandPaletteOpen();

		await page.getByRole('button', { name: 'Toggle theme' }).click();

		// Cycle starts from 'system' (nothing stored yet) and the mapping is system -> dark.
		expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
		await expect
			.element(page.getByRole('dialog', { includeHidden: true }))
			.not.toHaveAttribute('open');
	});
});
