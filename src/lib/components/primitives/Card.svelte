<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="rounded-sm border border-border-strong bg-surface p-4 md:p-6">
	{@render children()}
</div>
