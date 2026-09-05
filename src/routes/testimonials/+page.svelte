<script lang="ts">
	import { testimonials } from '$lib/content/testimonials';
	import { testimonialsCopy } from '$lib/content/copy/testimonials';
	import { profile } from '$lib/content/profile';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import TestimonialsGrid from '$lib/components/testimonials/TestimonialsGrid.svelte';
	import IconArrowUpRight from '$lib/components/icons/IconArrowUpRight.svelte';
	import IconQuote from '$lib/components/icons/IconQuote.svelte';

	const linkedInRecommendationsUrl = `${profile.links.linkedin}/details/recommendations`;
</script>

<svelte:head>
	<title>Testimonials | Kamal Kumar</title>
	<meta name="description" content={testimonialsCopy.intro} />
</svelte:head>

<Section tint={1}>
	<Container>
		<PageHeading icon={IconQuote} heading={testimonialsCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{testimonialsCopy.intro}</p>
		<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
		<a
			href={linkedInRecommendationsUrl}
			target="_blank"
			rel="noreferrer"
			class="mt-4 inline-flex items-center gap-1 text-small text-accent transition-colors duration-(--duration-fast) ease-standard hover:text-text"
		>
			{testimonialsCopy.linkedInLabel}
			<IconArrowUpRight size={14} />
		</a>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	</Container>
</Section>
<Section>
	<Container>
		<TestimonialsGrid {testimonials} />
	</Container>
</Section>
