<script lang="ts">
	import type { Profile } from '$lib/content/profile.types';
	import Container from '$lib/components/primitives/Container.svelte';

	let { profile }: { profile: Profile } = $props();
</script>

<footer class="border-t border-border py-8">
	<Container>
		<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
			<p class="text-small text-text-muted">© {new Date().getFullYear()} {profile.name}</p>
			<div class="flex gap-4">
				{#each profile.socials as social (social.label)}
					<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
					<a
						href={social.url}
						target="_blank"
						rel="noreferrer"
						class="text-small text-text-muted transition-colors duration-(--duration-fast) ease-standard hover:text-text"
					>
						{social.label}
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{/each}
			</div>
		</div>
	</Container>
</footer>
