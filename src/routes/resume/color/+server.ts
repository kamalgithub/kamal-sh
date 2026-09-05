import { profile } from '$lib/content/profile';
import { experience } from '$lib/content/experience';
import { education } from '$lib/content/education';
import { certifications } from '$lib/content/certifications';
import { buildResumeText } from '$lib/utils/buildResumeText';
import type { RequestHandler } from './$types';

export const prerender = true;

// A separate, opt-in static route rather than a ?color query param on /resume: the
// output here is still fully determined at build time (no per-request branching), so
// it stays a free static asset instead of forcing /resume itself onto SSR just to read
// a query string. Whoever wants ANSI styling asks for it by URL, explicitly.
export const GET: RequestHandler = () => {
	const body = buildResumeText({ profile, experience, education, certifications }, { color: true });
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
