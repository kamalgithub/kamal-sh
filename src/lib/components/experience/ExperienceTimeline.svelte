<script lang="ts">
	import type { ExperienceRole } from '$lib/content/experience.types';

	let { roles }: { roles: ExperienceRole[] } = $props();

	function formatRange(startDate: string, endDate: string): string {
		return endDate === 'present' ? `${startDate} to present` : `${startDate} to ${endDate}`;
	}
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each roles as role (role.company + role.startDate)}
		<li class="py-8">
			<p class="text-small text-text-muted">
				{formatRange(role.startDate, role.endDate)}, {role.location}
			</p>
			<h3 class="mt-2 font-display text-h2 font-medium text-text">{role.title}</h3>
			<p class="text-small text-accent">{role.company}</p>
			<p class="mt-4 max-w-2xl text-body text-text-muted">{role.summary}</p>
			{#if role.projects.length > 0}
				<ul class="mt-6 flex flex-col gap-4">
					{#each role.projects as project (project.title)}
						<li class="border-l-2 border-border pl-4">
							<p class="text-small font-medium text-text">{project.title}</p>
							<p class="text-small text-text-muted">{project.description}</p>
							<p class="text-small text-accent">{project.impact}</p>
						</li>
					{/each}
				</ul>
			{/if}
		</li>
	{/each}
</ul>
