<script lang="ts">
	import { profile } from '$lib/content/profile';
	import { stats } from '$lib/content/stats';
	import { certifications } from '$lib/content/certifications';
	import { testimonials } from '$lib/content/testimonials';
	import { products } from '$lib/content/products/products';
	import { homeCopy } from '$lib/content/copy/home';
	import { ctaCopy } from '$lib/content/copy/cta';
	import { getDisplayStats } from '$lib/utils/getDisplayStats';
	import Hero from '$lib/components/hero/Hero.svelte';
	import StatsBand from '$lib/components/stats/StatsBand.svelte';
	import BuildingShowcase from '$lib/components/building/BuildingShowcase.svelte';
	import TestimonialsPreview from '$lib/components/testimonials/TestimonialsPreview.svelte';
	import ClosingCta from '$lib/components/cta/ClosingCta.svelte';

	const displayStats = getDisplayStats(stats, certifications.length);
	const featuredTestimonials = testimonials.slice(0, 3);
</script>

<svelte:head>
	<title>{profile.name} | {profile.title}</title>
	<meta name="description" content={profile.tagline} />
</svelte:head>

<Hero {profile} copy={homeCopy} />
<StatsBand stats={displayStats} />
<BuildingShowcase
	{products}
	heading={homeCopy.buildingHeading}
	linkLabel={homeCopy.buildingLinkLabel}
/>
<TestimonialsPreview
	testimonials={featuredTestimonials}
	heading={homeCopy.testimonialsHeading}
	viewAllLabel={homeCopy.testimonialsViewAllLabel}
/>
<ClosingCta copy={ctaCopy} />
