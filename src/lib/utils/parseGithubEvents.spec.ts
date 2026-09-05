import { describe, expect, it } from 'vitest';
import { parseGithubEvents } from './parseGithubEvents';

describe('parseGithubEvents', () => {
	it('summarizes each supported event type', () => {
		const items = parseGithubEvents([
			{
				id: '1',
				type: 'PushEvent',
				repo: { name: 'devcrypted/portfolio-new' },
				created_at: '2026-01-01T00:00:00Z',
				payload: { commits: [{}, {}] }
			},
			{
				id: '2',
				type: 'PullRequestEvent',
				repo: { name: 'devcrypted/aicademycli' },
				created_at: '2026-01-02T00:00:00Z',
				payload: { action: 'opened' }
			},
			{
				id: '3',
				type: 'ReleaseEvent',
				repo: { name: 'devcrypted/aicademycli' },
				created_at: '2026-01-03T00:00:00Z',
				payload: { release: { tag_name: 'v1.2.0' } }
			}
		]);

		expect(items).toEqual([
			{
				id: '1',
				repo: 'devcrypted/portfolio-new',
				summary: 'Pushed 2 commits',
				icon: 'commit',
				url: 'https://github.com/devcrypted/portfolio-new',
				createdAt: '2026-01-01T00:00:00Z'
			},
			{
				id: '2',
				repo: 'devcrypted/aicademycli',
				summary: 'Opened a pull request',
				icon: 'pullRequest',
				url: 'https://github.com/devcrypted/aicademycli',
				createdAt: '2026-01-02T00:00:00Z'
			},
			{
				id: '3',
				repo: 'devcrypted/aicademycli',
				summary: 'Published release v1.2.0',
				icon: 'release',
				url: 'https://github.com/devcrypted/aicademycli',
				createdAt: '2026-01-03T00:00:00Z'
			}
		]);
	});

	it('picks a distinct icon for repo/branch/tag creation, not one generic icon', () => {
		const items = parseGithubEvents([
			{
				id: '1',
				type: 'CreateEvent',
				repo: { name: 'someone/repo' },
				created_at: '2026-01-01T00:00:00Z',
				payload: { ref_type: 'repository' }
			},
			{
				id: '2',
				type: 'CreateEvent',
				repo: { name: 'someone/repo' },
				created_at: '2026-01-01T00:00:00Z',
				payload: { ref_type: 'branch' }
			},
			{
				id: '3',
				type: 'CreateEvent',
				repo: { name: 'someone/repo' },
				created_at: '2026-01-01T00:00:00Z',
				payload: { ref_type: 'tag' }
			}
		]);

		expect(items.map((item) => item.icon)).toEqual(['repo', 'branch', 'tag']);
	});

	it('drops event types it does not know how to summarize', () => {
		const items = parseGithubEvents([
			{
				id: '1',
				type: 'WatchEvent',
				repo: { name: 'someone/repo' },
				created_at: '2026-01-01T00:00:00Z',
				payload: {}
			}
		]);
		expect(items).toEqual([]);
	});

	it('drops a push event with zero commits rather than showing an empty summary', () => {
		const items = parseGithubEvents([
			{
				id: '1',
				type: 'PushEvent',
				repo: { name: 'someone/repo' },
				created_at: '2026-01-01T00:00:00Z',
				payload: { commits: [] }
			}
		]);
		expect(items).toEqual([]);
	});

	it('is defensive against malformed API responses', () => {
		expect(parseGithubEvents(null)).toEqual([]);
		expect(parseGithubEvents(undefined)).toEqual([]);
		expect(parseGithubEvents({})).toEqual([]);
		expect(parseGithubEvents([{ id: '1' }])).toEqual([]);
		expect(
			parseGithubEvents([{ id: '1', type: 'PushEvent', repo: {}, created_at: 'x', payload: {} }])
		).toEqual([]);
	});

	it('caps results at the given limit', () => {
		const events = Array.from({ length: 10 }, (_, i) => ({
			id: String(i),
			type: 'CreateEvent',
			repo: { name: 'someone/repo' },
			created_at: '2026-01-01T00:00:00Z',
			payload: { ref_type: 'branch' }
		}));
		expect(parseGithubEvents(events, 3)).toHaveLength(3);
	});
});
