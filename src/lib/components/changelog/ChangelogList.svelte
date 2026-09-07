<script lang="ts">
	import type { ChangelogEntry } from '$lib/content/changelog.types';
	import type { ChangelogCopy } from '$lib/content/copy/changelog.types';
	import { formatDate } from '$lib/utils/formatDate';

	let { entries, copy }: { entries: ChangelogEntry[]; copy: ChangelogCopy } = $props();
</script>

{#if entries.length === 0}
	<p class="border-t border-border pt-8 text-body text-text-muted">{copy.emptyStateMessage}</p>
{:else}
	<ul class="flex flex-col divide-y divide-border border-t border-border">
		{#each entries as entry (entry.slug)}
			<li class="flex flex-col gap-1 py-8 sm:flex-row sm:gap-8">
				<p class="text-small text-text-muted sm:w-32 sm:shrink-0">{formatDate(entry.date)}</p>
				<div>
					<h2 class="font-display text-h2 font-medium text-text">{entry.title}</h2>
					<p class="mt-2 max-w-2xl text-body text-text-muted">{entry.description}</p>
				</div>
			</li>
		{/each}
	</ul>
{/if}
