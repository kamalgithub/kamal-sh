<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path d="M2 10h4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	<circle cx="10" cy="10" r="3" stroke="currentColor" stroke-width="1.5" />
	<path d="M13.5 10H18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
