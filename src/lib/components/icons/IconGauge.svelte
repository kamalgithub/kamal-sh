<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path
		d="M3.5 14.5a6.5 6.5 0 0113 0"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
	/>
	<path d="M10 14.5l3.2-4.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	<circle cx="10" cy="14.5" r="1" fill="currentColor" />
</svg>
