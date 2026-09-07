const ELLIPSIS = '…';

/** Cuts `text` to at most `maxLength` characters at the nearest preceding word boundary,
 *  so truncation never lands mid-word. Text already within the limit is returned as-is. */
export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	const cut = text.slice(0, maxLength);
	const lastSpace = cut.lastIndexOf(' ');
	const boundary = lastSpace > 0 ? cut.slice(0, lastSpace) : cut;
	return `${boundary.trimEnd()}${ELLIPSIS}`;
}
