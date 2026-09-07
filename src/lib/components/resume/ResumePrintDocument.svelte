<script lang="ts">
	import type { ResumeData } from '$lib/utils/resume.types';
	import type { ResumePrintCopy } from '$lib/content/copy/resumePrint.types';

	let {
		profile,
		experience,
		education,
		certifications,
		copy
	}: ResumeData & { copy: ResumePrintCopy } = $props();

	function formatRange(startDate: string, endDate: string): string {
		return endDate === 'present' ? `${startDate} to present` : `${startDate} to ${endDate}`;
	}
</script>

<article class="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
	<header class="border-b border-border-strong pb-6">
		<h1 class="font-display text-h1 font-medium text-text">{profile.name}</h1>
		<p class="mt-1 text-body text-text-muted">{profile.title}</p>
		<p class="mt-3 text-small text-text-muted">{profile.location}</p>
		<!-- eslint-disable svelte/no-navigation-without-resolve -- mailto link, not an internal route -->
		<a href="mailto:{profile.email}" class="text-small text-accent">{profile.email}</a>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	</header>

	<section class="mt-10">
		<h2 class="font-display text-h2 font-medium text-text">{copy.experienceHeading}</h2>
		<ul class="mt-4 flex flex-col divide-y divide-border border-t border-border">
			{#each experience as role (role.company + role.startDate)}
				<li class="py-6">
					<p class="text-small text-text-muted">
						{formatRange(role.startDate, role.endDate)}, {role.location}
					</p>
					<h3 class="mt-1 font-display text-body font-semibold text-text">
						{role.title}, {role.company}
					</h3>
					<p class="mt-2 text-small text-text-muted">{role.summary}</p>
					{#if role.projects.length > 0}
						<ul class="mt-3 flex flex-col gap-2">
							{#each role.projects as project (project.title)}
								<li class="border-l-2 border-border pl-3 text-small text-text-muted">
									<span class="font-medium text-text">{project.title}:</span>
									{project.impact}
								</li>
							{/each}
						</ul>
					{/if}
				</li>
			{/each}
		</ul>
	</section>

	<section class="mt-10">
		<h2 class="font-display text-h2 font-medium text-text">{copy.educationHeading}</h2>
		<ul class="mt-4 flex flex-col divide-y divide-border border-t border-border">
			{#each education as entry (entry.institution + entry.startDate)}
				<li class="py-4">
					<p class="font-display text-body font-semibold text-text">{entry.degree}</p>
					<p class="text-small text-text-muted">{entry.institution}</p>
					<p class="text-small text-text-muted">
						{formatRange(entry.startDate, entry.endDate)}, {entry.gpa}
					</p>
				</li>
			{/each}
		</ul>
	</section>

	{#if certifications.length > 0}
		<section class="mt-10">
			<h2 class="font-display text-h2 font-medium text-text">{copy.certificationsHeading}</h2>
			<ul class="mt-4 flex flex-col divide-y divide-border border-t border-border">
				{#each certifications as cert (cert.name + cert.year)}
					<li class="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between">
						<p class="text-body text-text">{cert.name}, {cert.issuer}</p>
						<p class="text-small text-text-muted">{cert.year}</p>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</article>
