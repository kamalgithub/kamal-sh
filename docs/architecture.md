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
    server/                   server-only code (Mailjet client, form actions, etc. — added when those features are built)
```

No `src/lib/index.ts` barrel file. Import directly from the file that defines what you need, e.g. `import { profile } from '$lib/content/profile'`, not `import { profile } from '$lib'`. Barrel files hide the real dependency graph and make one-file-one-functionality hard to enforce.

## Routing & rendering strategy

- **Prerender by default.** `src/routes/+layout.ts` sets `export const prerender = true` at the root, so every route is static at build time unless it explicitly opts out — this is a personal site, almost everything should be served as static assets for instant loads.
- **SSR only where genuinely required.** A handful of routes opt out with `export const prerender = false`, each for a specific per-request need:
  - `/contact` — the form submission action.
  - `/newsletter` — the writing-updates subscribe form's action (Mailjet contact list). `/writing`'s embedded copy of the same form posts here via `action="/newsletter"`, so `/writing` itself stays fully prerendered — only this one small route needs a server round trip.
  - `/status` — live Cloudflare Analytics data (see "Live external data" below); prerendering would freeze the numbers at build time, defeating the point of a status page.
  - `/about` — `+page.server.ts` fetches `api.github.com/.../events/public` live on every request (see "Live external data" below); prerendering would freeze that feed at build time, defeating the point.
  - `/` (`src/routes/+page.ts`) — the one exception that isn't about the page's own content. `src/hooks.server.ts` inspects every request's User-Agent so `curl kamal.sh` (or wget/iwr/any other CLI client) gets the résumé instead of the homepage; see "CLI content negotiation" below. This means every homepage visit — CLI or browser — is a real SSR render instead of a static-asset hit; acceptable on Workers' edge compute for this site's traffic, but a real, deliberate tradeoff, not a free one.
  - `/[shortlink]` — short-URL redirects (see "Short-URL redirects" below). Their destination is fully static, but a prerendered "redirect" on this adapter can only ever be a 200 HTML page with a meta-refresh, not a real 3xx — and a real HTTP redirect is what makes link-preview crawlers (Slack, Twitter, iMessage, etc.) follow through to the destination and show _its_ preview instead of ours. That specific need — a genuine status code, not per-request computation — is the justification for SSR here.

  Don't reach for SSR because it's the path of least resistance; justify it against "does this truly need per-request server computation." Note the tradeoff this creates: on `@sveltejs/adapter-cloudflare`, prerendered routes are served straight from `env.ASSETS.fetch()` and never reach `src/hooks.server.ts` — see "Response headers" below for why that matters.

- Route files stay thin: a `+page.svelte` imports content from `src/lib/content/` and composes components from `src/lib/components/` — it does not itself contain business logic or hardcoded copy.

## CLI content negotiation (`curl kamal.sh`)

`src/lib/utils/buildRootCliResponse.ts` is called from `src/hooks.server.ts` before SvelteKit's normal routing runs: for a GET to `/`, if `src/lib/utils/isCliRequest.ts` says the caller isn't a browser, it returns the plain-text résumé directly and `resolve(event)` is never called. `isCliRequest` keys off User-Agent not containing `"Mozilla"` — every mainstream browser includes it, virtually no CLI HTTP client does — with one explicit carve-out for PowerShell's `Invoke-WebRequest`/`iwr`, whose default User-Agent _does_ include `"Mozilla"` despite being a CLI tool. This is deliberately one broad heuristic plus one named exception, not a list of known tool names to keep extending forever.

`/` and `/resume` are ANSI bold/color **by default** — a deliberate choice, not the original one. There is no HTTP header that reveals whether a client's stdout is even a terminal (piping to a file or a non-ANSI-aware tool looks identical to the server), so this does carry real risk of garbled output for a genuinely legacy CLI or a script that expects plain text. `/resume-raw` is the uncolored escape hatch for exactly that case. `buildResumeText.ts`'s `color` option (default `false`) is what every one of these routes shares — keep any future formatting addition behind that same explicit, named opt-in rather than guessing client capability.

The same default-to-styled idea applies to the JSON surfaces, for a different reason: `/json` is a colorized, human-readable view (`src/lib/utils/colorizeJson.ts` — a few targeted regexes over our own known-shaped data, not a general JSON tokenizer), served as `text/plain` because the ANSI codes make it invalid JSON. `/json-raw` and `/resume.json` are the real `application/json` endpoints for the rare case someone wants to parse this data — nobody needs to consume a personal résumé as an API result, so the memorable short path optimizes for "looks good in a terminal."

## Short-URL redirects

One dynamic route, `src/routes/[shortlink]/+server.ts`, serves every `kamal.sh/<slug>` redirect — **adding a new one is a one-line data change, not a new route file.** Add `{ slug: 'subscribe', url: '...' }` to the array in `src/lib/content/shortlinks.ts` and `kamal.sh/subscribe` starts 301-redirecting immediately; no code, no new file, no deploy step beyond the normal one. `findShortLink.ts` does the lookup (a plain array `.find()` — this list is small and hand-maintained, not worth a `Map` or any other structure).

This used to be three separate hand-written `+server.ts` files (`/linkedin`, `/youtube`, `/github`), one per platform — replaced 2026-09-05 specifically so new short links don't need a new route each time. A slug that collides with a real page (e.g. someone adding `{ slug: 'work', ... }`) is silently unreachable, not an error: SvelteKit always resolves a static route (`src/routes/work/`) before falling through to a dynamic one (`src/routes/[shortlink]/`), so `/work` keeps working exactly as before. A slug with no matching entry falls through to a normal `error(404)`, which renders the site's real 404 page (`src/routes/+error.svelte`) — the same page any other unmatched URL gets.

Deliberately real HTTP redirects (`Response.redirect`, 301) rather than prerendered meta-refresh pages: a link-preview unfurler fetches the URL, follows the `Location` header, and renders the _destination's_ Open Graph tags — exactly "the preview should match the destination" with zero bespoke OG-tag copying to keep in sync by hand. See "Routing & rendering strategy" above for why this specific route has to be SSR (`prerender = false`) rather than the site's usual prerendered default.

## Prerendered `+server.ts` endpoints

`/resume`, `/resume-raw`, `/resume.md`, `/resume.json`, `/json`, and `/json-raw` each set `export const prerender = true` and return a plain-text/markdown/JSON/ANSI-colorized résumé built from existing content (`profile`, `experience`, `education`, `certifications`) by pure formatter functions in `src/lib/utils/` (`buildResumeText.ts`, `buildResumeMarkdown.ts`, `colorizeJson.ts`). Because the output depends only on static content, SvelteKit renders each one once at build time into a static file — visiting any of them costs nothing at request time, same as any other static asset. This is the pattern to follow for any future machine-readable endpoint whose content is fully known at build time: prefer a prerendered `+server.ts` over an SSR one. (`/` is the one resume-adjacent surface that couldn't stay this cheap — see above for why.)

**Never nest a prerendered `+server.ts` route directly under another prerendered `+server.ts` route's exact path** (e.g. `/resume/raw` under `/resume`) — a prerendered server endpoint's output is saved as a plain file matching its route path exactly, so `/resume` becomes a file named `resume`, and `/resume/raw` needs `resume` to be a _directory_. The two can't both be true; the build fails with "Cannot save X as Y is already a file" (this actually happened — `/resume/raw` and `/json/raw` were both renamed to the flat `/resume-raw`/`/json-raw` on 2026-09-05 to fix it, and it went unnoticed until a real production build was run, since `svelte-check`/`vitest`/`eslint` don't prerender anything). A sibling name (`/resume-raw`, `/resume.json`) never has this problem since it isn't nested under the exact path of another prerendered route. Run `bun run build` (not just `check`/`test`/`lint`) at least once before considering a new prerendered endpoint done — it's the only command that actually exercises this.

## Generated OG images

`scripts/generate-og-images.ts` renders a branded 1200×630 social-preview card per case study and product (`static/images/og/case-studies/<slug>.png`, `static/images/og/products/<slug>.png`) using `@resvg/resvg-js` — the one dependency justified here specifically because rasterizing SVG to PNG has no native/browser/SvelteKit-official equivalent, and `og:image` needs a real raster image (poor/no SVG support across Slack, Twitter/X, LinkedIn, iMessage unfurlers). Hand-run via `bun run generate:og` and the resulting PNGs committed, the same pattern as `sync:blog`/`sync:youtube`'s generated JSON — case-study/product content changes rarely and by hand, so there's no reason for `@resvg/resvg-js` (a devDependency, never shipped to the Worker) to run on every `bun run build`. Re-run the script after adding or renaming a case study or product.

This is deliberately independent of `Figure.svelte`'s own "photo pending" placeholder in the page body (see docs/design-tokens.md's Images section) — a generated title card is an honest, intentional design object for a social-media preview, not a stand-in pretending to be a real screenshot. `work/[slug]` and `building/[slug]` pass `data.study.image?.src ?? \`/images/og/case-studies/${data.study.slug}.png\``(and the product equivalent) to`SeoHead`, so a real photo takes priority the moment one is added, and the generated card is only ever the fallback. Word-wrapping in the script uses an approximate average-character-width heuristic, not real font metrics — resvg has no text-measurement API without a loaded, known font — tuned against this site's actual titles rather than proven exact for arbitrary future ones; sanity-check a new entry's rendered PNG after adding it.

## Live external data

`/about`'s GitHub activity feed (`src/routes/about/+page.server.ts`) is the one place this site calls a third-party API at request time. It fetches with the request-scoped `fetch` (so Cloudflare can cache/dedupe it), sets a `cache-control` response header, and wraps the call in try/catch — a GitHub outage or rate limit returns an empty list, never a broken page. The raw, untyped API response is parsed defensively by `src/lib/utils/parseGithubEvents.ts` (a pure function, independently unit-tested with fixture data) rather than trusted as-is, since it's third-party JSON, not our own typed content.

## Form abuse protection

- **Cloudflare Turnstile** (`src/lib/server/turnstile.ts`) blocks automated submissions on both `/contact` and the newsletter signup (`/newsletter` standalone, and the same `NewsletterSubscribeForm.svelte` embedded on `/writing`). The server side is identical for both: verify the resulting token against Cloudflare's `siteverify` endpoint using the real secret, `TURNSTILE_SECRET_KEY` (a `wrangler secret`, `.dev.vars` locally — never committed). If that secret is ever unset (or, see the incident note in tooling.md, set under the wrong name), the form fails closed with `notConfiguredError` rather than silently skipping verification — the same fail-closed pattern already established for Mailjet. Both Turnstile and Mailjet are configured and live in production as of 2026-09-09; the fail-closed behavior described here is what protects against a future misconfiguration, not the current state.

  The client-side site key is sourced two different ways, because the two forms have different rendering constraints: `ContactForm.svelte` receives `TURNSTILE_SITE_KEY` as a prop from `/contact/+page.server.ts`'s `load`, reading `platform.env` live at request time (fine — `/contact` is always SSR). `NewsletterSubscribeForm.svelte` instead imports it from `src/lib/utils/turnstileSiteKey.ts`, a constant baked in at build time via `vite.config.ts`'s `define` (same mechanism as `buildInfo.ts`'s git SHA/date, reading the value straight out of `wrangler.jsonc`) — because its one route that must stay prerendered (`/writing`) has no request-time env access at all. Both ultimately read the same non-secret, committed `TURNSTILE_SITE_KEY` value; this is only about _when_ it's read, not two different keys.

- **A 2-messages-per-4-hours cap** on `/contact` specifically (the newsletter form has its own, more generous 5-per-hour cap — see `/newsletter/+page.server.ts` — since subscribing carries far less abuse value than sending arbitrary messages), enforced at two levels per explicit request — neither alone is sufficient, together they're reasonable defense in depth for a personal contact form:
  - **Client-side** (`ContactForm.svelte`, `localStorage`): instant feedback with no round trip, but trivially bypassed (clear storage, incognito, a different browser).
  - **Server-side, by IP** (`src/lib/server/rateLimiter.ts`): the real enforcement. This needed some state that survives across separate requests, which is in tension with CLAUDE.md's "no database" hard rule — Workers are stateless per request. Resolved (explicitly, with the user) by using the Workers Cache API (`platform.caches.default`) as a narrowly-scoped, TTL'd counter rather than reaching for KV/D1: the IP is SHA-256 hashed before use as a cache key (nothing identifying is ever stored, even ephemerally), and the counter's own `Cache-Control: max-age` is what makes the 4-hour window self-expire with no cleanup job needed. This is best-effort, not exact — cache entries can be evicted early and aren't shared across every Cloudflare edge PoP — acceptable for blocking casual/repeat abuse, not a determined attacker who changes networks.

Both counted regardless of whether the message ultimately sends — an attempt that clears the honeypot and basic field validation counts against the cap even if Turnstile or Mailjet later reject it, otherwise the cap would be trivially bypassable by omitting the Turnstile token. On success, the form hides itself and shows only a "message sent" notice (`form?.success`), and on hitting the cap it shows a cooldown notice instead of the form (`form?.rateLimited` server-side, or the same `localStorage` check on a fresh page load).

## Response headers

`src/hooks.server.ts`'s `handle` sets security headers (CSP, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) on every response it handles — but per the adapter-cloudflare behavior noted above, that's only the SSR routes (`/`, `/about`, `/contact`, `/newsletter`, `/status`). Every prerendered route is served as a static asset and never reaches this hook. `_headers` (Cloudflare's native static-asset header mechanism, read from the **project root**, not `static/` — `@sveltejs/adapter-cloudflare` errors at build time if it's placed in `static/`, a real error caught by actually running `bun run build`, not by `check`/`test`/`lint`) carries the identical policy for everything else. **The two files must be kept in sync by hand** — there's no shared source between a Cloudflare `_headers` file and TypeScript code; `src/hooks.server.spec.ts` is the automated guard that fails CI the moment their CSP values drift apart (see tooling.md's "`_headers` and the CSP sync guard"). `_headers` genuinely does need the Turnstile allowance (`challenges.cloudflare.com` in `script-src`/`connect-src`/`frame-src`) even though Turnstile's own widget script only ever loads on `/contact` and `/newsletter`, both SSR'd — because `NewsletterSubscribeForm.svelte` is also embedded on `/writing`, a **prerendered** page covered by `_headers`, not `hooks.server.ts`. Don't "clean up" `_headers`' Turnstile allowance as unused without checking `/writing` first. See `/security` for the human-readable version of this policy, including the deliberate weakenings (`'unsafe-inline'` for scripts/styles, and `challenges.cloudflare.com` for Turnstile) and why.

## Dual-native mobile/desktop components

Used only where mobile and desktop behavior _genuinely diverges_ — different interaction model, different information density, not just a different arrangement of the same elements. Don't reach for this pattern for something a CSS breakpoint handles fine.

**Decide mobile and desktop separately, every time a feature is keyboard- or pointer-shaped** (see CLAUDE.md rule 8). A feature built around a desktop assumption — a keyboard shortcut, hover-revealed content, a wide multi-column layout — usually doesn't have a good mobile equivalent by just adding responsive classes to the same markup. Two honest outcomes, decided on purpose:

- **Build a genuinely different mobile version** via the dual-native split below, when the feature matters enough on mobile to deserve its own design.
- **Deliberately don't expose it on mobile at all**, when it doesn't — but be honest about what "it" means. The command palette (`CommandPalette.svelte`) was originally omitted from `NavMobile.svelte` entirely on the reasoning that Cmd/Ctrl+K and `/` are meaningless without a keyboard. That reasoning only covers _opening_ the palette — the palette itself, once open, is a plain tap-to-select list with no keyboard dependency at all (`onclick` handlers on every item), so omitting a trigger button also silently cut a feature that worked fine on touch. Revised 2026-09-05, after this exact gap was flagged directly: `NavMobile.svelte` now has its own search icon calling `requestCommandPaletteOpen()`, so mobile gets the same palette via tap that desktop gets via click or shortcut. The lesson, not just the fix: when a feature's un-availability on mobile is "deliberate," re-verify that the _whole_ feature needs cutting, not just the specific trigger mechanism that happens to be keyboard-shaped — a keyboard-only _opener_ doesn't imply a keyboard-only _feature_.

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

<ThingMobile {...props} />
<ThingDesktop {...props} />
```

**The visibility class lives on each variant's own root element** (`md:hidden` on `ThingMobile`'s top-level element, `hidden md:block` on `ThingDesktop`'s) — never on a wrapper div around the variant. A `position: sticky` element is constrained to its containing block: a wrapper div is exactly as tall as the nav inside it, so `sticky top-0` on the inner element silently stops working (this was a real bug — both nav variants had sticky classes that never stuck because `Nav.svelte` wrapped them in visibility divs, fixed 2026-09-05 by moving the classes onto the variant roots). A variant with multiple root-level siblings (like `NavMobile`'s bar + `<dialog>`) is fine: only the always-visible bar carries the visibility class; the dialog stays class-free because an unopened `<dialog>` is `display: none` on its own and can only be opened by a trigger inside the bar that's hidden at `md` and above.

Three files make up the pattern: `Thing.svelte` is the orchestrator, `ThingMobile.svelte` is the mobile variant, and `ThingDesktop.svelte` is the desktop variant. Both variants receive the same typed data/props from the orchestrator — they differ in interaction and layout, not in what data they're allowed to show.

The split point is `md` (768px, Tailwind's default) for every dual-native component in this codebase.

Because both variants render unconditionally, both mount and run their effects — timers, `$effect`s, event listeners, `matchMedia`/`ResizeObserver` listeners — even when hidden via CSS; the hidden one is `display: none`, not unmounted or torn down. Components using this pattern should keep their effects light, or guard them against their own visibility, since an off-viewport variant's effects still run.

### Mandatory checklist before shipping any new interactive feature

This is not optional and not a one-time pass — run it for every feature that adds a control, a widget, an embedded third-party script, or a data-dense layout, even a small one. "It has responsive classes" is not evidence it was checked; the questions below are.

1. **Compute the narrowest real width, don't eyeball it.** This site's smallest supported viewport is a 320px-wide phone. Subtract `Container`'s padding (`px-4` = 32px total) and, if inside a `Card`, its padding (`p-4` on mobile = 32px total) to get the actual content width available. A component with a fixed pixel width (an embedded widget, a grid with a minimum column width) either fits inside that number or it doesn't — check the arithmetic, don't assume a third-party widget "must be responsive."
   - **Real finding (2026-09-05):** Cloudflare Turnstile's default widget is a fixed 300px wide. `/contact`'s form sits in a `Card` inside a single mobile column, leaving ~240–256px of real content width on a 320px phone — the default widget would overflow. Fixed by setting `data-size="compact"` (150×140) — see `ContactForm.svelte`.
2. **Check touch-target size against real finger size, not visual balance.** Roughly 44×44px is the usual minimum (Apple HIG / Material Design guidance) for anything tappable — a grid of `n` equal cells across a known content width tells you the exact per-cell size; do the division.
   - **Real finding (2026-09-05):** the booking calendar's 7-column day grid (`BookingFlow.svelte`) computed to ~31px cells on a 320px phone under the original `Card` padding — clearly under target. `Card.svelte`'s mobile padding was reduced (`p-6` → `p-4 md:p-6`) to reclaim room; the underlying 7-columns-in-one-row shape is still tight on the very smallest phones (a known, accepted tradeoff for a real calendar-grid layout, not an oversight) but meaningfully better on the 375px+ widths that cover the large majority of phones in use.
3. **Ask whether the interaction model itself survives without a pointer/hover/keyboard.** Hover-revealed content, keyboard shortcuts, and drag gestures have no direct touch equivalent — decide explicitly whether the feature (a) gets a genuinely different mobile design (dual-native split above), or (b) is deliberately omitted on mobile (document why, like the command palette above), or (c) the interaction is already pointer-and-touch-agnostic (a plain tap/click, no hover-only affordance) and a shared implementation is correct as-is.
4. **For a purely decorative/presentational addition** (an icon, a tint, a border, a thumbnail, an avatar) with no new interaction model: a shared, responsive implementation is correct by default — don't invent a mobile/desktop split for something a CSS grid or `flex-wrap` already reflows correctly. Confirm this by checking it against #1 and #2 above, not by assumption; if it passes both, no split is needed and none should be added.
5. **Record the outcome.** Whichever of the above applies, leave a comment at the point of decision (not just in this file) — a future session (human or AI) needs to know a tradeoff was deliberate before "fixing" it. See the Turnstile/Card comments referenced above for the expected shape of that comment.

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

`BookingFlow.svelte` is a 3-step date → duration+time → details wizard (`src/lib/utils/ist.ts`, `getBookableDates.ts`, `getTimeSlotsForDate.ts` hold the calendar logic, each independently unit-tested). Duration and time-slot picking share one step — picking a duration reveals the matching slots directly below it on the same screen rather than navigating to a separate page, since the two are really one decision. The first two steps are purely local UI state, exactly as before; the change (2026-09-10) is the last step: instead of linking out to Cal.com's own booking page, the visitor's name/email/notes/meeting-platform choice are collected in a real form on this site and submitted to a server action (`?/book`, alongside `/contact`'s own `contact` action — both named, in the same `+page.server.ts`; SvelteKit doesn't allow mixing a `default` action with named ones, see tooling.md's gotcha), which calls Cal.com's API v2 directly (`src/lib/server/calBooking.ts`, `POST https://api.cal.com/v2/bookings`, auth via the `CAL_API_KEY` secret) to create the booking server-side. The visitor never leaves kamal.sh, and there's zero third-party UI/iframe involved — matching this site's native-first, on-brand-everywhere posture more closely than either of Cal.com's own embed options would have (see the design-tokens.md-adjacent reasoning below).

**Real event-type field, discovered from a live 400 response (2026-09-16):** the "meet" event type's own custom booking question is keyed `expectationsFromMe`, not an arbitrary name of this codebase's choosing — `calBooking.ts` sends the notes field under that exact key in `bookingFieldsResponses`, and it's required (Cal.com rejects the booking otherwise), so the notes field is required end-to-end here too, not optional as first built. If the event type's questions are ever reconfigured in the Cal.com dashboard, re-check this key and requiredness against a real request rather than assuming they still match.

**Why not Cal.com's embed (inline or popup)?** Investigated and deliberately rejected: Cal.com's own GitHub repo documents incomplete dark-theme support and an open, unresolved bug about the embed flashing between light/dark themes — a real regression risk for a dark-mode-default site that has otherwise engineered flash-of-wrong-theme out entirely (`app.html`'s inline theme script). Their CSS customization is also deliberately restricted by Cal.com, not just under-documented. A direct API call sidesteps all of it — no third-party rendering surface at all, so no theme mismatch is possible in the first place.

**Confirmed real availability (2026-09-09, from the account directly, not assumed):** 11:00 AM–2:00 PM IST, every day, no variation by day of week. `getTimeSlotsForDate.ts`'s `AVAILABILITY_START_HOUR`/`AVAILABILITY_END_HOUR` constants encode this. This still only controls which times the calendar _offers_ — the actual double-booking guard is the live API call: Cal.com returns a 409 (assumed; not documented in detail by Cal.com, confirm against real behavior) when a slot's taken, which `calBooking.ts` surfaces as `CalBookingConflictError`, and the UI sends the visitor back to the time step with a clear "that time was just taken" message rather than pretending the booking succeeded.

**Fixed request shape, by design:** the event type is a single Cal.com link (`kamalk/meet`) with an in-request `lengthInMinutes` rather than a separate link per duration (15/30/45/60 only — enforced by a `zod` union in `bookingInputSchema`, the one schema-validated form on this site; every other form here still hand-validates like `/contact`'s own `default` action does, which is a fine, simpler style for flatter input shapes — `calBooking.ts`'s nested attendee/location fields and enum-like duration/location values are what tipped this one specific form toward `zod`, not a site-wide replatform). `metadata.source` is always the fixed literal `'kamalsh-contact-form'`, never visitor-suppliable.

**Turnstile, lazy-loaded:** all three forms that use Turnstile on this site (`ContactForm.svelte`, `NewsletterSubscribeForm.svelte`, and this booking form) only inject Cloudflare's script and render the widget after the visitor's first focus inside the form (`onfocusin` on the `<form>` element flips a `turnstileRequested` flag that gates both the `<svelte:head>` script tag and the `.cf-turnstile` div). Most visits to any of these pages never submit anything, so loading a third-party script and rendering a widget unconditionally on page load was pure waste for the common case.

The widget computes "today" via `onMount` (never during SSR/prerender), so a visitor's actual current time is always used, not a stale build-time snapshot — see the dual-native section above for why `$effect`/`onMount` and not `$derived` matters here.

## Cross-component UI signaling (command palette)

`CommandPalette.svelte` is mounted once, in the root layout, and needs to open in response to two independent triggers it doesn't own: the global Cmd/Ctrl+K listener (which it does own) and a visible trigger button in `NavDesktop.svelte` (a sibling component, no direct reference to the palette). Rather than a shared reactive store (`$state` in a module-scope `.svelte.ts` file, watched by an `$effect` that calls `showModal()`), this uses a plain `window` `CustomEvent` (`src/lib/utils/commandPaletteEvent.ts`'s `requestCommandPaletteOpen()`), which `CommandPalette` listens for in `onMount` and handles with a direct, synchronous `showModal()` call.

This was a deliberate choice, not the first attempt: the module-`$state`-plus-`$effect` version worked in the browser but was flaky under `vitest-browser-svelte` in a way that traced back to effect-timing/dependency-tracking interaction across the module singleton, not to real application behavior. The imperative event-based version is simpler, has no reactive indirection between "user asked to open the palette" and "the dialog opens," and is easier to test — prefer this pattern for any future "open me from anywhere" UI trigger over a shared reactive store.

## Command palette search: recent display vs. full archive

`/writing` and the command palette read two different files for the same underlying content, on purpose. `scripts/sync-blog.ts` and `scripts/sync-youtube.ts` each write two outputs from the one feed fetch: `posts.generated.json`/`videos.generated.json` (a small, curated recent slice — 8 items — read by `/writing/+page.svelte` for display) and `posts-archive.generated.json`/`videos-archive.generated.json` (every entry the feed returns — the complete history for the blog, since `blog.aicademy.ac/feed.xml` isn't capped the way YouTube's is — used only for search). `/writing` deliberately stays a short, skimmable page; the palette's search is what reaches everything ever published.

**YouTube's real ceiling:** `videos-archive.generated.json` still only ever has at most 15 entries — that's YouTube's own hard limit on this RSS feed format, not a limit this codebase imposes, and there's no query parameter or pagination that changes it. Getting the channel's complete upload history would require the YouTube Data API (a new external credential + quota), not a wider slice of the existing feed.

**Lazy-loaded on first open, not on every page:** the two archive files run ~18KB gzipped combined — worth avoiding on every single page load for a feature (search) most visits never use. `CommandPalette.svelte` builds its command list eagerly from everything cheap (pages, case studies, products, socials), and only `import()`s the two archive JSON files — dynamically, code-split into their own chunk — the first time `openPalette()` actually runs. The dialog opens immediately either way; `commands` is `$state` and updates reactively (typically within a frame or two) once that import resolves, so the palette never blocks on it. `Command.hiddenWhenIdle` is how the palette still shows only a short, curated slice of writing/video results when idle (no query typed) while every one of them — old or new — is fully matched the moment a query narrows the list.

## Role-tailored homepage (`?for=`)

The homepage's middle sections (stats, building/products, testimonials — not the Hero or closing CTA, which stay fixed) reorder based on a `?for=` query parameter, read via `page.url.searchParams` from `$app/state`. `src/lib/utils/getHomeSectionOrder.ts` is a pure function mapping a role string to a section order, with an unrecognized or absent value falling back to the same order the page prerenders with. Because `page.url` is only meaningfully populated client-side after hydration, the prerendered HTML (what a crawler or no-JS visitor sees) always reflects the default order; reordering is a client-side enhancement, not something the build needs to branch on.
