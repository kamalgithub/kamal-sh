<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<rect x="3" y="7" width="14" height="9" rx="1.5" stroke="currentColor" stroke-width="1.5" />
	<path
		d="M7.5 7V5.5a1.5 1.5 0 011.5-1.5h2a1.5 1.5 0 011.5 1.5V7"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
	/>
	<path d="M3 11.5h14" stroke="currentColor" stroke-width="1.5" />
</svg>
