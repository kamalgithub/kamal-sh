import type { ContactCopy } from './contact.types';

export const contactCopy: ContactCopy = {
	heading: "Let's build together",
	intro:
		"Whether it's a cloud migration, a DevOps transformation, or just a technical discussion — send a message or book a time directly.",
	bookingHeading: 'Book a time',
	form: {
		nameLabel: 'Name',
		emailLabel: 'Email',
		messageLabel: 'Message',
		submitLabel: 'Send message',
		sendingLabel: 'Sending…',
		successMessage: "Thanks — I'll get back to you soon.",
		nameRequiredError: 'Please enter your name.',
		emailInvalidError: 'Please enter a valid email address.',
		messageRequiredError: 'Please enter a message.',
		sendFailedError: 'Something went wrong sending your message — please email directly instead.',
		notConfiguredError: 'Email sending is not configured yet — please email directly instead.'
	}
};
