<script lang="ts">
	import type { Testimonial } from '$lib/content/testimonials.types';

	let { testimonials }: { testimonials: Testimonial[] } = $props();
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each testimonials as testimonial (testimonial.name)}
		<li class="py-8">
			<p class="font-display text-body font-normal text-text">&ldquo;{testimonial.quote}&rdquo;</p>
			<p class="mt-4 text-small text-text-muted">{testimonial.name}, {testimonial.role}</p>
		</li>
	{/each}
</ul>
