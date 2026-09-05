<script lang="ts">
	import { onMount } from 'svelte';
	import { getStoredTheme, applyTheme, type Theme } from '$lib/utils/theme';
	import IconSun from '$lib/components/icons/IconSun.svelte';
	import IconMoon from '$lib/components/icons/IconMoon.svelte';
	import IconMonitor from '$lib/components/icons/IconMonitor.svelte';

	const options: { value: Theme; label: string }[] = [
		{ value: 'light', label: 'Light' },
		{ value: 'system', label: 'System' },
		{ value: 'dark', label: 'Dark' }
	];

	// Starts at 'system' during SSR/prerender (no localStorage there) and syncs to the
	// real stored value on mount — a one-frame mismatch here is fine since app.html's
	// inline script already set data-theme before paint; this only drives button state.
	let theme: Theme = $state('system');
	let open = $state(false);
	let wrapperEl: HTMLDivElement | undefined = $state();

	onMount(() => {
		theme = getStoredTheme();
	});

	function select(next: Theme) {
		theme = next;
		applyTheme(next);
		open = false;
	}

	function onDocumentClick(event: MouseEvent) {
		if (wrapperEl && !wrapperEl.contains(event.target as Node)) open = false;
	}

	function onDocumentKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') open = false;
	}

	// Only listens while the menu is actually open — a single-button toggle doesn't
	// need a permanent document-level listener for the other 99% of the time.
	$effect(() => {
		if (!open) return;
		document.addEventListener('click', onDocumentClick);
		document.addEventListener('keydown', onDocumentKeydown);
		return () => {
			document.removeEventListener('click', onDocumentClick);
			document.removeEventListener('keydown', onDocumentKeydown);
		};
	});
</script>

<div class="relative" bind:this={wrapperEl}>
	<button
		type="button"
		aria-label="Change theme (currently {theme})"
		aria-haspopup="menu"
		aria-expanded={open}
		onclick={() => (open = !open)}
		class="flex min-h-10 min-w-10 items-center justify-center rounded-sm text-text-muted transition-colors duration-(--duration-fast) ease-standard hover:text-text"
	>
		{#if theme === 'light'}
			<IconSun size={17} />
		{:else if theme === 'dark'}
			<IconMoon size={17} />
		{:else}
			<IconMonitor size={17} />
		{/if}
	</button>
	{#if open}
		<div
			role="menu"
			class="absolute right-0 z-50 mt-1 flex w-32 flex-col gap-0.5 rounded-sm border border-border-strong bg-surface p-1"
		>
			{#each options as option (option.value)}
				<button
					type="button"
					role="menuitemradio"
					aria-checked={theme === option.value}
					onclick={() => select(option.value)}
					class="flex items-center gap-2 rounded-[3px] px-2 py-1.5 text-left text-small transition-colors duration-(--duration-fast) ease-standard {theme ===
					option.value
						? 'bg-text text-bg'
						: 'text-text hover:bg-bg'}"
				>
					{#if option.value === 'light'}
						<IconSun size={14} />
					{:else if option.value === 'dark'}
						<IconMoon size={14} />
					{:else}
						<IconMonitor size={14} />
					{/if}
					{option.label}
				</button>
			{/each}
		</div>
	{/if}
</div>
