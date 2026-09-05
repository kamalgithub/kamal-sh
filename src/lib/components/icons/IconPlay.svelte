<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.5" />
	<path
		d="M8.3 7.2l5 2.8-5 2.8V7.2z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
</svg>
