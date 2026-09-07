export interface ContactMessage {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export interface MailjetConfig {
	apiKey: string;
	apiSecret: string;
	domain: string;
	/** Where the contact form's notification email is delivered — Kamal's real inbox. */
	toAddress: string;
}

/** The sender's own words, followed by a plain signature block so the recipient
 *  always sees who sent it and how to reach them, even before checking Reply-To. */
function buildEmailBody(contact: ContactMessage): string {
	return [
		contact.message,
		'',
		'—',
		'Regards,',
		contact.name,
		contact.email,
		'',
		'Sent using kamal.sh contact form'
	].join('\n');
}

/** Sends a contact-form submission as an email via Mailjet's Send API v3.1 (native fetch, no SDK dependency). */
export async function sendContactEmail(
	config: MailjetConfig,
	contact: ContactMessage
): Promise<void> {
	const response = await fetch('https://api.mailjet.com/v3.1/send', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${btoa(`${config.apiKey}:${config.apiSecret}`)}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			Messages: [
				{
					From: { Email: `postmaster@${config.domain}`, Name: 'kamal.sh contact form' },
					To: [{ Email: config.toAddress }],
					ReplyTo: { Email: contact.email, Name: contact.name },
					Subject: `[Query] ${contact.subject}`,
					TextPart: buildEmailBody(contact)
				}
			]
		})
	});

	if (!response.ok) {
		const detail = await response.text();
		throw new Error(`Mailjet request failed: ${response.status} ${detail}`);
	}
}
