<script lang="ts">
	import { resolve } from '$app/paths';
	import type { NavLink } from '$lib/content/nav.types';

	let { links, name }: { links: NavLink[]; name: string } = $props();
</script>

<div class="sticky top-0 z-40 border-b border-border bg-bg">
	<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
		<a href={resolve('/')} class="font-display text-lg font-semibold text-text">{name}</a>
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
	</div>
</div>
