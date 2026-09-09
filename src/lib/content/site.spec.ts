import { describe, expect, it } from 'vitest';
import { siteRoutes } from './site';
import { nav, footerLinks } from './nav';

// A new page added to nav/footerLinks without a matching siteRoutes entry would otherwise
// be a silent sitemap drop — this fails loudly instead. See site.ts's siteRoutes comment.
describe('siteRoutes covers every nav and footer link', () => {
	it.each([...nav, ...footerLinks])('includes $href', ({ href }) => {
		expect(siteRoutes).toContain(href);
	});
});
