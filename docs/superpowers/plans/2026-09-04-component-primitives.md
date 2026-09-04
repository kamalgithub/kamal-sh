# Component Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the four foundational, content-agnostic UI primitives (`Container`, `Section`, `Button`, `Card`) and document the decided dual-native mechanism, so the Home page (next phase) has something real to build on.

**Architecture:** Each primitive is a single Svelte 5 component (no dual-native split — none of these fork by viewport), styled with Tailwind v4 utility classes that consume the design tokens from `src/lib/styles/tokens.css`. Each gets a component test (Vitest browser-mode, real Chromium) living next to it as `Thing.svelte.spec.ts`.

**Tech Stack:** Svelte 5 (runes), Tailwind v4, Vitest + `vitest-browser-svelte` (`@vitest/browser-playwright`, real Chromium — not jsdom), TypeScript strict mode.

**Spec:** `docs/superpowers/specs/2026-09-04-component-primitives-design.md`

## Global Constraints

- Breakpoint: `md` (768px) is the mobile/desktop split point everywhere in this codebase.
- No `transform: scale()` or position-shifting classes on any interactive element, ever, on hover or otherwise (`CLAUDE.md` rule 2) — interaction feedback is `background-color`/`border-color`/`box-shadow`/`opacity` only.
- Strict TypeScript, no `any`.
- One file, one functionality — no barrel files.
- Every visible string a component renders comes from a prop/data, never hardcoded copy baked into a primitive.
- `--duration-fast`/`--duration-base` must be referenced as `duration-(--duration-fast)` (the canonical Tailwind v4 CSS-variable syntax) — a plain `duration-fast` class silently compiles to nothing. `--ease-standard`, all `--color-*` tokens, and the `--surface-glass-*` tokens all work as plain-named or `(--token)`-syntax utilities normally (verified against the real Tailwind v4 CLI output — see `docs/design-tokens.md`).
- Component tests use `await render(...)` (not the deprecated synchronous form), query via `page.getByRole`/`page.getByText` from `vitest/browser`, and use `createRawSnippet` from `svelte` to pass `children` in tests (there's no host component needed).

---

### Task 1: `Container.svelte`

**Files:**

- Create: `src/lib/components/primitives/Container.svelte`
- Test: `src/lib/components/primitives/Container.svelte.spec.ts`

**Interfaces:**

- Produces: `Container` — a Svelte component with props `{ children: Snippet }`. Renders a `<div>` wrapper, max-width `max-w-6xl`, centered, responsive horizontal padding.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/components/primitives/Container.svelte.spec.ts
import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Container from './Container.svelte';

describe('Container.svelte', () => {
	it('renders its children', async () => {
		const children = createRawSnippet(() => ({ render: () => `<p>content</p>` }));
		await render(Container, { children });

		await expect.element(page.getByText('content')).toBeInTheDocument();
	});

	it('constrains width and centers itself', async () => {
		const children = createRawSnippet(() => ({ render: () => `<p>content</p>` }));
		const { container } = await render(Container, { children });

		const wrapper = container.querySelector('div');
		expect(wrapper?.className).toContain('max-w-6xl');
		expect(wrapper?.className).toContain('mx-auto');
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test -- Container`
Expected: FAIL — `Container.svelte` doesn't exist yet.

- [ ] **Step 3: Write the implementation**

```svelte
<!-- src/lib/components/primitives/Container.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="mx-auto max-w-6xl px-4 md:px-6">
	{@render children()}
</div>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test -- Container`
Expected: PASS (2 tests)

- [ ] **Step 5: Typecheck and lint**

Run: `bun run gen && bun run check && bun run lint`
Expected: 0 errors. If Prettier reformats anything, run `bun run format` and re-check.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/primitives/Container.svelte src/lib/components/primitives/Container.svelte.spec.ts
git commit -m "feat: add Container primitive"
```

---

### Task 2: `Section.svelte`

**Files:**

- Create: `src/lib/components/primitives/Section.svelte`
- Test: `src/lib/components/primitives/Section.svelte.spec.ts`

**Interfaces:**

- Produces: `Section` — a Svelte component with props `{ children: Snippet }`. Renders a `<section>` wrapper with vertical rhythm spacing (`py-16 md:py-24`).

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/components/primitives/Section.svelte.spec.ts
import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Section from './Section.svelte';

describe('Section.svelte', () => {
	it('renders its children inside a <section>', async () => {
		const children = createRawSnippet(() => ({ render: () => `<p>content</p>` }));
		const { container } = await render(Section, { children });

		await expect.element(page.getByText('content')).toBeInTheDocument();
		expect(container.querySelector('section')).not.toBeNull();
	});

	it('applies vertical rhythm spacing', async () => {
		const children = createRawSnippet(() => ({ render: () => `<p>content</p>` }));
		const { container } = await render(Section, { children });

		const wrapper = container.querySelector('section');
		expect(wrapper?.className).toContain('py-16');
		expect(wrapper?.className).toContain('md:py-24');
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test -- Section`
Expected: FAIL — `Section.svelte` doesn't exist yet.

- [ ] **Step 3: Write the implementation**

```svelte
<!-- src/lib/components/primitives/Section.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<section class="py-16 md:py-24">
	{@render children()}
</section>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test -- Section`
Expected: PASS (2 tests)

- [ ] **Step 5: Typecheck and lint**

Run: `bun run gen && bun run check && bun run lint`
Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/primitives/Section.svelte src/lib/components/primitives/Section.svelte.spec.ts
git commit -m "feat: add Section primitive"
```

---

### Task 3: `Button.svelte`

**Files:**

- Create: `src/lib/components/primitives/Button.svelte`
- Test: `src/lib/components/primitives/Button.svelte.spec.ts`

**Interfaces:**

- Produces: `Button` — a Svelte component with props:

  ```ts
  interface Props {
  	variant?: 'primary' | 'secondary'; // default 'primary'
  	href?: string; // renders <a> instead of <button> when given
  	type?: 'button' | 'submit'; // default 'button', ignored when href is given
  	disabled?: boolean; // default false, ignored when href is given
  	onclick?: (event: MouseEvent) => void;
  	children: Snippet;
  }
  ```

  This is the canonical implementation of the no-scale/no-shift interaction rule — every future component with a clickable action should use `Button`, not hand-roll its own `<button>`/`<a>` styling.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/components/primitives/Button.svelte.spec.ts
import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it, vi } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Button from './Button.svelte';

describe('Button.svelte', () => {
	const label = createRawSnippet(() => ({ render: () => `<span>Click me</span>` }));

	it('renders as a button and fires onclick', async () => {
		const onclick = vi.fn();
		await render(Button, { children: label, onclick });

		await page.getByRole('button', { name: 'Click me' }).click();

		expect(onclick).toHaveBeenCalledOnce();
	});

	it('renders as a link when href is given', async () => {
		await render(Button, { children: label, href: 'https://example.com' });

		await expect.element(page.getByRole('link', { name: 'Click me' })).toBeInTheDocument();
	});

	it('never uses a transform-based hover/interaction effect', async () => {
		const { container } = await render(Button, { children: label });

		const element = container.querySelector('button');
		expect(element?.className).not.toMatch(/(?:^|\s)(?:hover:)?scale-/);
		expect(element?.className).not.toMatch(/(?:^|\s)(?:hover:)?translate-/);
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test -- Button`
Expected: FAIL — `Button.svelte` doesn't exist yet.

- [ ] **Step 3: Write the implementation**

```svelte
<!-- src/lib/components/primitives/Button.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary';
		href?: string;
		type?: 'button' | 'submit';
		disabled?: boolean;
		onclick?: (event: MouseEvent) => void;
		children: Snippet;
	}

	let {
		variant = 'primary',
		href,
		type = 'button',
		disabled = false,
		onclick,
		children
	}: Props = $props();

	const base =
		'inline-flex min-h-11 min-w-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-[background-color,border-color,box-shadow] duration-(--duration-fast) ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50';

	const variants = {
		primary: 'bg-accent text-white hover:bg-accent/90',
		secondary: 'border border-border bg-transparent text-text hover:bg-surface'
	} as const;

	const classes = $derived(`${base} ${variants[variant]}`);
</script>

{#if href}
	<a {href} class={classes}>
		{@render children()}
	</a>
{:else}
	<button {type} {disabled} {onclick} class={classes}>
		{@render children()}
	</button>
{/if}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test -- Button`
Expected: PASS (3 tests)

- [ ] **Step 5: Typecheck and lint**

Run: `bun run gen && bun run check && bun run lint`
Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/primitives/Button.svelte src/lib/components/primitives/Button.svelte.spec.ts
git commit -m "feat: add Button primitive"
```

---

### Task 4: `Card.svelte`

**Files:**

- Create: `src/lib/components/primitives/Card.svelte`
- Test: `src/lib/components/primitives/Card.svelte.spec.ts`

**Interfaces:**

- Produces: `Card` — a Svelte component with props `{ children: Snippet }`. Renders a `<div>` glass-surface wrapper using the `--surface-glass-*` tokens.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/components/primitives/Card.svelte.spec.ts
import { createRawSnippet } from 'svelte';
import { page } from 'vitest/browser';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import Card from './Card.svelte';

describe('Card.svelte', () => {
	it('renders its children inside a glass surface', async () => {
		const children = createRawSnippet(() => ({ render: () => `<p>content</p>` }));
		const { container } = await render(Card, { children });

		await expect.element(page.getByText('content')).toBeInTheDocument();
		const wrapper = container.querySelector('div');
		expect(wrapper?.className).toContain('bg-(--surface-glass-bg)');
		expect(wrapper?.className).toContain('backdrop-blur-(--surface-glass-blur)');
	});
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `bun run test -- Card`
Expected: FAIL — `Card.svelte` doesn't exist yet.

- [ ] **Step 3: Write the implementation**

```svelte
<!-- src/lib/components/primitives/Card.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div
	class="rounded-2xl border border-(--surface-glass-border) bg-(--surface-glass-bg) p-6 backdrop-blur-(--surface-glass-blur)"
>
	{@render children()}
</div>
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `bun run test -- Card`
Expected: PASS (1 test)

- [ ] **Step 5: Typecheck and lint**

Run: `bun run gen && bun run check && bun run lint`
Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/components/primitives/Card.svelte src/lib/components/primitives/Card.svelte.spec.ts
git commit -m "feat: add Card primitive"
```

---

### Task 5: Document the CSS-only dual-native mechanism

**Files:**

- Modify: `docs/architecture.md` (the "Dual-native mobile/desktop components" section)

**Interfaces:**

- Consumes: nothing from Tasks 1-4.
- Produces: nothing consumed by future tasks — this is documentation only, closing out the decision already made in the spec.

- [ ] **Step 1: Replace the vague mechanism sentence with the decided one**

In `docs/architecture.md`, find this paragraph under "Dual-native mobile/desktop components":

```
- `Thing.svelte` — the orchestrator. Owns shared state/data, decides which variant to render based on viewport (e.g. a `media` query check), and renders exactly one of the two below.
```

Replace the whole "Dual-native mobile/desktop components" section body with:

```markdown
Used only where mobile and desktop behavior _genuinely diverges_ — different interaction model, different information density, not just a different arrangement of the same elements. Don't reach for this pattern for something a CSS breakpoint handles fine.

**Mechanism (CSS-only dual render, decided 2026-09-04):** the orchestrator renders both variants unconditionally; Tailwind responsive classes show exactly one. No JavaScript is needed for the switch, there's no hydration mismatch or flash-of-wrong-variant risk, and it composes cleanly with full prerendering.

\`\`\`svelte
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
\`\`\`

Both variants receive the same typed data/props from the orchestrator — they differ in interaction and layout, not in what data they're allowed to show.
```

- [ ] **Step 2: Lint**

Run: `bun run lint`
Expected: 0 errors (run `bun run format` first if Prettier flags the markdown).

- [ ] **Step 3: Commit**

```bash
git add docs/architecture.md
git commit -m "docs: document the decided CSS-only dual-native mechanism"
```

---

## Self-review notes

- **Spec coverage:** all 4 primitives from the spec (Container, Section, Button, Card) have tasks; the dual-native mechanism decision has a task; spacing explicitly uses Tailwind defaults (no task needed, nothing to build); fonts are explicitly out of scope per the spec (no task, correctly absent here).
- **Type consistency:** `Snippet` (from `'svelte'`) and `children: Snippet` are used identically across all 4 components. `Button`'s `Props` interface is self-contained within Task 3, not referenced elsewhere.
- **Placeholder scan:** no TBD/TODO; every step has real, complete code.
