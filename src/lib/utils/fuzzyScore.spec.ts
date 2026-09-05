import { describe, expect, it } from 'vitest';
import { fuzzyScore, bestFuzzyScore } from './fuzzyScore';

describe('fuzzyScore', () => {
	it('matches an empty query against anything', () => {
		expect(fuzzyScore('', 'Toggle theme')).toBe(0);
	});

	it('scores an exact substring match higher than a subsequence match', () => {
		const substringScore = fuzzyScore('theme', 'Toggle theme');
		const subsequenceScore = fuzzyScore('tgltheme', 'Toggle theme');
		expect(substringScore).toBeGreaterThan(0);
		expect(subsequenceScore).toBeGreaterThan(0);
		expect(substringScore).toBeGreaterThan(subsequenceScore);
	});

	it('scores an earlier substring match higher than a later one', () => {
		const prefixScore = fuzzyScore('work', 'Work');
		const lateScore = fuzzyScore('work', 'Recent GitHub work');
		expect(prefixScore).toBeGreaterThan(lateScore);
	});

	it('matches skipped-letter subsequences, fzf-style, as long as order is preserved', () => {
		expect(fuzzyScore('tgl', 'Toggle theme')).toBeGreaterThan(-1);
		expect(fuzzyScore('rchtctr', 'Architecture')).toBeGreaterThan(-1);
	});

	it('rejects a subsequence whose required order does not actually exist in the target', () => {
		// The only "l" in "toggle theme" comes before the second "t" (in "theme"),
		// so "t", "t", "l" can never appear as an increasing-index subsequence.
		expect(fuzzyScore('ttl', 'Toggle theme')).toBe(-1);
	});

	it('penalizes gappier subsequence matches relative to tighter ones', () => {
		const tight = fuzzyScore('arch', 'Architecture');
		const gappy = fuzzyScore('acte', 'Architecture');
		expect(tight).toBeGreaterThan(gappy);
	});

	it('returns -1 when the query characters are not all present in order', () => {
		expect(fuzzyScore('xyz', 'Architecture')).toBe(-1);
		expect(fuzzyScore('emoth', 'theme')).toBe(-1); // right letters, wrong order
	});
});

describe('bestFuzzyScore', () => {
	it('picks the best score across every candidate string', () => {
		const score = bestFuzzyScore('dark', ['Toggle theme', 'dark', 'light', 'system']);
		expect(score).toBeGreaterThan(-1);
	});

	it('returns -1 when nothing in the candidate list matches', () => {
		expect(bestFuzzyScore('zzz', ['Toggle theme', 'dark', 'light'])).toBe(-1);
	});
});
