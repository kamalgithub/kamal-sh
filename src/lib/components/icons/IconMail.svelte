<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<rect x="2.5" y="4.5" width="15" height="11" rx="1" stroke="currentColor" stroke-width="1.5" />
	<path
		d="M2.5 5.5l7.5 6 7.5-6"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
