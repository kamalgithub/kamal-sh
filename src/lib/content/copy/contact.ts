import type { ContactCopy } from './contact.types';

export const contactCopy: ContactCopy = {
	heading: "Let's build together",
	intro:
		"Whether it's a cloud migration, a DevOps transformation, or just a technical discussion — send a message or book a time directly.",
	directEmailLabel: 'Prefer email?',
	bookingHeading: 'Book a time',
	form: {
		nameLabel: 'Name',
		emailLabel: 'Email',
		subjectLabel: 'Subject',
		messageLabel: 'Message',
		submitLabel: 'Send message',
		sendingLabel: 'Sending…',
		successMessage: "Thanks — I'll get back to you soon.",
		nameRequiredError: 'Please enter your name.',
		nameTooShortError: 'Please enter your full name.',
		nameTooLongError: "That name's too long — 100 characters max.",
		emailInvalidError: 'Please enter a valid email address.',
		subjectRequiredError: 'Please enter a subject.',
		subjectTooShortError: 'Please write a bit more of a subject.',
		subjectTooLongError: 'Please keep the subject under 150 characters.',
		messageRequiredError: 'Please enter a message.',
		messageTooShortError: 'Please write a bit more — at least 80 characters.',
		messageTooLongError: 'Please keep your message under 500 characters.',
		sendFailedError: 'Something went wrong sending your message — please email directly instead.',
		notConfiguredError: 'Email sending is not configured yet — please email directly instead.',
		verificationFailedError: 'Verification failed — please try again.',
		rateLimitedMessage:
			"You've sent a couple of messages recently — please wait a bit before sending another, or email directly instead."
	}
};
