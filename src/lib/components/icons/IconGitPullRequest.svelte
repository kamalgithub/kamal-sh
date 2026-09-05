<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<circle cx="6" cy="5" r="2" stroke="currentColor" stroke-width="1.5" />
	<circle cx="6" cy="15" r="2" stroke="currentColor" stroke-width="1.5" />
	<circle cx="14" cy="10" r="2" stroke="currentColor" stroke-width="1.5" />
	<path d="M6 7v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
	<path
		d="M14 8V7a3 3 0 00-3-3H9"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
	/>
	<path
		d="M11 2.5L8.5 4l2.5 1.5"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
