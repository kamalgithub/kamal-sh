/**
 * Every mainstream browser's User-Agent includes "Mozilla" — a holdover from the 1990s
 * browser wars that every vendor still ships for compatibility. curl, wget, httpie, and
 * virtually every other CLI HTTP client's default User-Agent does not, and a request
 * with no User-Agent at all is certainly not a real browser either. This is deliberately
 * one broad check rather than a list of known tool names — an allowlist of
 * "curl/wget/httpie" could never keep up with "any CLI tool."
 *
 * One explicit exception: PowerShell's Invoke-WebRequest/iwr defaults to a User-Agent
 * that *does* include "Mozilla/5.0" (inherited from old Internet Explorer's UA string),
 * so the broad rule alone would misclassify it as a browser.
 */
export function isCliRequest(request: Request): boolean {
	const userAgent = request.headers.get('user-agent') ?? '';
	if (userAgent.includes('PowerShell')) return true;
	return !userAgent.includes('Mozilla');
}
