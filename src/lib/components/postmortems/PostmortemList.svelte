<script lang="ts">
	import type { Postmortem } from '$lib/content/postmortems.types';
	import type { PostmortemsCopy } from '$lib/content/copy/postmortems.types';
	import { formatDate } from '$lib/utils/formatDate';

	let { postmortems, copy }: { postmortems: Postmortem[]; copy: PostmortemsCopy } = $props();
</script>

{#if postmortems.length === 0}
	<p class="border-t border-border pt-8 text-body text-text-muted">{copy.emptyStateMessage}</p>
{:else}
	<ul class="flex flex-col divide-y divide-border border-t border-border">
		{#each postmortems as postmortem (postmortem.slug)}
			<li class="py-8">
				<h2 class="font-display text-h2 font-medium text-text">{postmortem.title}</h2>
				<p class="mt-1 text-small text-text-muted">{formatDate(postmortem.date)}</p>
				<p class="mt-4 text-body text-text-muted">{postmortem.summary}</p>
				<dl class="mt-6 flex flex-col gap-4">
					<div>
						<dt class="text-small text-text-muted">Impact</dt>
						<dd class="mt-1 text-body text-text">{postmortem.impact}</dd>
					</div>
					<div>
						<dt class="text-small text-text-muted">Root cause</dt>
						<dd class="mt-1 text-body text-text">{postmortem.rootCause}</dd>
					</div>
					<div>
						<dt class="text-small text-text-muted">Resolution</dt>
						<dd class="mt-1 text-body text-text">{postmortem.resolution}</dd>
					</div>
					<div>
						<dt class="text-small text-text-muted">What changed</dt>
						<dd class="mt-1 text-body text-text">{postmortem.whatChanged}</dd>
					</div>
				</dl>
			</li>
		{/each}
	</ul>
{/if}
