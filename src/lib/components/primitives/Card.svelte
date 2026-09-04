<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="rounded-sm border border-border bg-surface p-6">
	{@render children()}
</div>
