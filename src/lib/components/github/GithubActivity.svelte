<script lang="ts">
	import type { GithubActivityItem } from '$lib/utils/parseGithubEvents';
	import IconActivity from '$lib/components/icons/IconActivity.svelte';

	let { items, heading }: { items: GithubActivityItem[]; heading: string } = $props();

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

{#if items.length > 0}
	<div>
		<h2 class="mb-6 flex items-center gap-2 font-display text-h2 font-medium text-text">
			<IconActivity size={22} />
			{heading}
		</h2>
		<ul class="flex flex-col divide-y divide-border border-t border-border">
			{#each items as item (item.id)}
				<li class="py-4">
					<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
					<a href={item.url} target="_blank" rel="noreferrer" class="group block">
						<p
							class="text-body text-text transition-colors duration-(--duration-fast) ease-standard group-hover:text-accent"
						>
							{item.summary} in {item.repo}
						</p>
						<p class="mt-1 text-small text-text-muted">{formatDate(item.createdAt)}</p>
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				</li>
			{/each}
		</ul>
	</div>
{/if}
