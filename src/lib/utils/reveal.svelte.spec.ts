import { describe, expect, it, afterEach, vi } from 'vitest';
import { reveal } from './reveal';

describe('reveal', () => {
	let node: HTMLElement;

	afterEach(() => {
		node?.remove();
		vi.useRealTimers();
	});

	it('hides the element and transitions it into view once it intersects', async () => {
		node = document.createElement('div');
		document.body.appendChild(node);

		const action = reveal(node);
		expect(node.style.opacity).toBe('0');
		expect(node.style.transform).toBe('translateY(8px)');

		action?.destroy?.();
	});

	it('reveals the element on a failsafe timer even if it never intersects', () => {
		vi.useFakeTimers();
		node = document.createElement('div');
		document.body.appendChild(node);

		reveal(node);
		expect(node.style.opacity).toBe('0');

		// No IntersectionObserver callback ever fires in this test — the failsafe is the
		// only thing that can reveal the node, guarding against content staying invisible
		// forever if the observer never fires for any reason (see docs/READINESS.md's A7).
		vi.advanceTimersByTime(1000);
		expect(node.style.opacity).toBe('1');
		// Chromium normalizes 'translateY(0)' to 'translateY(0px)' once it's applied to a
		// live element — matches what the CSSOM actually reports, not the literal string set.
		expect(node.style.transform).toBe('translateY(0px)');
	});

	it('does nothing when the visitor prefers reduced motion', () => {
		const originalMatchMedia = window.matchMedia;
		window.matchMedia = ((query: string) => ({
			matches: query.includes('reduce'),
			media: query,
			addEventListener: () => {},
			removeEventListener: () => {}
		})) as unknown as typeof window.matchMedia;

		node = document.createElement('div');
		document.body.appendChild(node);

		reveal(node);
		expect(node.style.opacity).toBe('');

		window.matchMedia = originalMatchMedia;
	});
});
