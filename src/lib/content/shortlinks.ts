import { profile } from './profile';
import type { ShortLink } from './shortlinks.types';

/**
 * kamal.sh/<slug> redirects (301) to <url>. Add a new short link by adding one entry
 * here — no new route file needed, see src/routes/[shortlink]/+server.ts. A slug that
 * collides with a real page (e.g. 'work') is never reachable here: SvelteKit always
 * resolves a static route before falling through to this dynamic one.
 */
export const shortLinks: ShortLink[] = [
	{ slug: 'linkedin', url: profile.links.linkedin },
	{ slug: 'youtube', url: profile.links.youtube },
	{ slug: 'github', url: profile.links.github }
];
