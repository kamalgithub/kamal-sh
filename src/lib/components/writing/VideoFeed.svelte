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

<ul class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-x-6 gap-y-8">
	{#each videos as video (video.videoId)}
		<li>
			<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
			<a href={video.link} target="_blank" rel="noopener" class="group block">
				<img
					src={video.thumbnail}
					alt=""
					loading="lazy"
					class="aspect-video w-full rounded-sm object-cover"
				/>
				<p class="mt-3 text-small font-medium text-text transition-theme group-hover:text-accent">
					{video.title}
				</p>
				<p class="mt-1 text-small text-text-muted">{formatDate(video.publishedAt)}</p>
			</a>
			<!-- eslint-enable svelte/no-navigation-without-resolve -->
		</li>
	{/each}
</ul>
