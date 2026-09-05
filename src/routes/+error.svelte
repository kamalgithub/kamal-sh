<script lang="ts">
	import { page } from '$app/state';
	import { errorCopy } from '$lib/content/copy/error';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import Button from '$lib/components/primitives/Button.svelte';

	// The only joke on the whole site, and only for the harmless case — a real error
	// (500, etc.) gets a plain, reassuring message instead. See docs/conventions.md.
	const isNotFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{page.status} | Kamal Kumar</title>
</svelte:head>

<Section>
	<Container>
		<div class="mx-auto max-w-xl text-center">
			{#if isNotFound}
				<pre
					class="mb-6 overflow-x-auto rounded-sm border border-border-strong bg-surface p-4 text-left font-mono text-small text-text-muted"><span
						class="text-accent">$</span
					> cd {page.url.pathname}
cd: no such file or directory</pre>
			{/if}
			<h1 class="font-display text-h1 font-medium text-text">
				{isNotFound ? errorCopy.notFoundHeading : errorCopy.genericHeading}
			</h1>
			<p class="mt-3 text-body text-text-muted">
				{isNotFound ? errorCopy.notFoundBody : errorCopy.genericBody}
			</p>
			<div class="mt-8">
				<Button href="/" variant="primary">{errorCopy.homeLabel}</Button>
			</div>
		</div>
	</Container>
</Section>
