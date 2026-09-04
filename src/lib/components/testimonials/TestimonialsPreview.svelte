<script lang="ts">
	import type { Testimonial } from '$lib/content/testimonials.types';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import Card from '$lib/components/primitives/Card.svelte';

	let {
		testimonials,
		heading,
		viewAllLabel
	}: { testimonials: Testimonial[]; heading: string; viewAllLabel: string } = $props();
</script>

<Section>
	<Container>
		<h2 class="mb-8 font-display text-h2 font-semibold text-text">{heading}</h2>
		<div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
			{#each testimonials as testimonial (testimonial.name)}
				<Card>
					<p class="mb-4 text-small text-text-muted">{testimonial.quote}</p>
					<p class="text-small font-medium text-text">{testimonial.name}</p>
					<p class="text-small text-text-muted">{testimonial.role}</p>
				</Card>
			{/each}
		</div>
		<!-- eslint-disable svelte/no-navigation-without-resolve -- route added later this pass; revisited with resolve() once it exists -->
		<a
			href="/testimonials"
			class="mt-8 inline-block text-small text-accent transition-colors duration-(--duration-fast) ease-standard hover:text-accent-hover"
		>
			{viewAllLabel}
		</a>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	</Container>
</Section>
