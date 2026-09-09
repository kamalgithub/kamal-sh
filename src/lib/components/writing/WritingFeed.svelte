<script lang="ts">
	import type { WritingPost } from '$lib/content/writing/writing.types';
	import IconArrowUpRight from '$lib/components/icons/IconArrowUpRight.svelte';
	import WritingThumbnail from './WritingThumbnail.svelte';

	let { posts }: { posts: WritingPost[] } = $props();

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each posts as post (post.link)}
		<li class="py-4">
			<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
			<a href={post.link} target="_blank" rel="noopener" class="group flex items-center gap-4">
				<WritingThumbnail src={post.thumbnail} alt="" />
				<div>
					<p
						class="flex items-center gap-1.5 font-display text-body font-medium text-text transition-theme group-hover:text-accent"
					>
						{post.title}
						<IconArrowUpRight size={14} />
					</p>
					<p class="mt-1 text-small text-text-muted">{formatDate(post.pubDate)}</p>
				</div>
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		</li>
	{/each}
</ul>
