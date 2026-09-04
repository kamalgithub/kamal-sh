/** Shared parsing primitives for the Atom feeds both sync scripts consume. */

export interface AtomLink {
	'@_href': string;
	'@_rel'?: string;
}

/** Atom entries can carry multiple <link> elements; picks the alternate (human-facing) one. */
export function linkHref(link: AtomLink | AtomLink[]): string {
	const links = Array.isArray(link) ? link : [link];
	const alternate = links.find(
		(candidate) => !candidate['@_rel'] || candidate['@_rel'] === 'alternate'
	);
	const href = (alternate ?? links[0])?.['@_href'];
	if (!href) throw new Error('feed entry is missing a link href');
	return href;
}

export function toIsoDate(raw: string | undefined, context: string): string {
	if (!raw) throw new Error(`feed entry "${context}" has no published/updated date`);
	const date = new Date(raw);
	if (Number.isNaN(date.getTime())) {
		throw new Error(`feed entry "${context}" has an invalid date: ${raw}`);
	}
	return date.toISOString();
}

export async function fetchFeedXml(url: string): Promise<string> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`fetching ${url} failed: ${response.status} ${response.statusText}`);
	}
	return response.text();
}
