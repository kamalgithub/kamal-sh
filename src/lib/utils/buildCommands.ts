import type { NavLink } from '$lib/content/nav.types';
import type { ProfileSocial } from '$lib/content/profile.types';
import type { CaseStudy } from '$lib/content/case-studies.types';
import type { Product } from '$lib/content/products/product.types';
import type { WritingPost } from '$lib/content/writing/writing.types';
import type { CommandPaletteCopy } from '$lib/content/copy/commandPalette.types';

export const THEME_TOGGLE_COMMAND_ID = 'toggle-theme';

/** A string key, not a component reference — content data stays framework-agnostic.
 *  'external' covers anything that opens outside this site (a social profile, a blog
 *  post) — see CommandPalette.svelte's run(), which already opens any non-'/' href in a
 *  new tab regardless of which content domain it came from. */
export type CommandIcon = 'page' | 'resume' | 'external';

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
	'/contact': ['email', 'message', 'book', 'call', 'meeting'],
	'/now': ['currently', 'focus'],
	'/uses': ['stack', 'tools', 'setup'],
	'/changelog': ['updates', 'history', 'releases'],
	'/status': ['uptime', 'metrics', 'analytics', 'requests'],
	'/security': ['csp', 'headers', 'vulnerability'],
	'/costs': ['pricing', 'infrastructure spend'],
	'/postmortems': ['incidents', 'outages']
};

/** Every social entry always gets 'social' plus whatever's platform-specific here — a
 * platform not listed still gets the shared 'social' keyword, just no extras. */
const SOCIAL_KEYWORDS: Record<string, string[]> = {
	GitHub: ['code', 'repos', 'follow'],
	LinkedIn: ['profile', 'follow', 'network'],
	YouTube: ['videos', 'channel', 'subscribe']
};

/** Most-recent-first, capped so the palette's idle (no-query) view stays a "site pages"
 *  list, not a full blog archive — /writing itself is where the complete list lives. */
const MAX_WRITING_POSTS_IN_PALETTE = 10;

/** Assembles the palette's command list from existing content — no copy is duplicated or
 *  hand-maintained here. Covers every real page (primary nav + secondary footer links),
 *  not just the primary nav, plus the content one level down (case studies, products,
 *  recent writing) so the palette's search genuinely covers the site, not just its top
 *  navigation. */
export function buildCommands(
	navLinks: NavLink[],
	footerLinks: NavLink[],
	caseStudies: CaseStudy[],
	products: Product[],
	writingPosts: WritingPost[],
	socials: ProfileSocial[],
	copy: CommandPaletteCopy
): Command[] {
	return [
		{ id: 'home', label: copy.homeLabel, group: copy.pagesGroupLabel, icon: 'page', href: '/' },
		...[...navLinks, ...footerLinks].map((link) => ({
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
		...caseStudies.map((study) => ({
			id: `case-study-${study.slug}`,
			label: study.title,
			group: copy.pagesGroupLabel,
			icon: 'page' as const,
			href: `/work/${study.slug}`,
			keywords: [study.company, ...study.technologies]
		})),
		...products.map((product) => ({
			id: `product-${product.slug}`,
			label: product.name,
			group: copy.pagesGroupLabel,
			icon: 'page' as const,
			href: `/building/${product.slug}`,
			keywords: product.highlights
		})),
		...writingPosts.slice(0, MAX_WRITING_POSTS_IN_PALETTE).map((post) => ({
			id: `writing-${post.slug}`,
			label: post.title,
			group: copy.writingGroupLabel,
			icon: 'external' as const,
			href: post.link
		})),
		{
			id: 'resume',
			label: copy.resumeLabel,
			group: copy.resumeGroupLabel,
			icon: 'resume',
			href: '/resume',
			keywords: ['cv', 'download', 'plain text']
		},
		{
			id: 'resume-print',
			label: copy.resumePrintLabel,
			group: copy.resumeGroupLabel,
			icon: 'resume',
			href: '/resume-print',
			keywords: ['cv', 'pdf', 'print']
		},
		...socials.map((social) => ({
			id: `social-${social.label}`,
			label: social.label,
			group: copy.socialGroupLabel,
			icon: 'external' as const,
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
