# CLAUDE.md

This is Kamal Kumar's personal site (kamal.sh) — a fast, minimal, skimmable **web application**, not a marketing website. It is built and maintained almost entirely by AI agents across many sessions. These rules exist so future changes stay consistent without a human re-reviewing every diff — follow them exactly, don't reinterpret them.

## Hard rules — non-negotiable

1. **No database.** Content is static, typed data. The only dynamic surface is the contact form (Mailgun) and, later, the booking flow.
2. **No hover scale, no hover position shift, ever.** Interactive elements never change size or move on hover/focus. Feedback is color, opacity, border only — click targets must stay exactly where the user expects them.
3. **Native-first dependency policy.** Before adding any package: can Svelte 5 runes or a browser API do this? Is there a SvelteKit-official or Svelte-core-maintained package? Only after both are "no" do you reach for a third-party library, and then exactly one — the most reliable option, never two libraries solving the same problem.
4. **Data/logic separation is absolute.** Anything a visitor can read — headings, labels, button text, alt text — lives in a typed `src/lib/content/*.ts` module. Components render data; they never contain hardcoded copy. See [docs/conventions.md](./docs/conventions.md).
5. **Components are robust to data changes.** Adding, removing, or lengthening a data item must never visually deform its component. See the layout-robustness section in [docs/conventions.md](./docs/conventions.md).
6. **Strict TypeScript, no `any`.** `tsconfig.json` is `strict: true`; keep it that way.
7. **One file, one functionality.** A component does one UI thing; a `.ts` file owns one cohesive concern. No barrel `index.ts` re-export files — import directly from the source file. See [docs/conventions.md](./docs/conventions.md).
8. **Judge mobile and desktop independently, every time.** Don't assume a desktop-shaped feature works on mobile just because it has responsive classes. Before building anything interactive, decide separately: does this genuinely work on a touch screen with no keyboard and little space? If a feature works well shared (most content, most static pages), a CSS breakpoint is enough. If it wouldn't — a different interaction model, no sane touch equivalent, no room for it — build the dual-native split (see [docs/architecture.md](./docs/architecture.md)) or deliberately omit/replace the feature on the platform it doesn't fit. Never ship a feature "because it happened to also work" on the platform it wasn't designed for — decide on purpose, both ways, every time.
9. **Prerender everything that can be prerendered.** SSR is reserved for genuinely dynamic routes only. See [docs/architecture.md](./docs/architecture.md).
10. **Record standing decisions immediately.** When the user states a preference, decision, or standard in conversation that should outlive the current change — a design rule, a technical constraint, something to prefer or avoid going forward — write it into the relevant `docs/*.md` file (or here, if it's cross-cutting) in the same session, before moving on to the next thing. Chat history doesn't carry forward to the next session; these files are the only memory this project has.

## Where things live

| Question                                                                                            | Doc                                              |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| How is SvelteKit / Tailwind v4 / TypeScript / wrangler / bun configured and used here?              | [docs/tooling.md](./docs/tooling.md)             |
| Where does a new file go? What's the routing/rendering strategy? What's the dual-native pattern?    | [docs/architecture.md](./docs/architecture.md)   |
| How do I structure a component or data module? What does DRY/SOLID mean concretely here?            | [docs/conventions.md](./docs/conventions.md)     |
| What are the color/type/motion tokens and how do I use them? What's the editorial design direction? | [docs/design-tokens.md](./docs/design-tokens.md) |

## Before you touch code

1. Read the `docs/*.md` section relevant to what you're changing.
2. Follow the existing pattern for that kind of file — don't invent a new one.
3. Touch only the files required for the task. Don't refactor, rename, or "clean up" unrelated code.
4. If your change affects what a `docs/*.md` file describes, update that file in the same change. If it doesn't, leave every other doc alone.

## Worked example — adding a new content field

Say a `Certification` needs a `credentialUrl` field:

1. Add `credentialUrl: string` (or `?: string` if not every entry has one) to `src/lib/content/certifications.types.ts`.
2. Add the value to the relevant entries in `src/lib/content/certifications.ts`.
3. Update the component that renders certifications to read `credentialUrl` from the data — never hardcode a URL in the component.
4. If `credentialUrl` is optional, make sure the component renders correctly whether it's present or not (rule 5 above) — don't assume every entry has it.

That's the whole pattern: type → data → consuming component. It applies to every content domain in `src/lib/content/`.
