<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Testimonial } from '$lib/content/testimonials.types';
	import { testimonialsCopy } from '$lib/content/copy/testimonials';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import TestimonialsGrid from './TestimonialsGrid.svelte';

	let {
		testimonials,
		totalCount,
		heading,
		viewAllLabel
	}: {
		testimonials: Testimonial[];
		/** The full list's length — `testimonials` here is only the featured preview slice. */
		totalCount: number;
		heading: string;
		viewAllLabel: string;
	} = $props();
</script>

<Section>
	<Container>
		<h2 class="mb-8 font-display text-h2 font-medium text-text">{heading}</h2>
		<TestimonialsGrid {testimonials} copy={testimonialsCopy} truncateQuotes />
		<a
			href={resolve('/testimonials')}
			class="mt-8 inline-flex items-center gap-1 text-small text-accent transition-theme hover:text-text"
		>
			{viewAllLabel} ({totalCount})
			<IconArrowRight size={14} />
		</a>
	</Container>
</Section>
