import { describe, expect, it } from 'vitest';
import { isCliRequest } from './isCliRequest';

function requestWithUserAgent(userAgent: string | undefined): Request {
	const headers = new Headers();
	if (userAgent !== undefined) headers.set('user-agent', userAgent);
	return new Request('https://kamal.sh/', { headers });
}

describe('isCliRequest', () => {
	it('treats real browser user-agents as not-CLI', () => {
		expect(
			isCliRequest(
				requestWithUserAgent(
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
				)
			)
		).toBe(false);
		expect(
			isCliRequest(
				requestWithUserAgent(
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Safari/605.1.15'
				)
			)
		).toBe(false);
	});

	it('treats known CLI tools as CLI', () => {
		expect(isCliRequest(requestWithUserAgent('curl/8.4.0'))).toBe(true);
		expect(isCliRequest(requestWithUserAgent('Wget/1.21.3'))).toBe(true);
		expect(isCliRequest(requestWithUserAgent('python-requests/2.31.0'))).toBe(true);
	});

	it('treats PowerShell as CLI even though its default User-Agent includes "Mozilla"', () => {
		expect(
			isCliRequest(
				requestWithUserAgent(
					'Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.19041.1320'
				)
			)
		).toBe(true);
		expect(isCliRequest(requestWithUserAgent('Mozilla/5.0 (Windows NT; ) PowerShell/7.4.0'))).toBe(
			true
		);
	});

	it('treats a missing User-Agent header as CLI, not as an unknown browser', () => {
		expect(isCliRequest(requestWithUserAgent(undefined))).toBe(true);
	});
});
