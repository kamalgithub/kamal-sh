import { profile } from '$lib/content/profile';
import { experience } from '$lib/content/experience';
import { education } from '$lib/content/education';
import { certifications } from '$lib/content/certifications';
import type { RequestHandler } from './$types';

export const prerender = true;

// The actual valid, parseable JSON — same content as /resume.json, just under the
// shorter /json path family for symmetry with /json (colorized) and /resume/raw.
export const GET: RequestHandler = () => {
	const body = JSON.stringify({ profile, experience, education, certifications }, null, 2);
	return new Response(body, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
