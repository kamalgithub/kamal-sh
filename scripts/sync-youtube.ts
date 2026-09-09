import { XMLParser } from 'fast-xml-parser';
import { fetchFeedXml, linkHref, toIsoDate, type AtomLink } from './lib/atom';
import { takeLatest } from './lib/take-latest';
import { dedupeByKeyKeepingLatest } from './lib/dedupe';
import { writeGeneratedJson } from './lib/write-generated-json';
import type { YoutubeVideo } from '../src/lib/content/youtube/video.types';

// Stable for the life of the channel — only changes if @aicademy-ac is deleted and recreated.
// To re-derive: view-source the channel page (https://www.youtube.com/@aicademy-ac) and search for "channelId".
const CHANNEL_ID = 'UCsV90U2e5FqsSTMizQCH4vA';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const OUTPUT_PATH = 'src/lib/content/youtube/videos.generated.json';
// YouTube's own feed format hard-caps at the 15 most recent uploads — verified against
// the live feed, and there's no query param or pagination that changes this. This is a
// real ceiling of the data source itself, not a limit this script imposes; getting the
// channel's full upload history would need the YouTube Data API (a new credential + quota),
// not just a wider slice of this feed. This archive output is everything the feed can give.
const ARCHIVE_OUTPUT_PATH = 'src/lib/content/youtube/videos-archive.generated.json';
const VIDEO_COUNT = 8;

interface YoutubeEntry {
	title: string;
	videoId?: string;
	link: AtomLink | AtomLink[];
	published?: string;
	updated?: string;
	group?: { thumbnail?: { '@_url'?: string } };
}

interface YoutubeFeed {
	feed?: { entry?: YoutubeEntry | YoutubeEntry[] };
}

async function main() {
	const xml = await fetchFeedXml(FEED_URL);

	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: '@_',
		removeNSPrefix: true,
		isArray: (name) => name === 'entry'
	});
	const parsed = parser.parse(xml) as YoutubeFeed;
	const entries = parsed.feed?.entry;
	if (!Array.isArray(entries) || entries.length === 0) {
		throw new Error(`no entries found in ${FEED_URL}`);
	}

	const rawVideos: YoutubeVideo[] = entries.map((entry) => {
		if (!entry.videoId) throw new Error(`entry "${entry.title}" is missing a videoId`);
		const thumbnail = entry.group?.thumbnail?.['@_url'];
		if (!thumbnail) throw new Error(`entry "${entry.title}" is missing a thumbnail`);
		return {
			title: entry.title,
			link: linkHref(entry.link),
			videoId: entry.videoId,
			publishedAt: toIsoDate(entry.published ?? entry.updated, entry.title),
			thumbnail
		};
	});
	// Defense-in-depth, matching sync-blog.ts — videoId collisions are unlikely from
	// YouTube's own feed, but videoId is this video's unique identity everywhere
	// downstream (command IDs in the palette), so it's enforced here regardless.
	const videos = dedupeByKeyKeepingLatest(
		rawVideos,
		(video) => video.videoId,
		(video) => video.publishedAt
	);

	const latest = takeLatest(videos, (video) => video.publishedAt, VIDEO_COUNT);
	await writeGeneratedJson(OUTPUT_PATH, latest);
	console.log(`synced ${latest.length} videos to ${OUTPUT_PATH}`);

	const archive = takeLatest(videos, (video) => video.publishedAt, videos.length);
	await writeGeneratedJson(ARCHIVE_OUTPUT_PATH, archive);
	console.log(`synced ${archive.length} videos to ${ARCHIVE_OUTPUT_PATH} (full archive)`);
}

main().catch((error: unknown) => {
	console.error(`sync-youtube failed: ${error instanceof Error ? error.message : String(error)}`);
	console.error('leaving the existing videos.generated.json untouched.');
	process.exit(1);
});
