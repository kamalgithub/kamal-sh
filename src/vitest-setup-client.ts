import { afterEach } from 'vitest';
import { cleanup } from 'vitest-browser-svelte';
import '../src/routes/layout.css';

// Without this, components rendered by one test stay mounted into the next —
// harmless for tests that only ever render once, but CommandPalette reads
// module-level shared state (commandPaletteState) that persists across tests,
// so a leftover mounted instance from a prior test causes duplicate DOM nodes.
afterEach(() => {
	cleanup();
});
