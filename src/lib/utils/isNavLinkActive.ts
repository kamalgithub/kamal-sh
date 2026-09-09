/** A link is "active" for its own exact path, or any path nested under it — so /work/foo
 *  still highlights the /work nav item, not just an exact /work match. */
export function isNavLinkActive(pathname: string, href: string): boolean {
	return pathname === href || pathname.startsWith(`${href}/`);
}
