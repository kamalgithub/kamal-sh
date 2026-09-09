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

	it('matches a command by its search keywords, not just its visible label', async () => {
		await render(CommandPalette);
		requestCommandPaletteOpen();

		// "dark" appears nowhere in the label "Toggle theme" — only in its keywords.
		await page.getByPlaceholder('Type a command or search').fill('dark');
		await expect.element(page.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
	});

	it('tolerates a partial/fuzzy query (skipped letters), not just exact substrings', async () => {
		await render(CommandPalette);
		requestCommandPaletteOpen();

		await page.getByPlaceholder('Type a command or search').fill('rchtctr');
		// exact: true — with the full writing archive searchable, several post titles
		// ("Serverless Architectures in...", etc.) also legitimately match this fuzzy
		// query and would otherwise make this locator ambiguous.
		await expect
			.element(page.getByRole('button', { name: 'Architecture', exact: true }))
			.toBeInTheDocument();
	});

	it('opens on "/" when focus is not in an editable field', async () => {
		await render(CommandPalette);
		document.body.focus();

		document.body.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }));

		await expect.element(page.getByRole('dialog')).toHaveAttribute('open');
	});

	it('does not hijack "/" while the visitor is typing in an editable field', async () => {
		const input = document.createElement('input');
		document.body.appendChild(input);
		input.focus();

		await render(CommandPalette);
		input.dispatchEvent(new KeyboardEvent('keydown', { key: '/', bubbles: true }));

		await expect
			.element(page.getByRole('dialog', { includeHidden: true }))
			.not.toHaveAttribute('open');

		input.remove();
	});

	it('running the theme-toggle command flips light/dark (never system) and closes the palette', async () => {
		const originalMatchMedia = window.matchMedia;
		window.matchMedia = ((query: string) => ({
			matches: query.includes('dark'),
			media: query,
			addEventListener: () => {},
			removeEventListener: () => {}
		})) as unknown as typeof window.matchMedia;

		await render(CommandPalette);
		requestCommandPaletteOpen();

		await page.getByRole('button', { name: 'Toggle theme' }).click();

		// System currently resolves dark, so the command's explicit result is light.
		expect(document.documentElement.getAttribute('data-theme')).toBe('light');
		await expect
			.element(page.getByRole('dialog', { includeHidden: true }))
			.not.toHaveAttribute('open');

		window.matchMedia = originalMatchMedia;
	});

	it('scrolls the highlighted row into view as ArrowDown moves past the visible list', async () => {
		await render(CommandPalette);
		requestCommandPaletteOpen();

		const input = page.getByPlaceholder('Type a command or search').element() as HTMLElement;
		const list = document.querySelector('ul') as HTMLUListElement;

		for (let i = 0; i < 12; i++) {
			input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
		}

		await expect.poll(() => list.scrollTop).toBeGreaterThan(0);
	});
});
