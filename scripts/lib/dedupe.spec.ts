import { describe, expect, it } from 'vitest';
import { dedupeByKeyKeepingLatest } from './dedupe';

interface Item {
	slug: string;
	pubDate: string;
}

describe('dedupeByKeyKeepingLatest', () => {
	it('keeps a single item unchanged', () => {
		const items: Item[] = [{ slug: 'a', pubDate: '2026-01-01' }];
		expect(
			dedupeByKeyKeepingLatest(
				items,
				(i) => i.slug,
				(i) => i.pubDate
			)
		).toEqual(items);
	});

	it('drops the older duplicate, keeping the newer occurrence by date', () => {
		const older: Item = { slug: 'a', pubDate: '2026-01-01' };
		const newer: Item = { slug: 'a', pubDate: '2026-06-01' };

		expect(
			dedupeByKeyKeepingLatest(
				[older, newer],
				(i) => i.slug,
				(i) => i.pubDate
			)
		).toEqual([newer]);
		expect(
			dedupeByKeyKeepingLatest(
				[newer, older],
				(i) => i.slug,
				(i) => i.pubDate
			)
		).toEqual([newer]);
	});

	it('leaves distinct keys untouched', () => {
		const items: Item[] = [
			{ slug: 'a', pubDate: '2026-01-01' },
			{ slug: 'b', pubDate: '2026-02-01' }
		];
		expect(
			dedupeByKeyKeepingLatest(
				items,
				(i) => i.slug,
				(i) => i.pubDate
			)
		).toEqual(items);
	});
});
