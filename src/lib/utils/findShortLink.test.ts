import { describe, expect, it } from 'vitest';
import { findShortLink } from './findShortLink';
import { shortLinks } from '$lib/content/shortlinks';

describe('findShortLink', () => {
	it('resolves every configured slug to its real URL', () => {
		for (const link of shortLinks) {
			expect(findShortLink(link.slug)).toBe(link.url);
		}
	});

	it('returns undefined for a slug that is not configured', () => {
		expect(findShortLink('definitely-not-a-real-shortlink')).toBeUndefined();
	});
});
