<script lang="ts">
	let { size = 16, filled = true }: { size?: number; filled?: boolean } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 20 20"
	fill={filled ? 'currentColor' : 'none'}
	aria-hidden="true"
>
	<path
		d="M10 2.5l2.35 4.76 5.25.76-3.8 3.7.9 5.23L10 14.5l-4.7 2.45.9-5.23-3.8-3.7 5.25-.76L10 2.5z"
		stroke="currentColor"
		stroke-width="1.25"
		stroke-linejoin="round"
	/>
</svg>
