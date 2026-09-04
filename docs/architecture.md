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

- **Prerender by default.** Every route whose content doesn't depend on the individual request should set `export const prerender = true` (or rely on the top-level default once one is set) — this is a personal site, almost everything is static at build time and should be served as static assets for instant loads.
- **SSR only where genuinely required** — currently just the future contact-form submission route. Don't reach for SSR because it's the path of least resistance; justify it against "does this truly need per-request server computation."
- Route files stay thin: a `+page.svelte` imports content from `src/lib/content/` and composes components from `src/lib/components/` — it does not itself contain business logic or hardcoded copy.

## Dual-native mobile/desktop components

Used only where mobile and desktop behavior _genuinely diverges_ — different interaction model, different information density, not just a different arrangement of the same elements. Don't reach for this pattern for something a CSS breakpoint handles fine.

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

Each content domain (`profile`, `experience`, `education`, `certifications`, `testimonials`, `stats`, `case-studies`, `products/`, `writing/`, `youtube/`, etc.) gets its own `<domain>.ts` + `<domain>.types.ts` pair in `src/lib/content/`. This mirrors how the data is already organized at the source (see the content-inventory captured from the previous site) and keeps each domain independently editable without touching unrelated ones.

Where a domain is split into multiple entities that each deserve their own file (e.g. `products/`), each entity gets its own file plus one small aggregate file (e.g. `products.ts`) whose only job is exporting the combined list — that aggregate is a genuine single-purpose file, not a barrel.

## Externally-synced content (`writing/`, `youtube/`)

Blog posts and YouTube videos aren't authored here — they're synced from external Atom feeds by standalone scripts under `scripts/`, which write typed, checked-in JSON snapshots (`src/lib/content/writing/posts.generated.json`, `src/lib/content/youtube/videos.generated.json`). The deployed site never fetches these feeds at runtime — it only ever reads the last-synced JSON, so an upstream feed outage can't break the live site.

- `bun run sync:blog` / `bun run sync:youtube` run the sync scripts locally.
- `.github/workflows/content-sync.yml` runs both on a ~48h schedule (plus manual dispatch) and commits any changes.
- Each sync script fails loudly (non-zero exit, clear stderr message) on any fetch/parse error and — critically — **does not touch the existing generated JSON** when it fails. The two syncs are independent in CI: one feed being down doesn't block the other from updating.
- `scripts/lib/` holds the small helpers shared by both scripts (Atom parsing primitives, "take the N most recent", "write generated JSON"). Don't duplicate this logic if a third synced-content source is ever added — extend `scripts/lib/` instead.
