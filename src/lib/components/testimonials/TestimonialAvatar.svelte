<script lang="ts">
	import { getInitials } from '$lib/utils/getInitials';

	let { name }: { name: string } = $props();
</script>

<span
	class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border-strong text-small font-medium text-text"
	aria-hidden="true"
>
	{getInitials(name)}
</span>
