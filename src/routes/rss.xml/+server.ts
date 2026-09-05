import posts from '$lib/content/writing/posts.generated.json';
import { profile } from '$lib/content/profile';
import { site } from '$lib/content/site';
import { escapeXml } from '$lib/utils/escapeXml';
import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const items = posts
		.map(
			(post) => `
	<item>
		<title>${escapeXml(post.title)}</title>
		<link>${post.link}</link>
		<guid>${post.link}</guid>
		<pubDate>${new Date(post.pubDate).toUTCString()}</pubDate>
	</item>`
		)
		.join('');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
	<title>${escapeXml(profile.name)} Writing</title>
	<link>${site.url}/writing</link>
	<description>${escapeXml(profile.tagline)}</description>${items}
</channel>
</rss>
`;

	return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
};
