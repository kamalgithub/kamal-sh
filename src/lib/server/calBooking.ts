import { z } from 'zod';
import { E164_PATTERN } from '$lib/utils/buildE164Phone';

export const CAL_DURATIONS = [15, 30, 45, 60] as const;
export type CalDuration = (typeof CAL_DURATIONS)[number];

export const CAL_LOCATIONS = ['google-meet', 'phone'] as const;
export type CalLocationChoice = (typeof CAL_LOCATIONS)[number];

export const bookingInputSchema = z
	.object({
		name: z.string().trim().min(2).max(100),
		email: z.email().max(254),
		duration: z.union(CAL_DURATIONS.map((d) => z.literal(d))),
		/** IST wall-clock instant, ISO UTC — see ist.ts's istInstant(). */
		start: z.iso.datetime(),
		// Required by the real "meet" event type's own custom booking field
		// (expectationsFromMe, confirmed 2026-09-16 from a real 400 response) — not
		// actually optional, despite how it reads.
		notes: z.string().trim().min(1).max(500),
		location: z.enum(CAL_LOCATIONS),
		// Already a combined, validated E.164 string by the time it reaches this schema
		// (see buildE164Phone.ts) — the server action combines the visitor's chosen
		// country + typed local number before this ever runs, specifically so Cal.com
		// never receives an ambiguous, country-code-less number it can't dial.
		phone: z.string().regex(E164_PATTERN).optional()
	})
	.refine((data) => data.location !== 'phone' || !!data.phone, {
		message: 'A valid phone number is required for a phone call booking.',
		path: ['phone']
	});

export type BookingInput = z.infer<typeof bookingInputSchema>;

export interface CalConfig {
	apiKey: string;
}

export interface CalBookingResult {
	uid: string;
	/** Meeting URL/detail Cal.com generated (e.g. the Google Meet link) — shown to the visitor as confirmation. */
	location: string;
}

/** Thrown specifically when Cal.com rejects the request because the slot is no longer
 *  free — distinct from every other failure so the caller can say "pick another time"
 *  instead of a generic error. */
export class CalBookingConflictError extends Error {}

// Cal.com's own dashboard-generated request snippet pinned this version — reusing it
// keeps the request shape matching what the account's "meet" event type actually
// expects. Bump deliberately (and re-verify the response shape) if it's ever changed.
const CAL_API_VERSION = '2026-02-25';
const CAL_USERNAME = 'kamalk';
const CAL_EVENT_TYPE_SLUG = 'meet';

// Cal.com's exact conflict status code isn't in the endpoint's own documented reference
// (only success/201 is documented in detail) — 409 is the standard REST convention for
// "this resource state changed under you," and is what's assumed here until a real
// double-booking attempt during testing confirms or corrects it.
const CONFLICT_STATUS = 409;

function buildLocation(input: BookingInput): Record<string, unknown> {
	if (input.location === 'phone') {
		return { type: 'attendeePhone', phone: input.phone };
	}
	return { type: 'integration', integration: 'google-meet' };
}

/** Creates a real booking on the 'meet' event type via Cal.com's API v2 (native fetch, no SDK dependency). */
export async function createCalBooking(
	config: CalConfig,
	input: BookingInput
): Promise<CalBookingResult> {
	const response = await fetch('https://api.cal.com/v2/bookings', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${config.apiKey}`,
			'Content-Type': 'application/json',
			'cal-api-version': CAL_API_VERSION
		},
		body: JSON.stringify({
			start: input.start,
			attendee: {
				name: input.name,
				email: input.email,
				timeZone: 'Asia/Kolkata',
				language: 'en'
			},
			eventTypeSlug: CAL_EVENT_TYPE_SLUG,
			username: CAL_USERNAME,
			lengthInMinutes: input.duration,
			location: buildLocation(input),
			// The event type's own custom field slug, not an arbitrary name of our choosing
			// — confirmed 2026-09-16 via a real "Missing required booking field response:
			// expectationsFromMe" error. Don't rename this key without re-checking the
			// event type (Settings -> Event Types -> meet -> Advanced -> Booking questions).
			bookingFieldsResponses: { expectationsFromMe: input.notes },
			// Always this site, never derived from anything user-suppliable — a fixed
			// provenance tag on every booking this form creates.
			metadata: { source: 'kamalsh-contact-form' }
		}),
		// Longer than the site's usual 4000ms default (see conventions.md's "Outbound
		// fetch timeouts") — booking creation does real scheduling work server-side on
		// Cal.com's end, not just a lookup.
		signal: AbortSignal.timeout(6000)
	});

	if (response.status === CONFLICT_STATUS) {
		throw new CalBookingConflictError('That time was just booked — pick another.');
	}
	if (!response.ok) {
		const detail = await response.text();
		throw new Error(`Cal.com booking request failed: ${response.status} ${detail}`);
	}

	const result = (await response.json()) as { data: { uid: string; location?: string } };
	return { uid: result.data.uid, location: result.data.location ?? '' };
}
