<script lang="ts">
	import type { ExperienceRole } from '$lib/content/experience.types';
	import Card from '$lib/components/primitives/Card.svelte';

	let { roles }: { roles: ExperienceRole[] } = $props();

	function formatRange(startDate: string, endDate: string): string {
		return endDate === 'present' ? `${startDate} — present` : `${startDate} — ${endDate}`;
	}
</script>

<div class="flex flex-col gap-6">
	{#each roles as role (role.company + role.startDate)}
		<Card>
			<p class="text-small text-text-muted">
				{formatRange(role.startDate, role.endDate)} · {role.location}
			</p>
			<h3 class="mt-1 font-display text-body font-semibold text-text">{role.title}</h3>
			<p class="text-small text-accent">{role.company}</p>
			<p class="mt-4 text-body text-text-muted">{role.summary}</p>
			{#if role.projects.length > 0}
				<ul class="mt-4 flex flex-col gap-3">
					{#each role.projects as project (project.title)}
						<li class="border-l-2 border-border pl-4">
							<p class="text-small font-medium text-text">{project.title}</p>
							<p class="text-small text-text-muted">{project.description}</p>
							<p class="text-small text-accent">{project.impact}</p>
						</li>
					{/each}
				</ul>
			{/if}
		</Card>
	{/each}
</div>
