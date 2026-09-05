<script lang="ts">
	import { resolve } from '$app/paths';
	import type { NavLink } from '$lib/content/nav.types';
	import ThemeToggle from './ThemeToggle.svelte';

	let { links, name }: { links: NavLink[]; name: string } = $props();
	let dialogEl: HTMLDialogElement | undefined = $state();

	function openMenu() {
		dialogEl?.showModal();
	}

	function closeMenu() {
		dialogEl?.close();
	}
</script>

<div
	class="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-bg px-4 py-3"
>
	<a href={resolve('/')} class="font-display text-lg font-semibold text-text">{name}</a>
	<div class="flex items-center gap-2">
		<ThemeToggle />
		<button
			type="button"
			onclick={openMenu}
			aria-label="Open menu"
			class="flex min-h-11 min-w-11 items-center justify-center rounded-full text-text transition-colors duration-(--duration-fast) ease-standard hover:bg-surface"
		>
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<path
					d="M2 5h16M2 10h16M2 15h16"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
			</svg>
		</button>
	</div>
</div>

<dialog
	bind:this={dialogEl}
	class="m-0 h-dvh max-h-none w-full max-w-none bg-bg p-0 backdrop:bg-bg/80"
>
	<div class="flex h-full flex-col">
		<div class="flex items-center justify-between px-4 py-3">
			<span class="font-display text-lg font-semibold text-text">{name}</span>
			<button
				type="button"
				onclick={closeMenu}
				aria-label="Close menu"
				class="flex min-h-11 min-w-11 items-center justify-center rounded-full text-text transition-colors duration-(--duration-fast) ease-standard hover:bg-surface"
			>
				<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
					<path
						d="M4 4l12 12M16 4L4 16"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</button>
		</div>
		<nav class="flex flex-1 flex-col items-start justify-center gap-2 px-6" aria-label="Primary">
			{#each links as link (link.href)}
				<!-- eslint-disable svelte/no-navigation-without-resolve -- content-authored href, not a compile-time literal -->
				<a
					href={link.href}
					onclick={closeMenu}
					class="py-3 text-2xl font-medium {link.href === '/contact' ? 'text-accent' : 'text-text'}"
				>
					{link.label}
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			{/each}
		</nav>
	</div>
</dialog>
