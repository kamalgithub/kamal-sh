import { describe, expect, it } from 'vitest';
import { buildRootCliResponse } from './buildRootCliResponse';

function request(userAgent: string): Request {
	return new Request('https://kamal.sh/', { headers: { 'user-agent': userAgent } });
}

describe('buildRootCliResponse', () => {
	it('returns a colored résumé response for a CLI client hitting the root path', async () => {
		const response = buildRootCliResponse(new URL('https://kamal.sh/'), request('curl/8.4.0'));

		expect(response).toBeDefined();
		expect(response?.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
		const body = await response?.text();
		expect(body).toContain('KAMAL KUMAR');
		expect(body).toContain('\x1b[1;94m'); // colored by default — /resume-raw is the plain escape hatch
	});

	it('returns undefined for a real browser, so normal page rendering takes over', () => {
		const response = buildRootCliResponse(
			new URL('https://kamal.sh/'),
			request('Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0 Safari/537.36')
		);
		expect(response).toBeUndefined();
	});

	it('returns undefined for a CLI client hitting any path other than the root', () => {
		const response = buildRootCliResponse(new URL('https://kamal.sh/work'), request('curl/8.4.0'));
		expect(response).toBeUndefined();
	});
});
