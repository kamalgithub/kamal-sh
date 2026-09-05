<script lang="ts">
	let { size = 20 }: { size?: number } = $props();
</script>

<span
	style:font-size="{size * 0.7}px"
	style:width="{size}px"
	style:height="{size}px"
	class="inline-flex items-center justify-center leading-none"
	aria-hidden="true"
>
	&#8984;
</span>
