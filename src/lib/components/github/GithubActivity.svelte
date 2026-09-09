<script lang="ts">
	import type { GithubActivityItem } from '$lib/utils/parseGithubEvents';
	import IconActivity from '$lib/components/icons/IconActivity.svelte';
	import IconGitCommit from '$lib/components/icons/IconGitCommit.svelte';
	import IconGitBranch from '$lib/components/icons/IconGitBranch.svelte';
	import IconRepo from '$lib/components/icons/IconRepo.svelte';
	import IconTag from '$lib/components/icons/IconTag.svelte';
	import IconGitPullRequest from '$lib/components/icons/IconGitPullRequest.svelte';
	import IconCircleDot from '$lib/components/icons/IconCircleDot.svelte';

	let { items, heading }: { items: GithubActivityItem[]; heading: string } = $props();

	const ICONS = {
		commit: IconGitCommit,
		branch: IconGitBranch,
		repo: IconRepo,
		tag: IconTag,
		pullRequest: IconGitPullRequest,
		issue: IconCircleDot,
		release: IconTag
	};

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
				{@const Icon = ICONS[item.icon]}
				<li class="py-4">
					<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
					<a href={item.url} target="_blank" rel="noopener" class="group flex items-start gap-3">
						<span class="mt-0.5 shrink-0 text-text-muted">
							<Icon size={16} />
						</span>
						<span>
							<p class="text-body text-text transition-theme group-hover:text-accent">
								{item.summary} in {item.repo}
							</p>
							<p class="mt-1 text-small text-text-muted">{formatDate(item.createdAt)}</p>
						</span>
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				</li>
			{/each}
		</ul>
	</div>
{/if}
