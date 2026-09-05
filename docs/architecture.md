# Architecture

> Update this file when the folder structure, routing strategy, or dual-native pattern changes — not when you just add a file that follows the existing shape.

## Folder structure

```
src/
  routes/                     SvelteKit pages — thin, compose components + content
  lib/
    components/<domain>/      UI components, grouped by the section/feature they belong to
    components/primitives/    content-agnostic, cross-cutting foundational components (Container, Section,
                               Button, Card) — a distinct grouping from feature/section domains
    content/<domain>.ts       typed data for that domain (the "visible copy" — see conventions.md)
    content/<domain>.types.ts the types for that domain's data
    styles/                   design tokens (tokens.css) and any other global CSS
    utils/                    small pure functions, one concern per file
    server/                   server-only code (Mailgun client, form actions, etc. — added when those features are built)
```

No `src/lib/index.ts` barrel file. Import directly from the file that defines what you need, e.g. `import { profile } from '$lib/content/profile'`, not `import { profile } from '$lib'`. Barrel files hide the real dependency graph and make one-file-one-functionality hard to enforce.

## Routing & rendering strategy

- **Prerender by default.** `src/routes/+layout.ts` sets `export const prerender = true` at the root, so every route is static at build time unless it explicitly opts out — this is a personal site, almost everything should be served as static assets for instant loads.
- **SSR only where genuinely required.** Two routes currently opt out with `export const prerender = false`, each for a specific per-request need:
  - `/contact` — the form submission action.
  - `/about` — `+page.server.ts` fetches `api.github.com/.../events/public` live on every request (see "Live external data" below); prerendering would freeze that feed at build time, defeating the point.

  Don't reach for SSR because it's the path of least resistance; justify it against "does this truly need per-request server computation." Note the tradeoff this creates: on `@sveltejs/adapter-cloudflare`, prerendered routes are served straight from `env.ASSETS.fetch()` and never reach `src/hooks.server.ts` — see "Response headers" below for why that matters.

- Route files stay thin: a `+page.svelte` imports content from `src/lib/content/` and composes components from `src/lib/components/` — it does not itself contain business logic or hardcoded copy.

## Prerendered `+server.ts` endpoints

`/resume`, `/resume.json`, and `/resume.md` (`src/routes/resume/+server.ts`, `resume.json/+server.ts`, `resume.md/+server.ts`) each set `export const prerender = true` and return a plain-text/JSON/markdown résumé built from existing content (`profile`, `experience`, `education`, `certifications`) by pure formatter functions in `src/lib/utils/` (`buildResumeText.ts`, `buildResumeMarkdown.ts`). Because the output depends only on static content, SvelteKit renders it once at build time into a static file — `curl kamal.sh/resume` costs nothing at request time, same as any other static asset. This is the pattern to follow for any future machine-readable endpoint whose content is fully known at build time: prefer a prerendered `+server.ts` over an SSR one.

## Live external data

`/about`'s GitHub activity feed (`src/routes/about/+page.server.ts`) is the one place this site calls a third-party API at request time. It fetches with the request-scoped `fetch` (so Cloudflare can cache/dedupe it), sets a `cache-control` response header, and wraps the call in try/catch — a GitHub outage or rate limit returns an empty list, never a broken page. The raw, untyped API response is parsed defensively by `src/lib/utils/parseGithubEvents.ts` (a pure function, independently unit-tested with fixture data) rather than trusted as-is, since it's third-party JSON, not our own typed content.

## Response headers

`src/hooks.server.ts`'s `handle` sets security headers (CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) on every response it handles — but per the adapter-cloudflare behavior noted above, that's only the SSR routes (`/about`, `/contact`). Every prerendered route is served as a static asset and never reaches this hook. `static/_headers` (Cloudflare's native static-asset header mechanism — copied verbatim into the build output like `robots.txt`) carries the identical policy for everything else. **The two files must be kept in sync by hand** — there's no shared source between a Cloudflare `_headers` file and TypeScript code. See `/security` for the human-readable version of this policy, including the one deliberate weakening (`'unsafe-inline'` for scripts/styles) and why.

## Dual-native mobile/desktop components

Used only where mobile and desktop behavior _genuinely diverges_ — different interaction model, different information density, not just a different arrangement of the same elements. Don't reach for this pattern for something a CSS breakpoint handles fine.

**Decide mobile and desktop separately, every time a feature is keyboard- or pointer-shaped** (see CLAUDE.md rule 8). A feature built around a desktop assumption — a keyboard shortcut, hover-revealed content, a wide multi-column layout — usually doesn't have a good mobile equivalent by just adding responsive classes to the same markup. Two honest outcomes, decided on purpose:

- **Build a genuinely different mobile version** via the dual-native split below, when the feature matters enough on mobile to deserve its own design.
- **Deliberately don't expose it on mobile at all**, when it doesn't. Example: the command palette (`CommandPalette.svelte`) is a keyboard-driven power-user feature — Cmd/Ctrl+K and `/` are meaningless without a keyboard, and a touch-friendly command-palette redesign wasn't worth building for a personal site. `NavMobile.svelte` has no trigger button for it on purpose; the underlying component still mounts (so an external keyboard still works), but nothing on the mobile UI implies the feature is there. This is a deliberate omission, not an oversight — don't "fix" it by adding a search icon to the mobile nav without redesigning the whole interaction for touch first.

**Mechanism (CSS-only dual render, decided 2026-09-04):** the orchestrator renders both variants unconditionally; Tailwind responsive classes show exactly one. No JavaScript is needed for the switch, there's no hydration mismatch or flash-of-wrong-variant risk, and it composes cleanly with full prerendering.

```svelte
<!-- Thing.svelte -->
<script lang="ts">
	import ThingMobile from './ThingMobile.svelte';
	import ThingDesktop from './ThingDesktop.svelte';

	interface Props {
		/* shared prop shape for both variants */
	}
	let { ...props }: Props = $props();
</script>

<div class="md:hidden">
	<ThingMobile {...props} />
</div>
<div class="hidden md:block">
	<ThingDesktop {...props} />
</div>
```

Three files make up the pattern: `Thing.svelte` is the orchestrator, `ThingMobile.svelte` is the mobile variant, and `ThingDesktop.svelte` is the desktop variant. Both variants receive the same typed data/props from the orchestrator — they differ in interaction and layout, not in what data they're allowed to show.

The split point is `md` (768px, Tailwind's default) for every dual-native component in this codebase.

Because both variants render unconditionally, both mount and run their effects — timers, `$effect`s, event listeners, `matchMedia`/`ResizeObserver` listeners — even when hidden via CSS; the hidden one is `display: none`, not unmounted or torn down. Components using this pattern should keep their effects light, or guard them against their own visibility, since an off-viewport variant's effects still run.

## Content domains

Each content domain (`profile`, `experience`, `education`, `certifications`, `testimonials`, `stats`, `case-studies`, `architecture`, `security`, `costs`, `postmortems`, `products/`, `writing/`, `youtube/`, etc.) gets its own `<domain>.ts` + `<domain>.types.ts` pair in `src/lib/content/`. This mirrors how the data is already organized at the source (see the content-inventory captured from the previous site) and keeps each domain independently editable without touching unrelated ones.

`postmortems.ts` is deliberately an empty array right now — see `/postmortems`'s honest empty state. An empty domain is a valid, intended state, not a placeholder to fill with invented content.

Where a domain is split into multiple entities that each deserve their own file (e.g. `products/`), each entity gets its own file plus one small aggregate file (e.g. `products.ts`) whose only job is exporting the combined list — that aggregate is a genuine single-purpose file, not a barrel.

## Externally-synced content (`writing/`, `youtube/`)

Blog posts and YouTube videos aren't authored here — they're synced from external Atom feeds by standalone scripts under `scripts/`, which write typed, checked-in JSON snapshots (`src/lib/content/writing/posts.generated.json`, `src/lib/content/youtube/videos.generated.json`). The deployed site never fetches these feeds at runtime — it only ever reads the last-synced JSON, so an upstream feed outage can't break the live site.

- `bun run sync:blog` / `bun run sync:youtube` run the sync scripts locally.
- `.github/workflows/content-sync.yml` runs both on a ~48h schedule (plus manual dispatch) and commits any changes.
- Each sync script fails loudly (non-zero exit, clear stderr message) on any fetch/parse error and — critically — **does not touch the existing generated JSON** when it fails. The two syncs are independent in CI: one feed being down doesn't block the other from updating.
- `scripts/lib/` holds the small helpers shared by both scripts (Atom parsing primitives, "take the N most recent", "write generated JSON"). Don't duplicate this logic if a third synced-content source is ever added — extend `scripts/lib/` instead.

## Booking flow (`/contact`)

`BookingFlow.svelte` is a 3-step date → duration → time-slot picker (`src/lib/utils/ist.ts`, `getBookableDates.ts`, `getTimeSlotsForDate.ts`, `buildCalComUrl.ts` hold the logic, each independently unit-tested). Picking a time slot links straight to Cal.com with a prefilled `slot` query param (`https://cal.com/kamalk/30min?slot=...`) — there is no live availability check against Cal.com's API; Cal.com's own booking page is the source of truth if a slot has since been taken.

**Assumption to verify against the real Cal.com account:** availability is assumed to be 9:00 AM–6:00 PM IST, every day, with no minimum-notice period beyond "must be in the future" (`getTimeSlotsForDate.ts`'s `AVAILABILITY_START_HOUR`/`AVAILABILITY_END_HOUR` constants). If the real Cal.com availability differs (different hours, excluded days, a minimum-notice buffer), update those constants to match — there was no way to confirm the real configured hours from here.

The widget computes "today" via `onMount` (never during SSR/prerender), so a visitor's actual current time is always used, not a stale build-time snapshot — see the dual-native section above for why `$effect`/`onMount` and not `$derived` matters here.

## Cross-component UI signaling (command palette)

`CommandPalette.svelte` is mounted once, in the root layout, and needs to open in response to two independent triggers it doesn't own: the global Cmd/Ctrl+K listener (which it does own) and a visible trigger button in `NavDesktop.svelte` (a sibling component, no direct reference to the palette). Rather than a shared reactive store (`$state` in a module-scope `.svelte.ts` file, watched by an `$effect` that calls `showModal()`), this uses a plain `window` `CustomEvent` (`src/lib/utils/commandPaletteEvent.ts`'s `requestCommandPaletteOpen()`), which `CommandPalette` listens for in `onMount` and handles with a direct, synchronous `showModal()` call.

This was a deliberate choice, not the first attempt: the module-`$state`-plus-`$effect` version worked in the browser but was flaky under `vitest-browser-svelte` in a way that traced back to effect-timing/dependency-tracking interaction across the module singleton, not to real application behavior. The imperative event-based version is simpler, has no reactive indirection between "user asked to open the palette" and "the dialog opens," and is easier to test — prefer this pattern for any future "open me from anywhere" UI trigger over a shared reactive store.

## Role-tailored homepage (`?for=`)

The homepage's middle sections (stats, building/products, testimonials — not the Hero or closing CTA, which stay fixed) reorder based on a `?for=` query parameter, read via `page.url.searchParams` from `$app/state`. `src/lib/utils/getHomeSectionOrder.ts` is a pure function mapping a role string to a section order, with an unrecognized or absent value falling back to the same order the page prerenders with. Because `page.url` is only meaningfully populated client-side after hydration, the prerendered HTML (what a crawler or no-JS visitor sees) always reflects the default order; reordering is a client-side enhancement, not something the build needs to branch on.
