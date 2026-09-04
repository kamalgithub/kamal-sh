<script lang="ts">
	import type { YoutubeVideo } from '$lib/content/youtube/video.types';

	let { videos }: { videos: YoutubeVideo[] } = $props();

	function formatDate(iso: string): string {
		return new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<ul class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
	{#each videos as video (video.videoId)}
		<li>
			<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
			<a
				href={video.link}
				target="_blank"
				rel="noreferrer"
				class="block rounded-2xl border border-border transition-colors duration-(--duration-fast) ease-standard hover:bg-surface"
			>
				<img
					src={video.thumbnail}
					alt=""
					loading="lazy"
					class="aspect-video w-full rounded-t-2xl object-cover"
				/>
				<div class="p-4">
					<p class="text-small font-medium text-text">{video.title}</p>
					<p class="mt-1 text-small text-text-muted">{formatDate(video.publishedAt)}</p>
				</div>
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		</li>
	{/each}
</ul>
