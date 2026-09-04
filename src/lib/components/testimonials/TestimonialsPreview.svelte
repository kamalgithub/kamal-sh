<script lang="ts">
	import type { Testimonial } from '$lib/content/testimonials.types';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import TestimonialsGrid from './TestimonialsGrid.svelte';

	let {
		testimonials,
		heading,
		viewAllLabel
	}: { testimonials: Testimonial[]; heading: string; viewAllLabel: string } = $props();
</script>

<Section>
	<Container>
		<h2 class="mb-8 font-display text-h2 font-semibold text-text">{heading}</h2>
		<TestimonialsGrid {testimonials} />
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
