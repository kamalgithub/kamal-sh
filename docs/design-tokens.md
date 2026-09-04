# Design tokens

> Update this file when a token is added/changed/removed — not when a component merely uses one.

All tokens live in `src/lib/styles/tokens.css` as CSS custom properties, and are mapped into Tailwind v4 utility classes via an `@theme` block in the same file (Tailwind v4 is CSS-first — there is no `tailwind.config.js`). Components consume tokens through Tailwind classes (`bg-surface`, `text-accent`, `font-display`) or, where Tailwind has no matching utility (glass blur, the aurora gradient), directly via `var(--token-name)`. **Never hardcode a hex value, font name, or timing value in a component** — add or reuse a token instead.

This is a first-pass skeleton: values are concrete enough to build against now, and get refined visually once real components exist — but the _system_ (what tokens exist, what they're for) is settled.

## Color

Dark is the default; light is a fully equal mode, not an afterthought (`prefers-color-scheme`, with a manual override to come with the theme-toggle component later).

| Token                | Dark                                                             | Light     | Use                                                                                                                      |
| -------------------- | ---------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--color-bg`         | `#0A0A0B`                                                        | `#FAFAFA` | page background                                                                                                          |
| `--color-surface`    | `#131316`                                                        | `#FFFFFF` | cards, panels                                                                                                            |
| `--color-border`     | `#232328`                                                        | `#E5E5E8` | hairline borders                                                                                                         |
| `--color-text`       | `#F5F5F7`                                                        | `#0A0A0B` | primary text                                                                                                             |
| `--color-text-muted` | `#9A9AA2`                                                        | `#6B6B73` | secondary text                                                                                                           |
| `--color-accent`     | `#6366F1`                                                        | `#6366F1` | links, focus rings, active states — the **one** functional accent                                                        |
| `--gradient-aurora`  | `linear-gradient(135deg, #14B8A6 0%, #6366F1 55%, #8B5CF6 100%)` | same      | **decorative only**, at most one or two focal moments per page (e.g. hero glow) — never repeated per-card, never on text |

Rule: `--color-accent` is the only color carrying functional meaning (interactive/active). The aurora gradient is decoration, used sparingly enough that it reads as a signature moment, not a pattern. Keep the overall palette minimal — resist adding new colors casually.

## Glass surfaces

Used only on a small set of elevated surfaces at once (nav bar, a card on hover/focus, a sheet/modal) — never full-page blur, never many glass surfaces stacked/visible simultaneously (cost + visual noise).

| Token                    | Value                                                                 |
| ------------------------ | --------------------------------------------------------------------- |
| `--surface-glass-bg`     | `rgba(255, 255, 255, 0.04)` (dark) / `rgba(10, 10, 11, 0.04)` (light) |
| `--surface-glass-border` | `rgba(255, 255, 255, 0.08)` (dark) / `rgba(10, 10, 11, 0.08)` (light) |
| `--surface-glass-blur`   | `14px`                                                                |

## Typography

- `--font-display: 'Switzer', ui-sans-serif, system-ui, sans-serif` — headings, wide weight range for weight-contrast typography.
- `--font-body: 'Inter', ui-sans-serif, system-ui, sans-serif` — body/UI text.
- Self-hosted variable `.woff2` files + `@font-face` rules get added when the first real page is built (not in this foundation pass) — `font-display: swap` is required when they land, no exceptions, so text is never invisible while fonts load.
- Fluid type scale via `clamp()`, defined in `tokens.css`: `--text-display`, `--text-h1`, `--text-h2`, `--text-body`, `--text-small` — scale between a mobile-sane minimum and a desktop maximum, no fixed `px` sizes for typography outside this scale.

## Motion

| Token             | Value                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------ |
| `--ease-standard` | `cubic-bezier(0.22, 1, 0.36, 1)` — cheap spring-like ease-out, no JS physics engine needed |
| `--duration-fast` | `120ms`                                                                                    |
| `--duration-base` | `200ms`                                                                                    |

**Hard rule** (see CLAUDE.md): never animate `transform: scale()` or a position offset on an interactive element, on hover or otherwise. Animate `opacity`, `background-color`, `border-color`, or `box-shadow` (for glow) only — an element's size and position must never change on interaction, so click targets stay exactly where the user expects them.
