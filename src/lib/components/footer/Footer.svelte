<script lang="ts">
	import type { Profile } from '$lib/content/profile.types';
	import type { NavLink } from '$lib/content/nav.types';
	import { buildInfo } from '$lib/utils/buildInfo';
	import { formatDate } from '$lib/utils/formatDate';
	import { footerCopy } from '$lib/content/copy/footer';
	import Container from '$lib/components/primitives/Container.svelte';
	import IconArrowUpRight from '$lib/components/icons/IconArrowUpRight.svelte';

	let { profile, footerLinks }: { profile: Profile; footerLinks: NavLink[] } = $props();

	const buildInfoText = $derived(
		footerCopy.buildInfoTemplate
			.replace('{date}', formatDate(buildInfo.date))
			.replace('{sha}', buildInfo.sha)
	);
</script>

<footer class="border-t border-border py-8">
	<Container>
		<div class="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
			<!-- getFullYear() runs at prerender time, not per-visit — this page is fully
			     static, so the copyright year freezes at whenever the site was last built.
			     Acceptable: a year-long staleness window at worst, and every deploy refreshes
			     it anyway. -->
			<p class="text-small text-text-muted">© {new Date().getFullYear()} {profile.name}</p>
			<div class="flex flex-wrap justify-center gap-4">
				{#each profile.socials as social (social.label)}
					<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL, not an internal route -->
					<a
						href={social.url}
						target="_blank"
						rel="noopener"
						class="flex items-center gap-1 text-small text-text-muted transition-theme hover:text-text"
					>
						{social.label}
						<IconArrowUpRight size={14} />
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{/each}
				{#each footerLinks as link (link.href)}
					<!-- eslint-disable svelte/no-navigation-without-resolve -- content-authored href, not a compile-time literal -->
					<a href={link.href} class="text-small text-text-muted transition-theme hover:text-text">
						{link.label}
					</a>
					<!-- eslint-enable svelte/no-navigation-without-resolve -->
				{/each}
			</div>
		</div>
		<p class="mt-4 text-center text-small text-text-muted sm:text-left">
			{buildInfoText}
		</p>
	</Container>
</footer>
