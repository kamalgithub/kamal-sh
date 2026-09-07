import { fail } from '@sveltejs/kit';
import { subscribeToMailingList } from '$lib/server/mailjetList';
import { checkRateLimit } from '$lib/server/rateLimiter';
import { newsletterCopy } from '$lib/content/copy/newsletter';
import type { Actions } from './$types';

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Generous compared to the contact form's 2-per-4h — subscribing carries far less abuse
// value than sending arbitrary messages, this just guards against a scripted flood.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_SECONDS = 60 * 60;

export const actions: Actions = {
	default: async ({ request, platform, getClientAddress }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const honeypot = String(formData.get('company') ?? '').trim();

		// Same honeypot pattern as /contact: report success without subscribing, so a bot
		// gets no signal that it was caught.
		if (honeypot) {
			return { success: true };
		}

		if (!email || !EMAIL_PATTERN.test(email)) {
			return fail(400, { error: newsletterCopy.invalidEmailError });
		}

		if (platform?.caches) {
			const { allowed } = await checkRateLimit(
				platform.caches,
				'newsletter',
				getClientAddress(),
				RATE_LIMIT_MAX,
				RATE_LIMIT_WINDOW_SECONDS
			);
			if (!allowed) {
				return fail(429, { error: newsletterCopy.rateLimitedError });
			}
		}

		const env = platform?.env;
		if (!env?.MAILJET_KEY || !env?.MAILJET_SECRET || !env?.MAILJET_LIST_ID) {
			return fail(500, { error: newsletterCopy.notConfiguredError });
		}

		try {
			await subscribeToMailingList(
				{ apiKey: env.MAILJET_KEY, apiSecret: env.MAILJET_SECRET, listId: env.MAILJET_LIST_ID },
				email
			);
		} catch (err) {
			console.error('Failed to subscribe to mailing list', err);
			return fail(500, { error: newsletterCopy.sendFailedError });
		}

		return { success: true };
	}
};
