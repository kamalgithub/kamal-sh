<script lang="ts">
	import type { Testimonial } from '$lib/content/testimonials.types';
	import IconQuote from '$lib/components/icons/IconQuote.svelte';
	import IconStar from '$lib/components/icons/IconStar.svelte';
	import TestimonialAvatar from './TestimonialAvatar.svelte';

	let { testimonials }: { testimonials: Testimonial[] } = $props();

	const STAR_SLOTS = [0, 1, 2, 3, 4];
</script>

<ul class="flex flex-col divide-y divide-border border-t border-border">
	{#each testimonials as testimonial (testimonial.name)}
		<li class="relative py-8">
			<span class="pointer-events-none absolute top-8 left-0 text-border-strong/50">
				<IconQuote size={30} />
			</span>
			<div
				class="flex items-center gap-0.5 pl-10 text-accent"
				aria-label="{testimonial.rating} out of 5 stars"
			>
				{#each STAR_SLOTS as i (i)}
					<IconStar size={13} filled={i < testimonial.rating} />
				{/each}
			</div>
			<p class="mt-2 pl-10 font-display text-body font-normal text-text">
				&ldquo;{testimonial.quote}&rdquo;
			</p>
			<div class="mt-4 flex items-center gap-3 pl-10">
				<TestimonialAvatar name={testimonial.name} />
				{#if testimonial.profileUrl}
					<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
					<a
						href={testimonial.profileUrl}
						target="_blank"
						rel="noreferrer"
						class="text-small text-text-muted transition-colors duration-(--duration-fast) ease-standard hover:text-accent"
					>
						{testimonial.name}, {testimonial.role}
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{:else}
					<p class="text-small text-text-muted">{testimonial.name}, {testimonial.role}</p>
				{/if}
			</div>
		</li>
	{/each}
</ul>
