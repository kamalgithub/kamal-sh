import { profile } from '$lib/content/profile';
import { experience } from '$lib/content/experience';
import { education } from '$lib/content/education';
import { certifications } from '$lib/content/certifications';
import { buildResumeText } from './buildResumeText';
import { isCliRequest } from './isCliRequest';

/**
 * `curl kamal.sh` (or wget/iwr/any other non-browser client) gets the plain-text résumé
 * straight from the root domain — returns `undefined` for anything else (a real browser,
 * or any other path), telling the caller to fall through to normal SvelteKit rendering.
 */
export function buildRootCliResponse(url: URL, request: Request): Response | undefined {
	if (url.pathname !== '/' || !isCliRequest(request)) return undefined;
	const body = buildResumeText({ profile, experience, education, certifications });
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
