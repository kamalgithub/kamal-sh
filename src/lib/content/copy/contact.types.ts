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
}

export interface ContactCopy {
	heading: string;
	intro: string;
	directEmailLabel: string;
	bookingHeading: string;
	form: ContactFormCopy;
}
