import { fail } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/server/mailgun';
import { verifyTurnstileToken } from '$lib/server/turnstile';
import { checkRateLimit } from '$lib/server/rateLimiter';
import { contactCopy } from '$lib/content/copy/contact';
import type { Actions, PageServerLoad } from './$types';

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
		const message = String(formData.get('message') ?? '').trim();
		const honeypot = String(formData.get('company') ?? '').trim();
		const turnstileToken = String(formData.get('cf-turnstile-response') ?? '').trim();
		const values = { name, email, message };
		const { form: copy } = contactCopy;

		// Bots fill every field, including the hidden honeypot. Report success without sending,
		// so the bot has no signal that it was caught.
		if (honeypot) {
			return { success: true };
		}

		const errors: { name?: string; email?: string; message?: string } = {};
		if (!name) errors.name = copy.nameRequiredError;
		if (!email || !EMAIL_PATTERN.test(email)) errors.email = copy.emailInvalidError;
		if (!message) errors.message = copy.messageRequiredError;

		if (Object.keys(errors).length > 0) {
			return fail(400, { errors, values });
		}

		const env = platform?.env;

		// Counted before Turnstile/Mailgun so a bot can't get unlimited free retries just
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

		if (!env?.MAILGUN_API_KEY) {
			return fail(500, { errors: { message: copy.notConfiguredError }, values });
		}

		try {
			await sendContactEmail(
				{
					apiKey: env.MAILGUN_API_KEY,
					domain: env.MAILGUN_DOMAIN,
					toAddress: env.MAILGUN_TO_ADDRESS
				},
				{ name, email, message }
			);
		} catch (err) {
			console.error('Failed to send contact email', err);
			return fail(500, { errors: { message: copy.sendFailedError }, values });
		}

		return { success: true };
	}
};
