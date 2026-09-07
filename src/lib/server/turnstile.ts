/** Verifies a Cloudflare Turnstile response token via its siteverify HTTP API (native fetch, no SDK dependency).
 *  Unlike the other outbound calls in `server/`, the caller doesn't wrap this in its own
 *  try/catch — a network failure or timeout here must resolve to "not verified", not throw. */
export async function verifyTurnstileToken(
	secretKey: string,
	token: string,
	remoteIp: string | undefined
): Promise<boolean> {
	const body = new URLSearchParams({ secret: secretKey, response: token });
	if (remoteIp) body.set('remoteip', remoteIp);

	try {
		const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body,
			signal: AbortSignal.timeout(4000)
		});
		if (!response.ok) return false;

		const result = (await response.json()) as { success?: boolean };
		return result.success === true;
	} catch {
		return false;
	}
}
