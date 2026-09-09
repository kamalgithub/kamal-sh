import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';

// Not every build environment is a git checkout (or has git installed) — 'unknown'
// is an honest fallback, never a guessed commit hash. See src/lib/utils/buildInfo.ts.
function getGitSha(): string {
	try {
		return execSync('git rev-parse --short HEAD').toString().trim();
	} catch {
		return 'unknown';
	}
}

// TURNSTILE_SITE_KEY is public/non-secret by design (Cloudflare's own model — it's meant
// to be embedded in page HTML) and already committed in wrangler.jsonc's `vars`. Reading
// it here — rather than only via `platform.env` at request time — lets the newsletter
// form's Turnstile widget render on /writing, which must stay prerendered and has no
// env access at request time. A small regex, not a full JSONC parse, since this is the
// one value we need and adding a parser dependency for it isn't worth it.
function getTurnstileSiteKey(): string {
	try {
		const wranglerConfig = readFileSync('wrangler.jsonc', 'utf-8');
		return wranglerConfig.match(/"TURNSTILE_SITE_KEY"\s*:\s*"([^"]*)"/)?.[1] ?? '';
	} catch {
		return '';
	}
}

export default defineConfig({
	define: {
		__BUILD_SHA__: JSON.stringify(getGitSha()),
		__BUILD_DATE__: JSON.stringify(new Date().toISOString()),
		__TURNSTILE_SITE_KEY__: JSON.stringify(getTurnstileSiteKey())
	},
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter: adapter()
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					setupFiles: ['./src/vitest-setup-client.ts'],
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					// scripts/lib holds pure, build-time-only helpers (feed parsing, dedup, etc.)
					// used by the content-sync scripts — same testing bar as src/lib/utils, just
					// outside src/ since nothing under scripts/ ships in the deployed app.
					include: ['src/**/*.{test,spec}.{js,ts}', 'scripts/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
