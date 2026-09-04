<script lang="ts">
	import { resolve } from '$app/paths';
	import type { CaseStudy } from '$lib/content/case-studies.types';
	import Card from '$lib/components/primitives/Card.svelte';

	let { caseStudies }: { caseStudies: CaseStudy[] } = $props();
</script>

{#if caseStudies.length > 0}
	<div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
		{#each caseStudies as study (study.slug)}
			<a href={resolve('/work/[slug]', { slug: study.slug })} class="block">
				<Card>
					<h3 class="font-display text-body font-semibold text-text">{study.title}</h3>
					<p class="mt-2 text-small text-text-muted">{study.summary}</p>
				</Card>
			</a>
		{/each}
	</div>
{/if}
