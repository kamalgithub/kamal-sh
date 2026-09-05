<script lang="ts">
	import { securityPosture } from '$lib/content/security';
	import { securityCopy } from '$lib/content/copy/security';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SecurityPostureList from '$lib/components/security/SecurityPostureList.svelte';
	import IconShield from '$lib/components/icons/IconShield.svelte';
</script>

<svelte:head>
	<title>Security | Kamal Kumar</title>
	<meta name="description" content={securityCopy.intro} />
</svelte:head>

<Section>
	<Container>
		<PageHeading icon={IconShield} heading={securityCopy.heading} />
		<p class="mt-3 max-w-2xl text-body text-text-muted">{securityCopy.intro}</p>
	</Container>
</Section>
<Section>
	<Container>
		<SecurityPostureList items={securityPosture} />
	</Container>
</Section>
<Section>
	<Container>
		<h2 class="font-display text-h2 font-medium text-text">{securityCopy.cspNoteHeading}</h2>
		<p class="mt-3 max-w-2xl text-body text-text-muted">{securityCopy.cspNoteBody}</p>
	</Container>
</Section>
<Section>
	<Container>
		<h2 class="font-display text-h2 font-medium text-text">{securityCopy.reportingHeading}</h2>
		<p class="mt-3 max-w-2xl text-body text-text-muted">{securityCopy.reportingBody}</p>
	</Container>
</Section>
