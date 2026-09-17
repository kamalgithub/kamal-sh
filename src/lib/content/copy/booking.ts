import type { BookingCopy } from './booking.types';

export const bookingCopy: BookingCopy = {
	heading: 'Book a time',
	dateStepLabel: 'Select a date',
	durationStepLabel: 'Select a duration',
	timeStepLabel: 'Select a time',
	detailsStepLabel: 'Your details',
	backLabel: 'Back',
	noSlotsMessage: 'No times left today — try another date.',
	loadingLabel: 'Loading available times…',
	stepProgressLabel: 'Step {current} of {total}',
	outsideWindowTooltip: 'Bookable only within the next 2 weeks',
	previousMonthLabel: 'Previous month',
	nextMonthLabel: 'Next month',
	weekdayLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
	durationLabelTemplate: '{minutes} min',
	nameLabel: 'Name',
	emailLabel: 'Email',
	// TODO(kamal): confirm this matches the real question text configured on the "meet"
	// event type's expectationsFromMe custom field (Cal.com dashboard -> Event Types ->
	// meet -> Advanced -> Booking questions) — this is a placeholder guess, not copied
	// from the real source.
	notesLabel: 'What are your expectations from this call?',
	locationLabel: 'Meet via',
	locationGoogleMeetLabel: 'Google Meet',
	locationPhoneLabel: 'Phone call',
	phoneLabel: 'Phone number',
	phoneCountryLabel: 'Country code',
	confirmLabel: 'Confirm booking',
	confirmingLabel: 'Booking…',
	successMessage: "You're booked — a confirmation is on its way to your email.",
	nameRequiredError: 'Enter your name.',
	emailInvalidError: 'Enter a valid email address.',
	notesRequiredError: 'This is required — let me know what you want to get out of the call.',
	phoneRequiredError: 'Enter a phone number for a phone call.',
	conflictError: 'That time was just booked — pick another.',
	notConfiguredError: 'Booking is not configured yet — try the direct link below instead.',
	verificationFailedError: 'Verification failed — please try again.',
	bookingFailedError:
		"Couldn't complete the booking — please try again or use the direct link below."
};
