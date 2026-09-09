# Conventions

> Update this file when a convention itself changes — not every time you follow one.

## DRY / SOLID, in this repo's terms

- **Single Responsibility**: a component renders one piece of UI; a `.ts` file owns one cohesive concern (one content domain, one utility group, one type module). If you're reaching for "and" to describe what a file does, split it.
- **Open/Closed via data, not branching**: components should extend by taking more data, not by growing internal conditionals for every new case. If a component needs a new "kind" of thing, model it as a discriminated union in the data's types, not a new prop plus an `if`.
- **DRY**: shared UI or logic used 2+ places becomes its own component/function. Don't duplicate a card layout across sections — extract it and pass different data in.
- **No premature abstraction**: three similar-but-not-identical things don't need a shared abstraction yet. Wait for the real, current need.

## One file, one functionality

Every `.svelte` and `.ts` file has exactly one reason to exist. Concretely:

- **Good**: `TestimonialCard.svelte` renders one testimonial. `certifications.ts` exports the certifications data. `formatDate.ts` formats a date.
- **Bad**: a `Section.svelte` that renders testimonials _or_ certifications _or_ stats depending on a `type` prop. Split it into one component per section.
- **Bad**: a `utils.ts` grab-bag with unrelated helpers. One function (or one tight cluster of related functions), one file.

No barrel `index.ts` files — see [architecture.md](./architecture.md).

## Data / logic separation (hard rule — see CLAUDE.md)

Anything visible to a visitor is data, and data lives in `src/lib/content/<domain>.ts`, typed by `src/lib/content/<domain>.types.ts`. A component receives that data via props or a direct import and renders it — it contains zero hardcoded visible strings.

```ts
// src/lib/content/testimonials.types.ts
export interface Testimonial {
	name: string;
	role: string;
	quote: string;
}
```

```svelte
<!-- TestimonialCard.svelte — good: pure presentation over data -->
<script lang="ts">
	import type { Testimonial } from '$lib/content/testimonials.types';
	let { testimonial }: { testimonial: Testimonial } = $props();
</script>

<article>
	<p>{testimonial.quote}</p>
	<span>{testimonial.name}</span>
	<span>{testimonial.role}</span>
</article>
```

Never `<p>"Kamal brought a rare combination of..."</p>` hardcoded in a component — that string belongs in `testimonials.ts`.

**The boundary for `aria-label`/`aria-describedby`/etc:** a _structural or landmark_ label — `aria-label="Primary"` on a `<nav>`, `role="img"`'s accessible name for a decorative element — describes the DOM's shape, not visitor-facing copy, and is exempt from this rule; it can stay inline. A _user-action_ label — "Open menu", "Change theme (currently {theme})", anything a screen-reader user hears as the wording for something they can do — is exactly the kind of visible string this rule means, and belongs in a typed `copy/*.ts` module like any other. When in doubt: would rewording it show up in a copy review? If yes, it's content.

## Layout robustness to data changes (hard rule — see CLAUDE.md)

A component must render correctly no matter how many items or how long the text is in the data it's given — adding, removing, or editing a content entry must never visually break its component.

- **Variable-length lists**: use CSS Grid `grid-template-columns: repeat(auto-fit, minmax(<min>, 1fr))` or flexbox with `flex-wrap: wrap` — never a fixed number of columns computed from an assumed item count.
- **Variable-length text**: use `-webkit-line-clamp` (or the `line-clamp` utility) to cap visible lines gracefully, never a fixed-height container that clips text mid-word.
- **Optional fields**: if a type marks a field optional, the component must have a real, considered rendering for its absence — not just hope it's always there.
- **Mentally test at both extremes** before considering a component done: does it still look right with 1 item? With 20?

## Page titles

`SeoHead.svelte` composes the `" | Kamal Kumar"` suffix internally — pass it the bare page name (`title="Work"`, not `title="Work | Kamal Kumar"`). Use its `fullTitle` prop instead only when a page's title genuinely doesn't fit the "Page | Kamal Kumar" shape — currently just Home (`"Kamal Kumar | Builder — Cloud & DevOps Engineer"`, name-first) and the error page (`"{page.status} | Kamal Kumar"`). Pass exactly one of `title`/`fullTitle`, never both, never neither.

## Above-the-fold images

`Figure.svelte`'s `loading` prop defaults to `'lazy'` — correct for almost every image on the site, since almost every image sits below the fold on first paint. The one exception is a genuine LCP candidate visible without scrolling (currently: the Hero portrait). That caller passes `loading="eager"`, which also flips `fetchpriority` to `'high'` and sets `decoding="async"` internally — don't set `fetchpriority`/`decoding` by hand, `loading="eager"` is the one prop that decides all three. Before adding `loading="eager"` to a new caller, confirm the image is actually above the fold on first paint; marking something eager that isn't just competes with the real LCP candidate for bandwidth.

## No-scale/no-shift interactions

`Button.svelte` (`src/lib/components/primitives/Button.svelte`) is the canonical implementation of the no-hover-scale/no-shift interaction rule (see CLAUDE.md rule 2) — it only ever animates `background-color`, `border-color`, `box-shadow`, and `opacity`. Every future component with a clickable action should use `Button.svelte` rather than hand-rolling `<button>`/`<a>` styling.

For a hand-rolled interactive element that genuinely can't use `Button.svelte` (a nav link, an inline text link, a hairline-list row) — use the `transition-theme` utility (`src/lib/styles/tokens.css`) for the hover/focus color transition, not a hand-written `transition-colors duration-(--duration-fast) ease-standard` string. It's the same thing, just defined once via Tailwind v4's `@utility` + `@apply`, so every element's hover feedback moves at the same speed and the class can only ever animate color-related properties. Reach for `Button.svelte` first regardless — this utility is for the cases that genuinely aren't a button.

## Outbound fetch timeouts

Every server-side `fetch` to a third-party API (GitHub, Mailjet, Turnstile, Cloudflare's GraphQL API) sets `signal: AbortSignal.timeout(...)` — a hung upstream must never stall a request indefinitely. 4000ms is the default; the About page's GitHub fetch uses 2500ms since it's not on a critical path (a failure there just means an empty activity feed, not a broken page). The caller must still handle the resulting `TimeoutError` the same way it already handles any other failure from that call — most routes already degrade gracefully (empty state, honest "unavailable" message); `turnstile.ts` is the one exception that wraps its own fetch in a try/catch (returning `false`) rather than relying on the caller, since Turnstile verification isn't optional and a thrown error there must resolve to "not verified," not an unhandled 500.

## Structured data (`{@html}`)

JSON-LD (`buildPersonJsonLd.ts`, `buildCaseStudyJsonLd.ts` in `src/lib/utils/`) is the one legitimate use of Svelte's `{@html}` in this codebase — a `<script type="application/ld+json">` has to be injected as raw markup, there's no other way to render it. `src/lib/utils/jsonLd.ts`'s `toJsonLdScript()` is the only function allowed to produce that HTML string: it escapes every `<` in the serialized JSON so a value can never close the script tag early, even though every current caller only ever passes our own static, typed content. Each `{@html}` call site carries an `eslint-disable-next-line svelte/no-at-html-tags` comment explaining why it's safe. Don't add a second, ad hoc way to inject a script tag — extend `jsonLd.ts` if a new structured-data type is needed.

## New-page checklist

Adding a page that belongs in navigation: add it to `nav`/`footerLinks` in `src/lib/content/nav.ts`, **and** to `siteRoutes` in `src/lib/content/site.ts` (`sitemap.xml/+server.ts` reads that list, not nav/footerLinks directly). Forget the second half and `site.spec.ts` fails the next time tests run — it asserts every nav/footer href appears in `siteRoutes` — so the gap gets caught before it ships as a silent sitemap drop, not after.

## External links

Every `target="_blank"` link uses `rel="noopener"`, not `rel="noreferrer"` — standardized on the weaker of the two deliberately. `noopener` alone already closes the real security hole (the new tab can't reach back into `window.opener`); `noreferrer` additionally strips the `Referer` header, which for this site's outbound links (LinkedIn, GitHub, a blog post, a case study source) means the destination loses a legitimate, harmless signal that the click came from kamal.sh. Nothing here is sensitive enough to be worth losing that attribution.

## Prop typing

- One or two simple props: use an inline type literal, e.g. `let { children }: { children: Snippet } = $props();` (as `Container.svelte`, `Section.svelte`, and `Card.svelte` do).
- Several props: use a named `interface Props { ... }` above the component, e.g. `let { variant, href, ... }: Props = $props();` (as `Button.svelte` does).

## Adding a new testimonial

Follow this exact sequence when Kamal asks for a new recommendation to be added to `src/lib/content/testimonials.ts` — it's written down so it doesn't have to be re-explained each time:

1. **Get the quote verbatim** from Kamal (pasted from LinkedIn or wherever it was written) — never paraphrase or summarize it. `quote` is always the recommender's exact words.
2. **Get the person's own LinkedIn profile URL** and set it as `profileUrl`. If it isn't available, leave `profileUrl` unset (it's optional) rather than guessing — a missing link is honest; a wrong one isn't. `TestimonialsGrid.svelte` already renders a plain, unlinked name when `profileUrl` is absent, so this never breaks layout.
3. **Set `rating: 5`, always** — every recommendation accepted onto this page is a genuine 5-star one, a deliberate content policy (not a computed average), matching every existing entry.
4. **Derive 1-3 short tags/highlights** from the quote's own content — a skimmable summary for someone who doesn't want to read the full paragraph (e.g. "Terraform", "mentorship", "Azure migration"). Pull these from words/themes the recommender actually used, never invent a skill or trait the quote doesn't support. (This field doesn't exist on `Testimonial` yet — it's specified here for when it's added; don't backfill it onto the other 28 entries without being asked.)
5. **Set `role`** to the clearest identifying part of their LinkedIn headline at the time, trimmed for length — match the style of existing entries (e.g. `'Senior DevOps Engineer, Company Name'`).
6. **Set `date`** to when the recommendation was written (LinkedIn shows this), and insert the new entry in reverse-chronological order, matching the array's existing ordering.

## Naming

- Components: `PascalCase.svelte`.
- Content/type/util modules: `camelCase.ts`, with the types file named `<domain>.types.ts` next to `<domain>.ts`.
- One default concept per file name — the name should tell you exactly what's inside without opening it.
