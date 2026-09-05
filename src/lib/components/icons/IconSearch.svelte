<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" stroke-width="1.5" />
	<path d="M12.7 12.7L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
