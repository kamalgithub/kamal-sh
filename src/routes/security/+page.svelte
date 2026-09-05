<script lang="ts">
	import { securityPosture } from '$lib/content/security';
	import { securityCopy } from '$lib/content/copy/security';
	import { profile } from '$lib/content/profile';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SecurityPostureList from '$lib/components/security/SecurityPostureList.svelte';
	import IconShield from '$lib/components/icons/IconShield.svelte';

	const LINK_CLASS =
		'text-accent transition-colors duration-(--duration-fast) ease-standard hover:text-text';
</script>

<svelte:head>
	<title>Security | Kamal Kumar</title>
	<meta name="description" content={securityCopy.intro} />
</svelte:head>

<Section tint={2}>
	<Container>
		<PageHeading icon={IconShield} heading={securityCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{securityCopy.intro}</p>
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
		<p class="mt-5 max-w-2xl text-body text-text-muted">{securityCopy.cspNoteBody}</p>
	</Container>
</Section>
<Section>
	<Container>
		<h2 class="font-display text-h2 font-medium text-text">{securityCopy.reportingHeading}</h2>
		<!-- eslint-disable svelte/no-navigation-without-resolve -- mailto: and a static file, neither is an internal route -->
		<p class="mt-5 max-w-2xl text-body text-text-muted">
			{securityCopy.reportingEmailLeadIn}<a href="mailto:{profile.email}" class={LINK_CLASS}
				>{profile.email}</a
			>{securityCopy.reportingBetween}<a href="/.well-known/security.txt" class={LINK_CLASS}
				>{securityCopy.reportingSecurityTxtLabel}</a
			>{securityCopy.reportingTrailer}
		</p>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	</Container>
</Section>
