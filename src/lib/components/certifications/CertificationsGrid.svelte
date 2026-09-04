<script lang="ts">
	import type { Certification } from '$lib/content/certifications.types';

	let { certifications }: { certifications: Certification[] } = $props();
</script>

<ul class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
	{#each certifications as cert (cert.name)}
		<li class="rounded-2xl border border-border p-4">
			<p class="text-small font-medium text-text">{cert.name}</p>
			<p class="text-small text-text-muted">{cert.issuer} · {cert.year}</p>
		</li>
	{/each}
</ul>
