export const site = {
	name: 'kamal.sh',
	url: 'https://kamal.sh',
	skipToContentLabel: 'Skip to content'
};

/** Every static route this site has, read by `sitemap.xml/+server.ts` to build the sitemap.
 *  Includes routes that aren't in `nav`/`footerLinks` (`/`, `/testimonials`, `/newsletter`,
 *  `/resume-print` — reachable some other way: the logo, a home-page section, an embedded
 *  form, the command palette) as well as every nav/footer link — `site.spec.ts` asserts the
 *  latter, so a new page added to nav/footerLinks fails that spec until it's added here too. */
export const siteRoutes = [
	'/',
	'/work',
	'/architecture',
	'/building',
	'/writing',
	'/about',
	'/testimonials',
	'/contact',
	'/newsletter',
	'/now',
	'/uses',
	'/changelog',
	'/status',
	'/resume-print',
	'/security',
	'/costs',
	'/postmortems'
];
