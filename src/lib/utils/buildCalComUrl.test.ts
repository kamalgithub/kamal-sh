import { describe, expect, it } from 'vitest';
import { buildCalComUrl } from './buildCalComUrl';

describe('buildCalComUrl', () => {
	it('matches the reference URL format exactly', () => {
		const url = buildCalComUrl('kamalk', 30, new Date('2026-09-05T06:00:00.000Z'));
		expect(url).toBe('https://cal.com/kamalk/30min?slot=2026-09-05T06%3A00%3A00.000Z');
	});
});
