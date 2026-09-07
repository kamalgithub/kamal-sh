export interface NewsletterCopy {
	heading: string;
	intro: string;
	emailLabel: string;
	submitLabel: string;
	subscribingLabel: string;
	successMessage: string;
	invalidEmailError: string;
	notConfiguredError: string;
	sendFailedError: string;
	rateLimitedError: string;
	/** Shown when Turnstile hasn't verified the visitor yet, or verification failed. */
	verificationFailedError: string;
	genericErrorMessage: string;
}
