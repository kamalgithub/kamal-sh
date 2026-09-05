import { describe, expect, it, afterEach } from 'vitest';
import { getStoredTheme, applyTheme, getResolvedTheme, toggleLightDark } from './theme';

function mockSystemPrefersDark(prefersDark: boolean) {
	window.matchMedia = ((query: string) => ({
		matches: query.includes('dark') && prefersDark,
		media: query,
		addEventListener: () => {},
		removeEventListener: () => {}
	})) as unknown as typeof window.matchMedia;
}

describe('theme', () => {
	afterEach(() => {
		localStorage.clear();
		document.documentElement.removeAttribute('data-theme');
	});

	it('defaults to system when nothing is stored', () => {
		expect(getStoredTheme()).toBe('system');
	});

	it('applies and persists an explicit light/dark override', () => {
		applyTheme('dark');
		expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
		expect(getStoredTheme()).toBe('dark');

		applyTheme('light');
		expect(document.documentElement.getAttribute('data-theme')).toBe('light');
		expect(getStoredTheme()).toBe('light');
	});

	it('clears the override and storage when set back to system', () => {
		applyTheme('dark');
		applyTheme('system');
		expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
		expect(getStoredTheme()).toBe('system');
	});

	it('ignores a corrupted storage value and falls back to system', () => {
		localStorage.setItem('theme', 'sepia');
		expect(getStoredTheme()).toBe('system');
	});

	describe('getResolvedTheme', () => {
		it('returns the explicit override unchanged when one is set', () => {
			applyTheme('dark');
			expect(getResolvedTheme()).toBe('dark');
		});

		it('resolves against the OS preference when set to system', () => {
			mockSystemPrefersDark(true);
			expect(getResolvedTheme()).toBe('dark');

			mockSystemPrefersDark(false);
			expect(getResolvedTheme()).toBe('light');
		});
	});

	describe('toggleLightDark', () => {
		it('flips an explicit dark override to light and back', () => {
			applyTheme('dark');
			toggleLightDark();
			expect(getStoredTheme()).toBe('light');

			toggleLightDark();
			expect(getStoredTheme()).toBe('dark');
		});

		it('starting from system, flips to the opposite of the resolved appearance', () => {
			mockSystemPrefersDark(true);
			toggleLightDark();
			// System currently resolves dark, so the explicit result should be light.
			expect(getStoredTheme()).toBe('light');
		});
	});
});
