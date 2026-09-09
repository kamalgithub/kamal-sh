/**
 * Svelte action: fades and lifts an element into place the first time it
 * crosses into the viewport. No-ops entirely under `prefers-reduced-motion`,
 * and disconnects its observer after the first reveal (one-shot — this is an
 * entrance animation, not a persistent scroll effect).
 */

const REVEAL_DISTANCE_PX = 8;
const REVEAL_THRESHOLD = 0.15;
const REVEAL_ROOT_MARGIN = '0px 0px -40px 0px';
// Content must never depend on JS to become visible — if the observer is slow, never
// fires, or hydration hiccups, this forces a reveal anyway so nothing stays hidden
// indefinitely. Comfortably longer than hydration should ever take, short enough that a
// visitor who never scrolls still sees the whole page within about a second.
const REVEAL_FAILSAFE_MS = 1000;

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

	let revealed = false;
	function show() {
		if (revealed) return;
		revealed = true;
		node.style.opacity = '1';
		node.style.transform = 'translateY(0)';
		observer.disconnect();
		clearTimeout(failsafe);
	}

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) show();
		},
		{ threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN }
	);
	observer.observe(node);
	const failsafe = setTimeout(show, REVEAL_FAILSAFE_MS);

	return {
		destroy() {
			observer.disconnect();
			clearTimeout(failsafe);
		}
	};
}
