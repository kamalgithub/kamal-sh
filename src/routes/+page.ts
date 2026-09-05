// Overrides the site-wide prerender default (see src/routes/+layout.ts) for just this
// route: `curl kamal.sh` needs a real per-request User-Agent check (src/hooks.server.ts),
// which only runs for routes that go through the Worker's SSR path — a prerendered page
// is served straight from static assets and never reaches hooks.server.ts at all. See
// docs/architecture.md's "Live external data" / CLI-resume section for the full tradeoff.
export const prerender = false;
