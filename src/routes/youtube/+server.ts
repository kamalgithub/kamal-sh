import { profile } from '$lib/content/profile';
import type { RequestHandler } from './$types';

// See src/routes/linkedin/+server.ts for why this is a real SSR redirect, not prerendered.
export const prerender = false;

export const GET: RequestHandler = () =>
	new Response(null, { status: 301, headers: { Location: profile.links.youtube } });
