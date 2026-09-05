<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<rect x="3" y="4.5" width="14" height="12" rx="1" stroke="currentColor" stroke-width="1.5" />
	<path
		d="M3 8h14M7 2.5v3M13 2.5v3"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
	/>
</svg>
