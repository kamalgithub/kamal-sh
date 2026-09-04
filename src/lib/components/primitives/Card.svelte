<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="rounded-2xl border border-(--surface-glass-border) bg-(--surface-glass-bg) p-6 backdrop-blur-(--surface-glass-blur)"
>
	{@render children()}
</div>
