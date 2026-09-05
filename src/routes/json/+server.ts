import { profile } from '$lib/content/profile';
import { experience } from '$lib/content/experience';
import { education } from '$lib/content/education';
import { certifications } from '$lib/content/certifications';
import type { RequestHandler } from './$types';

export const prerender = true;

// A short, memorable alias for /resume.json (kamal.sh/json) — same content, same static,
// zero-cost prerendering. Kept as a genuine duplicate rather than a redirect: `curl` and
// `iwr` don't follow redirects by default, and the whole point is that this "just works".
export const GET: RequestHandler = () => {
	const body = JSON.stringify({ profile, experience, education, certifications }, null, 2);
	return new Response(body, { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
