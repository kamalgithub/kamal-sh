import { fetchWorkerMetrics } from '$lib/server/cloudflareAnalytics';
import type { PageServerLoad } from './$types';

// Live data — see docs/architecture.md's "SSR only where genuinely required" list.
export const prerender = false;

export const load: PageServerLoad = async ({ platform }) => {
	const env = platform?.env;
	if (!env?.CF_API_TOKEN || !env?.CF_ACCOUNT_ID) {
		return { metrics: null };
	}

	try {
		const metrics = await fetchWorkerMetrics({
			apiToken: env.CF_API_TOKEN,
			accountTag: env.CF_ACCOUNT_ID
		});
		return { metrics };
	} catch (err) {
		console.error('Failed to fetch Cloudflare analytics', err);
		return { metrics: null };
	}
};
