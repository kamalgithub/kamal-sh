<script lang="ts">
	import { page } from '$app/state';
	import { profile } from '$lib/content/profile';
	import { stats } from '$lib/content/stats';
	import { certifications } from '$lib/content/certifications';
	import { testimonials } from '$lib/content/testimonials';
	import { products } from '$lib/content/products/products';
	import { homeCopy } from '$lib/content/copy/home';
	import { ctaCopy } from '$lib/content/copy/cta';
	import { getDisplayStats } from '$lib/utils/getDisplayStats';
	import { getHomeSectionOrder } from '$lib/utils/getHomeSectionOrder';
	import Hero from '$lib/components/hero/Hero.svelte';
	import StatsBand from '$lib/components/stats/StatsBand.svelte';
	import BuildingShowcase from '$lib/components/building/BuildingShowcase.svelte';
	import TestimonialsPreview from '$lib/components/testimonials/TestimonialsPreview.svelte';
	import ClosingCta from '$lib/components/cta/ClosingCta.svelte';

	const displayStats = getDisplayStats(stats, certifications.length);
	const featuredTestimonials = testimonials.slice(0, 3);

	// The prerendered HTML always reflects the default order (crawlers, no-JS visitors);
	// a real ?for= value only ever takes effect client-side, after hydration reads the URL.
	const sectionOrder = $derived(getHomeSectionOrder(page.url.searchParams.get('for')));
</script>

<svelte:head>
	<title>{profile.name} | {profile.title}</title>
	<meta name="description" content={profile.tagline} />
</svelte:head>

<Hero {profile} copy={homeCopy} />
{#each sectionOrder as section (section)}
	{#if section === 'stats'}
		<StatsBand stats={displayStats} />
	{:else if section === 'building'}
		<BuildingShowcase
			{products}
			heading={homeCopy.buildingHeading}
			linkLabel={homeCopy.buildingLinkLabel}
		/>
	{:else if section === 'testimonials'}
		<TestimonialsPreview
			testimonials={featuredTestimonials}
			heading={homeCopy.testimonialsHeading}
			viewAllLabel={homeCopy.testimonialsViewAllLabel}
		/>
	{/if}
{/each}
<ClosingCta copy={ctaCopy} />
