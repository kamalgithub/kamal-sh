<script lang="ts">
	import type { Certification } from '$lib/content/certifications.types';

	let { certifications }: { certifications: Certification[] } = $props();
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each certifications as cert (cert.name)}
		<li class="flex items-baseline justify-between gap-4 py-4">
			<p class="text-small font-medium text-text">{cert.name}</p>
			<p class="shrink-0 text-small text-text-muted">{cert.issuer}, {cert.year}</p>
		</li>
	{/each}
</ul>
