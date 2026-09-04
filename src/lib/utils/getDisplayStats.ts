import type { Stat } from '$lib/content/stats.types';

/** Appends the Certifications count, always derived from the live list length — never hardcoded. */
export function getDisplayStats(stats: Stat[], certificationsCount: number): Stat[] {
	return [...stats, { label: 'Certifications', value: String(certificationsCount) }];
}
