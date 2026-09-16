import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import BookingFlow from './BookingFlow.svelte';
import { bookingCopy } from '$lib/content/copy/booking';

const PROPS = { copy: bookingCopy, bookingUrl: 'https://cal.com/testuser', turnstileSiteKey: '' };

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

	// Picks the LAST bookable date, not the first — "today" (if still bookable) can have
	// a dwindling or empty slot window depending on the wall-clock time the test happens
	// to run at, which would make this flaky. A date further out always has its full
	// 11AM-2PM window ahead of it, regardless of when the test suite runs.
	async function advanceToDetailsStep(container: HTMLElement) {
		const dateButtons = await vi.waitFor(() => {
			const buttons = container.querySelectorAll('button.aspect-square:not([aria-disabled])');
			if (buttons.length === 0) throw new Error('no bookable dates rendered yet');
			return buttons;
		});
		(dateButtons[dateButtons.length - 1] as HTMLButtonElement).click();

		const durationButton = await vi.waitFor(() => {
			const button = Array.from(container.querySelectorAll('button')).find((b) =>
				b.textContent?.includes('30 min')
			);
			if (!button) throw new Error('duration step not rendered yet');
			return button as HTMLButtonElement;
		});
		durationButton.click();

		const slotButton = await vi.waitFor(() => {
			const button = container.querySelector(
				'.grid.grid-cols-\\[repeat\\(auto-fill\\,minmax\\(84px\\,1fr\\)\\)\\] button'
			);
			if (!button) throw new Error('no time slots rendered yet');
			return button as HTMLButtonElement;
		});
		slotButton.click();
	}

	it('reaches the details step with name/email fields after picking a date, duration, and time', async () => {
		const { container } = await render(BookingFlow, PROPS);
		await advanceToDetailsStep(container);

		await expect.element(page.getByLabelText(bookingCopy.nameLabel)).toBeInTheDocument();
		await expect.element(page.getByLabelText(bookingCopy.emailLabel)).toBeInTheDocument();
	});

	it('shows the phone field only after choosing the phone location option', async () => {
		const { container } = await render(BookingFlow, PROPS);
		await advanceToDetailsStep(container);

		await expect.element(page.getByLabelText(bookingCopy.phoneLabel)).not.toBeInTheDocument();

		await page.getByRole('radio', { name: bookingCopy.locationPhoneLabel }).click();

		await expect.element(page.getByLabelText(bookingCopy.phoneLabel)).toBeInTheDocument();
	});

	it('only loads the Turnstile script after the visitor focuses a field in the details step', async () => {
		const { container } = await render(BookingFlow, {
			...PROPS,
			turnstileSiteKey: 'test-site-key'
		});
		await advanceToDetailsStep(container);

		expect(document.head.querySelector('script[src*="turnstile"]')).toBeNull();

		await page.getByLabelText(bookingCopy.nameLabel).click();

		await vi.waitFor(() => {
			if (!document.head.querySelector('script[src*="turnstile"]')) {
				throw new Error('turnstile script not injected yet');
			}
		});
	});
});
