<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { profile } from '$lib/content/profile';
	import { nav, footerLinks } from '$lib/content/nav';
	import { caseStudies } from '$lib/content/case-studies';
	import { products } from '$lib/content/products/products';
	import { commandPaletteCopy as copy } from '$lib/content/copy/commandPalette';
	import { buildCommands, THEME_TOGGLE_COMMAND_ID, type Command } from '$lib/utils/buildCommands';
	import { getResolvedTheme, toggleLightDark, type ResolvedTheme } from '$lib/utils/theme';
	import { bestFuzzyScore } from '$lib/utils/fuzzyScore';
	import { COMMAND_PALETTE_OPEN_EVENT } from '$lib/utils/commandPaletteEvent';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import IconArrowUpRight from '$lib/components/icons/IconArrowUpRight.svelte';
	import IconTerminal from '$lib/components/icons/IconTerminal.svelte';
	import IconSun from '$lib/components/icons/IconSun.svelte';
	import IconMoon from '$lib/components/icons/IconMoon.svelte';

	// Pages/case-studies/products/socials are cheap and built eagerly. The full writing +
	// video archive (~18KB gz combined) is dynamically imported only once the visitor
	// actually opens the palette (see loadArchive) — every other page pays nothing for it,
	// and the palette still opens instantly with everything except archive results while
	// that tiny fetch resolves. See docs/READINESS.md's T2.3.
	let commands: Command[] = $state(
		buildCommands(nav, footerLinks, caseStudies, products, [], [], profile.socials, copy)
	);
	let archiveLoaded = false;

	async function loadArchive() {
		if (archiveLoaded) return;
		archiveLoaded = true;
		const [writingArchive, videoArchive] = await Promise.all([
			import('$lib/content/writing/posts-archive.generated.json'),
			import('$lib/content/youtube/videos-archive.generated.json')
		]);
		commands = buildCommands(
			nav,
			footerLinks,
			caseStudies,
			products,
			writingArchive.default,
			videoArchive.default,
			profile.socials,
			copy
		);
	}

	const STATIC_ICONS = { page: IconArrowRight, resume: IconTerminal, external: IconArrowUpRight };
	const RESOLVED_THEME_ICONS: Record<ResolvedTheme, typeof IconSun> = {
		light: IconSun,
		dark: IconMoon
	};

	let dialogEl: HTMLDialogElement | undefined = $state();
	let query = $state('');
	let activeIndex = $state(0);
	let itemRefs: (HTMLButtonElement | undefined)[] = $state([]);
	// Read fresh each time the palette opens (see openPalette) — resolved so the icon
	// reflects what's actually on screen right now, including when theme is 'system'.
	let currentResolvedTheme: ResolvedTheme = $state('dark');

	// Idle (no query): original content order, grouped. Searching: fuzzy-ranked best
	// first — a query can match a command's keywords ("dark" -> Toggle theme) as well
	// as its visible label, and a typo or abbreviation still finds it via subsequence
	// matching. See fuzzyScore.ts for exactly how far "fuzzy" goes here on purpose.
	const isSearching = $derived(query.trim() !== '');
	const filtered = $derived.by(() => {
		const q = query.trim();
		if (q === '') return commands.filter((command) => !command.hiddenWhenIdle);
		return commands
			.map((command) => ({
				command,
				score: bestFuzzyScore(q, [command.label, ...(command.keywords ?? [])])
			}))
			.filter((entry) => entry.score > -1)
			.sort((a, b) => b.score - a.score)
			.map((entry) => entry.command);
	});

	$effect(() => {
		if (activeIndex > filtered.length - 1) activeIndex = Math.max(filtered.length - 1, 0);
	});

	// Keeps the highlighted row visible when arrow keys move it past the scrollable list's edge.
	$effect(() => {
		itemRefs[activeIndex]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
	});

	// Imperative, not effect-driven: showModal()/close() run in direct response to the
	// action that opened/closed the palette, instead of a reactive watcher inferring
	// intent from a flag — one less layer of timing to reason about for a modal dialog.
	function openPalette() {
		query = '';
		activeIndex = 0;
		// itemRefs is intentionally not reset here — the list is always mounted (only the
		// dialog's open state is toggled), so bind:this already populated it once and
		// clearing it here would permanently orphan those refs with nothing left to repopulate them.
		currentResolvedTheme = getResolvedTheme();
		dialogEl?.showModal();
		// Fire-and-forget: the dialog opens immediately with whatever's already built;
		// `commands` updates reactively once the archive resolves, near-instant in practice.
		void loadArchive();
	}

	function closePalette() {
		dialogEl?.close();
	}

	function togglePalette() {
		if (dialogEl?.open) closePalette();
		else openPalette();
	}

	function commandIcon(command: Command) {
		if (command.id === THEME_TOGGLE_COMMAND_ID) return RESOLVED_THEME_ICONS[currentResolvedTheme];
		return command.icon ? STATIC_ICONS[command.icon] : undefined;
	}

	function run(command: Command) {
		closePalette();
		if (command.id === THEME_TOGGLE_COMMAND_ID) {
			toggleLightDark();
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

	function isEditableElement(element: Element | null): boolean {
		if (!element) return false;
		if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') return true;
		return (element as HTMLElement).isContentEditable;
	}

	function onGlobalKeydown(event: KeyboardEvent) {
		const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
		// "/" is a well-precedented "focus search" shortcut (GitHub, Slack) that no browser
		// or OS reserves globally — unlike Cmd/Ctrl+K, it also has to be guarded so typing an
		// actual "/" into a form field doesn't hijack it.
		const isSlash = event.key === '/' && !isEditableElement(document.activeElement);
		if (isCmdK || isSlash) {
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
		<span class="font-mono text-body text-accent" aria-hidden="true">&gt;</span>
		<input
			type="text"
			maxlength="100"
			bind:value={query}
			placeholder={copy.searchPlaceholder}
			class="w-full rounded-sm bg-transparent font-mono text-body text-text placeholder:text-text-muted focus:outline-hidden focus-visible:ring-2 focus-visible:ring-accent"
		/>
	</div>
	<ul class="max-h-80 overflow-y-auto p-2">
		{#each filtered as command, i (command.id)}
			{@const Icon = commandIcon(command)}
			{#if !isSearching && command.group !== filtered[i - 1]?.group}
				<li class="px-3 pt-3 pb-1 text-small text-text-muted first:pt-1">{command.group}</li>
			{/if}
			<li>
				<button
					bind:this={itemRefs[i]}
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
	<div
		class="flex items-center gap-4 border-t border-border px-4 py-2 font-mono text-small text-text-muted"
	>
		<span>{copy.navigateHint}</span>
		<span>{copy.selectHint}</span>
		<span>{copy.closeHint}</span>
	</div>
</dialog>
