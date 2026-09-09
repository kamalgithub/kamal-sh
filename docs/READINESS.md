# READINESS — full-repo improvement plan

> Written 2026-09-07 from a whole-repo audit (config, routes, endpoints, hooks, components, utils, content, fonts/assets, CI, docs). This file is the execution plan: work top-to-bottom by tier, fold each item's doc update into the same change (CLAUDE.md rule 10), and verify after every tier. Line numbers were accurate at audit time — re-locate by symbol if they've drifted.

**Overall assessment at audit time:** the codebase is healthy — zero `any`, zero Svelte-4 leftovers, zero hover-scale violations, prerender-by-default with SSR only where genuinely needed, rate-limited + honeypotted forms, specs on most utils, and comments that record _why_. Everything below is refinement, not rescue.

**Ground rules for anyone executing this file:**

- Each item lists its own doc update — do both in the same change.
- Every finished tier must pass: `bun run check`, `bun run lint`, `bun run build` (run at least once — it's the only command that prerenders), `bun run test`.
- Do not refactor anything not listed here (CLAUDE.md: touch only what the task requires).

## Tier 1 — high value, low risk

### T1.1 CI quality gate (G1 — HIGH) — ✅ done 2026-09-07

`.github/workflows/ci.yml` added: `check` → `lint` → `build` → `test` on every push/PR. Doc update landed in tooling.md's new "CI" section.

### T1.2 Hero portrait is lazy-loaded LCP image (A1 — HIGH)

- **Problem:** `Figure.svelte` hardcodes `loading="lazy"` with no opt-out, and `Hero.svelte` renders the above-the-fold portrait through it — the LCP candidate image is deprioritized on every visit.
- **Fix:** add `loading?: 'lazy' | 'eager'` prop to `Figure.svelte` (default `'lazy'`) plus an optional `fetchpriority?: 'high' | 'auto' | 'low'` and `decoding="async"`; `Hero.svelte` passes `loading="eager"` and `fetchpriority="high"`. Other Figure callers unchanged.
- **Doc update:** conventions.md — add the rule: "above-the-fold images render with `loading="eager"` + `fetchpriority="high"`; `Figure`'s default stays `lazy` for everything else."

### T1.3 SeoHead title composition (C1 — MED)

- **Problem:** the `" | Kamal Kumar"` suffix is duplicated in 18 files (`SeoHead title=` literals in every `+page.svelte` plus `+error.svelte:14`), violating rule 4 and DRY.
- **Fix:** `SeoHead.svelte` already imports `profile` — compose `{title} | {profile.name}` internally. Add an optional `fullTitle?: string` escape hatch; Home passes `fullTitle="{profile.name} | {profile.title}"` (reversed order, deliberate) and `+error.svelte` passes `fullTitle="{page.status} | {profile.name}"`. Update all ~18 call sites to pass bare page names ("Work", "Contact", …).
- **Doc update:** conventions.md — "page titles: pass the bare page name to SeoHead; the suffix is composed inside it; use `fullTitle` only when the shape is genuinely different (Home, error)."

### T1.4 Fetch timeouts on all outbound calls (F1 — MED) — ✅ done 2026-09-07

`signal: AbortSignal.timeout(...)` added to every outbound fetch (4000ms default, 2500ms for the non-critical About/GitHub call). `turnstile.ts` additionally got its own try/catch — it was the one call whose caller didn't already wrap it, so a thrown `TimeoutError` would have surfaced as an unhandled 500 instead of "verification failed." Doc update landed in conventions.md's new "Outbound fetch timeouts" section; `/security`'s copy didn't describe this behavior, so nothing to sync there.

### T1.5 Security-header comment + CSP sync (B1, B2 — MED) — ✅ done 2026-09-07

Both problems fixed: route-list comments in `hooks.server.ts` and `_headers` now say `/`, `/about`, `/contact`, `/newsletter`, `/status`; `_headers`' CSP now includes the Turnstile allowances (`script-src`, `connect-src`, `frame-src`) matching `hooks.server.ts` exactly. `src/hooks.server.spec.ts` added as the drift guard — it reads `_headers` from disk and asserts its CSP line matches the exported `CONTENT_SECURITY_POLICY` constant, so CI (T1.1) now fails loudly if the two are ever edited out of sync again. Doc update landed in tooling.md's new "`_headers` and the CSP sync guard" section.

While in the same code: also added site-wide `Cache-Control` (a separate ask, not originally in this audit) — `public, max-age=300, must-revalidate` on every page via the same two mechanisms, except `/` (User-Agent branching) and `/status` (live metrics) which get `no-store`, and `/about` which keeps its own more nuanced `setHeaders` value untouched.

## Tier 2 — performance & DRY

### T2.1 Font preloads (A2 — MED)

- **Problem:** no `<link rel="preload">` for the woff2 files; with `font-display: swap` the above-fold text waits on late-discovered fonts.
- **Fix:** in `app.html`, preload exactly the two above-fold faces: Switzer body weight and Fraunces variable. Preloads for fonts **must** carry `crossorigin` even same-origin: `<link rel="preload" href="/fonts/Fraunces-Variable.woff2" as="font" type="font/woff2" crossorigin />`.
- **Doc update:** design-tokens.md fonts section — "above-fold faces are preloaded in app.html; when the font set changes, update the preloads to match."

### T2.2 Switzer: 5 statics → 1 variable (A3 — MED)

- **Problem:** five static Switzer weights (~93KB across files) instead of one variable font; pages using 400/500/600 pull three separate downloads. Fraunces already proves the variable-file pattern here (36KB).
- **Fix:** fetch Fontshare's Switzer variable woff2 into `static/fonts/`, replace the five `@font-face` blocks in `fonts.css` with one (`font-weight: 100 900`), delete the statics. Visually verify all weights render (buttons 500, headings 600, dark-mode weight override from tokens.css unaffected).
- **Doc update:** design-tokens.md — note Switzer is now variable, same rationale as Fraunces.

### T2.3 Lazy CommandPalette command list (A4 — MED) — ✅ done 2026-09-09

Landed as part of adding full writing/video archive search (a separate, user-requested change that made this fix load-bearing rather than optional — the archive data alone runs ~18KB gz). `CommandPalette.svelte` builds pages/case-studies/products/socials eagerly (cheap), and dynamically `import()`s `posts-archive.generated.json`/`videos-archive.generated.json` only inside `openPalette()`, reactively updating `commands` (a `$state`) once it resolves — the global Cmd-K/`/`/`onPaletteOpen` listeners stay eager throughout, unaffected. See docs/architecture.md's "Command palette search: recent display vs. full archive".

- **Doc update:** architecture.md command-palette section — one sentence on the lazy strategy and the constraint that global listeners stay eager.

### T2.4 DRY extractions (C2, C3, C4 — MED)

1. **Email validation:** `EMAIL_PATTERN` duplicated in `contact/+page.server.ts:10` and `newsletter/+page.server.ts:9` → new pure util `src/lib/utils/isValidEmail.ts` + spec; both actions use it.
2. **Nav active check:** `isActive()` duplicated in `NavDesktop.svelte:12` and `NavMobile.svelte:14` → `src/lib/utils/isNavLinkActive.ts` (takes `pathname`, `href`) + spec.
3. **Shared transition utility:** `transition-colors duration-(--duration-fast) ease-standard` repeated 40+ times → define one Tailwind v4 `@utility` (e.g. `transition-theme`) in `tokens.css`, replace across components, and note it as the sanctioned hover-feedback mechanism (color/opacity/border only — reinforces CLAUDE.md rule 2 mechanically).

- **Doc update:** conventions.md — the transition utility is the only sanctioned way to write hover color transitions.

### T2.5 Hardcoded copy → content modules (D1, D2 — MED)

Move visitor-facing strings out of components (rule 4):

- `NavMobile.svelte:49,77` — "Open menu" / "Close menu" aria-labels.
- `ThemeToggle.svelte:8-12,55` — "Light" / "System" / "Dark" labels and "Change theme (currently {theme})".
- `BookingFlow.svelte:16,225` — `WEEKDAY_LABELS` array and the `"{minutes} min"` duration label.
- `Footer.svelte:43` — "Built {date} from commit {sha}" phrasing (and note the build-time freeze of `{new Date().getFullYear()}` on prerendered pages — acceptable, comment it).
- `+layout.svelte:35` — `name="kamal.sh"` literal → add `name: 'kamal.sh'` to `site.ts` and import it.
- **Doc update:** conventions.md — record the rule-4 boundary: structural/landmark labels (`aria-label="Primary"` on `<nav>`) are exempt; user-action labels ("Open menu") are not.

### T2.6 Sitemap as content + guard spec (B4 — MED)

- **Problem:** `sitemap.xml/+server.ts:8-26` hand-maintains 17 route literals — every new page is a silent sitemap-drop waiting to happen.
- **Fix:** move the route list into `src/lib/content/site.ts` (typed, exported, with a comment tying it to sitemap.xml), and add a spec asserting every `nav` + `footerLinks` href appears in it — a new page linked in the nav then fails the test until the sitemap list is updated.
- **Doc update:** conventions.md or tooling.md — "new page checklist: add to nav/footer content → the sitemap spec will remind you to add it to `site.ts`'s route list."

## Tier 3 — polish

| ID  | Finding                                                                                                 | Fix                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| A5  | Dual-theme images download both files (`display:none` still fetches)                                    | Accept (document in design-tokens.md) or convert to `<picture>` — decide once, record it          |
| A6  | `portrait.jpg` single 76KB JPEG                                                                         | Add an AVIF variant + `<picture>`/srcset in Figure usage — cheap LCP win, pairs with T1.2         |
| A7  | `Section use:reveal` can flash-hide prerendered content on slow connections                             | Accept + document in design-tokens.md motion section, or skip reveal for sections in-view at load |
| B5  | RSS: `post.link`/`guid` not XML-escaped; missing `atom:link rel="self"` + `<language>`                  | Escape all interpolations; add the two tags                                                       |
| B6  | `app.html:6` nonstandard `<meta name="text-scale">`; no `theme-color`                                   | Delete the no-op; add `<meta name="theme-color">` per theme (verify tokens.css values)            |
| C5  | `rel` inconsistency: `noreferrer` (Footer) vs `noopener` (BookingFlow)                                  | Standardize on `noopener` everywhere; document in conventions.md                                  |
| C6  | Turnstile `window` callbacks never cleaned up (`ContactForm.svelte:52-65`)                              | Return cleanup from `onMount`                                                                     |
| E1  | ThemeToggle `role="menu"` without arrow-key nav (ARIA pattern requires it)                              | Add ArrowUp/Down handling, or switch to a radiogroup/disclosure pattern — decide once, record it  |
| E2  | Form field errors not announced/focused as a group                                                      | Optional: error summary with focus management on failed submit                                    |
| G2  | `eslint.config.js:40` empty `rules: {}`; a11y preset unverified                                         | Enable `svelte/button-has-type: 'error'`; verify svelte a11y rules are actually active            |
| G3  | `scripts/generate-og-images.ts` has no package.json alias and isn't documented                          | Add `"gen:og"` script; one line in tooling.md                                                     |
| G4  | Test gaps: `formatDate.ts`, `buildCommands.ts`, `buildCareerTimeline.ts`, `scripts/lib/*` have no specs | Add small pure-function specs                                                                     |

## Stale AI docs to fix regardless of code changes

1. **`hooks.server.ts:5` + `_headers:4`** — stale SSR route lists (covered by T1.5).
2. **`docs/design-tokens.md:40`** — per-page tint assignment table predates the six new pages: verify and document tints for `status` (observed: `tint 3`), `newsletter`, `now`, `uses`, `changelog`, `resume-print`.
3. **`docs/conventions.md`** — accumulates from T1.2/T1.3/T1.4/T2.4/T2.5/T2.6/C5: title composition, eager-image rule, fetch-timeout rule, transition utility, rule-4 boundary, rel convention, new-page checklist.
4. **`CLAUDE.md`** — candidate standing rules from this audit: fetch timeouts mandatory; titles via SeoHead composition (never a literal suffix); CI gate is the quality bar (check + lint + build + test before "done").
5. **`docs/tooling.md`** — `_headers` lives at repo root (adapter v7 requirement — do not "fix" back into `static/`); `gen:og` script; CI note.
6. **`docs/architecture.md`** — CommandPalette lazy strategy (T2.3) once implemented.

## Verified-clean areas (no action — recorded so future audits don't re-litigate)

- No `any`, no Svelte-4 syntax, no hover scale/translate violations, no dead `+server` routes (linkedin/youtube/github consolidation is documented in architecture.md:50).
- `_headers` at repo root is **correct** for adapter-cloudflare v7 (adapter source warns against `static/`); the generated worker appends immutable caching for `/_app/immutable/*` itself.
- Server actions: honeypot + IP-hash rate limiting (Cache API) + fail-closed secrets — solid; the only gap is timeouts (T1.4).
- Prerendering: default-on via `+layout.ts`; `prerender = false` correctly scoped to `/`, `/contact`, `/about`, `/status`, `/newsletter`, `[shortlink]`.
- Dependency hygiene clean; vitest projects sensibly split with `requireAssertions: true`.

## Done definition

All tiers executed; every item's paired doc update landed in the same change; full gate green (`check`, `lint`, `build`, `test`); this file then gets reduced to a short "completed YYYY-MM-DD" note or deleted — it is a plan, not a permanent doc.
