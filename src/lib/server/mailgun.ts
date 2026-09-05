export interface ContactMessage {
	name: string;
	email: string;
	subject: string;
	message: string;
}

export interface MailgunConfig {
	apiKey: string;
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

/** Sends a contact-form submission as an email via Mailgun's HTTP API (native fetch, no SDK dependency). */
export async function sendContactEmail(
	config: MailgunConfig,
	contact: ContactMessage
): Promise<void> {
	const body = new URLSearchParams({
		from: `kamal.sh contact form <postmaster@${config.domain}>`,
		to: config.toAddress,
		'h:Reply-To': contact.email,
		subject: `[Query] ${contact.subject}`,
		text: buildEmailBody(contact)
	});

	const response = await fetch(`https://api.mailgun.net/v3/${config.domain}/messages`, {
		method: 'POST',
		headers: {
			Authorization: `Basic ${btoa(`api:${config.apiKey}`)}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body
	});

	if (!response.ok) {
		const detail = await response.text();
		throw new Error(`Mailgun request failed: ${response.status} ${detail}`);
	}
}
