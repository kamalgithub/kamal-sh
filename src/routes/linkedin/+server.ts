import { profile } from '$lib/content/profile';
import type { RequestHandler } from './$types';

// Not prerendered, deliberately: a static host can only serve a 200 (a meta-refresh
// page), and link-preview crawlers (Slack, Twitter, iMessage...) need a real HTTP
// redirect to follow through to LinkedIn and show LinkedIn's own preview, not ours.
export const prerender = false;

export const GET: RequestHandler = () =>
	new Response(null, { status: 301, headers: { Location: profile.links.linkedin } });
