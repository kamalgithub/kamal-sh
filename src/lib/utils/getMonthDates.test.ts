import { describe, expect, it } from 'vitest';
import { addMonths, getMonthDates } from './getMonthDates';

describe('getMonthDates', () => {
	it('returns every day of a 30-day month', () => {
		const dates = getMonthDates(2026, 8); // September (0-indexed)
		expect(dates).toHaveLength(30);
		expect(dates[0]).toEqual({ year: 2026, month: 8, day: 1 });
		expect(dates[29]).toEqual({ year: 2026, month: 8, day: 30 });
	});

	it('returns every day of a 31-day month', () => {
		const dates = getMonthDates(2026, 0); // January
		expect(dates).toHaveLength(31);
	});

	it('handles February in a leap year', () => {
		const dates = getMonthDates(2028, 1);
		expect(dates).toHaveLength(29);
	});
});

describe('addMonths', () => {
	it('adds months within the same year', () => {
		expect(addMonths(2026, 8, 1)).toEqual({ year: 2026, month: 9 });
	});

	it('rolls over into the next year', () => {
		expect(addMonths(2026, 11, 1)).toEqual({ year: 2027, month: 0 });
	});

	it('rolls back into the previous year', () => {
		expect(addMonths(2026, 0, -1)).toEqual({ year: 2025, month: 11 });
	});

	it('is a no-op for an offset of 0', () => {
		expect(addMonths(2026, 8, 0)).toEqual({ year: 2026, month: 8 });
	});
});
