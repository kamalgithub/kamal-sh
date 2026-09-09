import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
	// Noon UTC, not midnight — a timestamp near a day boundary would format as the
	// previous/next calendar date depending on the machine's local timezone; noon is far
	// enough from midnight that every real-world UTC offset (-12 to +14) still lands on
	// the same calendar day, so this test is deterministic regardless of where it runs.
	it('formats an ISO date as "Month D, YYYY"', () => {
		expect(formatDate('2026-09-05T12:00:00.000Z')).toBe('September 5, 2026');
	});

	it('formats a different month/day correctly', () => {
		expect(formatDate('2026-01-15T12:00:00.000Z')).toBe('January 15, 2026');
	});
});
