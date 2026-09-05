import { getIstCalendarDate, istInstant, type CalendarDate } from './ist';
import { AVAILABILITY_END_HOUR } from './getTimeSlotsForDate';

/**
 * The next `days` IST calendar dates starting from `now`'s IST date. Today is excluded
 * once its availability window has fully passed — otherwise the calendar offers a date
 * that's guaranteed to show "no times left" the moment it's clicked.
 */
export function getBookableDates(now: Date, days: number): CalendarDate[] {
	const today = getIstCalendarDate(now);
	const todayWindowPassed = now.getTime() >= istInstant(today, AVAILABILITY_END_HOUR, 0).getTime();
	const startOffset = todayWindowPassed ? 1 : 0;

	const dates: CalendarDate[] = [];
	for (let i = startOffset; i < startOffset + days; i++) {
		const d = new Date(Date.UTC(today.year, today.month, today.day + i));
		dates.push({ year: d.getUTCFullYear(), month: d.getUTCMonth(), day: d.getUTCDate() });
	}
	return dates;
}
