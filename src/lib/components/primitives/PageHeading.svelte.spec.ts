import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import PageHeading from './PageHeading.svelte';
import IconShield from '$lib/components/icons/IconShield.svelte';

describe('PageHeading.svelte', () => {
	it('renders the heading as an <h1> with the icon mark above it, not beside it', async () => {
		const { container } = await render(PageHeading, {
			icon: IconShield,
			heading: 'Security posture'
		});

		await expect
			.element(page.getByRole('heading', { level: 1, name: 'Security posture' }))
			.toBeInTheDocument();

		const html = container.querySelector('div')?.innerHTML ?? '';
		expect(html.indexOf('<svg')).toBeGreaterThanOrEqual(0);
		expect(html.indexOf('<svg')).toBeLessThan(html.indexOf('<h1'));
	});
});
