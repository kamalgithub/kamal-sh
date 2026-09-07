<script lang="ts">
	import { profile } from '$lib/content/profile';
	import { experience } from '$lib/content/experience';
	import { education } from '$lib/content/education';
	import { certifications } from '$lib/content/certifications';
	import { testimonials } from '$lib/content/testimonials';
	import { aboutCopy } from '$lib/content/copy/about';
	import { buildCareerTimeline } from '$lib/utils/buildCareerTimeline';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import IconUser from '$lib/components/icons/IconUser.svelte';
	import CareerTimeline from '$lib/components/about/CareerTimeline.svelte';
	import EducationList from '$lib/components/education/EducationList.svelte';
	import CertificationsGrid from '$lib/components/certifications/CertificationsGrid.svelte';
	import GithubActivity from '$lib/components/github/GithubActivity.svelte';
	import TestimonialsPreview from '$lib/components/testimonials/TestimonialsPreview.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const featuredTestimonials = testimonials.slice(0, 3);
	const careerTimeline = buildCareerTimeline(experience, education, certifications);
</script>

<SeoHead title="About | Kamal Kumar" description={profile.tagline} />

<Section tint={2}>
	<Container>
		<PageHeading icon={IconUser} heading={aboutCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{profile.tagline}</p>
	</Container>
</Section>
<Section>
	<Container>
		<h2 class="mb-6 font-display text-h2 font-medium text-text">
			{aboutCopy.careerTimelineHeading}
		</h2>
		<CareerTimeline entries={careerTimeline} />
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
	totalCount={testimonials.length}
	heading={aboutCopy.testimonialsHeading}
	viewAllLabel={aboutCopy.testimonialsViewAllLabel}
/>
