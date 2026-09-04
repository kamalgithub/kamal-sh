<script lang="ts">
	import { resolve } from '$app/paths';
	import type { CaseStudy } from '$lib/content/case-studies.types';

	let { caseStudies }: { caseStudies: CaseStudy[] } = $props();
</script>

{#if caseStudies.length > 0}
	<ul class="flex flex-col divide-y divide-border border-t border-border">
		{#each caseStudies as study (study.slug)}
			<li class="py-8">
				<a href={resolve('/work/[slug]', { slug: study.slug })} class="group block">
					<h3
						class="font-display text-h2 font-medium text-text transition-colors duration-(--duration-fast) ease-standard group-hover:text-accent"
					>
						{study.title}
					</h3>
					<p class="mt-2 max-w-2xl text-body text-text-muted">{study.summary}</p>
				</a>
			</li>
		{/each}
	</ul>
{/if}
