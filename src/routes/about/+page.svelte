<script lang="ts">
	import { profile } from '$lib/content/profile';
	import { education } from '$lib/content/education';
	import { certifications } from '$lib/content/certifications';
	import { testimonials } from '$lib/content/testimonials';
	import { aboutCopy } from '$lib/content/copy/about';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import EducationList from '$lib/components/education/EducationList.svelte';
	import CertificationsGrid from '$lib/components/certifications/CertificationsGrid.svelte';
	import GithubActivity from '$lib/components/github/GithubActivity.svelte';
	import TestimonialsPreview from '$lib/components/testimonials/TestimonialsPreview.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const featuredTestimonials = testimonials.slice(0, 3);
</script>

<svelte:head>
	<title>About | Kamal Kumar</title>
	<meta name="description" content={profile.tagline} />
</svelte:head>

<Section tint={2}>
	<Container>
		<h1 class="font-display text-display font-medium text-text">{aboutCopy.heading}</h1>
		<p class="mt-3 max-w-2xl text-body text-text-muted">{profile.tagline}</p>
	</Container>
</Section>
<Section>
	<Container>
		<h2 class="mb-6 font-display text-h2 font-medium text-text">{aboutCopy.educationHeading}</h2>
		<EducationList entries={education} />
	</Container>
</Section>
<Section>
	<Container>
		<h2 class="mb-6 font-display text-h2 font-medium text-text">
			{aboutCopy.certificationsHeading} ({certifications.length})
		</h2>
		<CertificationsGrid {certifications} />
	</Container>
</Section>
<Section>
	<Container>
		<GithubActivity items={data.githubActivity} heading={aboutCopy.githubActivityHeading} />
	</Container>
</Section>
<TestimonialsPreview
	testimonials={featuredTestimonials}
	heading={aboutCopy.testimonialsHeading}
	viewAllLabel={aboutCopy.testimonialsViewAllLabel}
/>
