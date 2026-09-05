import type { Stat } from './stats.types';

// Manually maintained — bump `asOf` whenever a value is updated.
// The "Certifications" stat is intentionally not here: it must always be
// derived from certifications.length (see certifications.ts) rather than
// hardcoded, so it can never drift out of sync with the actual list.
export const stats: Stat[] = [
	{ label: 'LinkedIn followers', value: '13K+', asOf: '2026-09-05' },
	{ label: 'YouTube subscribers', value: '2.9K+', asOf: '2026-09-05' },
	{ label: 'Years of experience', value: '10+', asOf: '2026-08-21' },
	{ label: 'Students taught', value: '600+', asOf: '2026-09-05' },
	{ label: 'Cloud cost savings', value: '$1.4M+', asOf: '2026-08-21' }
];
