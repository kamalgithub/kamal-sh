import { XMLParser } from 'fast-xml-parser';
import { fetchFeedXml, linkHref, toIsoDate, type AtomLink } from './lib/atom';
import { takeLatest } from './lib/take-latest';
import { dedupeByKeyKeepingLatest } from './lib/dedupe';
import { writeGeneratedJson } from './lib/write-generated-json';
import type { WritingPost } from '../src/lib/content/writing/writing.types';

const FEED_URL = 'https://blog.aicademy.ac/feed.xml';
const OUTPUT_PATH = 'src/lib/content/writing/posts.generated.json';
// Every post the feed returns, not a recent slice — Jekyll's feed.xml here isn't capped
// the way YouTube's is (verified: it returns the same full history as the blog's own
// sitemap.xml), so this is a genuine complete archive, used only for command-palette
// search. /writing's own display still reads the small, curated file above.
const ARCHIVE_OUTPUT_PATH = 'src/lib/content/writing/posts-archive.generated.json';
const POST_COUNT = 8;

interface BlogEntry {
	title: string;
	link: AtomLink | AtomLink[];
	published?: string;
	updated?: string;
}

interface BlogFeed {
	feed?: { entry?: BlogEntry | BlogEntry[] };
}

function slugFromLink(link: string): string {
	const segments = new URL(link).pathname.split('/').filter(Boolean);
	const slug = segments.at(-1);
	if (!slug) throw new Error(`could not derive a slug from link: ${link}`);
	return slug;
}

async function main() {
	const xml = await fetchFeedXml(FEED_URL);

	const parser = new XMLParser({
		ignoreAttributes: false,
		attributeNamePrefix: '@_',
		isArray: (name) => name === 'entry'
	});
	const parsed = parser.parse(xml) as BlogFeed;
	const entries = parsed.feed?.entry;
	if (!Array.isArray(entries) || entries.length === 0) {
		throw new Error(`no entries found in ${FEED_URL}`);
	}

	const rawPosts: WritingPost[] = entries.map((entry) => {
		const link = linkHref(entry.link);
		const slug = slugFromLink(link);
		return {
			title: entry.title,
			link,
			pubDate: toIsoDate(entry.published ?? entry.updated, entry.title),
			slug,
			thumbnail: `https://blog.aicademy.ac/assets/img/${slug}.webp`
		};
	});
	// A republished post can appear twice in the feed with the same slug but a different
	// timestamp — slug is used as this post's unique identity everywhere downstream
	// (command IDs in the palette), so it must be unique here first.
	const posts = dedupeByKeyKeepingLatest(
		rawPosts,
		(post) => post.slug,
		(post) => post.pubDate
	);

	const latest = takeLatest(posts, (post) => post.pubDate, POST_COUNT);
	await writeGeneratedJson(OUTPUT_PATH, latest);
	console.log(`synced ${latest.length} blog posts to ${OUTPUT_PATH}`);

	const archive = takeLatest(posts, (post) => post.pubDate, posts.length);
	await writeGeneratedJson(ARCHIVE_OUTPUT_PATH, archive);
	console.log(`synced ${archive.length} blog posts to ${ARCHIVE_OUTPUT_PATH} (full archive)`);
}

main().catch((error: unknown) => {
	console.error(`sync-blog failed: ${error instanceof Error ? error.message : String(error)}`);
	console.error('leaving the existing posts.generated.json untouched.');
	process.exit(1);
});
