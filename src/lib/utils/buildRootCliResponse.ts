import { building } from '$app/environment';
import { profile } from '$lib/content/profile';
import { experience } from '$lib/content/experience';
import { education } from '$lib/content/education';
import { certifications } from '$lib/content/certifications';
import { buildResumeText } from './buildResumeText';
import { isCliRequest } from './isCliRequest';

/**
 * `curl kamal.sh` (or wget/iwr/any other non-browser client) gets the résumé straight
 * from the root domain, ANSI bold/color on by default (same as /resume) — returns
 * `undefined` for anything else (a real browser, or any other path), telling the caller
 * to fall through to normal SvelteKit rendering. /resume-raw is the plain-text escape
 * hatch for a client that can't handle the color codes; there is no raw variant at the
 * root itself, to keep exactly one behavior for `curl kamal.sh`.
 *
 * The `building` guard matters, not just style: SvelteKit's own prerender crawler makes
 * an internal fetch to `/` (to discover links to other pages) with no browser-like
 * User-Agent, which `isCliRequest` — correctly, for a real request — would classify as a
 * CLI client. Without this guard, the build itself gets served the plain-text résumé
 * instead of the homepage for that internal fetch, and fails with "Cannot prerender a
 * root +server.js that returns a non-HTML response" (this actually happened, found by
 * running a real `bun run build`, which is the only command that exercises this path).
 */
export function buildRootCliResponse(url: URL, request: Request): Response | undefined {
	if (building || url.pathname !== '/' || !isCliRequest(request)) return undefined;
	const body = buildResumeText({ profile, experience, education, certifications }, { color: true });
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
