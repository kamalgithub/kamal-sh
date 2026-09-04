/** Returns the `count` most recent items, newest first, by the date `dateOf` reads off each item. */
export function takeLatest<T>(items: T[], dateOf: (item: T) => string, count: number): T[] {
	return [...items]
		.sort((a, b) => new Date(dateOf(b)).getTime() - new Date(dateOf(a)).getTime())
		.slice(0, count);
}
