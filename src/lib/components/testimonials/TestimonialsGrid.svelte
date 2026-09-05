<script lang="ts">
	import type { Testimonial } from '$lib/content/testimonials.types';
	import IconQuote from '$lib/components/icons/IconQuote.svelte';
	import TestimonialAvatar from './TestimonialAvatar.svelte';

	let { testimonials }: { testimonials: Testimonial[] } = $props();
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each testimonials as testimonial (testimonial.name)}
		<li class="relative py-8">
			<span class="pointer-events-none absolute top-0 left-0 text-border-strong/50">
				<IconQuote size={30} />
			</span>
			<p class="pl-10 font-display text-body font-normal text-text">
				&ldquo;{testimonial.quote}&rdquo;
			</p>
			<div class="mt-4 flex items-center gap-3 pl-10">
				<TestimonialAvatar name={testimonial.name} />
				<p class="text-small text-text-muted">{testimonial.name}, {testimonial.role}</p>
			</div>
		</li>
	{/each}
</ul>
