import type { SecurityCopy } from './security.types';

export const securityCopy: SecurityCopy = {
	heading: 'Security posture',
	intro:
		"What's actually true about how this site is built and run — not a compliance badge wall. Verify any of it yourself; the source is public.",
	cspNoteHeading: 'An honest tradeoff, not an oversight',
	cspNoteBody:
		"The Content-Security-Policy allows 'unsafe-inline' for scripts and styles. That's because a small theme-preference script runs inline in the page head to avoid a flash of the wrong theme, each page injects its own JSON-LD structured data as an inline script, and a couple of components use Svelte's style directive, which renders as an inline style attribute. None of these are user-controlled input, so the practical risk is low, but a strict nonce-based policy would be more defensible — it's the next thing this page will change when it does.",
	reportingHeading: 'Reporting something',
	reportingBody:
		'Email kamal@kamal.sh, or see /.well-known/security.txt for the machine-readable version of the same contact.'
};
