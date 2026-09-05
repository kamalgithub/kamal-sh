import { describe, expect, it } from 'vitest';
import { buildCalendarWeeks, getWeekday } from './buildCalendarWeeks';
import type { CalendarDate } from './ist';

function range(start: CalendarDate, count: number): CalendarDate[] {
	const dates: CalendarDate[] = [];
	for (let i = 0; i < count; i++) {
		const d = new Date(Date.UTC(start.year, start.month, start.day + i));
		dates.push({ year: d.getUTCFullYear(), month: d.getUTCMonth(), day: d.getUTCDate() });
	}
	return dates;
}

describe('getWeekday', () => {
	it('returns 0 for a known Sunday and 6 for a known Saturday', () => {
		expect(getWeekday({ year: 2026, month: 8, day: 6 })).toBe(0); // 2026-09-06 is a Sunday
		expect(getWeekday({ year: 2026, month: 8, day: 5 })).toBe(6); // 2026-09-05 is a Saturday
	});
});

describe('buildCalendarWeeks', () => {
	it('returns an empty array for no dates', () => {
		expect(buildCalendarWeeks([])).toEqual([]);
	});

	it('pads the first week so the first date lands under its real weekday', () => {
		// 2026-09-05 is a Saturday -> 6 leading nulls, then that one date.
		const weeks = buildCalendarWeeks(range({ year: 2026, month: 8, day: 5 }, 1));
		expect(weeks).toHaveLength(1);
		expect(weeks[0]).toEqual([
			null,
			null,
			null,
			null,
			null,
			null,
			{ year: 2026, month: 8, day: 5 }
		]);
	});

	it('pads the trailing week and splits into complete 7-day rows', () => {
		// Start on a Sunday (2026-09-06) for 10 days -> exactly one full week, then a
		// partial second week padded with trailing nulls.
		const weeks = buildCalendarWeeks(range({ year: 2026, month: 8, day: 6 }, 10));
		expect(weeks).toHaveLength(2);
		expect(weeks[0].every((cell) => cell !== null)).toBe(true);
		expect(weeks[1].slice(0, 3).every((cell) => cell !== null)).toBe(true);
		expect(weeks[1].slice(3)).toEqual([null, null, null, null]);
	});
});
