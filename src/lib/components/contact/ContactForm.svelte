<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ContactFormCopy } from '$lib/content/copy/contact.types';
	import Button from '$lib/components/primitives/Button.svelte';

	interface FormState {
		success?: boolean;
		errors?: { name?: string; email?: string; message?: string };
		values?: { name?: string; email?: string; message?: string };
	}

	let { form, copy }: { form?: FormState; copy: ContactFormCopy } = $props();
	let submitting = $state(false);
</script>

{#if form?.success}
	<p class="text-body text-text" role="status">{copy.successMessage}</p>
{:else}
	<form
		method="POST"
		use:enhance={() => {
			submitting = true;
			return async ({ update }) => {
				await update();
				submitting = false;
			};
		}}
		class="flex flex-col gap-4"
	>
		<div>
			<label for="name" class="text-small text-text-muted">{copy.nameLabel}</label>
			<input
				id="name"
				name="name"
				type="text"
				required
				value={form?.values?.name ?? ''}
				aria-invalid={form?.errors?.name ? 'true' : undefined}
				aria-describedby={form?.errors?.name ? 'name-error' : undefined}
				class="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-text transition-colors duration-(--duration-fast) ease-standard focus:border-accent focus:outline-hidden"
			/>
			{#if form?.errors?.name}
				<p id="name-error" class="mt-1 text-small text-error">{form.errors.name}</p>
			{/if}
		</div>

		<div>
			<label for="email" class="text-small text-text-muted">{copy.emailLabel}</label>
			<input
				id="email"
				name="email"
				type="email"
				required
				value={form?.values?.email ?? ''}
				aria-invalid={form?.errors?.email ? 'true' : undefined}
				aria-describedby={form?.errors?.email ? 'email-error' : undefined}
				class="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-text transition-colors duration-(--duration-fast) ease-standard focus:border-accent focus:outline-hidden"
			/>
			{#if form?.errors?.email}
				<p id="email-error" class="mt-1 text-small text-error">{form.errors.email}</p>
			{/if}
		</div>

		<div>
			<label for="message" class="text-small text-text-muted">{copy.messageLabel}</label>
			<textarea
				id="message"
				name="message"
				required
				rows="5"
				aria-invalid={form?.errors?.message ? 'true' : undefined}
				aria-describedby={form?.errors?.message ? 'message-error' : undefined}
				class="mt-1 w-full rounded-lg border border-border bg-transparent px-3 py-2 text-text transition-colors duration-(--duration-fast) ease-standard focus:border-accent focus:outline-hidden"
				>{form?.values?.message ?? ''}</textarea
			>
			{#if form?.errors?.message}
				<p id="message-error" class="mt-1 text-small text-error">{form.errors.message}</p>
			{/if}
		</div>

		<!-- Honeypot — hidden from sighted users, invisible to real visitors, filled in only by bots. -->
		<div class="hidden" aria-hidden="true">
			<label for="company">Company</label>
			<input id="company" name="company" type="text" tabindex="-1" autocomplete="off" />
		</div>

		<Button type="submit" variant="primary" disabled={submitting}>
			{submitting ? copy.sendingLabel : copy.submitLabel}
		</Button>
	</form>
{/if}
