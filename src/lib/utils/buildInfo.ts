/**
 * Baked in at build time (see vite.config.ts's `define`) — the deployed Worker has no
 * git or filesystem access at request time, so this can't be computed live. `sha` is
 * 'unknown' when git isn't available in the build environment (see vite.config.ts),
 * never a guessed/placeholder value.
 */
export const buildInfo = {
	sha: __BUILD_SHA__,
	date: __BUILD_DATE__
};
