import { describe, expect, it, vi } from 'vitest';

// Separate file because this mocks $app/environment's `building` to true for every test
// in it — the real bug this guards against: SvelteKit's prerender crawler fetches `/`
// with no browser-like User-Agent, which without this guard gets misclassified as a CLI
// request and breaks the build. See buildRootCliResponse.ts's doc comment.
vi.mock('$app/environment', () => ({ building: true }));

describe('buildRootCliResponse (during build)', () => {
	it('returns undefined even for what looks like a CLI request, so the crawler gets real HTML', async () => {
		const { buildRootCliResponse } = await import('./buildRootCliResponse');

		const response = buildRootCliResponse(
			new URL('https://kamal.sh/'),
			new Request('https://kamal.sh/', { headers: { 'user-agent': '' } })
		);

		expect(response).toBeUndefined();
	});
});
