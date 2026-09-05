<script lang="ts">
	import type { Certification } from '$lib/content/certifications.types';
	import IconCheckCircle from '$lib/components/icons/IconCheckCircle.svelte';

	let { certifications }: { certifications: Certification[] } = $props();
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each certifications as cert (cert.name)}
		<li class="flex items-baseline justify-between gap-4 py-4">
			<p class="flex items-baseline gap-2 text-small font-medium text-text">
				<span class="shrink-0 translate-y-[0.15em] text-accent"><IconCheckCircle size={14} /></span>
				{cert.name}
			</p>
			<p class="shrink-0 text-small text-text-muted">{cert.issuer}, {cert.year}</p>
		</li>
	{/each}
</ul>
