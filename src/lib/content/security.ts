import type { SecurityPostureItem } from './security.types';

export const securityPosture: SecurityPostureItem[] = [
	{
		label: 'No database',
		description:
			"Content is static, typed data checked into the repo. There's no user datastore to breach, because there isn't one."
	},
	{
		label: 'Secrets never committed',
		description:
			'The one real secret this site has — the Mailgun API key — is set via Cloudflare’s encrypted secret store, never in source control or a committed environment file.'
	},
	{
		label: 'Minimal, deliberate dependencies',
		description:
			'A native-first policy means most features use browser or framework primitives instead of a package. Fewer dependencies is a smaller supply-chain surface to audit.'
	},
	{
		label: 'Security headers on every response',
		description:
			'Content-Security-Policy, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and a restrictive Permissions-Policy, applied via a Cloudflare header rule and a SvelteKit hook so both static and dynamic routes are covered.'
	},
	{
		label: 'Strict TypeScript',
		description:
			'strict: true, no any, across the entire codebase — most type errors are caught before deploy.'
	},
	{
		label: "Cloudflare's edge network",
		description:
			'TLS, DDoS mitigation, and edge caching are handled by the hosting platform, not hand-rolled.'
	}
];
