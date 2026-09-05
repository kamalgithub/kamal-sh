<script lang="ts">
	import { profile } from '$lib/content/profile';
	import { contactCopy } from '$lib/content/copy/contact';
	import { bookingCopy } from '$lib/content/copy/booking';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import Card from '$lib/components/primitives/Card.svelte';
	import ContactForm from '$lib/components/contact/ContactForm.svelte';
	import BookingFlow from '$lib/components/booking/BookingFlow.svelte';
	import IconMail from '$lib/components/icons/IconMail.svelte';
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();
</script>

<svelte:head>
	<title>Contact | Kamal Kumar</title>
	<meta name="description" content={contactCopy.intro} />
</svelte:head>

<Section tint={3}>
	<Container>
		<h1 class="font-display text-display font-medium text-text">{contactCopy.heading}</h1>
		<p class="mt-3 max-w-2xl text-body text-text-muted">{contactCopy.intro}</p>
		<p class="mt-4 flex items-center gap-2 text-body text-text-muted">
			<IconMail size={18} />
			{contactCopy.directEmailLabel}
			<a
				href="mailto:{profile.email}"
				class="text-accent transition-colors duration-(--duration-fast) ease-standard hover:text-text"
			>
				{profile.email}
			</a>
		</p>
		<div class="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
			<Card>
				<ContactForm form={form ?? undefined} copy={contactCopy.form} />
			</Card>
			<Card>
				<BookingFlow copy={bookingCopy} bookingUrl={profile.links.booking} />
			</Card>
		</div>
	</Container>
</Section>
