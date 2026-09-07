<script lang="ts">
	import { enhance } from '$app/forms';
	import type { NewsletterCopy } from '$lib/content/copy/newsletter.types';
	import Button from '$lib/components/primitives/Button.svelte';

	let { copy }: { copy: NewsletterCopy } = $props();

	let submitting = $state(false);
	let status: 'idle' | 'success' | 'error' = $state('idle');
	let errorMessage = $state('');
</script>

{#if status === 'success'}
	<p class="text-body text-text" role="status">{copy.successMessage}</p>
{:else}
	<form
		method="POST"
		action="/newsletter"
		use:enhance={() => {
			submitting = true;
			return async ({ result }) => {
				submitting = false;
				if (result.type === 'success') {
					status = 'success';
					return;
				}
				status = 'error';
				errorMessage =
					result.type === 'failure'
						? ((result.data as { error?: string } | undefined)?.error ?? copy.genericErrorMessage)
						: copy.genericErrorMessage;
			};
		}}
		class="flex flex-col gap-3 sm:flex-row sm:items-start"
	>
		<div class="flex-1">
			<label for="newsletter-email" class="sr-only">{copy.emailLabel}</label>
			<input
				id="newsletter-email"
				name="email"
				type="email"
				required
				placeholder={copy.emailLabel}
				aria-invalid={status === 'error' ? 'true' : undefined}
				aria-describedby={status === 'error' ? 'newsletter-email-error' : undefined}
				class="w-full rounded-sm border border-border-strong bg-transparent px-3 py-2 text-text transition-colors duration-(--duration-fast) ease-standard focus:border-accent focus:outline-hidden"
			/>
			<!-- Honeypot — hidden from sighted users, invisible to real visitors, filled in only by bots. -->
			<div class="hidden" aria-hidden="true">
				<label for="newsletter-company">Company</label>
				<input
					id="newsletter-company"
					name="company"
					type="text"
					tabindex="-1"
					autocomplete="off"
				/>
			</div>
			{#if status === 'error'}
				<p id="newsletter-email-error" class="mt-1 text-small text-error">{errorMessage}</p>
			{/if}
		</div>
		<Button type="submit" disabled={submitting}>
			{submitting ? copy.subscribingLabel : copy.submitLabel}
		</Button>
	</form>
{/if}
