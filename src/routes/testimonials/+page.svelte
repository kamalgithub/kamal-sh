<script lang="ts">
	import { testimonials } from '$lib/content/testimonials';
	import { testimonialsCopy } from '$lib/content/copy/testimonials';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import TestimonialsGrid from '$lib/components/testimonials/TestimonialsGrid.svelte';
</script>

<svelte:head>
	<title>Testimonials | Kamal Kumar</title>
	<meta name="description" content={testimonialsCopy.intro} />
</svelte:head>

<Section>
	<Container>
		<h1 class="font-display text-display font-medium text-text">{testimonialsCopy.heading}</h1>
		<p class="mt-3 max-w-2xl text-body text-text-muted">{testimonialsCopy.intro}</p>
	</Container>
</Section>
<Section>
	<Container>
		<TestimonialsGrid {testimonials} />
	</Container>
</Section>
