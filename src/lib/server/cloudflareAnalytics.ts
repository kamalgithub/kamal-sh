import type { WorkerMetrics } from '$lib/utils/workerMetrics.types';

export interface CloudflareAnalyticsConfig {
	apiToken: string;
	accountTag: string;
}

// Cloudflare's GraphQL API uses lowercase custom scalar names (string, uint64), not
// standard GraphQL String/Int — this matches Cloudflare's own documented examples.
const QUERY = `
	query WorkerMetrics($accountTag: string, $since: string, $until: string) {
		viewer {
			accounts(filter: { accountTag: $accountTag }) {
				workersInvocationsAdaptive(
					limit: 100
					filter: { datetime_geq: $since, datetime_leq: $until }
				) {
					sum {
						requests
						errors
					}
				}
			}
		}
	}
`;

interface GraphQlResponse {
	data?: {
		viewer?: {
			accounts?: { workersInvocationsAdaptive?: { sum: { requests: number; errors: number } }[] }[];
		};
	};
	errors?: { message: string }[];
}

/**
 * Real, live request/error counts for the last 24 hours via Cloudflare's GraphQL
 * Analytics API (plain fetch, no SDK — native-first policy). Sums every returned row's
 * `sum` rather than assuming a single aggregated row, since the exact row grouping this
 * dataset returns for a plain range query isn't itself documented — summing counts is
 * correct regardless. Throws on any failure; the caller renders an honest "unavailable"
 * state rather than a fabricated number — see /status's +page.server.ts.
 */
export async function fetchWorkerMetrics(
	config: CloudflareAnalyticsConfig
): Promise<WorkerMetrics> {
	const until = new Date();
	const since = new Date(until.getTime() - 24 * 60 * 60 * 1000);

	const response = await fetch('https://api.cloudflare.com/client/v4/graphql', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${config.apiToken}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: QUERY,
			variables: {
				accountTag: config.accountTag,
				since: since.toISOString(),
				until: until.toISOString()
			}
		})
	});

	if (!response.ok) {
		throw new Error(`Cloudflare GraphQL API request failed: ${response.status}`);
	}

	const body = (await response.json()) as GraphQlResponse;
	if (body.errors && body.errors.length > 0) {
		throw new Error(
			`Cloudflare GraphQL API returned errors: ${body.errors.map((error) => error.message).join('; ')}`
		);
	}

	const rows = body.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive ?? [];
	return rows.reduce(
		(totals, row) => ({
			requests: totals.requests + row.sum.requests,
			errors: totals.errors + row.sum.errors
		}),
		{ requests: 0, errors: 0 }
	);
}
