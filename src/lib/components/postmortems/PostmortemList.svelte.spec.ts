import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PostmortemList from './PostmortemList.svelte';
import type { PostmortemsCopy } from '$lib/content/copy/postmortems.types';

const copy: PostmortemsCopy = {
	heading: 'Postmortems',
	intro: 'Intro',
	emptyStateMessage: 'Nothing has broken publicly yet.'
};

describe('PostmortemList.svelte', () => {
	it('shows the honest empty state instead of an empty list when there are no entries', async () => {
		await render(PostmortemList, { postmortems: [], copy });
		await expect.element(page.getByText('Nothing has broken publicly yet.')).toBeInTheDocument();
	});

	it('renders every field of a real entry', async () => {
		await render(PostmortemList, {
			postmortems: [
				{
					slug: 'contact-form-outage',
					title: 'Contact form outage',
					date: '2026-01-15',
					summary: 'The form silently failed to send for six hours.',
					impact: 'Visitors could not reach me for six hours.',
					rootCause: 'A missing environment variable in production.',
					resolution: 'Restored the variable and added a startup check.',
					whatChanged: 'The app now fails loudly at boot if the variable is missing.'
				}
			],
			copy
		});

		await expect.element(page.getByText('Contact form outage')).toBeInTheDocument();
		await expect
			.element(page.getByText('A missing environment variable in production.'))
			.toBeInTheDocument();
		await expect
			.element(page.getByText('Nothing has broken publicly yet.'))
			.not.toBeInTheDocument();
	});
});
