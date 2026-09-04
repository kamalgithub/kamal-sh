# Design tokens

> Update this file when a token is added/changed/removed — not when a component merely uses one.

All tokens live in `src/lib/styles/tokens.css` as CSS custom properties, and are mapped into Tailwind v4 utility classes via an `@theme` block in the same file (Tailwind v4 is CSS-first — there is no `tailwind.config.js`). Components consume tokens through Tailwind classes (`bg-surface`, `text-accent`, `font-display`) or, where Tailwind has no matching utility, directly via `var(--token-name)`. **Never hardcode a hex value, font name, or timing value in a component** — add or reuse a token instead.

**Direction: Modern Editorial** (revised 2026-09-05, replacing the original glassmorphism/gradient skeleton — see git history for what came before and why it changed). A serif display face, a single flat accent used only as text/rules, and hairline-divided lists/dividers as the primary structural device instead of a grid of identical rounded, shadowed cards. This directly avoids the generic AI-design tells documented at the bottom of this file.

## Color

Dark is the default; light is a fully equal mode, not an afterthought (`prefers-color-scheme`, with a manual override to come with the theme-toggle component later). All neutrals are true gray (`R=G=B`) — no warm cast, deliberately.

| Token                | Dark      | Light     | Use                                                                                                                                                                                                                                   |
| -------------------- | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--color-bg`         | `#0A0A0A` | `#FAFAFA` | page background                                                                                                                                                                                                                       |
| `--color-surface`    | `#131313` | `#FFFFFF` | the few genuinely raised panels (contact form, booking widget) — not used for general content                                                                                                                                         |
| `--color-border`     | `#262626` | `#E2E2E2` | hairline rules — the primary structural device on this site (see "Surfaces & structure" below)                                                                                                                                        |
| `--color-text`       | `#EBEBEB` | `#121212` | primary text                                                                                                                                                                                                                          |
| `--color-text-muted` | `#9A9A9A` | `#6B6B6B` | secondary text                                                                                                                                                                                                                        |
| `--color-accent`     | `#5C82FF` | `#2544B0` | text links, active nav state, hover color-shifts, rules/marks — **never a button fill, never a glow**. "Blueprint/cyanotype blue" — a nod to technical drawings, not generic SaaS indigo.                                             |
| `--color-error`      | `#F87171` | `#DC2626` | form validation feedback — the only other functional color. Different values per mode because a single red doesn't clear WCAG AA against both a near-black and a near-white background — verified via the relative-luminance formula. |

Both accent values verified against their background via the WCAG relative-luminance formula: dark `#5C82FF` on `#0A0A0A` is ~5.75:1, light `#2544B0` on `#FAFAFA` is ~8.14:1 — both comfortably clear AA (4.5:1) for normal text, which matters because accent is used as **text**, not fill.

Rule: `--color-accent` and `--color-error` are the only colors carrying functional meaning. Keep the palette minimal — resist adding new colors casually; both existing functional colors were added only because of a real, unavoidable need (interactive state, validation feedback), not a stylistic want.

## Surfaces & structure

There is no glass/blur/gradient system anymore, and no grid-of-identical-rounded-cards pattern. Both are the single most common tell of generic AI-generated design (content chopped into identical rounded cards, the same soft shadow under each, gradient washes as decoration) — see the "Avoiding generic tells" section below.

- **Hairline dividers are the primary structural device.** Most content lists (testimonials, products, case studies, certifications, education, experience, writing) are `<ul class="divide-y divide-border border-t border-border">` — a top rule plus a rule between each item. No box, no shadow, no per-item border-radius.
- **`Card.svelte`** (flat `bg-surface` + `border-border`, small `rounded-sm`, no blur) is reserved for genuinely raised functional UI — currently just the contact form and booking widget panels. It is not the default wrapper for arbitrary content anymore.
- **Radius convention:** small and consistent (`rounded-sm` on buttons, inputs, `Card`) — never a full pill on a CTA button (reads as generic "SaaS app," not editorial), never zero-radius everywhere either (that's its own generic tell — see below). Small icon-only utility buttons (nav hamburger/close) are the one exception that stays `rounded-full`, since a circular icon button isn't the pattern being avoided.
- **`Button.svelte` primary variant** is a solid "ink stamp" fill: `bg-text text-bg` (swapping the already-guaranteed-high-contrast text/background pair, so no separate accent fill color is needed or verified). Secondary is an outline in the same ink color. Accent color never appears on a button.

## Typography

Self-hosted, real files (not system-font fallback) — `static/fonts/`, `@font-face` rules in `src/lib/styles/fonts.css`:

- `--font-display: 'Fraunces', ui-serif, Georgia, 'Times New Roman', serif` — a modern soft-serif with real character, used for every heading. Serif is what signals "editorial" against a field of sans-only tech sites. One variable file (`Fraunces-Variable.woff2`, weight range 400-700, normal style only — no italic, since italic emphasis on headline words is itself a generic tell, see below). SIL OFL licensed via Google Fonts, free to self-host.
- `--font-body: 'Switzer', ui-sans-serif, system-ui, sans-serif` — body/UI text, four static weight files (400/500/600/700). Free to self-host per Fontshare's license.
- Fluid type scale via `clamp()`, defined in `tokens.css`: `--text-display`, `--text-h1`, `--text-h2`, `--text-body`, `--text-small` — scale between a mobile-sane minimum and a desktop maximum, no fixed `px` sizes for typography outside this scale. `--text-display` uses a tight `line-height: 1` to suit the serif's large-scale proportions.

## Motion

| Token             | Value                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` — cheap spring-like ease-out, no JS physics engine needed |
| `--duration-fast` | `120ms`                                                                                    |
| `--duration-base` | `200ms`                                                                                    |

**Hard rule** (see CLAUDE.md): never animate `transform: scale()` or a position offset on an interactive element, on hover or otherwise. Animate `opacity`, `background-color`, `border-color`, `color`, or `text-decoration-color` only — an element's size and position must never change on interaction, so click targets stay exactly where the user expects them.

**Gotcha:** `--ease-standard` correctly generates an `ease-standard` Tailwind utility (Tailwind v4's `--ease-*` namespace does a keyed theme lookup). `--duration-*` does **not** work the same way — Tailwind's `duration-*` utility parses its suffix as a raw number, so a named key like `duration-fast` silently compiles to nothing (no error, no CSS rule — verified against the real Tailwind v4 CLI output before this was trusted). Use the canonical CSS-variable syntax instead: `duration-(--duration-fast)`, which correctly compiles to `transition-duration: var(--duration-fast)`.

## Avoiding generic AI-design tells

Kept here because it's exactly the kind of non-obvious constraint a future agent (human or AI) could easily undo by accident while "improving" a page. Calibration for what generic AI-generated design clusters around, and what this site deliberately avoids:

- **The SaaS-card kit** — content chopped into identical rounded cards, one border-radius on everything, the same soft grey shadow under each, gradient washes as decoration. This was the original design direction here and got replaced specifically because of this. See "Surfaces & structure" above.
- **A warm cream background with a high-contrast serif and a terracotta accent**, or **a near-black background with a single bright acid accent used as the only distinctive move** — this site uses a serif display face and a near-black default, but the palette stays a true neutral (never warm) and the accent is deliberately restrained (text/rules only, never a glow, never a fill) so type and structure carry the design, not the accent color.
- **A broadsheet layout with hairline rules and zero border-radius everywhere** — this site does use hairline rules extensively, but radius isn't zero across the board (see the radius convention above) — full commitment to zero-radius is its own recognizable tell.
- **Template chrome**: tracked-out ALL-CAPS eyebrow labels above headings, meta strings joined with middle dots (`A · B · C`), labels built as `WORD — fragment` with a spaced em dash, a `→` appended to link/button text. None of these appear anywhere in this codebase's copy — if you're adding a new piece of UI copy, don't reach for any of them. Prefer plain grammatical joins ("Name, Role" not "Name · Role"; "2022 to 2024" not "2022 — 2024").
- **Italicizing/coloring a single word in a headline for emphasis** — don't. If a headline needs emphasis, the whole headline's weight/size does the work.
