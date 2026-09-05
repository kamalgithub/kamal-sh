import { buildRootCliResponse } from '$lib/utils/buildRootCliResponse';
import type { Handle } from '@sveltejs/kit';

/**
 * Covers only the genuinely SSR'd routes (/, /about, /contact) — adapter-cloudflare's
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
 *
 * `challenges.cloudflare.com` (script/frame/connect) is Cloudflare Turnstile — only
 * actually loaded on /contact, but this one policy is shared across all three SSR
 * routes, so the allowance is granted here rather than added as a per-route branch.
 */
const CONTENT_SECURITY_POLICY = [
	"default-src 'self'",
	"script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' https://*.ytimg.com https://blog.aicademy.ac data:",
	"font-src 'self'",
	"connect-src 'self' https://api.github.com https://challenges.cloudflare.com",
	'frame-src https://challenges.cloudflare.com',
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'"
].join('; ');

// See src/routes/+page.ts for why "/" is SSR (prerender = false): buildRootCliResponse
// needs a real per-request User-Agent check, which only runs for routes that go through
// the Worker's SSR path — a prerendered page is served straight from static assets and
// never reaches this hook at all.
export const handle: Handle = async ({ event, resolve }) => {
	const response = buildRootCliResponse(event.url, event.request) ?? (await resolve(event));

	response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	return response;
};
