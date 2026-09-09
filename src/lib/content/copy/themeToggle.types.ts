export interface ThemeToggleCopy {
	lightLabel: string;
	systemLabel: string;
	darkLabel: string;
	/** Template with a `{theme}` placeholder, e.g. "Change theme (currently {theme})". */
	triggerLabelTemplate: string;
}
