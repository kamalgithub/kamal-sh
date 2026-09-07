import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { CONTENT_SECURITY_POLICY } from './hooks.server';

// adapter-cloudflare's generated worker serves every prerendered page straight from
// env.ASSETS.fetch(), bypassing handle() entirely — _headers carries the identical CSP
// for those responses, kept in sync with this file by hand. This test is the guard that
// catches drift between the two (see docs/READINESS.md's T1.5).
describe('CSP stays in sync between hooks.server.ts and _headers', () => {
	it('matches the Content-Security-Policy value in the repo-root _headers file', () => {
		const headersFile = readFileSync(new URL('../_headers', import.meta.url), 'utf-8');
		const match = headersFile.match(/^\s*Content-Security-Policy:\s*(.+)$/m);

		expect(match).not.toBeNull();
		expect(match?.[1].trim()).toBe(CONTENT_SECURITY_POLICY);
	});
});
