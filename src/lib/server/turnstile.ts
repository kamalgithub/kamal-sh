/** Verifies a Cloudflare Turnstile response token via its siteverify HTTP API (native fetch, no SDK dependency). */
export async function verifyTurnstileToken(
	secretKey: string,
	token: string,
	remoteIp: string | undefined
): Promise<boolean> {
	const body = new URLSearchParams({ secret: secretKey, response: token });
	if (remoteIp) body.set('remoteip', remoteIp);

	const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body
	});
	if (!response.ok) return false;

	const result = (await response.json()) as { success?: boolean };
	return result.success === true;
}
