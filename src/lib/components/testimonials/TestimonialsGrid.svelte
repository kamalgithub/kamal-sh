<script lang="ts">
	import type { Testimonial } from '$lib/content/testimonials.types';
	import Card from '$lib/components/primitives/Card.svelte';

	let { testimonials }: { testimonials: Testimonial[] } = $props();
</script>

<div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
	{#each testimonials as testimonial (testimonial.name)}
		<Card>
			<p class="mb-4 text-small text-text-muted">{testimonial.quote}</p>
			<p class="text-small font-medium text-text">{testimonial.name}</p>
			<p class="text-small text-text-muted">{testimonial.role}</p>
		</Card>
	{/each}
</div>
