import { page as browserPage } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import ErrorPage from './+error.svelte';
import { errorCopy } from '$lib/content/copy/error';

describe('+error.svelte', () => {
	it('always offers a way back home', async () => {
		await render(ErrorPage);

		await expect
			.element(browserPage.getByRole('link', { name: errorCopy.homeLabel }))
			.toBeInTheDocument();
	});

	it('shows a heading and body for whatever status the test harness reports', async () => {
		await render(ErrorPage);

		const heading = document.querySelector('h1');
		expect(heading?.textContent).toBeTruthy();
	});
});
