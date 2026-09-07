import type { StatusCopy } from './status.types';

export const statusCopy: StatusCopy = {
	heading: 'Status',
	intro:
		"Real request and error counts for this site, read live from Cloudflare — not a marketing uptime claim, whatever the actual numbers are. See /costs for what running it costs and /postmortems for what's broken publicly.",
	windowLabel: 'Last 24 hours',
	requestsLabel: 'Requests',
	errorsLabel: 'Errors',
	errorRateLabel: 'Error rate',
	notConfiguredMessage: "Live metrics aren't wired up yet — check back soon."
};
