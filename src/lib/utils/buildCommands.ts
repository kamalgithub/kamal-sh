import type { NavLink } from '$lib/content/nav.types';
import type { ProfileSocial } from '$lib/content/profile.types';
import type { CommandPaletteCopy } from '$lib/content/copy/commandPalette.types';

export const THEME_TOGGLE_COMMAND_ID = 'toggle-theme';

export interface Command {
	id: string;
	label: string;
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
		{ id: 'home', label: copy.homeLabel, href: '/' },
		...navLinks.map((link) => ({ id: link.href, label: link.label, href: link.href })),
		{ id: 'testimonials', label: copy.testimonialsLabel, href: '/testimonials' },
		{ id: 'resume', label: copy.resumeLabel, href: '/resume' },
		...socials.map((social) => ({
			id: `social-${social.label}`,
			label: social.label,
			href: social.url
		})),
		{ id: THEME_TOGGLE_COMMAND_ID, label: copy.themeToggleLabel }
	];
}
