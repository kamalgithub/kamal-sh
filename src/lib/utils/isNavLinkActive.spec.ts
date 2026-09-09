import { describe, expect, it } from 'vitest';
import { isNavLinkActive } from './isNavLinkActive';

describe('isNavLinkActive', () => {
	it('matches an exact path', () => {
		expect(isNavLinkActive('/work', '/work')).toBe(true);
	});

	it('matches a nested path under the link', () => {
		expect(isNavLinkActive('/work/aks-migration', '/work')).toBe(true);
	});

	it('does not match an unrelated path that merely shares a prefix', () => {
		expect(isNavLinkActive('/workshop', '/work')).toBe(false);
	});

	it('does not match a sibling path', () => {
		expect(isNavLinkActive('/about', '/work')).toBe(false);
	});

	it('matches the root path only exactly, never as a prefix of everything', () => {
		expect(isNavLinkActive('/', '/')).toBe(true);
		expect(isNavLinkActive('/work', '/')).toBe(false);
	});
});
