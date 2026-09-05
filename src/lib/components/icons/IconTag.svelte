<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path
		d="M10.5 3H4.5a1 1 0 00-1 1v6a1 1 0 00.3.7l7.3 7.3a1 1 0 001.4 0l5.3-5.3a1 1 0 000-1.4L11.2 3.3a1 1 0 00-.7-.3z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
	<circle cx="7" cy="7" r="1.15" fill="currentColor" />
</svg>
