import { describe, expect, it } from 'vitest';
import { truncateText } from './truncateText';

describe('truncateText', () => {
	it('returns text unchanged when it is already within the limit', () => {
		expect(truncateText('short quote', 150)).toBe('short quote');
	});

	it('returns text unchanged when it is exactly at the limit', () => {
		const text = 'a'.repeat(150);
		expect(truncateText(text, 150)).toBe(text);
	});

	it('cuts at the nearest word boundary and appends an ellipsis', () => {
		const text = 'The quick brown fox jumps over the lazy dog and keeps running';
		expect(truncateText(text, 20)).toBe('The quick brown fox…');
	});

	it('falls back to a hard cut when there is no earlier space', () => {
		const text = 'supercalifragilisticexpialidocious';
		expect(truncateText(text, 10)).toBe('supercalif…');
	});
});
