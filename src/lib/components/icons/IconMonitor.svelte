<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<rect x="3" y="4" width="14" height="10" rx="1" stroke="currentColor" stroke-width="1.5" />
	<path d="M7 17h6M10 14v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
