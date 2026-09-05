import { describe, expect, it } from 'vitest';
import { getInitials } from './getInitials';

describe('getInitials', () => {
	it('takes the first letter of the first and last word', () => {
		expect(getInitials('Aditya Shah')).toBe('AS');
	});

	it('handles a middle name by ignoring it', () => {
		expect(getInitials('Sraddhananda Jetty')).toBe('SJ');
	});

	it('falls back to a single letter for a one-word name', () => {
		expect(getInitials('Cher')).toBe('C');
	});

	it('collapses extra whitespace', () => {
		expect(getInitials('  Ada   Lovelace  ')).toBe('AL');
	});

	it('returns an empty string for an empty name', () => {
		expect(getInitials('')).toBe('');
	});
});
