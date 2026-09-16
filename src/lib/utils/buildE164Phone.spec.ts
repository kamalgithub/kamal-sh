import { describe, expect, it } from 'vitest';
import { buildE164Phone, E164_PATTERN } from './buildE164Phone';

describe('buildE164Phone', () => {
	it('combines a country dial code with a local number', () => {
		expect(buildE164Phone('IN', '9876543210')).toBe('+919876543210');
	});

	it('strips spaces, dashes, and parens from the local number', () => {
		expect(buildE164Phone('US', '(212) 555-0143')).toBe('+12125550143');
	});

	it('returns undefined for an unrecognized country', () => {
		expect(buildE164Phone('XX', '9876543210')).toBeUndefined();
	});

	it('returns undefined for an empty local number', () => {
		expect(buildE164Phone('IN', '')).toBeUndefined();
		expect(buildE164Phone('IN', '   ')).toBeUndefined();
	});

	it('returns undefined when the combined number exceeds E.164 length', () => {
		expect(buildE164Phone('IN', '9'.repeat(20))).toBeUndefined();
	});
});

describe('E164_PATTERN', () => {
	it('matches valid E.164 numbers', () => {
		expect(E164_PATTERN.test('+919876543210')).toBe(true);
		expect(E164_PATTERN.test('+12125550143')).toBe(true);
	});

	it('rejects numbers without a leading +, with a leading zero, or too long', () => {
		expect(E164_PATTERN.test('919876543210')).toBe(false);
		expect(E164_PATTERN.test('+0123456789')).toBe(false);
		expect(E164_PATTERN.test('+' + '9'.repeat(16))).toBe(false);
	});
});
