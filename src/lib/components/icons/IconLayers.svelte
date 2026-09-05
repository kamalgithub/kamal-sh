<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path
		d="M10 2.5l7.5 3.75L10 10 2.5 6.25 10 2.5z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
	<path
		d="M2.5 10.375L10 14.125l7.5-3.75M2.5 14.125L10 17.875l7.5-3.75"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
