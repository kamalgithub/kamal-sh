<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<circle cx="10" cy="6.5" r="3" stroke="currentColor" stroke-width="1.5" />
	<path
		d="M3.5 16c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
	/>
</svg>
