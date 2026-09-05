<script lang="ts">
	import { resolve } from '$app/paths';
	import type { NavLink } from '$lib/content/nav.types';
	import { requestCommandPaletteOpen } from '$lib/utils/commandPaletteEvent';
	import { commandPaletteCopy } from '$lib/content/copy/commandPalette';
	import ThemeToggle from './ThemeToggle.svelte';
	import IconSearch from '$lib/components/icons/IconSearch.svelte';
	import IconCommand from '$lib/components/icons/IconCommand.svelte';

	let { links, name }: { links: NavLink[]; name: string } = $props();
</script>

<div class="sticky top-0 z-40 border-b border-border bg-bg">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<a href={resolve('/')} class="font-display text-lg font-semibold text-text">{name}</a>
		<div class="flex items-center gap-6">
			<nav class="flex items-center gap-6" aria-label="Primary">
				{#each links as link (link.href)}
					<!-- eslint-disable svelte/no-navigation-without-resolve -- content-authored href, not a compile-time literal -->
					<a
						href={link.href}
						class="text-small transition-colors duration-(--duration-fast) ease-standard {link.href ===
						'/contact'
							? 'text-accent hover:underline'
							: 'text-text-muted hover:text-text'}"
					>
						{link.label}
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{/each}
			</nav>
			<button
				type="button"
				onclick={requestCommandPaletteOpen}
				aria-label={commandPaletteCopy.triggerLabel}
				class="flex items-center gap-2 rounded-sm border border-border-strong px-2.5 py-1.5 text-text-muted transition-colors duration-(--duration-fast) ease-standard hover:text-text"
			>
				<IconSearch size={15} />
				<span class="flex items-center gap-0.5 text-small">
					<IconCommand size={13} />K
				</span>
			</button>
			<ThemeToggle />
		</div>
	</div>
</div>
