import { describe, expect, it } from 'vitest';
import { isValidEmail } from './isValidEmail';

describe('isValidEmail', () => {
	it('accepts a normal, well-formed address', () => {
		expect(isValidEmail('ada@example.com')).toBe(true);
	});

	it('rejects an empty string', () => {
		expect(isValidEmail('')).toBe(false);
	});

	it('rejects a string with no @', () => {
		expect(isValidEmail('adaexample.com')).toBe(false);
	});

	it('rejects a string with no domain dot', () => {
		expect(isValidEmail('ada@example')).toBe(false);
	});

	it('rejects an address longer than 254 characters', () => {
		const tooLong = `${'a'.repeat(250)}@example.com`;
		expect(isValidEmail(tooLong)).toBe(false);
	});

	it('accepts an address right at the 254-character limit', () => {
		const local = 'a'.repeat(254 - '@example.com'.length);
		const atLimit = `${local}@example.com`;
		expect(atLimit.length).toBe(254);
		expect(isValidEmail(atLimit)).toBe(true);
	});
});
