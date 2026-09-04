import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import NavMobile from './NavMobile.svelte';

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
});
