import { profile } from '$lib/content/profile';
import { experience } from '$lib/content/experience';
import { education } from '$lib/content/education';
import { certifications } from '$lib/content/certifications';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const body = JSON.stringify({ profile, experience, education, certifications }, null, 2);
	return new Response(body, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
