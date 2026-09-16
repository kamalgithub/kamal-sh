import { istInstant, type CalendarDate } from './ist';

// Confirmed availability window — 11:00 AM to 2:00 PM IST, every day, no variation
// (confirmed 2026-09-09 against the real Cal.com "meet" event type). This still only
// drives which slots the calendar *displays* — the actual booking still goes through
// Cal.com's API (see calBooking.ts), which is what actually prevents double-booking; if
// this window is ever changed on Cal.com's side without updating it here, the calendar
// would just show a wrong/stale set of times, surfaced as a real conflict error at
// submit time rather than a UI phantom. Exported so getBookableDates.ts can tell whether
// today's window has already fully passed, without duplicating the window here.
export const AVAILABILITY_START_HOUR = 11;
export const AVAILABILITY_END_HOUR = 14;

/** Available slot start instants for one IST calendar date, spaced by `durationMinutes`, excluding past slots. */
export function getTimeSlotsForDate(
	date: CalendarDate,
	durationMinutes: number,
	now: Date
): Date[] {
	const windowStart = istInstant(date, AVAILABILITY_START_HOUR, 0).getTime();
	const windowEnd = istInstant(date, AVAILABILITY_END_HOUR, 0).getTime();
	const step = durationMinutes * 60_000;

	const slots: Date[] = [];
	for (let cursor = windowStart; cursor + step <= windowEnd; cursor += step) {
		if (cursor > now.getTime()) {
			slots.push(new Date(cursor));
		}
	}
	return slots;
}
