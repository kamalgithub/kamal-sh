/**
 * Small, dependency-free fuzzy match (the fzf/VS Code style: every query character
 * must appear in the target in order, not necessarily contiguous). Deliberately stops
 * there — it does not correct substitution-style typos (edit distance), which would
 * add real complexity for a list of a dozen-odd commands where subsequence matching
 * already covers abbreviations, skipped letters, and partial typing.
 *
 * Returns a score where higher is a better match, or -1 for no match at all, so a
 * caller can sort matches best-first with a plain numeric sort.
 */
export function fuzzyScore(query: string, target: string): number {
	const q = query.toLowerCase();
	const t = target.toLowerCase();
	if (q === '') return 0;

	const exactIndex = t.indexOf(q);
	if (exactIndex !== -1) {
		// Exact substring beats any subsequence match; an earlier position (especially
		// a prefix match) beats a later one.
		return 1000 - exactIndex;
	}

	let queryIndex = 0;
	let lastMatchIndex = -1;
	let gapPenalty = 0;
	for (let targetIndex = 0; targetIndex < t.length && queryIndex < q.length; targetIndex++) {
		if (t[targetIndex] !== q[queryIndex]) continue;
		if (lastMatchIndex !== -1) gapPenalty += targetIndex - lastMatchIndex - 1;
		lastMatchIndex = targetIndex;
		queryIndex++;
	}

	if (queryIndex < q.length) return -1;
	return 500 - gapPenalty;
}

/** Best score for `query` across every one of a command's searchable strings, or -1 if none match. */
export function bestFuzzyScore(query: string, candidates: string[]): number {
	let best = -1;
	for (const candidate of candidates) {
		const score = fuzzyScore(query, candidate);
		if (score > best) best = score;
	}
	return best;
}
