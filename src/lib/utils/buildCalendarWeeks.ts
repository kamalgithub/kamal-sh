import type { CalendarDate } from './ist';

/** 0 = Sunday ... 6 = Saturday, computed via UTC so it never drifts with the runtime's own timezone. */
export function getWeekday(date: CalendarDate): number {
	return new Date(Date.UTC(date.year, date.month, date.day)).getUTCDay();
}

/**
 * Arranges a flat, ascending list of dates into Sunday-start calendar weeks (7 slots each),
 * padding leading/trailing gaps with `null` so each date lands under its real weekday column.
 * Assumes `dates` is already ascending and gap-free, which is all getBookableDates produces.
 */
export function buildCalendarWeeks(dates: CalendarDate[]): (CalendarDate | null)[][] {
	if (dates.length === 0) return [];

	const weeks: (CalendarDate | null)[][] = [];
	let week: (CalendarDate | null)[] = new Array(getWeekday(dates[0])).fill(null);

	for (const date of dates) {
		week.push(date);
		if (week.length === 7) {
			weeks.push(week);
			week = [];
		}
	}
	if (week.length > 0) {
		weeks.push([...week, ...new Array(7 - week.length).fill(null)]);
	}
	return weeks;
}
