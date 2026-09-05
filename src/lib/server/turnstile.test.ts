import { afterEach, describe, expect, it, vi } from 'vitest';
import { verifyTurnstileToken } from './turnstile';

describe('verifyTurnstileToken', () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it('returns true when Cloudflare reports success', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }))
		);

		expect(await verifyTurnstileToken('secret', 'token', '1.2.3.4')).toBe(true);
	});

	it('returns false when Cloudflare reports failure', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false }), { status: 200 }))
		);

		expect(await verifyTurnstileToken('secret', 'token', undefined)).toBe(false);
	});

	it('returns false when the siteverify request itself fails', async () => {
		vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 500 })));

		expect(await verifyTurnstileToken('secret', 'token', undefined)).toBe(false);
	});

	it('sends the token, secret, and remote IP as form fields', async () => {
		const fetchMock = vi
			.fn()
			.mockResolvedValue(new Response(JSON.stringify({ success: true }), { status: 200 }));
		vi.stubGlobal('fetch', fetchMock);

		await verifyTurnstileToken('my-secret', 'my-token', '1.2.3.4');

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify');
		const body = new URLSearchParams(init.body as string);
		expect(body.get('secret')).toBe('my-secret');
		expect(body.get('response')).toBe('my-token');
		expect(body.get('remoteip')).toBe('1.2.3.4');
	});
});
