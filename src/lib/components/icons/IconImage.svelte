<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<rect x="2.5" y="3.5" width="15" height="13" rx="1" stroke="currentColor" stroke-width="1.5" />
	<circle cx="7" cy="8" r="1.5" stroke="currentColor" stroke-width="1.5" />
	<path
		d="M3.5 14.5l4-4 2.5 2.5 3-3.5 3.5 4"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
