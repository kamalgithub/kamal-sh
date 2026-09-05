export interface ContactFormCopy {
	nameLabel: string;
	emailLabel: string;
	messageLabel: string;
	submitLabel: string;
	sendingLabel: string;
	successMessage: string;
	nameRequiredError: string;
	emailInvalidError: string;
	messageRequiredError: string;
	sendFailedError: string;
	notConfiguredError: string;
	/** Shown when Turnstile hasn't verified the visitor yet, or verification failed. */
	verificationFailedError: string;
	/** Shown, form hidden, once the sender has hit the 2-messages-per-4-hours cap. */
	rateLimitedMessage: string;
}

export interface ContactCopy {
	heading: string;
	intro: string;
	directEmailLabel: string;
	bookingHeading: string;
	form: ContactFormCopy;
}
