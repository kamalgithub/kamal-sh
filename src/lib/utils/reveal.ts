/**
 * Svelte action: fades and lifts an element into place the first time it
 * crosses into the viewport. No-ops entirely under `prefers-reduced-motion`,
 * and disconnects its observer after the first reveal (one-shot — this is an
 * entrance animation, not a persistent scroll effect).
 */

const REVEAL_DISTANCE_PX = 8;
const REVEAL_THRESHOLD = 0.15;
const REVEAL_ROOT_MARGIN = '0px 0px -40px 0px';

interface RevealOptions {
	delayMs?: number;
}

export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	const { delayMs = 0 } = options;

	if (typeof IntersectionObserver === 'undefined') return {};
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return {};

	node.style.opacity = '0';
	node.style.transform = `translateY(${REVEAL_DISTANCE_PX}px)`;
	node.style.transition =
		`opacity var(--duration-base) var(--ease-standard) ${delayMs}ms, ` +
		`transform var(--duration-base) var(--ease-standard) ${delayMs}ms`;

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) return;
			node.style.opacity = '1';
			node.style.transform = 'translateY(0)';
			observer.disconnect();
		},
		{ threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN }
	);
	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
