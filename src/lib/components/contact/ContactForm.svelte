<script lang="ts">
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import type { ContactFormCopy } from '$lib/content/copy/contact.types';
	import Button from '$lib/components/primitives/Button.svelte';

	interface FormState {
		success?: boolean;
		/** Set by the server when the sender has hit the 2-per-4-hours cap. */
		rateLimited?: boolean;
		errors?: { name?: string; email?: string; subject?: string; message?: string };
		values?: { name?: string; email?: string; subject?: string; message?: string };
	}

	let {
		form,
		copy,
		turnstileSiteKey
	}: { form?: FormState; copy: ContactFormCopy; turnstileSiteKey: string } = $props();

	let submitting = $state(false);
	let turnstileVerified = $state(false);
	let clientRateLimited = $state(false);
	// Turnstile's script + widget only load once the visitor actually starts filling in
	// the form, not on page load — most /contact visits never submit anything, so loading
	// Cloudflare's script and rendering a widget unconditionally wastes a request and a
	// moment of layout work for nearly everyone who lands here.
	let turnstileRequested = $state(false);

	// Client-side mirror of the server's IP-based cap (see rateLimiter.ts) — lets a repeat
	// visitor see the cooldown instantly, without a round trip, on a fresh page load.
	// Trivially bypassable (clear storage, different browser); the server enforces the
	// real limit regardless.
	const STORAGE_KEY = 'kamal.sh:contact-submissions';
	const WINDOW_MS = 4 * 60 * 60 * 1000;
	const MAX_PER_WINDOW = 2;

	function readRecentSubmissions(): number[] {
		try {
			const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
			const timestamps = Array.isArray(parsed)
				? parsed.filter((value): value is number => typeof value === 'number')
				: [];
			const now = Date.now();
			return timestamps.filter((timestamp) => now - timestamp < WINDOW_MS);
		} catch {
			return [];
		}
	}

	function recordSubmission(): void {
		const recent = readRecentSubmissions();
		recent.push(Date.now());
		localStorage.setItem(STORAGE_KEY, JSON.stringify(recent));
	}

	onMount(() => {
		clientRateLimited = readRecentSubmissions().length >= MAX_PER_WINDOW;

		const withCallbacks = window as typeof window & {
			onTurnstileSuccess?: () => void;
			onTurnstileExpired?: () => void;
		};
		withCallbacks.onTurnstileSuccess = () => {
			turnstileVerified = true;
		};
		withCallbacks.onTurnstileExpired = () => {
			turnstileVerified = false;
		};

		// This component isn't typically unmounted mid-session (the form lives on its own
		// page), but leaving a stale global callback referencing a torn-down component's
		// state is a real leak if that ever changes — cheap to avoid.
		return () => {
			delete withCallbacks.onTurnstileSuccess;
			delete withCallbacks.onTurnstileExpired;
		};
	});

	const isRateLimited = $derived(form?.rateLimited === true || clientRateLimited);
</script>

<svelte:head>
	{#if turnstileSiteKey && turnstileRequested}
		<!-- eslint-disable svelte/no-navigation-without-resolve -- external script, not an internal route -->
		<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	{/if}
</svelte:head>

{#if form?.success}
	<p class="text-body text-text" role="status">{copy.successMessage}</p>
{:else if isRateLimited}
	<p class="text-body text-text-muted" role="status">{copy.rateLimitedMessage}</p>
{:else}
	<form
		method="POST"
		action="?/contact"
		onfocusin={() => (turnstileRequested = true)}
		use:enhance={() => {
			submitting = true;
			return async ({ result, update }) => {
				await update();
				submitting = false;
				if (result.type === 'success') recordSubmission();
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
				minlength="2"
				maxlength="100"
				value={form?.values?.name ?? ''}
				aria-invalid={form?.errors?.name ? 'true' : undefined}
				aria-describedby={form?.errors?.name ? 'name-error' : undefined}
				class="mt-1 w-full rounded-sm border border-border-strong bg-transparent px-3 py-2 text-text transition-theme focus:border-accent focus:outline-hidden"
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
				maxlength="254"
				value={form?.values?.email ?? ''}
				aria-invalid={form?.errors?.email ? 'true' : undefined}
				aria-describedby={form?.errors?.email ? 'email-error' : undefined}
				class="mt-1 w-full rounded-sm border border-border-strong bg-transparent px-3 py-2 text-text transition-theme focus:border-accent focus:outline-hidden"
			/>
			{#if form?.errors?.email}
				<p id="email-error" class="mt-1 text-small text-error">{form.errors.email}</p>
			{/if}
		</div>

		<div>
			<label for="subject" class="text-small text-text-muted">{copy.subjectLabel}</label>
			<input
				id="subject"
				name="subject"
				type="text"
				required
				minlength="3"
				maxlength="150"
				value={form?.values?.subject ?? ''}
				aria-invalid={form?.errors?.subject ? 'true' : undefined}
				aria-describedby={form?.errors?.subject ? 'subject-error' : undefined}
				class="mt-1 w-full rounded-sm border border-border-strong bg-transparent px-3 py-2 text-text transition-theme focus:border-accent focus:outline-hidden"
			/>
			{#if form?.errors?.subject}
				<p id="subject-error" class="mt-1 text-small text-error">{form.errors.subject}</p>
			{/if}
		</div>

		<div>
			<label for="message" class="text-small text-text-muted">{copy.messageLabel}</label>
			<textarea
				id="message"
				name="message"
				required
				minlength="80"
				maxlength="500"
				rows="5"
				aria-invalid={form?.errors?.message ? 'true' : undefined}
				aria-describedby={form?.errors?.message ? 'message-error' : undefined}
				class="mt-1 max-h-80 min-h-32 w-full resize-none overflow-y-auto rounded-sm border border-border-strong bg-transparent px-3 py-2 text-text transition-theme focus:border-accent focus:outline-hidden"
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

		{#if turnstileSiteKey}
			<!-- "flexible" adapts its width to the container instead of rendering at a fixed
			     150x140 ("compact") or 300x65 ("normal") box — this form sits inside a Card
			     on a single mobile column, where either fixed size either overflows the
			     narrowest phone widths or looks like a stray square. Same size on desktop
			     too: no genuine interaction difference between a tap and a click here to
			     justify a dual-native split. -->
			<div
				class="cf-turnstile"
				data-sitekey={turnstileSiteKey}
				data-callback="onTurnstileSuccess"
				data-expired-callback="onTurnstileExpired"
				data-size="flexible"
			></div>
		{/if}

		<Button
			type="submit"
			variant="primary"
			disabled={submitting || (turnstileSiteKey !== '' && !turnstileVerified)}
		>
			{submitting ? copy.sendingLabel : copy.submitLabel}
		</Button>
	</form>
{/if}
