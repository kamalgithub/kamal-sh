<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.5" />
	<circle cx="10" cy="10" r="2" fill="currentColor" />
</svg>
