<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import type { NewsletterCopy } from '$lib/content/copy/newsletter.types';
	import { turnstileSiteKey } from '$lib/utils/turnstileSiteKey';
	import Button from '$lib/components/primitives/Button.svelte';

	let { copy }: { copy: NewsletterCopy } = $props();

	let submitting = $state(false);
	let status: 'idle' | 'success' | 'error' = $state('idle');
	let errorMessage = $state('');
	let turnstileVerified = $state(false);

	// Distinct global callback names from ContactForm's — this form and the contact form
	// never mount on the same page today, but there's no reason to risk two Turnstile
	// widgets fighting over the same window callback if that ever changes.
	onMount(() => {
		const withCallbacks = window as typeof window & {
			onNewsletterTurnstileSuccess?: () => void;
			onNewsletterTurnstileExpired?: () => void;
		};
		withCallbacks.onNewsletterTurnstileSuccess = () => {
			turnstileVerified = true;
		};
		withCallbacks.onNewsletterTurnstileExpired = () => {
			turnstileVerified = false;
		};

		// This same form mounts on both /writing and the standalone /newsletter page —
		// cleaning up on unmount avoids a stale callback from one page's mount referencing
		// a torn-down instance's state after the visitor navigates to the other.
		return () => {
			delete withCallbacks.onNewsletterTurnstileSuccess;
			delete withCallbacks.onNewsletterTurnstileExpired;
		};
	});
</script>

<svelte:head>
	{#if turnstileSiteKey}
		<!-- eslint-disable svelte/no-navigation-without-resolve -- external script, not an internal route -->
		<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{/if}
</svelte:head>

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
		class="flex flex-col gap-3"
	>
		<div class="flex flex-col gap-3 sm:flex-row sm:items-start">
			<div class="flex-1">
				<label for="newsletter-email" class="sr-only">{copy.emailLabel}</label>
				<input
					id="newsletter-email"
					name="email"
					type="email"
					required
					maxlength="254"
					placeholder={copy.emailLabel}
					aria-invalid={status === 'error' ? 'true' : undefined}
					aria-describedby={status === 'error' ? 'newsletter-email-error' : undefined}
					class="w-full rounded-sm border border-border-strong bg-transparent px-3 py-2 text-text transition-theme focus:border-accent focus:outline-hidden"
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
			<Button
				type="submit"
				disabled={submitting || (turnstileSiteKey !== '' && !turnstileVerified)}
			>
				{submitting ? copy.subscribingLabel : copy.submitLabel}
			</Button>
		</div>

		{#if turnstileSiteKey}
			<!-- "flexible" adapts to the container's width instead of a fixed boxy/compact size. -->
			<div
				class="cf-turnstile"
				data-sitekey={turnstileSiteKey}
				data-callback="onNewsletterTurnstileSuccess"
				data-expired-callback="onNewsletterTurnstileExpired"
				data-size="flexible"
			></div>
		{/if}
	</form>
{/if}
