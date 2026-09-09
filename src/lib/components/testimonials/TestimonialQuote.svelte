<script lang="ts">
	import type { TestimonialsCopy } from '$lib/content/copy/testimonials.types';
	import { truncateText } from '$lib/utils/truncateText';

	const PREVIEW_LENGTH = 150;

	let {
		quote,
		truncate = false,
		copy
	}: {
		quote: string;
		/** Clamp to `PREVIEW_LENGTH` chars with a show more/less toggle — off by default so the
		 *  full /testimonials page always renders the complete quote. */
		truncate?: boolean;
		copy: TestimonialsCopy;
	} = $props();

	let expanded = $state(false);

	const isTruncatable = $derived(truncate && quote.length > PREVIEW_LENGTH);
	const displayText = $derived(
		isTruncatable && !expanded ? truncateText(quote, PREVIEW_LENGTH) : quote
	);
</script>

<p class="mt-2 pl-10 font-display text-body font-normal text-text">
	&ldquo;{displayText}&rdquo;
</p>
{#if isTruncatable}
	<button
		type="button"
		class="mt-1 pl-10 text-small text-accent transition-theme hover:text-text"
		onclick={() => (expanded = !expanded)}
	>
		{expanded ? copy.showLessLabel : copy.showMoreLabel}
	</button>
{/if}
