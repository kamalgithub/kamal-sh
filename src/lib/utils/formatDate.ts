/** 'September 5, 2026' — the one date format used anywhere a visitor reads a date on this site. */
export function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}
