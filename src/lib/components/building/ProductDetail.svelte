<script lang="ts">
	import type { Product } from '$lib/content/products/product.types';
	import Button from '$lib/components/primitives/Button.svelte';

	let { product }: { product: Product } = $props();
</script>

<p class="text-body text-text-muted">{product.tagline}</p>
<p class="mt-6 text-body text-text-muted">{product.description}</p>

{#if product.highlights.length > 0}
	<ul class="mt-8 flex flex-col gap-2">
		{#each product.highlights as highlight (highlight)}
			<li class="flex gap-2 text-body text-text-muted">
				<span class="text-accent" aria-hidden="true">—</span>
				{highlight}
			</li>
		{/each}
	</ul>
{/if}

{#if product.installCommand}
	<code
		class="mt-8 block w-fit rounded-lg border border-border bg-surface px-4 py-2 text-small text-text"
	>
		{product.installCommand}
	</code>
{/if}

<div class="mt-8 flex flex-wrap gap-3">
	{#if product.primaryCta}
		<Button href={product.primaryCta.url} variant="primary">{product.primaryCta.label}</Button>
	{/if}
	{#each product.links as link (link.url)}
		<Button href={link.url} variant="secondary">{link.label}</Button>
	{/each}
</div>
