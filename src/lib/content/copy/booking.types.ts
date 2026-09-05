export interface BookingCopy {
	heading: string;
	dateStepLabel: string;
	durationStepLabel: string;
	timeStepLabel: string;
	backLabel: string;
	noSlotsMessage: string;
	loadingLabel: string;
	/** Template with `{current}`/`{total}` placeholders, e.g. "Step {current} of {total}". */
	stepProgressLabel: string;
}
