export interface MailgunListConfig {
	apiKey: string;
	/** e.g. 'writing@mail.kamal.sh' — the mailing list's own address, not a person's. */
	listAddress: string;
}

/** Adds an email to the writing-updates mailing list via Mailgun's HTTP API (native
 *  fetch, no SDK — same approach as mailgun.ts). `upsert` makes a repeat signup a no-op
 *  success instead of a duplicate-member error. */
export async function subscribeToMailingList(
	config: MailgunListConfig,
	email: string
): Promise<void> {
	const body = new URLSearchParams({ address: email, subscribed: 'yes', upsert: 'yes' });

	const response = await fetch(`https://api.mailgun.net/v3/lists/${config.listAddress}/members`, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${btoa(`api:${config.apiKey}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body
	});

	if (!response.ok) {
		const detail = await response.text();
		throw new Error(`Mailgun list request failed: ${response.status} ${detail}`);
	}
}
