<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<circle cx="7.25" cy="7" r="2.5" stroke="currentColor" stroke-width="1.5" />
	<path
		d="M2.5 16c0-2.9 2.1-4.5 4.75-4.5s4.75 1.6 4.75 4.5"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
	/>
	<path
		d="M12.5 4.7a2.5 2.5 0 010 4.6M14.25 11.6c1.9.5 3.25 1.9 3.25 4.4"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linecap="round"
	/>
</svg>
