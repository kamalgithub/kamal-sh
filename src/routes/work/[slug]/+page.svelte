<script lang="ts">
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import Figure from '$lib/components/primitives/Figure.svelte';
	import CaseStudyBlocks from '$lib/components/case-studies/CaseStudyBlocks.svelte';
	import { buildCaseStudyJsonLd } from '$lib/utils/buildCaseStudyJsonLd';
	import { toJsonLdScript } from '$lib/utils/jsonLd';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const caseStudyJsonLd = $derived(toJsonLdScript(buildCaseStudyJsonLd(data.study)));
</script>

<svelte:head>
	<title>{data.study.title} | Kamal Kumar</title>
	<meta name="description" content={data.study.summary} />
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- toJsonLdScript escapes every "<" itself; content is our own static case-study data, never user input -->
	{@html caseStudyJsonLd}
</svelte:head>

<Section>
	<Container>
		<p class="text-small text-accent">{data.study.company}</p>
		<h1 class="mt-2 font-display text-display font-medium text-text">{data.study.title}</h1>
		<div class="mt-4 flex flex-wrap gap-2">
			{#each data.study.technologies as tech (tech)}
				<span class="rounded-full border border-border px-3 py-1 text-small text-text-muted"
					>{tech}</span
				>
			{/each}
		</div>
		<div class="mt-8">
			<Figure
				image={data.study.image}
				width={1200}
				height={675}
				label="Architecture diagram — {data.study.title}"
			/>
		</div>
		<div class="mt-10">
			<CaseStudyBlocks blocks={data.study.blocks} />
		</div>
	</Container>
</Section>
