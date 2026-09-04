<script lang="ts">
	import type { Profile } from '$lib/content/profile.types';
	import type { HomeCopy } from '$lib/content/copy/home.types';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import Button from '$lib/components/primitives/Button.svelte';

	let { profile, copy }: { profile: Profile; copy: HomeCopy } = $props();
</script>

<Section>
	<Container>
		<div class="flex flex-col items-start gap-6 md:max-w-4xl">
			<p class="text-small text-text-muted">{profile.name}, {profile.title}</p>
			<h1 class="font-display text-display font-medium text-text">
				{profile.tagline}
			</h1>
			<p class="text-body text-text-muted">{profile.location}</p>
			<div class="flex flex-wrap gap-3 pt-2">
				<Button href="/contact" variant="primary">{copy.heroCtaPrimaryLabel}</Button>
				<Button href="/work" variant="secondary">{copy.heroCtaSecondaryLabel}</Button>
			</div>
		</div>
	</Container>
</Section>
