import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import TestimonialAvatar from './TestimonialAvatar.svelte';

describe('TestimonialAvatar.svelte', () => {
	it('renders the initials of the given name', async () => {
		await render(TestimonialAvatar, { name: 'Aditya Shah' });
		await expect.element(page.getByText('AS')).toBeInTheDocument();
	});

	it('is hidden from assistive tech since the name is rendered as visible text alongside it', async () => {
		const { container } = await render(TestimonialAvatar, { name: 'Aditya Shah' });
		expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
	});
});
