import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendContactEmail } from './mailgun';

const CONFIG = { apiKey: 'key', domain: 'mail.kamal.sh', toAddress: 'kamal@kamal.sh' };
const CONTACT = {
	name: 'Ada Lovelace',
	email: 'ada@example.com',
	subject: 'Cloud migration question',
	message: 'Hi, I have a question about your work.'
};

describe('sendContactEmail', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('prefixes the sender-chosen subject with [Query]', async () => {
		const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 200 }));
		vi.stubGlobal('fetch', fetchMock);

		await sendContactEmail(CONFIG, CONTACT);

		const [, init] = fetchMock.mock.calls[0];
		const body = new URLSearchParams(init.body as string);
		expect(body.get('subject')).toBe('[Query] Cloud migration question');
	});

	it('sets Reply-To to the sender email, not the site address', async () => {
		const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 200 }));
		vi.stubGlobal('fetch', fetchMock);

		await sendContactEmail(CONFIG, CONTACT);

		const [, init] = fetchMock.mock.calls[0];
		const body = new URLSearchParams(init.body as string);
		expect(body.get('h:Reply-To')).toBe('ada@example.com');
		expect(body.get('to')).toBe('kamal@kamal.sh');
	});

	it('sends the message as the body, followed by a signature footer', async () => {
		const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 200 }));
		vi.stubGlobal('fetch', fetchMock);

		await sendContactEmail(CONFIG, CONTACT);

		const [, init] = fetchMock.mock.calls[0];
		const body = new URLSearchParams(init.body as string);
		const text = body.get('text') ?? '';
		expect(text.startsWith(CONTACT.message)).toBe(true);
		expect(text).toContain('Regards,');
		expect(text).toContain('Ada Lovelace');
		expect(text).toContain('ada@example.com');
		expect(text).toContain('Sent using kamal.sh contact form');
	});

	it('throws when Mailgun responds with a non-ok status', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('bad request', { status: 400 })));

		await expect(sendContactEmail(CONFIG, CONTACT)).rejects.toThrow('Mailgun request failed');
	});
});
