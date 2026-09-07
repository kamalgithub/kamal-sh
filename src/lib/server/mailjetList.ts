export interface MailjetListConfig {
	apiKey: string;
	apiSecret: string;
	/** Mailjet's numeric contact list ID (see the list's settings in the Mailjet dashboard) — not an email address. */
	listId: string;
}

/** Adds an email to the writing-updates contact list via Mailjet's Contact Lists API
 *  (native fetch, no SDK — same approach as mailjet.ts). `addnoforce` makes a repeat
 *  signup a no-op success instead of a duplicate-member error. */
export async function subscribeToMailingList(
	config: MailjetListConfig,
	email: string
): Promise<void> {
	const response = await fetch(
		`https://api.mailjet.com/v3/REST/contactslist/${config.listId}/managecontact`,
		{
			method: 'POST',
			headers: {
				Authorization: `Basic ${btoa(`${config.apiKey}:${config.apiSecret}`)}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ Action: 'addnoforce', Email: email })
		}
	);

	if (!response.ok) {
		const detail = await response.text();
		throw new Error(`Mailjet list request failed: ${response.status} ${detail}`);
	}
}
