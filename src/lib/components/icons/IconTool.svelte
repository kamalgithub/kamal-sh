<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path
		d="M13.5 3.5a4 4 0 00-5.4 4.7L3 13.3v2.2h2.2l5.1-5.1a4 4 0 004.7-5.4l-2.6 2.6-2-.5-.5-2 2.6-2.6z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
		stroke-linecap="round"
	/>
</svg>
