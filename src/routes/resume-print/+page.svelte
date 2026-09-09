<script lang="ts">
	import { profile } from '$lib/content/profile';
	import { experience } from '$lib/content/experience';
	import { education } from '$lib/content/education';
	import { certifications } from '$lib/content/certifications';
	import { resumePrintCopy } from '$lib/content/copy/resumePrint';
	import Container from '$lib/components/primitives/Container.svelte';
	import Button from '$lib/components/primitives/Button.svelte';
	import ResumePrintDocument from '$lib/components/resume/ResumePrintDocument.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
</script>

<SeoHead title="Résumé" description={resumePrintCopy.intro} />

<div class="print:hidden">
	<Container>
		<div class="flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
			<p class="max-w-xl text-small text-text-muted">{resumePrintCopy.intro}</p>
			<Button type="button" onclick={() => window.print()}
				>{resumePrintCopy.printButtonLabel}</Button
			>
		</div>
	</Container>
</div>

<ResumePrintDocument {profile} {experience} {education} {certifications} copy={resumePrintCopy} />

<style>
	/* Print-only: this page's job is to be printed/saved as a PDF, so it forces real
	   black-on-white regardless of the visitor's current theme — the live token values
	   (e.g. dark mode's near-white --color-text) would be nearly invisible against a
	   printed page's default white background, since browsers omit background colors
	   unless "print backgrounds" is explicitly enabled. Scoped to this page only (this
	   CSS only loads when /resume-print is visited) rather than touching tokens.css,
	   which every other page also relies on. Also hides the site nav/footer/command
	   palette — everything except this page's own <main> content — so a printed page is
	   just the résumé, not the whole site chrome around it. */
	@media print {
		:global(:root) {
			--color-bg: #ffffff;
			--color-text: #000000;
			--color-text-muted: #333333;
			--color-border: #cccccc;
			--color-border-strong: #999999;
			--color-accent: #1d3fad;
		}

		:global(body > *:not(#main-content)) {
			display: none;
		}
	}
</style>
