/** Shared between the server-only Cloudflare Analytics client (src/lib/server/) and the
 *  /status page's display component — kept out of $lib/server/ so a .svelte file can
 *  safely import the type without importing server-only code. */
export interface WorkerMetrics {
	requests: number;
	errors: number;
}
