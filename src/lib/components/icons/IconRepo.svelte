<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path
		d="M5 3h9a1 1 0 011 1v12H6.5A1.5 1.5 0 015 14.5V3z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
	<path
		d="M5 14.5A1.5 1.5 0 016.5 13H15"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
</svg>
