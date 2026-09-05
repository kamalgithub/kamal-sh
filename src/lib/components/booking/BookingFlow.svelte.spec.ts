import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import BookingFlow from './BookingFlow.svelte';
import { bookingCopy } from '$lib/content/copy/booking';

const PROPS = { copy: bookingCopy, bookingUrl: 'https://cal.com/testuser' };

describe('BookingFlow.svelte', () => {
	it('shows a month label and a 7-column weekday header once loaded', async () => {
		await render(BookingFlow, PROPS);

		await expect.element(page.getByText('Sun')).toBeInTheDocument();
		await expect.element(page.getByText('Sat')).toBeInTheDocument();
	});

	it('disables navigating to the previous month on first load', async () => {
		await render(BookingFlow, PROPS);

		await expect.element(page.getByRole('button', { name: 'Previous month' })).toBeDisabled();
	});

	it('advances to the duration step when a bookable date is clicked', async () => {
		const { container } = await render(BookingFlow, PROPS);

		// Day cells share the "aspect-square" class; nav buttons don't - scoping to it
		// avoids accidentally clicking the month Previous/Next controls instead.
		const bookableButton = await vi.waitFor(() => {
			const button = container.querySelector('button.aspect-square:not([aria-disabled])');
			if (!button) throw new Error('no bookable date rendered yet');
			return button as HTMLButtonElement;
		});
		bookableButton.click();

		await expect.element(page.getByText(bookingCopy.durationStepLabel)).toBeInTheDocument();
	});

	it('shows the outside-window tooltip when a faded date is clicked', async () => {
		const { container } = await render(BookingFlow, PROPS);

		const disabledButton = await vi.waitFor(() => {
			const button = container.querySelector('button.aspect-square[aria-disabled="true"]');
			if (!button) throw new Error('no disabled date rendered yet');
			return button as HTMLButtonElement;
		});
		disabledButton.click();

		const tooltip = disabledButton.parentElement?.querySelector('[role="tooltip"]');
		expect(tooltip?.className).toContain('opacity-100');
	});
});
