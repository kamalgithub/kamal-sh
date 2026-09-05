/**
 * Plain window CustomEvent name used to ask the command palette to open from
 * anywhere in the tree (a nav button) without prop-drilling a callback through
 * the layout, and without a cross-module reactive store to keep in sync with
 * the dialog's own imperative showModal()/close() calls.
 */
export const COMMAND_PALETTE_OPEN_EVENT = 'command-palette:open';

export function requestCommandPaletteOpen(): void {
	window.dispatchEvent(new Event(COMMAND_PALETTE_OPEN_EVENT));
}
