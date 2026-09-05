/** A string key, not a component reference — content data stays framework-agnostic (see buildCommands.ts's CommandIcon for the same pattern). */
export type GithubActivityIcon =
	'commit' | 'branch' | 'repo' | 'tag' | 'pullRequest' | 'issue' | 'release';

/** Display-ready shape the About page actually renders — everything else about the raw GitHub event is discarded. */
export interface GithubActivityItem {
	id: string;
	repo: string;
	summary: string;
	icon: GithubActivityIcon;
	url: string;
	createdAt: string;
}

const SUPPORTED_EVENT_TYPES = new Set([
	'PushEvent',
	'PullRequestEvent',
	'IssuesEvent',
	'CreateEvent',
	'ReleaseEvent'
]);

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function summarize(type: string, payload: Record<string, unknown>): string | undefined {
	if (type === 'PushEvent') {
		const commits = Array.isArray(payload.commits) ? payload.commits.length : 0;
		if (commits === 0) return undefined;
		return commits === 1 ? 'Pushed 1 commit' : `Pushed ${commits} commits`;
	}
	if (type === 'PullRequestEvent') {
		const action = typeof payload.action === 'string' ? payload.action : undefined;
		if (!action) return undefined;
		return `${action[0]?.toUpperCase()}${action.slice(1)} a pull request`;
	}
	if (type === 'IssuesEvent') {
		const action = typeof payload.action === 'string' ? payload.action : undefined;
		if (!action) return undefined;
		return `${action[0]?.toUpperCase()}${action.slice(1)} an issue`;
	}
	if (type === 'CreateEvent') {
		const refType = typeof payload.ref_type === 'string' ? payload.ref_type : undefined;
		if (!refType) return undefined;
		return `Created a new ${refType}`;
	}
	if (type === 'ReleaseEvent') {
		const release = isRecord(payload.release) ? payload.release : undefined;
		const tag = release && typeof release.tag_name === 'string' ? release.tag_name : undefined;
		return tag ? `Published release ${tag}` : 'Published a release';
	}
	return undefined;
}

/** Assumes `type` is one of SUPPORTED_EVENT_TYPES — the CreateEvent branch falls back to
 *  'branch' for a ref_type other than the three GitHub currently documents (repository/branch/tag). */
function iconFor(type: string, payload: Record<string, unknown>): GithubActivityIcon {
	if (type === 'PushEvent') return 'commit';
	if (type === 'PullRequestEvent') return 'pullRequest';
	if (type === 'IssuesEvent') return 'issue';
	if (type === 'ReleaseEvent') return 'release';
	const refType = typeof payload.ref_type === 'string' ? payload.ref_type : undefined;
	if (refType === 'repository') return 'repo';
	if (refType === 'tag') return 'tag';
	return 'branch';
}

/** Defensive by necessity — this is an unauthenticated third-party API response, not our own typed content. */
export function parseGithubEvents(raw: unknown, limit = 6): GithubActivityItem[] {
	if (!Array.isArray(raw)) return [];

	const items: GithubActivityItem[] = [];
	for (const event of raw) {
		if (items.length >= limit) break;
		if (!isRecord(event)) continue;

		const { id, type, repo, created_at: createdAt, payload } = event;
		if (typeof id !== 'string' || typeof type !== 'string' || typeof createdAt !== 'string')
			continue;
		if (!isRecord(repo) || typeof repo.name !== 'string') continue;
		if (!SUPPORTED_EVENT_TYPES.has(type) || !isRecord(payload)) continue;

		const summary = summarize(type, payload);
		if (!summary) continue;

		items.push({
			id,
			repo: repo.name,
			summary,
			icon: iconFor(type, payload),
			url: `https://github.com/${repo.name}`,
			createdAt
		});
	}
	return items;
}
