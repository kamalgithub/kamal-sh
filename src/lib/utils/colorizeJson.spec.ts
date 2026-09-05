import { describe, expect, it } from 'vitest';
import { colorizeJson } from './colorizeJson';

describe('colorizeJson', () => {
	it('wraps keys, string values, numbers, and literals in distinct ANSI codes', () => {
		const output = colorizeJson({ name: 'Ada', age: 30, active: true, nickname: null });

		expect(output).toContain('\x1b[36m"name"\x1b[0m:');
		expect(output).toContain('\x1b[32m"Ada"\x1b[0m');
		expect(output).toContain('\x1b[33m30\x1b[0m');
		expect(output).toContain('\x1b[35mtrue\x1b[0m');
		expect(output).toContain('\x1b[35mnull\x1b[0m');
	});

	it('still contains the real values once the ANSI codes are stripped', () => {
		const output = colorizeJson({ role: 'Analyst', years: 8 });
		// eslint-disable-next-line no-control-regex -- stripping the ANSI codes this function just added
		const stripped = output.replace(/\x1b\[\d+m/g, '');
		const parsed = JSON.parse(stripped);
		expect(parsed).toEqual({ role: 'Analyst', years: 8 });
	});

	it('preserves nested structure (arrays and objects) unchanged aside from coloring', () => {
		const output = colorizeJson({ items: [{ id: 1 }, { id: 2 }] });
		// eslint-disable-next-line no-control-regex -- stripping the ANSI codes this function just added
		const stripped = output.replace(/\x1b\[\d+m/g, '');
		expect(JSON.parse(stripped)).toEqual({ items: [{ id: 1 }, { id: 2 }] });
	});
});
