<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
	<path
		d="M10 18s6-5.686 6-10.5a6 6 0 10-12 0C4 12.314 10 18 10 18z"
		stroke="currentColor"
		stroke-width="1.5"
		stroke-linejoin="round"
	/>
	<circle cx="10" cy="7.5" r="2.25" stroke="currentColor" stroke-width="1.5" />
</svg>
