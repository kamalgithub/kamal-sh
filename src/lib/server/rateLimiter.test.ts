import { describe, expect, it, vi } from 'vitest';
import { checkRateLimit, type RateLimitCache } from './rateLimiter';

function fakeCaches(cached?: { count: number; windowStart: number }) {
	const put = vi.fn();
	const match = vi
		.fn()
		.mockResolvedValue(cached ? new Response(JSON.stringify(cached)) : undefined);
	const caches: RateLimitCache = { default: { match, put } };
	return { caches, match, put };
}

describe('checkRateLimit', () => {
	it('allows and records a first attempt with no prior entry', async () => {
		const { caches, put } = fakeCaches(undefined);

		const result = await checkRateLimit(caches, 'contact', '1.2.3.4', 2, 14400);

		expect(result.allowed).toBe(true);
		expect(put).toHaveBeenCalledTimes(1);
		const [, response] = put.mock.calls[0];
		const stored = await response.json();
		expect(stored.count).toBe(1);
	});

	it('allows a second attempt within the window and increments the count', async () => {
		const { caches, put } = fakeCaches({ count: 1, windowStart: Date.now() });

		const result = await checkRateLimit(caches, 'contact', '1.2.3.4', 2, 14400);

		expect(result.allowed).toBe(true);
		const [, response] = put.mock.calls[0];
		const stored = await response.json();
		expect(stored.count).toBe(2);
	});

	it('rejects a third attempt within the window without rewriting the entry', async () => {
		const { caches, put } = fakeCaches({ count: 2, windowStart: Date.now() });

		const result = await checkRateLimit(caches, 'contact', '1.2.3.4', 2, 14400);

		expect(result.allowed).toBe(false);
		expect(put).not.toHaveBeenCalled();
	});

	it('treats an entry older than the window as expired and starts fresh', async () => {
		const eightHoursAgo = Date.now() - 8 * 60 * 60 * 1000;
		const { caches, put } = fakeCaches({ count: 2, windowStart: eightHoursAgo });

		const result = await checkRateLimit(caches, 'contact', '1.2.3.4', 2, 14400);

		expect(result.allowed).toBe(true);
		const [, response] = put.mock.calls[0];
		const stored = await response.json();
		expect(stored.count).toBe(1);
	});

	it('scopes the cache key so different identifiers never collide', async () => {
		const { caches, match } = fakeCaches(undefined);

		await checkRateLimit(caches, 'contact', '1.2.3.4', 2, 14400);
		await checkRateLimit(caches, 'contact', '5.6.7.8', 2, 14400);

		const [firstKey] = match.mock.calls[0];
		const [secondKey] = match.mock.calls[1];
		expect(firstKey).not.toBe(secondKey);
	});
});
