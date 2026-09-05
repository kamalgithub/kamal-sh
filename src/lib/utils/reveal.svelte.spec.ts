import { describe, expect, it, afterEach } from 'vitest';
import { reveal } from './reveal';

describe('reveal', () => {
	let node: HTMLElement;

	afterEach(() => {
		node?.remove();
	});

	it('hides the element and transitions it into view once it intersects', async () => {
		node = document.createElement('div');
		document.body.appendChild(node);

		const action = reveal(node);
		expect(node.style.opacity).toBe('0');
		expect(node.style.transform).toBe('translateY(8px)');

		action?.destroy?.();
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
