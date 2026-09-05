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

## Layout robustness to data changes (hard rule — see CLAUDE.md)

A component must render correctly no matter how many items or how long the text is in the data it's given — adding, removing, or editing a content entry must never visually break its component.

- **Variable-length lists**: use CSS Grid `grid-template-columns: repeat(auto-fit, minmax(<min>, 1fr))` or flexbox with `flex-wrap: wrap` — never a fixed number of columns computed from an assumed item count.
- **Variable-length text**: use `-webkit-line-clamp` (or the `line-clamp` utility) to cap visible lines gracefully, never a fixed-height container that clips text mid-word.
- **Optional fields**: if a type marks a field optional, the component must have a real, considered rendering for its absence — not just hope it's always there.
- **Mentally test at both extremes** before considering a component done: does it still look right with 1 item? With 20?

## No-scale/no-shift interactions

`Button.svelte` (`src/lib/components/primitives/Button.svelte`) is the canonical implementation of the no-hover-scale/no-shift interaction rule (see CLAUDE.md rule 2) — it only ever animates `background-color`, `border-color`, `box-shadow`, and `opacity`. Every future component with a clickable action should use `Button.svelte` rather than hand-rolling `<button>`/`<a>` styling.

## Structured data (`{@html}`)

JSON-LD (`buildPersonJsonLd.ts`, `buildCaseStudyJsonLd.ts` in `src/lib/utils/`) is the one legitimate use of Svelte's `{@html}` in this codebase — a `<script type="application/ld+json">` has to be injected as raw markup, there's no other way to render it. `src/lib/utils/jsonLd.ts`'s `toJsonLdScript()` is the only function allowed to produce that HTML string: it escapes every `<` in the serialized JSON so a value can never close the script tag early, even though every current caller only ever passes our own static, typed content. Each `{@html}` call site carries an `eslint-disable-next-line svelte/no-at-html-tags` comment explaining why it's safe. Don't add a second, ad hoc way to inject a script tag — extend `jsonLd.ts` if a new structured-data type is needed.

## Prop typing

- One or two simple props: use an inline type literal, e.g. `let { children }: { children: Snippet } = $props();` (as `Container.svelte`, `Section.svelte`, and `Card.svelte` do).
- Several props: use a named `interface Props { ... }` above the component, e.g. `let { variant, href, ... }: Props = $props();` (as `Button.svelte` does).

## Adding a new testimonial

Follow this exact sequence when Kamal asks for a new recommendation to be added to `src/lib/content/testimonials.ts` — it's written down so it doesn't have to be re-explained each time:

1. **Get the quote verbatim** from Kamal (pasted from LinkedIn or wherever it was written) — never paraphrase or summarize it. `quote` is always the recommender's exact words.
2. **Get the person's own LinkedIn profile URL** and set it as `profileUrl`. If it isn't available, leave `profileUrl` unset (it's optional) rather than guessing — a missing link is honest; a wrong one isn't. `TestimonialsGrid.svelte` already renders a plain, unlinked name when `profileUrl` is absent, so this never breaks layout.
3. **Set `rating: 5`, always** — every recommendation accepted onto this page is a genuine 5-star one, a deliberate content policy (not a computed average), matching every existing entry.
4. **Derive 1-3 short tags/highlights** from the quote's own content — a skimmable summary for someone who doesn't want to read the full paragraph (e.g. "Terraform", "mentorship", "Azure migration"). Pull these from words/themes the recommender actually used, never invent a skill or trait the quote doesn't support. (This field doesn't exist on `Testimonial` yet — it's specified here for when it's added; don't backfill it onto the other 27 entries without being asked.)
5. **Set `role`** to the clearest identifying part of their LinkedIn headline at the time, trimmed for length — match the style of existing entries (e.g. `'Senior DevOps Engineer, Company Name'`).
6. **Set `date`** to when the recommendation was written (LinkedIn shows this), and insert the new entry in reverse-chronological order, matching the array's existing ordering.

## Naming

- Components: `PascalCase.svelte`.
- Content/type/util modules: `camelCase.ts`, with the types file named `<domain>.types.ts` next to `<domain>.ts`.
- One default concept per file name — the name should tell you exactly what's inside without opening it.
