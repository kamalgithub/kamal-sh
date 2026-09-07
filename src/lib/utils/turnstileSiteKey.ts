/**
 * Baked in at build time (see vite.config.ts's `define`, sourced from wrangler.jsonc's
 * committed, non-secret TURNSTILE_SITE_KEY value) rather than read from `platform.env`.
 * Unlike /contact, the newsletter form is also embedded on /writing, which must stay
 * prerendered and has no request-time env access — so this is the one Turnstile site key
 * source that works on both of its mount points. Empty when Turnstile isn't configured
 * yet, same honest fallback used everywhere else in this codebase.
 */
export const turnstileSiteKey = __TURNSTILE_SITE_KEY__;
