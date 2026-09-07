<script lang="ts">
	import { statusCopy } from '$lib/content/copy/status';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import IconMonitor from '$lib/components/icons/IconMonitor.svelte';
	import StatusMetrics from '$lib/components/status/StatusMetrics.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<SeoHead title="Status | Kamal Kumar" description={statusCopy.intro} />

<Section tint={3}>
	<Container>
		<PageHeading icon={IconMonitor} heading={statusCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{statusCopy.intro}</p>
	</Container>
</Section>
<Section>
	<Container>
		<StatusMetrics metrics={data.metrics} copy={statusCopy} />
	</Container>
</Section>
