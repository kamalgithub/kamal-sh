import type { CalendarDate } from './ist';

/** Every date in a given month (0-indexed, matching JS Date), 1 through the last day. */
export function getMonthDates(year: number, month: number): CalendarDate[] {
	const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
	const dates: CalendarDate[] = [];
	for (let day = 1; day <= daysInMonth; day++) {
		dates.push({ year, month, day });
	}
	return dates;
}

/** The {year, month} that's `offset` calendar months after (or before, if negative) the given one. */
export function addMonths(
	year: number,
	month: number,
	offset: number
): { year: number; month: number } {
	const total = month + offset;
	return {
		year: year + Math.floor(total / 12),
		month: ((total % 12) + 12) % 12
	};
}
