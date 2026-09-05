import { profile } from '$lib/content/profile';
import { experience } from '$lib/content/experience';
import { education } from '$lib/content/education';
import { certifications } from '$lib/content/certifications';
import { buildResumeText } from '$lib/utils/buildResumeText';
import type { RequestHandler } from './$types';

export const prerender = true;

// ANSI bold/color by default, same as the root domain — see /security for the tradeoff
// this accepts. /resume/raw is the plain-text escape hatch for a client that can't
// handle the color codes; both are still static, still free at request time.
export const GET: RequestHandler = () => {
	const body = buildResumeText({ profile, experience, education, certifications }, { color: true });
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
