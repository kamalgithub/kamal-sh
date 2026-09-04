# Component-system foundation: primitives + the dual-native pattern

## Context

The site's content is now migrated (`src/lib/content/`) and the design tokens exist (`src/lib/styles/tokens.css`). Nothing renders any of it yet — `src/routes/+page.svelte` is still a placeholder. The original brief described a comprehensive 100+ component library, but that's speculative scope: this repo's own rules (`CLAUDE.md`'s no-premature-abstraction, least-code, and YAGNI principles) argue against designing dozens of components before any real page proves what's actually needed.

This spec covers only the **system**: the foundational, content-agnostic primitives every page will build on, and a concrete, decided mechanism for the dual-native (mobile/desktop) pattern that `docs/architecture.md` already describes in the abstract. Actual page-specific components (Nav, Hero, StatsBand, TestimonialCard, etc.) are explicitly out of scope here — they get built against real content during the Home page implementation, which follows this spec.

## Breakpoint

`md` (768px, Tailwind v4's default) is the mobile/desktop split point for every dual-native component: below `md` renders the mobile variant, `md` and up renders the desktop variant.

## Dual-native mechanism (decided)

`docs/architecture.md` already documents the shape (orchestrator + `XMobile`/`XDesktop`) but left the actual mobile/desktop decision mechanism open. This spec settles it: **CSS-only dual render**.

The orchestrator component renders both variants unconditionally in markup; Tailwind responsive utility classes show exactly one:

```svelte
<!-- Thing.svelte -->
<script lang="ts">
	import ThingMobile from './ThingMobile.svelte';
	import ThingDesktop from './ThingDesktop.svelte';
	let { ...props } = $props();
</script>

<div class="md:hidden">
	<ThingMobile {...props} />
</div>
<div class="hidden md:block">
	<ThingDesktop {...props} />
</div>
```

Chosen over a `matchMedia`/`ResizeObserver`-driven approach because: no JavaScript is needed for the switch itself, there's no hydration mismatch or flash-of-wrong-variant risk, and it composes cleanly with full prerendering (there's no server-side viewport to detect against). The cost — both variants' markup shipping in the HTML — is negligible for a personal site and cheap under gzip.

This section of `docs/architecture.md`'s "Dual-native mobile/desktop components" gets updated to state this mechanism explicitly once implemented, replacing the current vaguer "decides which variant to render based on viewport" phrasing.

## Primitives (this pass)

Four components, none of them dual-native themselves — their responsive behavior is ordinary breakpoint-driven CSS, not a structural fork (per the existing rule: don't split into Mobile/Desktop variants for something a breakpoint handles fine).

`src/lib/components/primitives/`:

- **`Container.svelte`** — max-width + responsive horizontal padding wrapper. `max-w-6xl` (1152px), `px-4` on mobile, `px-6` at `md` and up. Takes children via a snippet/slot; no other props needed yet.
- **`Section.svelte`** — vertical rhythm wrapper for a page section (consistent top/bottom spacing between sections down the page). Takes children via a snippet/slot.
- **`Button.svelte`** — the canonical implementation of the site's no-scale/no-shift interaction rule (`CLAUDE.md` rule 2). Hover/focus feedback is `background-color`/`border-color`/`box-shadow` only, using the `--duration-fast` and `--ease-standard` motion tokens — never `transform`. Minimum 44×44px touch target. Visible focus ring using `--color-accent`. Supports at least a primary and a secondary visual variant (exact prop shape decided at implementation time, following existing Svelte 5 prop conventions).
- **`Card.svelte`** — the glass-surface primitive, built on the `--surface-glass-*` tokens from `docs/design-tokens.md`. Takes children via a snippet/slot.

## Spacing

No new tokens — Tailwind's default spacing scale is used as-is. Nothing about this site's needs justifies a custom scale yet.

## Explicitly out of scope for this pass

- Any content-bearing component (Nav, Hero, StatsBand, TestimonialCard, CertificationGrid, BookingWidget, etc.) — built during the Home page implementation, driven by real content and layout needs rather than speculation.
- The booking flow and Mailgun email integration — separate subsystems, each gets its own brainstorm + spec later.
- Fonts — self-hosted Switzer/Inter `.woff2` files and `@font-face` rules are deferred to "when the first real page is built" per `docs/design-tokens.md`; that's the Home page pass, not this one.

## Testing / verification

- `bun run check`, `bun run lint`, `bun run build` after the four primitives exist — same gates as every prior change in this repo.
- No meaningful visual/resize verification is possible from the primitives alone, since none of them fork by viewport. Real dual-native visual verification (resizing the browser between mobile and desktop widths and confirming exactly one variant renders) happens once Home's Nav/Hero consume the pattern for the first time.
