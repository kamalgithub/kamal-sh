# READINESS — full-repo improvement plan

> Written 2026-09-07 from a whole-repo audit (config, routes, endpoints, hooks, components, utils, content, fonts/assets, CI, docs). This file is the execution plan: work top-to-bottom by tier, fold each item's doc update into the same change (CLAUDE.md rule 10), and verify after every tier. Line numbers were accurate at audit time — re-locate by symbol if they've drifted.

**Overall assessment at audit time:** the codebase is healthy — zero `any`, zero Svelte-4 leftovers, zero hover-scale violations, prerender-by-default with SSR only where genuinely needed, rate-limited + honeypotted forms, specs on most utils, and comments that record _why_. Everything below is refinement, not rescue.

**Status as of 2026-09-09:** Tiers 1, 2, and 3 are done except for T2.2 and three Tier-3 items (A5, A6, E2), each deliberately left open below with a reason — none are correctness/security issues, all are judgment calls or scoped-out work.

**Ground rules for anyone executing this file:**

- Each item lists its own doc update — do both in the same change.
- Every finished tier must pass: `bun run check`, `bun run lint`, `bun run build` (run at least once — it's the only command that prerenders), `bun run test`.
- Do not refactor anything not listed here (CLAUDE.md: touch only what the task requires).

## Tier 1 — high value, low risk

### T1.1 CI quality gate (G1 — HIGH) — ✅ done 2026-09-07

`.github/workflows/ci.yml` added: `check` → `lint` → `build` → `test` on every push/PR. Doc update landed in tooling.md's new "CI" section.

### T1.2 Hero portrait is lazy-loaded LCP image (A1 — HIGH) — ✅ done 2026-09-09

`Figure.svelte` got a `loading?: 'lazy' | 'eager'` prop (default `'lazy'`) that also derives `fetchpriority` (`'high'` when eager) and always sets `decoding="async"`; `Hero.svelte` passes `loading="eager"`. Doc update landed in conventions.md's new "Above-the-fold images" section.

### T1.3 SeoHead title composition (C1 — MED) — ✅ done 2026-09-09

`SeoHead.svelte` now composes `{title} | {profile.name}` internally; added an optional `fullTitle` prop for the two pages whose title shape genuinely differs (Home, the error page — which previously didn't use `SeoHead` at all and now does, gaining real description/OG/canonical tags it never had). All ~19 call sites updated to pass bare page names. Doc update landed in conventions.md's new "Page titles" section.

### T1.4 Fetch timeouts on all outbound calls (F1 — MED) — ✅ done 2026-09-07

`signal: AbortSignal.timeout(...)` added to every outbound fetch (4000ms default, 2500ms for the non-critical About/GitHub call). `turnstile.ts` additionally got its own try/catch — it was the one call whose caller didn't already wrap it, so a thrown `TimeoutError` would have surfaced as an unhandled 500 instead of "verification failed." Doc update landed in conventions.md's new "Outbound fetch timeouts" section; `/security`'s copy didn't describe this behavior, so nothing to sync there.

### T1.5 Security-header comment + CSP sync (B1, B2 — MED) — ✅ done 2026-09-07

Both problems fixed: route-list comments in `hooks.server.ts` and `_headers` now say `/`, `/about`, `/contact`, `/newsletter`, `/status`; `_headers`' CSP now includes the Turnstile allowances (`script-src`, `connect-src`, `frame-src`) matching `hooks.server.ts` exactly. `src/hooks.server.spec.ts` added as the drift guard — it reads `_headers` from disk and asserts its CSP line matches the exported `CONTENT_SECURITY_POLICY` constant, so CI (T1.1) now fails loudly if the two are ever edited out of sync again. Doc update landed in tooling.md's new "`_headers` and the CSP sync guard" section.

While in the same code: also added site-wide `Cache-Control` (a separate ask, not originally in this audit) — `public, max-age=300, must-revalidate` on every page via the same two mechanisms, except `/` (User-Agent branching) and `/status` (live metrics) which get `no-store`, and `/about` which keeps its own more nuanced `setHeaders` value untouched.

## Tier 2 — performance & DRY

### T2.1 Font preloads (A2 — MED) — ✅ done 2026-09-09

`app.html` preloads `Fraunces-Variable.woff2` and `Switzer-Light.woff2` (the dark-mode default weight — tokens.css's unconditional `:root` default) with `crossorigin`. Doc update landed in design-tokens.md's Typography section.

### T2.2 Switzer: 5 statics → 1 variable (A3 — MED) — ⏸️ open, needs explicit go-ahead

**Not done.** This needs fetching a real font file from Fontshare — a new external download, which requires the user's explicit permission before Claude can act on it (not something to do unprompted, per this project's own safety norms) plus the correct source URL, which isn't something to guess. Ask the user directly before picking this back up; don't try to find/guess a Fontshare CDN URL programmatically.

### T2.3 Lazy CommandPalette command list (A4 — MED) — ✅ done 2026-09-09

Landed as part of adding full writing/video archive search (a separate, user-requested change that made this fix load-bearing rather than optional — the archive data alone runs ~18KB gz). `CommandPalette.svelte` builds pages/case-studies/products/socials eagerly (cheap), and dynamically `import()`s `posts-archive.generated.json`/`videos-archive.generated.json` only inside `openPalette()`, reactively updating `commands` (a `$state`) once it resolves — the global Cmd-K/`/`/`onPaletteOpen` listeners stay eager throughout, unaffected. Doc update landed in architecture.md's "Command palette search: recent display vs. full archive" section.

### T2.4 DRY extractions (C2, C3, C4 — MED) — ✅ done 2026-09-09

1. **Email validation:** extracted to `src/lib/utils/isValidEmail.ts` (+ spec); both `contact` and `newsletter` actions use it.
2. **Nav active check:** extracted to `src/lib/utils/isNavLinkActive.ts` (+ spec); both `NavDesktop.svelte` and `NavMobile.svelte` use it.
3. **Shared transition utility:** `transition-theme` (Tailwind v4 `@utility` + `@apply`, in `tokens.css`) replaces all 33 hand-written `transition-colors duration-(--duration-fast) ease-standard` occurrences. `Button.svelte` deliberately kept its own `transition-[...]` list (needs `opacity`, which `transition-colors` doesn't cover).

Doc update landed in conventions.md's "No-scale/no-shift interactions" section.

### T2.5 Hardcoded copy → content modules (D1, D2 — MED) — ✅ done 2026-09-09

Moved to typed content: `NavMobile`'s open/close-menu labels (`copy/nav.ts`), `ThemeToggle`'s Light/System/Dark labels + trigger-label template (`copy/themeToggle.ts`), `BookingFlow`'s weekday labels + duration template (added to `copy/booking.ts`), `Footer`'s build-info template (`copy/footer.ts`), and the `"kamal.sh"` literal in `+layout.svelte` (now `site.name`). Doc update landed in conventions.md's new "Data / logic separation" boundary note (structural/landmark labels are exempt; user-action labels aren't).

### T2.6 Sitemap as content + guard spec (B4 — MED) — ✅ done 2026-09-09

Route list moved to `siteRoutes` in `src/lib/content/site.ts`; `sitemap.xml/+server.ts` reads it instead of a local literal. `site.spec.ts` added, asserting every `nav`/`footerLinks` href appears in `siteRoutes`. Doc update landed in conventions.md's new "New-page checklist" section.

## Tier 3 — polish

| ID  | Finding                                                                                | Status                                                                                                                                                                                                                                                                                                                                                                                                                    |
| --- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A5  | Dual-theme images download both files (`display:none` still fetches)                   | ⏸️ Open — a real accept-or-`<picture>` design decision, not something to default on silently.                                                                                                                                                                                                                                                                                                                             |
| A6  | `portrait.jpg` single 76KB JPEG                                                        | ⏸️ Open — needs a new AVIF image asset generated/verified, heavier than the other Tier 3 items; pairs with T1.2 whenever picked up.                                                                                                                                                                                                                                                                                       |
| A7  | ~~`Section use:reveal` can flash-hide prerendered content on slow connections~~        | **✅ done 2026-09-09** — this stopped being theoretical (a real report: "page is blank except Hero"). Fixed with a failsafe timer in `reveal.ts` that force-reveals ~1s after mount regardless of intersection — see `reveal.svelte.spec.ts`.                                                                                                                                                                             |
| B5  | RSS: `post.link`/`guid` not XML-escaped; missing `atom:link rel="self"` + `<language>` | ✅ done 2026-09-09 — `escapeXml` now covers `link`/`guid`/`site.url`; added `<language>en</language>` and `<atom:link rel="self">`.                                                                                                                                                                                                                                                                                       |
| B6  | `app.html:6` nonstandard `<meta name="text-scale">`; no `theme-color`                  | ✅ done 2026-09-09 — no-op meta deleted; two `theme-color` tags added, one per `prefers-color-scheme` (doesn't follow the manual toggle override — documented as a deliberate, low-stakes gap in `app.html` itself).                                                                                                                                                                                                      |
| C5  | `rel` inconsistency: `noreferrer` (Footer) vs `noopener` (BookingFlow)                 | ✅ done 2026-09-09 — standardized on `noopener` everywhere (the weaker of the two, deliberately: this site's outbound links have nothing to lose by passing referrer, and there's real value in destinations seeing traffic came from kamal.sh). Doc update in conventions.md's new "External links" section.                                                                                                             |
| C6  | Turnstile `window` callbacks never cleaned up (`ContactForm.svelte:52-65`)             | ✅ done 2026-09-09 — both `ContactForm.svelte` and `NewsletterSubscribeForm.svelte` (which grew the same pattern after this audit was written) now return a cleanup function from `onMount` that deletes the global callbacks.                                                                                                                                                                                            |
| E1  | ThemeToggle `role="menu"` without arrow-key nav (ARIA pattern requires it)             | ✅ done 2026-09-09 — Up/Down (wrapping) + Home/End move focus between items; opening the menu focuses the checked item; Escape or selecting an item returns focus to the trigger. 4 new tests in `ThemeToggle.svelte.spec.ts`.                                                                                                                                                                                            |
| E2  | Form field errors not announced/focused as a group                                     | ⏸️ Open, explicitly deferred — lower-value than the rest of this list; each field's error is already `aria-describedby`-linked individually, this would only help the specific case of multiple simultaneous errors.                                                                                                                                                                                                      |
| G2  | `eslint.config.js:40` empty `rules: {}`; a11y preset unverified                        | ✅ done 2026-09-09 — verified (programmatically, not by inspection) that `eslint-plugin-svelte@3.23.0` ships **zero** a11y rules; Svelte's own compiler emits `a11y_*` warnings via `svelte-check` instead (confirmed by deliberately triggering one). Documented in tooling.md so no one goes looking for a missing a11y ESLint config again. Also enabled `svelte/button-has-type: 'error'` — zero existing violations. |
| G3  | `scripts/generate-og-images.ts` has no package.json alias and isn't documented         | Already done before this audit's Tier 3 pass — `generate:og` script exists, and architecture.md documents it thoroughly.                                                                                                                                                                                                                                                                                                  |
| G4  | Test gaps: `formatDate.ts`, `buildCareerTimeline.ts` had no specs                      | ✅ done 2026-09-09 — both specced now (`buildCommands.ts` and `scripts/lib/*` got theirs earlier the same day).                                                                                                                                                                                                                                                                                                           |

## Stale AI docs to fix regardless of code changes

All done as of 2026-09-09:

1. **`hooks.server.ts` + `_headers`** stale SSR route lists — fixed via T1.5.
2. **`docs/design-tokens.md`'s per-page tint table** — verify it still covers every page next time it's touched; not re-audited in this pass.
3. **`docs/conventions.md`** — gained sections from T1.2/T1.3/T1.4/T2.4/T2.5/T2.6/C5: page titles, above-the-fold images, outbound fetch timeouts, the transition utility, the rule-4 label boundary, external-link `rel`, the new-page checklist.
4. **`docs/tooling.md`** — gained the CI section, the `_headers`/CSP sync-guard section, and the a11y-linting-lives-in-svelte-check note.
5. **`docs/architecture.md`** — gained the CommandPalette lazy-search section.

## Verified-clean areas (no action — recorded so future audits don't re-litigate)

- No `any`, no Svelte-4 syntax, no hover scale/translate violations, no dead `+server` routes (linkedin/youtube/github consolidation is documented in architecture.md:50).
- `_headers` at repo root is **correct** for adapter-cloudflare v7 (adapter source warns against `static/`); the generated worker appends immutable caching for `/_app/immutable/*` itself.
- Server actions: honeypot + IP-hash rate limiting (Cache API) + fail-closed secrets — solid.
- Prerendering: default-on via `+layout.ts`; `prerender = false` correctly scoped to `/`, `/contact`, `/about`, `/status`, `/newsletter`, `[shortlink]`.
- Dependency hygiene clean; vitest projects sensibly split with `requireAssertions: true` (now also covering `scripts/lib/*`).

## Done definition

All tiers executed; every item's paired doc update landed in the same change; full gate green (`check`, `lint`, `build`, `test`); this file then gets reduced to a short "completed YYYY-MM-DD" note or deleted — it is a plan, not a permanent doc. **Not yet met** — T2.2 needs the user's go-ahead on an external font fetch, and A5/A6/E2 are deliberately-deferred judgment calls. Once those four resolve one way or another, close out this file.
