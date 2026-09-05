import { istInstant, type CalendarDate } from './ist';

// Assumed availability window — 11:00 AM to 2:00 PM IST, matching the real Cal.com
// schedule. Adjust here if that changes; there is no live availability check against
// Cal.com itself.
const AVAILABILITY_START_HOUR = 11;
const AVAILABILITY_END_HOUR = 14;

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
