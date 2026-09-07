// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties;
		}

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
	}

	// Injected by vite.config.ts's `define` at build time — see src/lib/utils/buildInfo.ts,
	// the only file allowed to reference these directly. A standalone ambient .d.ts file
	// elsewhere under src/lib wasn't picked up by `svelte-check` (plain `tsc` accepted it
	// fine — svelte-check specifically didn't), so these live here instead, next to
	// App.Platform, the other project-wide ambient declaration svelte-check is verified
	// to actually respect.
	const __BUILD_SHA__: string;
	const __BUILD_DATE__: string;
}

export {};
