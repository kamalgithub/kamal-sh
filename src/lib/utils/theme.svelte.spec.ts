import { describe, expect, it, afterEach } from 'vitest';
import { getStoredTheme, applyTheme } from './theme';

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
});
