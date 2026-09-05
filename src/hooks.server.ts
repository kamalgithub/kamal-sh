import type { Handle } from '@sveltejs/kit';

/**
 * Covers only the genuinely SSR'd routes (/about, /contact) — adapter-cloudflare's
 * generated worker serves every prerendered page straight from env.ASSETS.fetch(),
 * bypassing this hook entirely, so static/_headers carries the same policy for
 * everything else. Keep the two in sync by hand.
 *
 * `script-src`/`style-src` include 'unsafe-inline' deliberately, not by oversight — see
 * /security for why: the theme FOUC-prevention script in app.html and the per-page
 * JSON-LD <script> tags are plain inline content with no nonce/hash wiring (SvelteKit's
 * built-in CSP hashing only covers its own generated tags, not ours), and a couple of
 * components use Svelte's `style:` directive, which renders as an inline style attribute.
 * Everything else stays as strict as this static, no-database site allows.
 */
const CONTENT_SECURITY_POLICY = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline'",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' https://*.ytimg.com data:",
	"font-src 'self'",
	"connect-src 'self' https://api.github.com",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'"
].join('; ');

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	return response;
};
