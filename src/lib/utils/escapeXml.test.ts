import { describe, expect, it } from 'vitest';
import { escapeXml } from './escapeXml';

describe('escapeXml', () => {
	it('escapes ampersands and angle brackets', () => {
		expect(escapeXml('Docker & Kubernetes: <intro>')).toBe(
			'Docker &amp; Kubernetes: &lt;intro&gt;'
		);
	});

	it('leaves plain text untouched', () => {
		expect(escapeXml('Plain title')).toBe('Plain title');
	});
});
