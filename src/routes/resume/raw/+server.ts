import { profile } from '$lib/content/profile';
import { experience } from '$lib/content/experience';
import { education } from '$lib/content/education';
import { certifications } from '$lib/content/certifications';
import { buildResumeText } from '$lib/utils/buildResumeText';
import type { RequestHandler } from './$types';

export const prerender = true;

// Plain ASCII, no ANSI codes — the escape hatch for a client that can't render color
// (piping to a file, an older terminal, a script parsing the output as plain text).
export const GET: RequestHandler = () => {
	const body = buildResumeText({ profile, experience, education, certifications });
	return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
