import { fail } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/server/mailjet';
import { verifyTurnstileToken } from '$lib/server/turnstile';
import { checkRateLimit } from '$lib/server/rateLimiter';
import { isValidEmail } from '$lib/utils/isValidEmail';
import { contactCopy } from '$lib/content/copy/contact';
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

export const load: PageServerLoad = ({ platform }) => {
	return { turnstileSiteKey: platform?.env?.TURNSTILE_SITE_KEY ?? '' };
};

export const actions: Actions = {
	default: async ({ request, platform, getClientAddress }) => {
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
	}
};
