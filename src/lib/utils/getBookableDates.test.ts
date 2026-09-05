import { describe, expect, it } from 'vitest';
import { getBookableDates } from './getBookableDates';

describe('getBookableDates', () => {
	it('returns 14 consecutive dates starting today (IST)', () => {
		const now = new Date('2026-09-05T06:00:00.000Z'); // 2026-09-05, 11:30 AM IST
		const dates = getBookableDates(now, 14);

		expect(dates).toHaveLength(14);
		expect(dates[0]).toEqual({ year: 2026, month: 8, day: 5 });
		expect(dates[13]).toEqual({ year: 2026, month: 8, day: 18 });
	});

	it('rolls over month and year boundaries correctly', () => {
		const now = new Date('2026-12-28T06:00:00.000Z'); // 2026-12-28, 11:30 AM IST
		const dates = getBookableDates(now, 14);

		expect(dates[0]).toEqual({ year: 2026, month: 11, day: 28 });
		expect(dates[3]).toEqual({ year: 2026, month: 11, day: 31 });
		expect(dates[4]).toEqual({ year: 2027, month: 0, day: 1 });
	});

	it('excludes today once its availability window (11am-2pm IST) has passed', () => {
		const now = new Date('2026-09-05T10:01:00.000Z'); // 2026-09-05, 3:31 PM IST
		const dates = getBookableDates(now, 14);

		expect(dates).toHaveLength(14);
		expect(dates[0]).toEqual({ year: 2026, month: 8, day: 6 });
	});

	it('still includes today while its availability window is still open', () => {
		const now = new Date('2026-09-05T08:00:00.000Z'); // 2026-09-05, 1:30 PM IST
		const dates = getBookableDates(now, 14);

		expect(dates[0]).toEqual({ year: 2026, month: 8, day: 5 });
	});
});
