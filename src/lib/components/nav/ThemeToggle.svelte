<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { getStoredTheme, applyTheme, type Theme } from '$lib/utils/theme';
	import { themeToggleCopy as copy } from '$lib/content/copy/themeToggle';
	import IconSun from '$lib/components/icons/IconSun.svelte';
	import IconMoon from '$lib/components/icons/IconMoon.svelte';
	import IconMonitor from '$lib/components/icons/IconMonitor.svelte';

	const options: { value: Theme; label: string }[] = [
		{ value: 'light', label: copy.lightLabel },
		{ value: 'system', label: copy.systemLabel },
		{ value: 'dark', label: copy.darkLabel }
	];

	// Starts at 'system' during SSR/prerender (no localStorage there) and syncs to the
	// real stored value on mount — a one-frame mismatch here is fine since app.html's
	// inline script already set data-theme before paint; this only drives button state.
	let theme: Theme = $state('system');
	let open = $state(false);
	let wrapperEl: HTMLDivElement | undefined = $state();
	let triggerEl: HTMLButtonElement | undefined = $state();
	let itemRefs: (HTMLButtonElement | undefined)[] = $state([]);

	onMount(() => {
		theme = getStoredTheme();
	});

	function select(next: Theme) {
		theme = next;
		applyTheme(next);
		open = false;
		triggerEl?.focus();
	}

	// The ARIA menu pattern moves focus into the menu on open, landing on whichever item
	// is currently checked (falling back to the first) rather than leaving focus on the
	// trigger — a plain click-to-open toggle wouldn't need this, but arrow-key navigation
	// below only works once focus is actually inside the menu.
	async function toggleOpen() {
		open = !open;
		if (!open) return;
		await tick();
		const checkedIndex = options.findIndex((option) => option.value === theme);
		itemRefs[checkedIndex >= 0 ? checkedIndex : 0]?.focus();
	}

	function closeAndReturnFocus() {
		open = false;
		triggerEl?.focus();
	}

	function onDocumentClick(event: MouseEvent) {
		if (wrapperEl && !wrapperEl.contains(event.target as Node)) open = false;
	}

	function onDocumentKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') closeAndReturnFocus();
	}

	// Standard ARIA menu keyboard support: Up/Down move focus between items (wrapping),
	// Home/End jump to the ends — without this, a keyboard user can Tab to the trigger and
	// open the menu, but can't actually reach any item inside it.
	function onMenuKeydown(event: KeyboardEvent) {
		const currentIndex = itemRefs.findIndex((el) => el === document.activeElement);
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			itemRefs[(currentIndex + 1) % options.length]?.focus();
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			itemRefs[(currentIndex - 1 + options.length) % options.length]?.focus();
		} else if (event.key === 'Home') {
			event.preventDefault();
			itemRefs[0]?.focus();
		} else if (event.key === 'End') {
			event.preventDefault();
			itemRefs[options.length - 1]?.focus();
		}
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
		bind:this={triggerEl}
		type="button"
		aria-label={copy.triggerLabelTemplate.replace('{theme}', theme)}
		aria-haspopup="menu"
		aria-expanded={open}
		onclick={toggleOpen}
		class="flex min-h-10 min-w-10 items-center justify-center rounded-sm text-text-muted transition-theme hover:text-text"
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
			tabindex="-1"
			onkeydown={onMenuKeydown}
			class="absolute right-0 z-50 mt-1 flex w-32 flex-col gap-0.5 rounded-sm border border-border-strong bg-surface p-1"
		>
			{#each options as option, i (option.value)}
				<button
					bind:this={itemRefs[i]}
					type="button"
					role="menuitemradio"
					aria-checked={theme === option.value}
					onclick={() => select(option.value)}
					class="flex items-center gap-2 rounded-[3px] px-2 py-1.5 text-left text-small transition-theme {theme ===
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
