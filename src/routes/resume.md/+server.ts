import { profile } from '$lib/content/profile';
import { experience } from '$lib/content/experience';
import { education } from '$lib/content/education';
import { certifications } from '$lib/content/certifications';
import { buildResumeMarkdown } from '$lib/utils/buildResumeMarkdown';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const body = buildResumeMarkdown({ profile, experience, education, certifications });
	return new Response(body, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
