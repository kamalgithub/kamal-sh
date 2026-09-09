/** Removes duplicate items by a derived key, keeping whichever occurrence has the latest
 *  date when duplicates disagree. Real-world feeds can list the same post/video twice
 *  (e.g. a republish bumps its timestamp but keeps the same slug/id) — the newest
 *  occurrence is treated as the current, correct one. */
export function dedupeByKeyKeepingLatest<T>(
	items: T[],
	keyOf: (item: T) => string,
	dateOf: (item: T) => string
): T[] {
	const byKey = new Map<string, T>();
	for (const item of items) {
		const key = keyOf(item);
		const existing = byKey.get(key);
		if (!existing || new Date(dateOf(item)).getTime() > new Date(dateOf(existing)).getTime()) {
			byKey.set(key, item);
		}
	}
	return [...byKey.values()];
}
