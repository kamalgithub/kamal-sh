import { profile } from '$lib/content/profile';
import { parseGithubEvents } from '$lib/utils/parseGithubEvents';
import type { PageServerLoad } from './$types';

// The one genuinely dynamic surface on this page — see docs/architecture.md.
export const prerender = false;

// Reuses the GitHub link already in profile.ts instead of duplicating the username.
const githubUsername = new URL(profile.links.github).pathname.replace(/^\//, '');

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=1800' });

	try {
		const response = await fetch(`https://api.github.com/users/${githubUsername}/events/public`, {
			headers: { Accept: 'application/vnd.github+json' },
			signal: AbortSignal.timeout(2500)
		});
		if (!response.ok) return { githubActivity: [] };
		return { githubActivity: parseGithubEvents(await response.json()) };
	} catch {
		// A GitHub outage or rate limit should never take the About page down with it.
		return { githubActivity: [] };
	}
};
