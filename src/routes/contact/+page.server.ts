import { fail } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/server/mailjet';
import { verifyTurnstileToken } from '$lib/server/turnstile';
import { checkRateLimit } from '$lib/server/rateLimiter';
import {
	createCalBooking,
	bookingInputSchema,
	CalBookingConflictError
} from '$lib/server/calBooking';
import { isValidEmail } from '$lib/utils/isValidEmail';
import { buildE164Phone } from '$lib/utils/buildE164Phone';
import { contactCopy } from '$lib/content/copy/contact';
import { bookingCopy } from '$lib/content/copy/booking';
import { profile } from '$lib/content/profile';
import type { Actions, PageServerLoad } from './$types';

export const prerender = false;

const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const SUBJECT_MIN_LENGTH = 3;
const SUBJECT_MAX_LENGTH = 150;
// Long enough to rule out drive-by one-liners, short enough not to demand an essay.
const MESSAGE_MIN_LENGTH = 80;
const MESSAGE_MAX_LENGTH = 500;
// 2 messages per sender per 4 hours — see docs/architecture.md's "Contact form abuse
// protection" for why this is IP-based (Cache API) rather than a real database.
const RATE_LIMIT_MAX = 2;
const RATE_LIMIT_WINDOW_SECONDS = 4 * 60 * 60;

// A real calendar booking is at least as valuable an abuse target as a contact message
// (it consumes a real, finite meeting slot and creates a live calendar event) — same cap
// shape as the contact form, kept as its own rate-limit scope so hitting one cap doesn't
// consume the other's budget.
const BOOKING_RATE_LIMIT_MAX = 2;
const BOOKING_RATE_LIMIT_WINDOW_SECONDS = 4 * 60 * 60;

export const load: PageServerLoad = ({ platform }) => {
	return { turnstileSiteKey: platform?.env?.TURNSTILE_SITE_KEY ?? '' };
};

export const actions: Actions = {
	contact: async ({ request, platform, getClientAddress }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim();
		const subject = String(formData.get('subject') ?? '').trim();
		const message = String(formData.get('message') ?? '').trim();
		const honeypot = String(formData.get('company') ?? '').trim();
		const turnstileToken = String(formData.get('cf-turnstile-response') ?? '').trim();
		const values = { name, email, subject, message };
		const { form: copy } = contactCopy;

		// Bots fill every field, including the hidden honeypot. Report success without sending,
		// so the bot has no signal that it was caught.
		if (honeypot) {
			return { success: true };
		}

		const errors: { name?: string; email?: string; subject?: string; message?: string } = {};
		if (!name) errors.name = copy.nameRequiredError;
		else if (name.length < NAME_MIN_LENGTH) errors.name = copy.nameTooShortError;
		else if (name.length > NAME_MAX_LENGTH) errors.name = copy.nameTooLongError;
		if (!isValidEmail(email)) {
			errors.email = copy.emailInvalidError;
		}
		if (!subject) errors.subject = copy.subjectRequiredError;
		else if (subject.length < SUBJECT_MIN_LENGTH) errors.subject = copy.subjectTooShortError;
		else if (subject.length > SUBJECT_MAX_LENGTH) errors.subject = copy.subjectTooLongError;
		if (!message) errors.message = copy.messageRequiredError;
		else if (message.length < MESSAGE_MIN_LENGTH) errors.message = copy.messageTooShortError;
		else if (message.length > MESSAGE_MAX_LENGTH) errors.message = copy.messageTooLongError;

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		const env = platform?.env;

		// Counted before Turnstile/Mailjet so a bot can't get unlimited free retries just
		// by sending a request that later fails verification — the cap is on attempts
		// that clear basic validation, not only on successfully-sent messages.
		if (platform?.caches) {
			const { allowed } = await checkRateLimit(
				platform.caches,
				'contact',
				getClientAddress(),
				RATE_LIMIT_MAX,
				RATE_LIMIT_WINDOW_SECONDS
			);
			if (!allowed) {
				return fail(429, { rateLimited: true, values });
			}
		}

		if (!env?.TURNSTILE_SECRET_KEY) {
			return fail(500, { errors: { message: copy.notConfiguredError }, values });
		}
		const verified = await verifyTurnstileToken(
			env.TURNSTILE_SECRET_KEY,
			turnstileToken,
			getClientAddress()
		);
		if (!verified) {
			return fail(400, { errors: { message: copy.verificationFailedError }, values });
		}

		if (!env?.MAILJET_KEY || !env?.MAILJET_SECRET || !env?.MAILJET_DOMAIN) {
			return fail(500, { errors: { message: copy.notConfiguredError }, values });
		}

		try {
			await sendContactEmail(
				{
					apiKey: env.MAILJET_KEY,
					apiSecret: env.MAILJET_SECRET,
					domain: env.MAILJET_DOMAIN,
					toAddress: profile.email
				},
				{ name, email, subject, message }
			);
		} catch (err) {
			console.error('Failed to send contact email', err);
			return fail(500, { errors: { message: copy.sendFailedError }, values });
		}

		return { success: true };
	},

	book: async ({ request, platform, getClientAddress }) => {
		const formData = await request.formData();
		const phoneCountry = String(formData.get('phoneCountry') ?? '').trim();
		const phoneNumber = String(formData.get('phoneNumber') ?? '').trim();
		const location = String(formData.get('location') ?? '');
		// Combined into one E.164 string here, before validation — a plain local number
		// with no country code is meaningless to Cal.com's phone-call location type, and
		// this is the one place both halves are available together.
		const phone = location === 'phone' ? buildE164Phone(phoneCountry, phoneNumber) : undefined;
		const raw = {
			name: String(formData.get('name') ?? '').trim(),
			email: String(formData.get('email') ?? '').trim(),
			duration: Number(formData.get('duration')),
			start: String(formData.get('start') ?? ''),
			notes: String(formData.get('notes') ?? '').trim() || undefined,
			location,
			phone
		};
		// Separate from `raw` — the client form has distinct phoneCountry/phoneNumber
		// fields to repopulate on error, not the single combined E.164 value `raw` needs
		// for validation.
		const bookingValues = {
			name: raw.name,
			email: raw.email,
			notes: raw.notes,
			location: raw.location,
			phoneCountry,
			phoneNumber
		};
		const honeypot = String(formData.get('company') ?? '').trim();
		const turnstileToken = String(formData.get('cf-turnstile-response') ?? '').trim();

		// Same bot-signal-hiding shape as the contact action above.
		if (honeypot) {
			return { success: true };
		}

		const parsed = bookingInputSchema.safeParse(raw);
		if (!parsed.success) {
			const fieldErrors: { name?: string; email?: string; notes?: string; phone?: string } = {};
			for (const issue of parsed.error.issues) {
				const field = issue.path[0];
				if (field === 'name') fieldErrors.name = bookingCopy.nameRequiredError;
				else if (field === 'email') fieldErrors.email = bookingCopy.emailInvalidError;
				else if (field === 'notes') fieldErrors.notes = bookingCopy.notesRequiredError;
				else if (field === 'phone') fieldErrors.phone = bookingCopy.phoneRequiredError;
			}
			return fail(400, { bookingErrors: fieldErrors, bookingValues });
		}

		const env = platform?.env;

		// Booking shares the contact form's abuse-value reasoning (see the constant above)
		// but is counted under its own scope, independent of the contact form's cap.
		if (platform?.caches) {
			const { allowed } = await checkRateLimit(
				platform.caches,
				'booking',
				getClientAddress(),
				BOOKING_RATE_LIMIT_MAX,
				BOOKING_RATE_LIMIT_WINDOW_SECONDS
			);
			if (!allowed) {
				return fail(429, { bookingRateLimited: true, bookingValues });
			}
		}

		if (!env?.TURNSTILE_SECRET_KEY) {
			return fail(500, {
				bookingErrors: { message: bookingCopy.notConfiguredError },
				bookingValues
			});
		}
		const verified = await verifyTurnstileToken(
			env.TURNSTILE_SECRET_KEY,
			turnstileToken,
			getClientAddress()
		);
		if (!verified) {
			return fail(400, {
				bookingErrors: { message: bookingCopy.verificationFailedError },
				bookingValues
			});
		}

		if (!env?.CAL_API_KEY) {
			return fail(500, {
				bookingErrors: { message: bookingCopy.notConfiguredError },
				bookingValues
			});
		}

		try {
			const result = await createCalBooking({ apiKey: env.CAL_API_KEY }, parsed.data);
			return { bookingSuccess: true, bookingLocation: result.location };
		} catch (err) {
			if (err instanceof CalBookingConflictError) {
				return fail(409, {
					bookingErrors: { message: bookingCopy.conflictError },
					bookingConflict: true,
					bookingValues
				});
			}
			console.error('Failed to create Cal.com booking', err);
			return fail(500, {
				bookingErrors: { message: bookingCopy.bookingFailedError },
				bookingValues
			});
		}
	}
};
