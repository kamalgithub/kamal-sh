<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path
		d="M10 4L2.5 8l7.5 4 7.5-4L10 4z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
	<path
		d="M5.5 10.2v3.3c0 1.2 2 2.2 4.5 2.2s4.5-1 4.5-2.2v-3.3"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
	<path d="M17.5 9v4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
