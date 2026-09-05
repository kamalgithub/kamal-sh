<script lang="ts">
	let { size = 32 }: { size?: number } = $props();
</script>

<svg
	width={size}
	height={(size * 20) / 24}
	viewBox="0 0 24 20"
	fill="currentColor"
	aria-hidden="true"
>
	<path d="M0 20v-6.5C0 7 3.5 2.5 9 0l1.5 3C7 4.5 5 7 5 9.5h4V20H0Z" />
	<path d="M13 20v-6.5c0-6.5 3.5-11 9-13.5L23.5 3C20 4.5 18 7 18 9.5h4V20H13Z" />
</svg>
