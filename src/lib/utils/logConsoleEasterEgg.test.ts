import { afterEach, describe, expect, it, vi } from 'vitest';
import { logConsoleEasterEgg } from './logConsoleEasterEgg';

describe('logConsoleEasterEgg', () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('logs to the console without throwing', () => {
		const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

		expect(() => logConsoleEasterEgg()).not.toThrow();
		expect(logSpy).toHaveBeenCalled();
	});
});
