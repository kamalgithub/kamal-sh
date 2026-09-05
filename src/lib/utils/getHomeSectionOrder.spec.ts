import { describe, expect, it } from 'vitest';
import { getHomeSectionOrder } from './getHomeSectionOrder';

describe('getHomeSectionOrder', () => {
	it('returns the default order when there is no ?for= param', () => {
		expect(getHomeSectionOrder(null)).toEqual(['stats', 'building', 'testimonials']);
	});

	it('returns the default order for an unrecognized role instead of throwing', () => {
		expect(getHomeSectionOrder('astronaut')).toEqual(['stats', 'building', 'testimonials']);
	});

	it('reorders for a recognized role', () => {
		expect(getHomeSectionOrder('recruiter')).toEqual(['stats', 'testimonials', 'building']);
		expect(getHomeSectionOrder('engineer')).toEqual(['building', 'stats', 'testimonials']);
	});
});
