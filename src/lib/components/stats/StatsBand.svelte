<script lang="ts">
	import type { Stat } from '$lib/content/stats.types';
	import Container from '$lib/components/primitives/Container.svelte';
	import Section from '$lib/components/primitives/Section.svelte';
	import IconUsers from '$lib/components/icons/IconUsers.svelte';
	import IconPlay from '$lib/components/icons/IconPlay.svelte';
	import IconCalendar from '$lib/components/icons/IconCalendar.svelte';
	import IconGraduationCap from '$lib/components/icons/IconGraduationCap.svelte';
	import IconTrendingUp from '$lib/components/icons/IconTrendingUp.svelte';
	import IconCheckCircle from '$lib/components/icons/IconCheckCircle.svelte';

	let { stats }: { stats: Stat[] } = $props();

	const ICONS = {
		users: IconUsers,
		play: IconPlay,
		calendar: IconCalendar,
		graduationCap: IconGraduationCap,
		trendingUp: IconTrendingUp,
		checkCircle: IconCheckCircle
	};
</script>

<Section>
	<Container>
		<dl class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-8">
			{#each stats as stat (stat.label)}
				{@const Icon = ICONS[stat.icon]}
				<div class="flex flex-col gap-1.5">
					<dt class="flex items-center gap-1.5 text-small text-text-muted">
						<Icon size={16} />
						{stat.label}
					</dt>
					<dd class="font-display text-h2 font-medium text-text">{stat.value}</dd>
				</div>
			{/each}
		</dl>
	</Container>
</Section>
