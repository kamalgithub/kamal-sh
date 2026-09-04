import { describe, expect, it } from 'vitest';
import { getIstCalendarDate, istInstant } from './ist';

describe('istInstant', () => {
	it('converts an IST wall-clock time to the correct UTC instant', () => {
		// 9:00 AM IST = 3:30 AM UTC (IST is UTC+5:30)
		const instant = istInstant({ year: 2026, month: 8, day: 5 }, 9, 0);
		expect(instant.toISOString()).toBe('2026-09-05T03:30:00.000Z');
	});

	it('matches the reference example (11:30 AM IST)', () => {
		const instant = istInstant({ year: 2026, month: 8, day: 5 }, 11, 30);
		expect(instant.toISOString()).toBe('2026-09-05T06:00:00.000Z');
	});
});

describe('getIstCalendarDate', () => {
	it('returns the IST calendar date for a UTC instant on the same day', () => {
		const date = getIstCalendarDate(new Date('2026-09-05T06:00:00.000Z'));
		expect(date).toEqual({ year: 2026, month: 8, day: 5 });
	});

	it('rolls over to the next IST day for a late-UTC instant', () => {
		// 2026-09-05T20:00:00Z is 2026-09-06T01:30 IST — already the next day in IST.
		const date = getIstCalendarDate(new Date('2026-09-05T20:00:00.000Z'));
		expect(date).toEqual({ year: 2026, month: 8, day: 6 });
	});
});
