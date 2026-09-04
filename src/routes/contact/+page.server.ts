import { fail } from '@sveltejs/kit';
import { sendContactEmail } from '$lib/server/mailgun';
import { contactCopy } from '$lib/content/copy/contact';
import type { Actions } from './$types';

export const prerender = false;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const actions: Actions = {
	default: async ({ request, platform }) => {
		const formData = await request.formData();
		const name = String(formData.get('name') ?? '').trim();
		const email = String(formData.get('email') ?? '').trim();
		const message = String(formData.get('message') ?? '').trim();
		const honeypot = String(formData.get('company') ?? '').trim();
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
