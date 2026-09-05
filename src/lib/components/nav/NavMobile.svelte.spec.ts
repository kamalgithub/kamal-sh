import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import NavMobile from './NavMobile.svelte';
import { COMMAND_PALETTE_OPEN_EVENT } from '$lib/utils/commandPaletteEvent';

const links = [
	{ label: 'Work', href: '/work' },
	{ label: 'Contact', href: '/contact' }
];

describe('NavMobile.svelte', () => {
	it('opens the menu dialog and shows the nav links', async () => {
		await render(NavMobile, { links, name: 'kamal.sh' });

		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();

		await page.getByRole('button', { name: 'Open menu' }).click();

		await expect.element(page.getByRole('dialog')).toBeInTheDocument();
		await expect.element(page.getByRole('link', { name: 'Work' })).toBeInTheDocument();
	});

	it('closes the menu when the close button is clicked', async () => {
		await render(NavMobile, { links, name: 'kamal.sh' });

		await page.getByRole('button', { name: 'Open menu' }).click();
		await expect.element(page.getByRole('dialog')).toBeInTheDocument();

		await page.getByRole('button', { name: 'Close menu' }).click();
		await expect.element(page.getByRole('dialog')).not.toBeInTheDocument();
	});

	it('has its own search trigger, since the command palette needs no keyboard to use once open', async () => {
		await render(NavMobile, { links, name: 'kamal.sh' });

		let opened = false;
		window.addEventListener(COMMAND_PALETTE_OPEN_EVENT, () => (opened = true));

		await page.getByRole('button', { name: 'Open command palette' }).click();

		expect(opened).toBe(true);
	});
});
