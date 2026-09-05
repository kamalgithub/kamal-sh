<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path
		d="M10 2.5l6 2.4v4.6c0 4.4-2.9 7.5-6 8.5-3.1-1-6-4.1-6-8.5V4.9l6-2.4z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
	<path
		d="M7 10l2 2 4-4.2"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
