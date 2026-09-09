<script lang="ts">
	import { experience } from '$lib/content/experience';
	import { caseStudies } from '$lib/content/case-studies';
	import { stats } from '$lib/content/stats';
	import { certifications } from '$lib/content/certifications';
	import { workCopy } from '$lib/content/copy/work';
	import { ctaCopy } from '$lib/content/copy/cta';
	import { getDisplayStats } from '$lib/utils/getDisplayStats';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import IconBriefcase from '$lib/components/icons/IconBriefcase.svelte';
	import StatsBand from '$lib/components/stats/StatsBand.svelte';
	import CaseStudyLinks from '$lib/components/case-studies/CaseStudyLinks.svelte';
	import ExperienceTimeline from '$lib/components/experience/ExperienceTimeline.svelte';
	import ClosingCta from '$lib/components/cta/ClosingCta.svelte';

	const displayStats = getDisplayStats(stats, certifications.length);
</script>

<SeoHead title="Work" description={workCopy.intro} />

<Section tint={1}>
	<Container>
		<PageHeading icon={IconBriefcase} heading={workCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{workCopy.intro}</p>
	</Container>
</Section>
<StatsBand stats={displayStats} />
<Section>
	<Container>
		<CaseStudyLinks {caseStudies} />
	</Container>
</Section>
<Section>
	<Container>
		<ExperienceTimeline roles={experience} />
	</Container>
</Section>
<ClosingCta copy={ctaCopy} />
