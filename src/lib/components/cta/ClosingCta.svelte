<script lang="ts">
	import type { CtaCopy } from '$lib/content/copy/cta.types';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import Button from '$lib/components/primitives/Button.svelte';

	let { copy }: { copy: CtaCopy } = $props();
</script>

<Section>
	<Container>
		<div class="flex flex-col items-center gap-4 border-t border-border pt-16 text-center">
			<h2 class="font-display text-h2 font-medium text-text">{copy.heading}</h2>
			<p class="max-w-xl text-body text-text-muted">{copy.body}</p>
			<Button href="/contact" variant="primary">{copy.buttonLabel}</Button>
		</div>
	</Container>
</Section>
