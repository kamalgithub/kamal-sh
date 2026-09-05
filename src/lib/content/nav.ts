import type { NavLink } from './nav.types';

export const nav: NavLink[] = [
	{ label: 'Work', href: '/work' },
	{ label: 'Architecture', href: '/architecture' },
	{ label: 'Building', href: '/building' },
	{ label: 'Writing', href: '/writing' },
	{ label: 'About', href: '/about' },
	{ label: 'Contact', href: '/contact' }
];

/** Secondary, lower-traffic links — rendered in the footer, not the primary nav. */
export const footerLinks: NavLink[] = [
	{ label: 'Security', href: '/security' },
	{ label: 'Costs', href: '/costs' },
	{ label: 'Postmortems', href: '/postmortems' }
];
