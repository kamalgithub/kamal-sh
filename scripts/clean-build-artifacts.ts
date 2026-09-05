import { rmSync } from 'node:fs';

const BUILD_ARTIFACT_DIRS = [
	'.svelte-kit/cloudflare',
	'.svelte-kit/cloudflare-tmp',
	'.svelte-kit/output'
];

for (const dir of BUILD_ARTIFACT_DIRS) {
	rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });
}
