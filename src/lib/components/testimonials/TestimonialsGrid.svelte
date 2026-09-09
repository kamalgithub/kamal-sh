<script lang="ts">
	import type { Testimonial } from '$lib/content/testimonials.types';
	import type { TestimonialsCopy } from '$lib/content/copy/testimonials.types';
	import IconQuote from '$lib/components/icons/IconQuote.svelte';
	import IconStar from '$lib/components/icons/IconStar.svelte';
	import TestimonialAvatar from './TestimonialAvatar.svelte';
	import TestimonialQuote from './TestimonialQuote.svelte';

	let {
		testimonials,
		copy,
		truncateQuotes = false
	}: {
		testimonials: Testimonial[];
		copy: TestimonialsCopy;
		/** Clamp quotes to a preview length with a show more toggle — used on the homepage
		 *  preview; the full /testimonials page always shows quotes in full. */
		truncateQuotes?: boolean;
	} = $props();

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
			<TestimonialQuote quote={testimonial.quote} truncate={truncateQuotes} {copy} />
			<div class="mt-4 flex items-center gap-3 pl-10">
				<TestimonialAvatar name={testimonial.name} />
				{#if testimonial.profileUrl}
					<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
					<a
						href={testimonial.profileUrl}
						target="_blank"
						rel="noopener"
						class="text-small text-text-muted transition-theme hover:text-accent"
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
