import { describe, expect, it } from 'vitest';
import { buildCommands } from './buildCommands';
import type { CommandPaletteCopy } from '$lib/content/copy/commandPalette.types';
import type { WritingPost } from '$lib/content/writing/writing.types';
import type { YoutubeVideo } from '$lib/content/youtube/video.types';

const COPY: CommandPaletteCopy = {
	homeLabel: 'Home',
	resumeLabel: 'Resume',
	resumePrintLabel: 'Résumé (printable)',
	testimonialsLabel: 'Testimonials',
	themeToggleLabel: 'Toggle theme',
	searchPlaceholder: 'Search',
	emptyLabel: 'No matching commands.',
	triggerLabel: 'Open command palette',
	triggerHint: '/ or ⌘K',
	pagesGroupLabel: 'Pages',
	resumeGroupLabel: 'Resume',
	socialGroupLabel: 'Social',
	writingGroupLabel: 'Writing',
	videosGroupLabel: 'Videos',
	themeGroupLabel: 'Theme',
	navigateHint: '↑↓ navigate',
	selectHint: '↵ select',
	closeHint: 'esc close'
};

function post(slug: string): WritingPost {
	return {
		title: slug,
		link: `https://blog.example.com/${slug}`,
		pubDate: '2026-01-01',
		slug,
		thumbnail: 'https://example.com/thumb.webp'
	};
}

function video(videoId: string): YoutubeVideo {
	return {
		title: videoId,
		link: `https://youtube.com/watch?v=${videoId}`,
		videoId,
		publishedAt: '2026-01-01',
		thumbnail: 'https://example.com/thumb.jpg'
	};
}

describe('buildCommands', () => {
	it('marks writing posts beyond the idle cap as hiddenWhenIdle, and the rest as visible', () => {
		const posts = Array.from({ length: 12 }, (_, i) => post(`post-${i}`));
		const commands = buildCommands([], [], [], [], posts, [], [], COPY);

		const writingCommands = commands.filter((c) => c.group === COPY.writingGroupLabel);
		expect(writingCommands).toHaveLength(12);
		expect(writingCommands.slice(0, 10).every((c) => !c.hiddenWhenIdle)).toBe(true);
		expect(writingCommands.slice(10).every((c) => c.hiddenWhenIdle === true)).toBe(true);
	});

	it('marks videos beyond the idle cap as hiddenWhenIdle, and the rest as visible', () => {
		const videos = Array.from({ length: 12 }, (_, i) => video(`v${i}`));
		const commands = buildCommands([], [], [], [], [], videos, [], COPY);

		const videoCommands = commands.filter((c) => c.group === COPY.videosGroupLabel);
		expect(videoCommands).toHaveLength(12);
		expect(videoCommands.slice(0, 10).every((c) => !c.hiddenWhenIdle)).toBe(true);
		expect(videoCommands.slice(10).every((c) => c.hiddenWhenIdle === true)).toBe(true);
	});

	it('never marks a page/resume/social/theme command as hiddenWhenIdle', () => {
		const commands = buildCommands([], [], [], [], [], [], [], COPY);
		expect(commands.every((c) => !c.hiddenWhenIdle)).toBe(true);
	});

	it('gives every writing post and video a distinct id, even with an empty archive', () => {
		const commands = buildCommands([], [], [], [], [post('a'), post('b')], [video('x')], [], COPY);
		const ids = commands.map((c) => c.id);
		expect(new Set(ids).size).toBe(ids.length);
	});
});
