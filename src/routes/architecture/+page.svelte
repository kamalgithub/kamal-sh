<script lang="ts">
	import { architectureNodes } from '$lib/content/architecture';
	import { architectureCopy } from '$lib/content/copy/architecture';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import ArchitectureDiagram from '$lib/components/architecture/ArchitectureDiagram.svelte';
</script>

<svelte:head>
	<title>Architecture | Kamal Kumar</title>
	<meta name="description" content={architectureCopy.intro} />
</svelte:head>

<Section>
	<Container>
		<h1 class="font-display text-display font-medium text-text">{architectureCopy.heading}</h1>
		<p class="mt-3 max-w-2xl text-body text-text-muted">{architectureCopy.intro}</p>
	</Container>
</Section>
<Section>
	<Container>
		<ArchitectureDiagram nodes={architectureNodes} copy={architectureCopy} />
	</Container>
</Section>
