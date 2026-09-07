import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import { caseStudies } from '../src/lib/content/case-studies';
import { products } from '../src/lib/content/products/products';

// A hand-run, hand-committed generator (like scripts/sync-blog.ts's posts.generated.json)
// rather than a build-time step — case-study/product content changes rarely and by hand,
// so there's no need for @resvg/resvg-js (a build-only devDependency, never shipped to
// the Worker) to run on every `bun run build`. Re-run `bun run generate:og` after adding
// or renaming a case study or product. These are social-preview cards only, independent
// of Figure.svelte's own "photo pending" placeholder in the page body — see
// docs/architecture.md's "Generated OG images" section.
const WIDTH = 1200;
const HEIGHT = 630;
const BG = '#0A0A0A';
const TEXT = '#EBEBEB';
const MUTED = '#9A9A9A';
const ACCENT = '#5C82FF';

function escapeXml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Greedy word-wrap using an approximate average character width for a generic serif
 *  font. This is a branded title card, not typeset body text — resvg has no text-
 *  measurement API to wrap exactly without a loaded, known font, so an approximation
 *  (tuned against this site's actual titles) is the pragmatic choice here. */
function wrapText(text: string, fontSize: number, maxWidth: number, maxLines: number): string[] {
	const avgCharWidth = fontSize * 0.53;
	const maxChars = Math.max(1, Math.floor(maxWidth / avgCharWidth));
	const words = text.split(' ');
	const lines: string[] = [];
	let current = '';

	for (const word of words) {
		const candidate = current ? `${current} ${word}` : word;
		if (candidate.length > maxChars && current) {
			lines.push(current);
			current = word;
		} else {
			current = candidate;
		}
	}
	if (current) lines.push(current);

	if (lines.length > maxLines) {
		const truncated = lines.slice(0, maxLines);
		truncated[maxLines - 1] = truncated[maxLines - 1].replace(/\s*\S*$/, '') + '…';
		return truncated;
	}
	return lines;
}

function renderOgSvg({
	eyebrow,
	title,
	subtitle
}: {
	eyebrow: string;
	title: string;
	subtitle: string;
}): string {
	const fontSize = 56;
	const lineHeight = 68;
	const titleLines = wrapText(title, fontSize, WIDTH - 160, 3);
	const titleStartY = 300 - ((titleLines.length - 1) * lineHeight) / 2;

	const titleTspans = titleLines
		.map(
			(line, i) => `<tspan x="80" y="${titleStartY + i * lineHeight}">${escapeXml(line)}</tspan>`
		)
		.join('');

	return `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
	<rect width="${WIDTH}" height="${HEIGHT}" fill="${BG}" />
	<text x="80" y="90" font-family="ui-monospace, Menlo, Consolas, monospace" font-size="28" font-weight="600">
		<tspan fill="${ACCENT}">$</tspan><tspan fill="${TEXT}"> kamal.sh</tspan>
	</text>
	<text font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="500" fill="${TEXT}">${titleTspans}</text>
	<text x="80" y="${titleStartY + titleLines.length * lineHeight + 26}" font-family="Arial, sans-serif" font-size="26" fill="${MUTED}">${escapeXml(subtitle)}</text>
	<text x="80" y="${HEIGHT - 60}" font-family="Arial, sans-serif" font-size="22" fill="${ACCENT}">${escapeXml(eyebrow)}</text>
</svg>`;
}

function renderPng(svg: string): Buffer {
	const resvg = new Resvg(svg, { font: { loadSystemFonts: true } });
	return resvg.render().asPng();
}

function writeImage(path: string, buffer: Buffer): void {
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, buffer);
	console.log(`Wrote ${path}`);
}

for (const study of caseStudies) {
	const svg = renderOgSvg({ eyebrow: 'Case study', title: study.title, subtitle: study.company });
	writeImage(join('static/images/og/case-studies', `${study.slug}.png`), renderPng(svg));
}

for (const product of products) {
	const svg = renderOgSvg({ eyebrow: 'Building', title: product.name, subtitle: product.tagline });
	writeImage(join('static/images/og/products', `${product.slug}.png`), renderPng(svg));
}

console.log('OG images generated.');
