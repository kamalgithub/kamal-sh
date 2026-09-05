<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { NavLink } from '$lib/content/nav.types';
	import { requestCommandPaletteOpen } from '$lib/utils/commandPaletteEvent';
	import { commandPaletteCopy } from '$lib/content/copy/commandPalette';
	import ThemeToggle from './ThemeToggle.svelte';
	import IconSearch from '$lib/components/icons/IconSearch.svelte';

	let { links, name }: { links: NavLink[]; name: string } = $props();

	function isActive(href: string): boolean {
		return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
	}
</script>

<div class="sticky top-0 z-40 border-b border-border bg-bg">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<a
			href={resolve('/')}
			class="flex items-center gap-1.5 font-mono text-lg font-semibold text-text"
		>
			<span class="text-accent" aria-hidden="true">$</span>
			{name}
		</a>
		<div class="flex items-center gap-8">
			<nav class="flex items-center gap-6" aria-label="Primary">
				{#each links as link (link.href)}
					{@const active = isActive(link.href)}
					<!-- eslint-disable svelte/no-navigation-without-resolve -- content-authored href, not a compile-time literal -->
					<a
						href={link.href}
						aria-current={active ? 'page' : undefined}
						class="text-small transition-colors duration-(--duration-fast) ease-standard {active
							? 'text-accent'
							: 'text-text-muted hover:text-text'}"
					>
						{link.label}
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{/each}
			</nav>
			<div class="flex items-center gap-1">
				<button
					type="button"
					onclick={requestCommandPaletteOpen}
					aria-label={commandPaletteCopy.triggerLabel}
					title="{commandPaletteCopy.triggerLabel} ({commandPaletteCopy.triggerHint})"
					class="flex min-h-10 min-w-10 items-center justify-center rounded-sm text-text-muted transition-colors duration-(--duration-fast) ease-standard hover:text-text"
				>
					<IconSearch size={17} />
				</button>
				<ThemeToggle />
			</div>
		</div>
	</div>
</div>
