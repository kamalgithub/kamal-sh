import type { BookingCopy } from './booking.types';

export const bookingCopy: BookingCopy = {
	heading: 'Book a time',
	dateStepLabel: 'Select a date',
	durationStepLabel: 'Select a duration',
	timeStepLabel: 'Select a time',
	backLabel: 'Back',
	noSlotsMessage: 'No times left today — try another date.',
	loadingLabel: 'Loading available times…',
	stepProgressLabel: 'Step {current} of {total}',
	outsideWindowTooltip: 'Bookable only within the next 2 weeks',
	previousMonthLabel: 'Previous month',
	nextMonthLabel: 'Next month'
};
