<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path
		d="M4 16l1-4L13.5 3.5a1.5 1.5 0 012.1 0l.4.4a1.5 1.5 0 010 2.1L7.5 14.5 4 16z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
	<path d="M12 5.5l2.5 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
</svg>
