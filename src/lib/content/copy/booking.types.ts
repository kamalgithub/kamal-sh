export interface BookingCopy {
	heading: string;
	dateStepLabel: string;
	durationStepLabel: string;
	timeStepLabel: string;
	detailsStepLabel: string;
	backLabel: string;
	noSlotsMessage: string;
	loadingLabel: string;
	/** Template with `{current}`/`{total}` placeholders, e.g. "Step {current} of {total}". */
	stepProgressLabel: string;
	/** Shown on hover/tap for a real calendar day outside the bookable window. */
	outsideWindowTooltip: string;
	previousMonthLabel: string;
	nextMonthLabel: string;
	/** Sun-first, matching the calendar grid's own column order. */
	weekdayLabels: string[];
	/** Template with a `{minutes}` placeholder, e.g. "{minutes} min". */
	durationLabelTemplate: string;
	nameLabel: string;
	emailLabel: string;
	notesLabel: string;
	locationLabel: string;
	locationGoogleMeetLabel: string;
	locationPhoneLabel: string;
	phoneLabel: string;
	confirmLabel: string;
	confirmingLabel: string;
	successMessage: string;
	nameRequiredError: string;
	emailInvalidError: string;
	notesRequiredError: string;
	phoneRequiredError: string;
	conflictError: string;
	notConfiguredError: string;
	verificationFailedError: string;
	bookingFailedError: string;
}
