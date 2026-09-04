<script lang="ts">
	import type { WritingPost } from '$lib/content/writing/writing.types';

	let { posts }: { posts: WritingPost[] } = $props();

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<ul class="flex flex-col gap-3">
	{#each posts as post (post.link)}
		<li>
			<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
			<a
				href={post.link}
				target="_blank"
				rel="noreferrer"
				class="block rounded-2xl border border-border p-4 transition-colors duration-(--duration-fast) ease-standard hover:bg-surface"
			>
				<p class="font-display text-body font-semibold text-text">{post.title}</p>
				<p class="mt-1 text-small text-text-muted">{formatDate(post.pubDate)}</p>
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		</li>
	{/each}
</ul>
