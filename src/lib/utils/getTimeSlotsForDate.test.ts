import { describe, expect, it } from 'vitest';
import { getTimeSlotsForDate } from './getTimeSlotsForDate';

const FAR_PAST = new Date('2000-01-01T00:00:00.000Z');
const date = { year: 2026, month: 8, day: 5 };

describe('getTimeSlotsForDate', () => {
	it('generates slots spanning the 9am-6pm IST window at the given duration', () => {
		const slots = getTimeSlotsForDate(date, 30, FAR_PAST);

		expect(slots).toHaveLength(18); // 9 hours / 30 min
		expect(slots[0].toISOString()).toBe('2026-09-05T03:30:00.000Z'); // 9:00 AM IST
		expect(slots.at(-1)?.toISOString()).toBe('2026-09-05T12:00:00.000Z'); // 5:30 PM IST, last 30-min slot
	});

	it('produces fewer, evenly spaced slots for a longer duration', () => {
		const slots = getTimeSlotsForDate(date, 60, FAR_PAST);

		expect(slots).toHaveLength(9); // 9 hours / 60 min
		expect(slots[0].toISOString()).toBe('2026-09-05T03:30:00.000Z');
		expect(slots.at(-1)?.toISOString()).toBe('2026-09-05T11:30:00.000Z'); // 5:00 PM IST
	});

	it('excludes slots that have already passed', () => {
		// 12:00 PM IST on the same date — everything before this should be filtered out.
		const now = new Date('2026-09-05T06:30:00.000Z');
		const slots = getTimeSlotsForDate(date, 30, now);

		expect(slots.every((slot) => slot.getTime() > now.getTime())).toBe(true);
		expect(slots[0].toISOString()).toBe('2026-09-05T07:00:00.000Z'); // 12:30 PM IST
	});
});
