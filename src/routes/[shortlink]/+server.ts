import { error } from '@sveltejs/kit';
import { findShortLink } from '$lib/utils/findShortLink';
import type { RequestHandler } from './$types';

// Add a new short link in src/lib/content/shortlinks.ts — no new route file needed.
// Not prerendered, deliberately: a static host can only serve a 200 (a meta-refresh
// page), and link-preview crawlers (Slack, Twitter, iMessage...) need a real HTTP
// redirect to follow through to the destination and show its own preview, not ours.
// A real page route (e.g. /work) always resolves before this dynamic one, so this only
// ever runs for a slug that isn't a real page — either a configured short link, or a
// genuine unmatched path, which falls through to the normal 404 below.
export const prerender = false;

export const GET: RequestHandler = ({ params }) => {
	const target = findShortLink(params.shortlink);
	if (!target) error(404, 'Not found');
	return new Response(null, { status: 301, headers: { Location: target } });
};
