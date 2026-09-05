import { shortLinks } from '$lib/content/shortlinks';

/** Exact slug match against the short-link list — kept as a pure function so the route handler stays trivial. */
export function findShortLink(slug: string): string | undefined {
	return shortLinks.find((link) => link.slug === slug)?.url;
}
