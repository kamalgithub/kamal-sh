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
	/** Extra search terms a query can match besides the visible label — e.g. "dark"/"light" for Theme. */
	keywords?: string[];
}

/** Hand-curated synonyms for the fixed nav routes — extend here, not by guessing in the fuzzy matcher. */
const NAV_KEYWORDS: Record<string, string[]> = {
	'/work': ['case studies', 'experience', 'projects'],
	'/architecture': ['design', 'platform', 'system design', 'diagram'],
	'/building': ['products', 'tools'],
	'/writing': ['blog', 'posts', 'articles', 'videos'],
	'/about': ['bio', 'education', 'certifications', 'github activity'],
	'/contact': ['email', 'message', 'book', 'call', 'meeting']
};

/** Every social entry always gets 'social' plus whatever's platform-specific here — a
 * platform not listed still gets the shared 'social' keyword, just no extras. */
const SOCIAL_KEYWORDS: Record<string, string[]> = {
	GitHub: ['code', 'repos', 'follow'],
	LinkedIn: ['profile', 'follow', 'network'],
	YouTube: ['videos', 'channel', 'subscribe']
};

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
			href: link.href,
			keywords: NAV_KEYWORDS[link.href]
		})),
		{
			id: 'testimonials',
			label: copy.testimonialsLabel,
			group: copy.pagesGroupLabel,
			icon: 'page',
			href: '/testimonials',
			keywords: ['reviews', 'quotes', 'references']
		},
		{
			id: 'resume',
			label: copy.resumeLabel,
			group: copy.resumeGroupLabel,
			icon: 'resume',
			href: '/resume',
			keywords: ['cv', 'download']
		},
		...socials.map((social) => ({
			id: `social-${social.label}`,
			label: social.label,
			group: copy.socialGroupLabel,
			icon: 'social' as const,
			href: social.url,
			keywords: ['social', ...(SOCIAL_KEYWORDS[social.label] ?? [])]
		})),
		{
			id: THEME_TOGGLE_COMMAND_ID,
			label: copy.themeToggleLabel,
			group: copy.themeGroupLabel,
			keywords: ['dark', 'light', 'color', 'appearance', 'mode', 'system']
		}
	];
}
