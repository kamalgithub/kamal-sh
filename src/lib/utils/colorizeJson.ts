/**
 * ANSI-colorizes pretty-printed JSON for terminal viewing — deliberately a few targeted
 * regexes over our own trusted, known-shaped data (profile/experience/education/
 * certifications), not a general JSON tokenizer. That would be real extra complexity
 * for content we author ourselves and know doesn't contain adversarial patterns like a
 * literal `": "` inside a string value. Once colorized, the output is no longer valid
 * JSON (the escape codes break parsing) — that's why this is served as text/plain at
 * /json, with /json/raw and /resume.json as the actual application/json endpoints.
 */
const ANSI = {
	reset: '\x1b[0m',
	key: '\x1b[36m', // cyan
	string: '\x1b[32m', // green
	number: '\x1b[33m', // yellow
	literal: '\x1b[35m' // magenta — true/false/null
};

export function colorizeJson(value: unknown): string {
	const json = JSON.stringify(value, null, 2);
	return json
		.replace(/"([^"\\]*(?:\\.[^"\\]*)*)":/g, `${ANSI.key}"$1"${ANSI.reset}:`)
		.replace(/: "([^"\\]*(?:\\.[^"\\]*)*)"/g, `: ${ANSI.string}"$1"${ANSI.reset}`)
		.replace(/: (-?\d+(?:\.\d+)?)/g, `: ${ANSI.number}$1${ANSI.reset}`)
		.replace(/: (true|false|null)/g, `: ${ANSI.literal}$1${ANSI.reset}`);
}
