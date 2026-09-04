// IST is a fixed UTC+5:30 offset year-round — no daylight saving to account for.
export const IST_OFFSET_MINUTES = 5 * 60 + 30;

export interface CalendarDate {
	year: number;
	/** 0-indexed, matching JS Date's month numbering. */
	month: number;
	day: number;
}

/** The {year, month, day} `instant` falls on when observed in IST, regardless of the runtime's own timezone. */
export function getIstCalendarDate(instant: Date): CalendarDate {
	const ist = new Date(instant.getTime() + IST_OFFSET_MINUTES * 60_000);
	return { year: ist.getUTCFullYear(), month: ist.getUTCMonth(), day: ist.getUTCDate() };
}

/** The absolute UTC instant that a given IST wall-clock date + time represents. */
export function istInstant(date: CalendarDate, hour: number, minute: number): Date {
	const asIfUtc = Date.UTC(date.year, date.month, date.day, hour, minute);
	return new Date(asIfUtc - IST_OFFSET_MINUTES * 60_000);
}
