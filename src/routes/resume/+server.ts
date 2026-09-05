import { profile } from '$lib/content/profile';
import { experience } from '$lib/content/experience';
import { education } from '$lib/content/education';
import { certifications } from '$lib/content/certifications';
import { buildResumeText } from '$lib/utils/buildResumeText';
import type { RequestHandler } from './$types';

export const prerender = true;

// Always plain text — for both `curl kamal.sh/resume` and a browser hit alike.
// No content-negotiation branching: a browser renders text/plain fine, and it
// lets this render to a static file at build time instead of needing SSR.
export const GET: RequestHandler = () => {
	const body = buildResumeText({ profile, experience, education, certifications });
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
