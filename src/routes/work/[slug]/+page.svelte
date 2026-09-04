<script lang="ts">
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import CaseStudyBlocks from '$lib/components/case-studies/CaseStudyBlocks.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.study.title} | Kamal Kumar</title>
	<meta name="description" content={data.study.summary} />
</svelte:head>

<Section>
	<Container>
		<p class="text-small text-accent">{data.study.company}</p>
		<h1 class="mt-2 font-display text-display font-semibold text-text">{data.study.title}</h1>
		<div class="mt-4 flex flex-wrap gap-2">
			{#each data.study.technologies as tech (tech)}
				<span class="rounded-full border border-border px-3 py-1 text-small text-text-muted"
					>{tech}</span
				>
			{/each}
		</div>
		<div class="mt-10">
			<CaseStudyBlocks blocks={data.study.blocks} />
		</div>
	</Container>
</Section>
