<script lang="ts">
	import { onMount } from 'svelte';
	import { getStoredTheme, applyTheme, type Theme } from '$lib/utils/theme';
	import IconSun from '$lib/components/icons/IconSun.svelte';
	import IconMoon from '$lib/components/icons/IconMoon.svelte';
	import IconMonitor from '$lib/components/icons/IconMonitor.svelte';

	const options: { value: Theme; label: string }[] = [
		{ value: 'light', label: 'Light theme' },
		{ value: 'system', label: 'Match system theme' },
		{ value: 'dark', label: 'Dark theme' }
	];

	// Starts at 'system' during SSR/prerender (no localStorage there) and syncs to the
	// real stored value on mount — a one-frame mismatch here is fine since app.html's
	// inline script already set data-theme before paint; this only drives button state.
	let theme: Theme = $state('system');

	onMount(() => {
		theme = getStoredTheme();
	});

	function select(next: Theme) {
		theme = next;
		applyTheme(next);
	}
</script>

<div
	role="group"
	aria-label="Theme"
	class="inline-flex items-center gap-0.5 rounded-sm border border-border p-0.5"
>
	{#each options as option (option.value)}
		<button
			type="button"
			aria-label={option.label}
			aria-pressed={theme === option.value}
			onclick={() => select(option.value)}
			class="flex min-h-10 min-w-10 items-center justify-center rounded-[3px] transition-colors duration-(--duration-fast) ease-standard {theme ===
			option.value
				? 'bg-text text-bg'
				: 'text-text-muted hover:text-text'}"
		>
			{#if option.value === 'light'}
				<IconSun size={16} />
			{:else if option.value === 'dark'}
				<IconMoon size={16} />
			{:else}
				<IconMonitor size={16} />
			{/if}
		</button>
	{/each}
</div>
