import { afterEach, describe, expect, it, vi } from 'vitest';
import { createCalBooking, bookingInputSchema, CalBookingConflictError } from './calBooking';

const VALID_INPUT = {
	name: 'Jane Doe',
	email: 'jane@example.com',
	duration: 30 as const,
	start: '2026-09-15T05:30:00.000Z',
	notes: 'Want to discuss a Terraform migration.',
	location: 'google-meet' as const
};

describe('bookingInputSchema', () => {
	it('accepts a valid google-meet booking with no phone', () => {
		expect(bookingInputSchema.safeParse(VALID_INPUT).success).toBe(true);
	});

	it('rejects empty notes — required by the real event type', () => {
		const result = bookingInputSchema.safeParse({ ...VALID_INPUT, notes: '' });
		expect(result.success).toBe(false);
	});

	it('rejects an invalid email', () => {
		const result = bookingInputSchema.safeParse({ ...VALID_INPUT, email: 'not-an-email' });
		expect(result.success).toBe(false);
	});

	it('rejects a duration outside the fixed 15/30/45/60 set', () => {
		const result = bookingInputSchema.safeParse({ ...VALID_INPUT, duration: 20 });
		expect(result.success).toBe(false);
	});

	it('requires a phone number when location is phone', () => {
		const result = bookingInputSchema.safeParse({ ...VALID_INPUT, location: 'phone' });
		expect(result.success).toBe(false);
	});

	it('accepts a phone booking when a phone number is present', () => {
		const result = bookingInputSchema.safeParse({
			...VALID_INPUT,
			location: 'phone',
			phone: '+919876543210'
		});
		expect(result.success).toBe(true);
	});
});

describe('createCalBooking', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns the booking uid and location on success', async () => {
		vi.stubGlobal(
			'fetch',
			vi
				.fn()
				.mockResolvedValue(
					new Response(
						JSON.stringify({ data: { uid: 'abc123', location: 'https://meet.google.com/xyz' } }),
						{ status: 201 }
					)
				)
		);

		const result = await createCalBooking({ apiKey: 'key' }, bookingInputSchema.parse(VALID_INPUT));
		expect(result).toEqual({ uid: 'abc123', location: 'https://meet.google.com/xyz' });
	});

	it('throws CalBookingConflictError on a 409 response', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 409 })));

		await expect(
			createCalBooking({ apiKey: 'key' }, bookingInputSchema.parse(VALID_INPUT))
		).rejects.toBeInstanceOf(CalBookingConflictError);
	});

	it('throws a plain Error on any other non-ok response', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('bad request', { status: 400 })));

		await expect(
			createCalBooking({ apiKey: 'key' }, bookingInputSchema.parse(VALID_INPUT))
		).rejects.toThrow('Cal.com booking request failed: 400');
	});

	it('sends the Authorization, Content-Type, and cal-api-version headers', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ data: { uid: 'abc123', location: '' } }), { status: 201 })
			);
		vi.stubGlobal('fetch', fetchMock);

		await createCalBooking({ apiKey: 'my-key' }, bookingInputSchema.parse(VALID_INPUT));

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('https://api.cal.com/v2/bookings');
		expect(init.headers['Authorization']).toBe('Bearer my-key');
		expect(init.headers['cal-api-version']).toBeTruthy();
	});

	it('maps a phone booking to an attendeePhone location', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ data: { uid: 'abc123', location: '' } }), { status: 201 })
			);
		vi.stubGlobal('fetch', fetchMock);

		await createCalBooking(
			{ apiKey: 'key' },
			bookingInputSchema.parse({ ...VALID_INPUT, location: 'phone', phone: '+919876543210' })
		);

		const [, init] = fetchMock.mock.calls[0];
		const body = JSON.parse(init.body as string);
		expect(body.location).toEqual({ type: 'attendeePhone', phone: '+919876543210' });
	});

	// Regression test for a real failure: the "meet" event type's own custom booking
	// field is keyed expectationsFromMe, not notes — sending the wrong key produced a
	// real 400 from Cal.com ("Missing required booking field response: expectationsFromMe").
	it('sends notes under the expectationsFromMe booking field key', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ data: { uid: 'abc123', location: '' } }), { status: 201 })
			);
		vi.stubGlobal('fetch', fetchMock);

		await createCalBooking({ apiKey: 'key' }, bookingInputSchema.parse(VALID_INPUT));

		const [, init] = fetchMock.mock.calls[0];
		const body = JSON.parse(init.body as string);
		expect(body.bookingFieldsResponses).toEqual({ expectationsFromMe: VALID_INPUT.notes });
	});
});
