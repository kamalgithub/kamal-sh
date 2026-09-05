/**
 * Three-state theme preference: 'system' defers to prefers-color-scheme (tokens.css
 * handles that with no JS at all); 'light'/'dark' are explicit overrides persisted
 * across visits. Kept framework-agnostic (no Svelte imports) so the FOUC-prevention
 * script in app.html can mirror this same storage contract without a bundle.
 */

export type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';

export function getStoredTheme(): Theme {
	const value = localStorage.getItem(STORAGE_KEY);
	return value === 'light' || value === 'dark' ? value : 'system';
}

export function applyTheme(theme: Theme): void {
	if (theme === 'system') {
		document.documentElement.removeAttribute('data-theme');
		localStorage.removeItem(STORAGE_KEY);
		return;
	}
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem(STORAGE_KEY, theme);
}

export type ResolvedTheme = 'light' | 'dark';

/** What the visitor actually sees right now — resolves 'system' against the OS preference. */
export function getResolvedTheme(): ResolvedTheme {
	const stored = getStoredTheme();
	if (stored !== 'system') return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Flips between light and dark only — for the command palette's quick toggle, which
 * intentionally skips 'system'. The navbar's ThemeToggle dropdown is the full 3-way
 * control; a one-key command is for "just switch it," not "match my OS."
 */
export function toggleLightDark(): void {
	applyTheme(getResolvedTheme() === 'dark' ? 'light' : 'dark');
}
