<script lang="ts">
	import { newsletterCopy } from '$lib/content/copy/newsletter';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import PageHeading from '$lib/components/primitives/PageHeading.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import IconMail from '$lib/components/icons/IconMail.svelte';
	import NewsletterSubscribeForm from '$lib/components/newsletter/NewsletterSubscribeForm.svelte';
</script>

<SeoHead title="Subscribe" description={newsletterCopy.intro} />

<Section tint={1}>
	<Container>
		<PageHeading icon={IconMail} heading={newsletterCopy.heading} />
		<p class="mt-5 max-w-2xl text-body text-text-muted">{newsletterCopy.intro}</p>
		<div class="mt-6 max-w-md">
			<NewsletterSubscribeForm copy={newsletterCopy} />
		</div>
	</Container>
</Section>
