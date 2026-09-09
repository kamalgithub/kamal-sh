<script lang="ts">
	import { untrack } from 'svelte';
	import type { ArchitectureNode, ArchitectureNodeIcon } from '$lib/content/architecture.types';
	import type { ArchitectureCopy } from '$lib/content/copy/architecture.types';
	import Card from '$lib/components/primitives/Card.svelte';
	import IconArrowRight from '$lib/components/icons/IconArrowRight.svelte';
	import IconLayers from '$lib/components/icons/IconLayers.svelte';
	import IconShield from '$lib/components/icons/IconShield.svelte';
	import IconGauge from '$lib/components/icons/IconGauge.svelte';
	import IconCheckCircle from '$lib/components/icons/IconCheckCircle.svelte';
	import IconActivity from '$lib/components/icons/IconActivity.svelte';

	let { nodes, copy }: { nodes: ArchitectureNode[]; copy: ArchitectureCopy } = $props();

	const ICONS: Record<ArchitectureNodeIcon, typeof IconLayers> = {
		layers: IconLayers,
		shield: IconShield,
		gauge: IconGauge,
		checkCircle: IconCheckCircle,
		activity: IconActivity
	};

	const flowNodes = $derived(nodes.filter((node) => node.category === 'flow'));
	const crossCuttingNodes = $derived(nodes.filter((node) => node.category === 'cross-cutting'));

	// Deliberately captured once as the initial selection, not kept in sync with `nodes` —
	// `nodes` is static content, this just needs a sensible default the visitor can change.
	let selectedId = $state(untrack(() => nodes[0]?.id));
	const selected = $derived(nodes.find((node) => node.id === selectedId));

	function nodeButtonClass(isSelected: boolean): string {
		const base =
			'flex items-center gap-2 rounded-sm border px-4 py-3 text-left text-small font-medium transition-theme';
		return isSelected
			? `${base} border-text bg-text text-bg`
			: `${base} border-border-strong text-text hover:border-accent`;
	}
</script>

<div>
	<p class="text-small text-text-muted">{copy.flowLabel}</p>
	<div class="mt-3 flex flex-wrap items-center gap-2">
		{#each flowNodes as node, i (node.id)}
			{@const NodeIcon = ICONS[node.icon]}
			<button
				type="button"
				aria-pressed={selectedId === node.id}
				onclick={() => (selectedId = node.id)}
				class={nodeButtonClass(selectedId === node.id)}
			>
				<NodeIcon size={16} />
				{node.label}
			</button>
			{#if i < flowNodes.length - 1}
				<span class="text-text-muted" aria-hidden="true"><IconArrowRight size={16} /></span>
			{/if}
		{/each}
	</div>

	<p class="mt-8 text-small text-text-muted">{copy.crossCuttingLabel}</p>
	<div class="mt-3 flex flex-wrap gap-2">
		{#each crossCuttingNodes as node (node.id)}
			{@const NodeIcon = ICONS[node.icon]}
			<button
				type="button"
				aria-pressed={selectedId === node.id}
				onclick={() => (selectedId = node.id)}
				class={nodeButtonClass(selectedId === node.id)}
			>
				<NodeIcon size={16} />
				{node.label}
			</button>
		{/each}
	</div>

	{#if selected}
		{@const SelectedIcon = ICONS[selected.icon]}
		<div class="mt-8">
			<Card>
				<div class="flex items-center gap-3">
					<span
						class="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-bg text-accent"
					>
						<SelectedIcon size={20} />
					</span>
					<h2 class="font-display text-h2 font-medium text-text">{selected.label}</h2>
				</div>
				<p class="mt-4 text-body text-text-muted">{selected.summary}</p>

				<h3 class="mt-6 text-small text-text-muted">{copy.rationaleLabel}</h3>
				<p class="mt-2 text-body text-text">{selected.rationale}</p>

				{#if selected.tradeoffs.length > 0}
					<h3 class="mt-6 text-small text-text-muted">{copy.tradeoffsLabel}</h3>
					<ul class="mt-2 flex flex-col divide-y divide-border border-t border-border">
						{#each selected.tradeoffs as tradeoff (tradeoff.considered)}
							<li class="py-3">
								<p class="text-body font-medium text-text">{tradeoff.considered}</p>
								<p class="mt-1 text-body text-text-muted">{tradeoff.rejectedBecause}</p>
							</li>
						{/each}
					</ul>
				{/if}
			</Card>
		</div>
	{/if}
</div>
