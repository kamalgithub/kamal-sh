<script lang="ts">
	import type { Profile } from '$lib/content/profile.types';
	import type { HomeCopy } from '$lib/content/copy/home.types';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import Button from '$lib/components/primitives/Button.svelte';
	import Figure from '$lib/components/primitives/Figure.svelte';
	import IconMapPin from '$lib/components/icons/IconMapPin.svelte';

	let { profile, copy }: { profile: Profile; copy: HomeCopy } = $props();
</script>

<Section>
	<Container>
		<div class="grid grid-cols-1 items-center gap-10 md:grid-cols-[1fr_auto]">
			<div class="flex flex-col items-start gap-6">
				<p class="text-small text-text-muted">{profile.name}, {profile.title}</p>
				<h1 class="font-display text-display font-medium text-text">
					{profile.tagline}
				</h1>
				<p class="flex items-center gap-1.5 text-body text-text-muted">
					<IconMapPin size={18} />
					{profile.location}
				</p>
				<div class="flex flex-wrap gap-3 pt-2">
					<Button href="/contact" variant="primary">{copy.heroCtaPrimaryLabel}</Button>
					<Button href="/work" variant="secondary">{copy.heroCtaSecondaryLabel}</Button>
				</div>
			</div>
			<div class="w-40 shrink-0 rounded-sm border border-border-strong bg-surface p-1.5 md:w-56">
				<Figure
					image={profile.photo}
					width={480}
					height={480}
					label="Portrait — {profile.name}"
					class="aspect-square h-auto w-full rounded-[2px] object-cover"
				/>
			</div>
		</div>
	</Container>
</Section>
