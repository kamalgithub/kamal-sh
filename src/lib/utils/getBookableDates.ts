import { getIstCalendarDate, type CalendarDate } from './ist';

/** The next `days` IST calendar dates starting from `now`'s IST date (today included). */
export function getBookableDates(now: Date, days: number): CalendarDate[] {
	const today = getIstCalendarDate(now);
	const dates: CalendarDate[] = [];
	for (let i = 0; i < days; i++) {
		const d = new Date(Date.UTC(today.year, today.month, today.day + i));
		dates.push({ year: d.getUTCFullYear(), month: d.getUTCMonth(), day: d.getUTCDate() });
	}
	return dates;
}
