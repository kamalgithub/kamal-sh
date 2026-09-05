import { describe, expect, it } from 'vitest';
import { getDisplayStats } from './getDisplayStats';
import type { Stat } from '$lib/content/stats.types';

describe('getDisplayStats', () => {
	it('appends a Certifications entry using the given count', () => {
		const stats: Stat[] = [
			{ label: 'Years of experience', value: '8+', icon: 'calendar', asOf: '2026-08-21' }
		];

		const result = getDisplayStats(stats, 8);

		expect(result).toEqual([
			{ label: 'Years of experience', value: '8+', icon: 'calendar', asOf: '2026-08-21' },
			{ label: 'Certifications', value: '8', icon: 'checkCircle' }
		]);
	});

	it('does not mutate the input array', () => {
		const stats: Stat[] = [
			{ label: 'Years of experience', value: '8+', icon: 'calendar', asOf: '2026-08-21' }
		];

		getDisplayStats(stats, 8);

		expect(stats).toHaveLength(1);
	});
});
