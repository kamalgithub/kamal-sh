<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { profile } from '$lib/content/profile';
	import { nav } from '$lib/content/nav';
	import { commandPaletteCopy as copy } from '$lib/content/copy/commandPalette';
	import { buildCommands, THEME_TOGGLE_COMMAND_ID, type Command } from '$lib/utils/buildCommands';
	import { getStoredTheme, applyTheme, type Theme } from '$lib/utils/theme';
	import { COMMAND_PALETTE_OPEN_EVENT } from '$lib/utils/commandPaletteEvent';
	import IconSearch from '$lib/components/icons/IconSearch.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import IconArrowUpRight from '$lib/components/icons/IconArrowUpRight.svelte';
	import IconTerminal from '$lib/components/icons/IconTerminal.svelte';
	import IconSun from '$lib/components/icons/IconSun.svelte';
	import IconMoon from '$lib/components/icons/IconMoon.svelte';
	import IconMonitor from '$lib/components/icons/IconMonitor.svelte';

	const commands = buildCommands(nav, profile.socials, copy);
	const THEME_CYCLE: Record<Theme, Theme> = { dark: 'light', light: 'system', system: 'dark' };
	const STATIC_ICONS = { page: IconArrowRight, resume: IconTerminal, social: IconArrowUpRight };
	const THEME_ICONS: Record<Theme, typeof IconSun> = {
		light: IconSun,
		dark: IconMoon,
		system: IconMonitor
	};

	let dialogEl: HTMLDialogElement | undefined = $state();
	let query = $state('');
	let activeIndex = $state(0);
	// Read fresh each time the palette opens (see openPalette) — the theme rarely changes
	// while it's open, and running the command closes the palette immediately anyway.
	let currentTheme: Theme = $state('system');

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return q === ''
			? commands
			: commands.filter((command) => command.label.toLowerCase().includes(q));
	});

	$effect(() => {
		if (activeIndex > filtered.length - 1) activeIndex = Math.max(filtered.length - 1, 0);
	});

	// Imperative, not effect-driven: showModal()/close() run in direct response to the
	// action that opened/closed the palette, instead of a reactive watcher inferring
	// intent from a flag — one less layer of timing to reason about for a modal dialog.
	function openPalette() {
		query = '';
		activeIndex = 0;
		currentTheme = getStoredTheme();
		dialogEl?.showModal();
	}

	function closePalette() {
		dialogEl?.close();
	}

	function togglePalette() {
		if (dialogEl?.open) closePalette();
		else openPalette();
	}

	function commandIcon(command: Command) {
		if (command.id === THEME_TOGGLE_COMMAND_ID) return THEME_ICONS[currentTheme];
		return command.icon ? STATIC_ICONS[command.icon] : undefined;
	}

	function run(command: Command) {
		closePalette();
		if (command.id === THEME_TOGGLE_COMMAND_ID) {
			applyTheme(THEME_CYCLE[getStoredTheme()]);
			return;
		}
		if (!command.href) return;
		if (command.href.startsWith('/')) {
			// eslint-disable-next-line svelte/no-navigation-without-resolve -- content-authored href, not a compile-time literal
			goto(command.href);
		} else {
			window.open(command.href, '_blank', 'noopener');
		}
	}

	function onDialogKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			activeIndex = Math.min(activeIndex + 1, filtered.length - 1);
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			activeIndex = Math.max(activeIndex - 1, 0);
		} else if (event.key === 'Enter') {
			event.preventDefault();
			const command = filtered[activeIndex];
			if (command) run(command);
		}
	}

	function onBackdropClick(event: MouseEvent) {
		if (event.target === dialogEl) closePalette();
	}

	function onGlobalKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			togglePalette();
		}
	}

	onMount(() => {
		window.addEventListener('keydown', onGlobalKeydown);
		window.addEventListener(COMMAND_PALETTE_OPEN_EVENT, openPalette);
		return () => {
			window.removeEventListener('keydown', onGlobalKeydown);
			window.removeEventListener(COMMAND_PALETTE_OPEN_EVENT, openPalette);
		};
	});
</script>

<dialog
	bind:this={dialogEl}
	onclick={onBackdropClick}
	onkeydown={onDialogKeydown}
	aria-label={copy.triggerLabel}
	class="mx-auto mt-24 w-[calc(100%-2rem)] max-w-lg overflow-hidden rounded-sm border border-border-strong bg-surface p-0 backdrop:bg-bg/80"
>
	<div class="flex items-center gap-3 border-b border-border px-4 py-3">
		<IconSearch size={18} />
		<input
			type="text"
			bind:value={query}
			placeholder={copy.searchPlaceholder}
			class="w-full bg-transparent text-body text-text placeholder:text-text-muted focus:outline-hidden"
		/>
	</div>
	<ul class="max-h-80 overflow-y-auto p-2">
		{#each filtered as command, i (command.id)}
			{@const Icon = commandIcon(command)}
			{#if command.group !== filtered[i - 1]?.group}
				<li class="px-3 pt-3 pb-1 text-small text-text-muted first:pt-1">{command.group}</li>
			{/if}
			<li>
				<button
					type="button"
					onclick={() => run(command)}
					onmouseenter={() => (activeIndex = i)}
					class="flex w-full items-center gap-2.5 rounded-sm px-3 py-2 text-left text-body transition-colors duration-(--duration-fast) ease-standard {i ===
					activeIndex
						? 'bg-text text-bg'
						: 'text-text'}"
				>
					{#if Icon}
						<span class="shrink-0 {i === activeIndex ? '' : 'text-text-muted'}"
							><Icon size={16} /></span
						>
					{/if}
					{command.label}
				</button>
			</li>
		{:else}
			<li class="px-3 py-2 text-body text-text-muted">{copy.emptyLabel}</li>
		{/each}
	</ul>
	<div class="flex items-center gap-4 border-t border-border px-4 py-2 text-small text-text-muted">
		<span>{copy.navigateHint}</span>
		<span>{copy.selectHint}</span>
		<span>{copy.closeHint}</span>
	</div>
</dialog>
