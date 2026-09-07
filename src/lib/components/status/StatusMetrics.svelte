<script lang="ts">
	import type { WorkerMetrics } from '$lib/utils/workerMetrics.types';
	import type { StatusCopy } from '$lib/content/copy/status.types';

	let { metrics, copy }: { metrics: WorkerMetrics | null; copy: StatusCopy } = $props();

	const errorRate = $derived(
		metrics && metrics.requests > 0
			? `${((metrics.errors / metrics.requests) * 100).toFixed(2)}%`
			: '0%'
	);
</script>

{#if metrics}
	<p class="text-small text-text-muted">{copy.windowLabel}</p>
	<dl class="mt-4 flex flex-col divide-y divide-border border-t border-border">
		<div class="flex items-baseline justify-between py-4">
			<dt class="text-body text-text-muted">{copy.requestsLabel}</dt>
			<dd class="font-display text-h2 font-medium text-text">
				{metrics.requests.toLocaleString()}
			</dd>
		</div>
		<div class="flex items-baseline justify-between py-4">
			<dt class="text-body text-text-muted">{copy.errorsLabel}</dt>
			<dd class="font-display text-h2 font-medium text-text">{metrics.errors.toLocaleString()}</dd>
		</div>
		<div class="flex items-baseline justify-between py-4">
			<dt class="text-body text-text-muted">{copy.errorRateLabel}</dt>
			<dd class="font-display text-h2 font-medium text-text">{errorRate}</dd>
		</div>
	</dl>
{:else}
	<p class="border-t border-border pt-8 text-body text-text-muted">{copy.notConfiguredMessage}</p>
{/if}
