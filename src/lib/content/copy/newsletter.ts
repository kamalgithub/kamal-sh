import type { NewsletterCopy } from './newsletter.types';

export const newsletterCopy: NewsletterCopy = {
	heading: 'Get new posts by email',
	intro:
		"New writing and videos, sent when there's something real to share — no other list, no spam.",
	emailLabel: 'Email address',
	submitLabel: 'Subscribe',
	subscribingLabel: 'Subscribing…',
	successMessage: "You're subscribed — new posts will land in your inbox.",
	invalidEmailError: 'Enter a valid email address.',
	notConfiguredError: "Subscriptions aren't set up yet — check back soon.",
	sendFailedError: 'Something went wrong. Try again in a moment.',
	rateLimitedError: 'Too many attempts. Try again later.',
	genericErrorMessage: 'Something went wrong. Try again in a moment.'
};
