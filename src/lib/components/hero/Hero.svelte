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
		<div class="relative">
			<div
				class="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
				style:background="var(--gradient-aurora)"
				aria-hidden="true"
			></div>
			<div class="relative flex flex-col items-start gap-6 md:max-w-3xl">
				<p class="text-small text-text-muted">{profile.location} · {profile.timezone}</p>
				<h1 class="font-display text-display font-semibold text-text">
					{profile.name}
				</h1>
				<p class="text-h2 text-text-muted">{profile.title}</p>
				<p class="max-w-xl text-body text-text-muted">{profile.tagline}</p>
				<div class="flex flex-wrap gap-3 pt-2">
					<Button href="/contact" variant="primary">{copy.heroCtaPrimaryLabel}</Button>
					<Button href="/work" variant="secondary">{copy.heroCtaSecondaryLabel}</Button>
				</div>
			</div>
		</div>
	</Container>
</Section>
