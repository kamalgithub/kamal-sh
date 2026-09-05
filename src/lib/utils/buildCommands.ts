import type { NavLink } from '$lib/content/nav.types';
import type { ProfileSocial } from '$lib/content/profile.types';
import type { CommandPaletteCopy } from '$lib/content/copy/commandPalette.types';

export const THEME_TOGGLE_COMMAND_ID = 'toggle-theme';

/** A string key, not a component reference — content data stays framework-agnostic. */
export type CommandIcon = 'page' | 'resume' | 'social';

export interface Command {
	id: string;
	label: string;
	group: string;
	/** Absent only for the theme-toggle command, which renders the live current-theme icon instead. */
	icon?: CommandIcon;
	/** Absent only for the theme-toggle command, which runs code instead of navigating. */
	href?: string;
}

/** Assembles the palette's command list from existing content — no copy is duplicated or hand-maintained here. */
export function buildCommands(
	navLinks: NavLink[],
	socials: ProfileSocial[],
	copy: CommandPaletteCopy
): Command[] {
	return [
		{ id: 'home', label: copy.homeLabel, group: copy.pagesGroupLabel, icon: 'page', href: '/' },
		...navLinks.map((link) => ({
			id: link.href,
			label: link.label,
			group: copy.pagesGroupLabel,
			icon: 'page' as const,
			href: link.href
		})),
		{
			id: 'testimonials',
			label: copy.testimonialsLabel,
			group: copy.pagesGroupLabel,
			icon: 'page',
			href: '/testimonials'
		},
		{
			id: 'resume',
			label: copy.resumeLabel,
			group: copy.resumeGroupLabel,
			icon: 'resume',
			href: '/resume'
		},
		...socials.map((social) => ({
			id: `social-${social.label}`,
			label: social.label,
			group: copy.socialGroupLabel,
			icon: 'social' as const,
			href: social.url
		})),
		{ id: THEME_TOGGLE_COMMAND_ID, label: copy.themeToggleLabel, group: copy.themeGroupLabel }
	];
}
