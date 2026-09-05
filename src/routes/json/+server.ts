import { profile } from '$lib/content/profile';
import { experience } from '$lib/content/experience';
import { education } from '$lib/content/education';
import { certifications } from '$lib/content/certifications';
import { colorizeJson } from '$lib/utils/colorizeJson';
import type { RequestHandler } from './$types';

export const prerender = true;

// A human-facing, ANSI-colorized view — nobody needs this résumé data as a real API
// result, so the default here optimizes for "looks good in a terminal" over "is valid
// JSON" (colorizing breaks strict JSON syntax). /json/raw and /resume.json are the
// actual application/json endpoints for the rare case someone wants to parse it.
export const GET: RequestHandler = () => {
	const body = colorizeJson({ profile, experience, education, certifications });
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
