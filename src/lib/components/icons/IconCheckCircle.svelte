<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.5" />
	<path
		d="M6.5 10.2l2.3 2.3 4.7-5"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
	/>
</svg>
