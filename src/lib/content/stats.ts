import type { Stat } from './stats.types';

// Manually maintained — bump `asOf` whenever a value is updated.
// The "Certifications" stat is intentionally not here: it must always be
// derived from certifications.length (see certifications.ts) rather than
// hardcoded, so it can never drift out of sync with the actual list.
export const stats: Stat[] = [
	{ label: 'LinkedIn followers', value: '10K+', asOf: '2026-08-21' },
	{ label: 'YouTube subscribers', value: '2.5K+', asOf: '2026-08-21' },
	{ label: 'Years of experience', value: '8+', asOf: '2026-08-21' },
	{ label: 'Students taught', value: '500+', asOf: '2026-08-21' },
	{ label: 'Cloud cost savings driven', value: '$1.4M+', asOf: '2026-08-21' }
];
