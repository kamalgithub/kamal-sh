const CACHE_KEY_ORIGIN = 'https://rate-limit.internal';

interface RateLimitState {
	count: number;
	/** Epoch ms when this identifier's current window started. */
	windowStart: number;
}

/** The one cache this needs — Workers' `caches.default`. Declared locally, duck-typed to
 *  only what's actually called here, rather than trusting the ambient `CacheStorage`/
 *  `Request`/`Response` globals: those resolve inconsistently between lib.dom.d.ts and
 *  @cloudflare/workers-types depending on the importing file, and the real DOM/Workers
 *  Response types aren't structurally assignable to each other in either direction. */
export interface RateLimitCache {
	default: {
		match(key: string): Promise<{ json(): Promise<unknown> } | undefined>;
		put(key: string, response: unknown): Promise<void>;
	};
}

async function hashIdentifier(value: string): Promise<string> {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
}

/**
 * Best-effort per-identifier rate limiting using the Workers Cache API (`platform.caches`)
 * instead of a real database — see CLAUDE.md's "no database" hard rule. The identifier
 * (an IP address) is hashed before use as a cache key, so nothing identifying is stored,
 * even ephemerally. Cache entries can be evicted early and aren't shared across every
 * Cloudflare edge location, so this blocks casual repeat abuse from the same visitor —
 * not a determined attacker switching networks or edge PoPs.
 */
export async function checkRateLimit(
	caches: RateLimitCache,
	scope: string,
	identifier: string,
	maxPerWindow: number,
	windowSeconds: number
): Promise<{ allowed: boolean }> {
	const cache = caches.default;
	const key = `${CACHE_KEY_ORIGIN}/${scope}/${await hashIdentifier(identifier)}`;
	const now = Date.now();

	const cached = await cache.match(key);
	let state: RateLimitState | undefined;
	if (cached) {
		const body = (await cached.json()) as RateLimitState;
		if ((now - body.windowStart) / 1000 < windowSeconds) state = body;
	}
	state ??= { count: 0, windowStart: now };

	if (state.count >= maxPerWindow) {
		return { allowed: false };
	}

	const nextState: RateLimitState = { count: state.count + 1, windowStart: state.windowStart };
	const remainingSeconds = Math.max(
		1,
		Math.round(windowSeconds - (now - state.windowStart) / 1000)
	);
	await cache.put(
		key,
		new Response(JSON.stringify(nextState), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': `max-age=${remainingSeconds}`
			}
		})
	);

	return { allowed: true };
}
