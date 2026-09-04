# RedGrid Frontend — Standing Audit Prompt

You are auditing the RedGrid frontend codebase (Next.js App Router, React, TypeScript, Tailwind CSS v4, shadcn on Base UI). Run every section below against the current state of `app-frontend/src/`. Do not assume anything is already fixed — verify each check fresh by reading the actual code, not by memory of past passes. Where a check references a grep pattern, that pattern is a starting point to locate candidates; always open the file and confirm the surrounding context before flagging or clearing something, since the same pattern can be a real bug in one file and a non-issue in another (see the exceptions called out per section).

Produce your findings as a new markdown file. For each finding: name the file(s), quote the offending line(s), state why it's wrong, and give the exact fix. Group findings by severity (Critical / High / Medium / Low) and end with a recommended execution order. Do not report a check as "fixed" or "clean" just because a similar issue was addressed somewhere else in the codebase — verify per-file.

---

## 1. Responsive / mobile-first layout

Tailwind usage here must be mobile-first: unprefixed classes are the base (≤640px) layout, `sm:` (≥640px) and `lg:` (≥1024px, matching the app shell's own desktop threshold) progressively enhance it.

- Search every `grid-cols-N` usage. Any hit with no `sm:`/`md:`/`lg:`/`xl:` variant on the same element is a finding — it will not collapse to fewer columns on a narrow viewport.
- For every top-level page/hub/view component (the ones that own page-level layout, not leaf components like badges or buttons), check whether the layout degrades to a single scrollable column below `lg:`. Specifically check any two-pane or three-pane layout (list + detail, sidebar + main content, main + right rail): the container must switch between `flex-col` (stacked, mobile) and `lg:flex-row` (side-by-side, desktop) — not render both panes side-by-side unconditionally.
- Do not flag a component just because it has zero responsive prefixes in isolation — a leaf component that's rendered inside an already-responsive parent (e.g. a filterable table, a single-column tab body) doesn't need its own breakpoints. Only flag it if you can point to the actual overflow/crush that would occur on a narrow viewport.

## 2. Fixed pixel widths and heights

- Search for `w-[Npx]`, `h-[Npx]`, `min-w-[Npx]`, `max-w-[Npx]`, `min-h-[Npx]`, `max-h-[Npx]` across `.tsx` files.
- For each hit, classify it first:
  - **Layout-role width** (a side panel, rail, sidebar, drawer, or any container that spans a meaningful fraction of the viewport) → this must follow `w-full <breakpoint>:w-<value>` (full width on mobile, fixed at the breakpoint where the multi-pane layout kicks in). A bare `w-[Npx]` with no `w-full`/breakpoint base is a finding.
  - **Small form-field or inline element width** (a narrow input, a label column, a small badge/icon container — roughly under 100px and not spanning toward the viewport edge) → this does **not** need to be fluid. Do not flag these; flagging them dilutes the report and has previously caused real layout-role widths to get lost among false positives.
- For every layout-role width you flag, check `globals.css`'s `@theme` block(s) for an existing width token (`--width-panel-*`, `--width-drawer-*`, or similar) before recommending a fix — prefer reusing or extending the token scale over leaving a fixed raw pixel value in the component, and prefer the plain Tailwind class the token generates (e.g. `w-panel-sm`) over the arbitrary-value long-hand (`w-[var(--width-panel-sm)]`) when both exist for the same token — the long-hand form is a code-quality miss even when it resolves to the correct value.
- For any fixed-height container inside a modal/dialog/drawer (diagrams, charts, scrollable lists with a hardcoded `h-[Npx]`), verify it has a small-viewport fallback — either `h-[min(Npx, Xvh)]` or `max-h-[Xvh] overflow-y-auto`. A bare fixed height with no viewport-relative cap is a finding.
- Full-viewport-height containers must use `h-dvh`/`min-h-dvh`, never `h-screen`/`min-h-screen`/raw `100vh` — the latter don't account for mobile browser chrome and will clip or jump content on mobile Safari/Chrome. Any `*-screen` height utility is a finding.

## 3. Component primitives — reuse over reinvention

- List everything in `components/ui/`. For each file, confirm it is actually imported somewhere in `src/features/` or `src/app/`. Any primitive with zero imports outside its own file is dead code — a finding, regardless of how it got there (added for a use case that changed, or never wired up in the first place). Recommend either removing it or wiring it into a real use case; don't leave it in limbo.
- Search for hand-rolled equivalents of primitives that already exist in `components/ui/`:
  - **Modals/drawers:** `fixed inset-0` combined with `role="dialog"`, manual `Escape`-key `onKeyDown` handling, or a focus-trap library import, in a file that isn't itself part of `components/ui/`. If a `Dialog`/`Sheet` primitive exists in `components/ui/`, this is a finding — the custom implementation should be migrated onto it.
  - **Tabs:** a `useState` holding an "active tab" string/enum, paired with a row of buttons that call the setter and JSX that conditionally renders based on equality checks against that state. If a `Tabs` primitive exists, this is a finding.
  - **Tables:** a raw `<table>`/`<tr>`/`<td>` tag tree outside `components/ui/table.tsx` itself, when a `Table` primitive exists. Flag every file with a raw `<table>` — there is often more than one, and they tend to be structurally near-identical (fix the pattern once, verify, then apply the identical diff shape to the rest rather than re-deriving each migration).
  - **Dropdowns/menus/tooltips/popovers:** any custom absolutely-positioned floating panel triggered by a click/hover with manual outside-click-to-close logic, when the equivalent primitive exists.
- When a primitive **is** used, verify the call site uses the primitive's top-level composed export (e.g. `DialogContent`, not a hand-assembled `Portal`+`Overlay`+`Popup` built from the raw underlying library). A component that imports the raw sub-primitives directly to rebuild its own wrapper is a finding even though it's "using the primitive" — it's bypassing the composed export's built-in mobile-safe sizing, centering, and z-index handling and reintroducing the exact class of bug primitives exist to prevent (this has happened here before: a component "migrated" to a primitive still hand-built its own popup positioning and lost the mobile-safe width in the process — check specifically for this).

## 4. Accessibility

- Search for `role="button"` on non-`<button>` elements. Every hit is a finding unless there is a documented, specific reason a native `<button>` genuinely cannot be used (there almost never is). This applies with extra weight to full-screen or backdrop elements — a `role="button"` spanning the whole viewport makes the entire screen announce as one interactive control to assistive technology.
- Confirm every icon-only interactive control (an icon inside a `Button` with no visible text) has an `aria-label`.
- Confirm every modal/drawer/dropdown actually has a working focus trap and scroll lock. If it's built on the shadcn primitive, this should be automatic — but verify the call site isn't bypassing the primitive's composed export per Section 3's last bullet, since that's exactly how a focus trap can silently disappear even after "using" the right primitive.
- Cross-check the project's own ESLint config for any `jsx-a11y` rule set to `"warn"` instead of `"error"`. Treat those as if they were errors when auditing new code — a warning-level rule existing in config is not license to write code that only just clears it.

## 5. Design tokens — colors, z-index, radius, spacing

- Search for hardcoded hex colors (`#[0-9a-fA-F]{3,8}`) in `.tsx` files. The only acceptable hit is a required literal string in a metadata/config export (e.g. a `themeColor` field) that mirrors an existing CSS variable's value — everything else is a finding; it should reference a `--color-*`/semantic CSS variable via a Tailwind class instead.
- Search for raw z-index utilities (`z-10`, `z-50`, `z-[N]`, etc.) that don't correspond to a named token in `globals.css`'s `@theme` block. Check `globals.css` for the current z-index scale first — if one exists, every stacking context in the app should reference a token from it, not a bare number.
- When a token is reused, verify it's being reused for something semantically related to what it was named for. A component borrowing an unrelated token (e.g. a canvas node's hover-elevate effect using the app chrome's header z-index token, purely because the number happens to work today) is a finding even though nothing looks visually broken — it creates false coupling that will cause an unrelated future change to silently break this component.
- Search for `rounded-[Npx]` or other arbitrary radius values when a `--radius-*` scale exists in `@theme` — use the scale.
- If you find a category of repeated raw value that has no token yet (a third or later occurrence of the same kind of magic number), recommend adding a token namespace for it in `globals.css` rather than only fixing the individual occurrences.

## 6. Inline styles

- Search for `style={{...}}` usage. For each hit, determine whether the value is static (the same on every render, could be written once and never changes) or dynamic (computed from props/state/data at render time).
- Static values are a finding — they should become a Tailwind utility class, or a new `@utility` block in `globals.css` if the same static combination repeats across 3+ components.
- Dynamic, data-driven values (a computed percentage width, a color driven by a status value, an animation timing constant) are correct to leave as inline styles — do not flag these; Tailwind cannot express arbitrary runtime-computed values.

## 7. Fonts and images

- Confirm every font is loaded via `next/font/google` (or `next/font/local`) in the root layout, not via a raw `@import url(fonts.googleapis.com/...)` in CSS. A CSS-level Google Fonts import is a finding regardless of which typeface it's for — it bypasses self-hosting, `font-display` control, and causes layout shift.
- Confirm images use `next/image`, not raw `<img>` tags, except for cases where `next/image`'s optimization genuinely doesn't apply (e.g. a tiny inline SVG icon).

## 8. Next.js Server vs. Client Components

- Check whether route-level `page.tsx`/`layout.tsx` files default to Server Components. A `"use client"` directive at the very top of a route entry point is only acceptable when the route has no server-fetchable data at all (e.g. it's still running on local mock/fixture data) — flag it as a forward-looking finding either way, noting that the migration to real data fetching should introduce Server Components at the route level rather than carrying the client-only pattern forward.
- Check any `useEffect`-based data-fetching hook pattern (fetch-on-mount inside a client component). This is acceptable only for genuinely client-only data (e.g. reading from browser storage); anything that could be fetched server-side should be, once a real backend exists.
- Check any auth-gating logic that blocks rendering after mount inside a client component (`if (!ready) return null`) — this causes a flash-of-blank-page on every navigation and should move to middleware or a Server Component check.

## 9. TypeScript & general code hygiene

Run these as a fast sweep — they should all come back at zero, and any hit is a finding:

- `: any` / `<any>` / `as any` usage.
- `console.log` calls (bare `console.warn`/`console.error` are fine if the ESLint config allows them — check the config rather than assuming).
- `key={index}` / `key={i}` on list items (list keys must be a stable domain id).
- Floating (un-awaited, unhandled) promises.
- `var` usage, `==`/`!=` instead of `===`/`!==` (unless the project's own ESLint config explicitly allows `== null`).

If the project's ESLint config already encodes these as errors and the codebase passes lint, don't re-litigate the rule — just confirm the sweep is actually clean; don't skip it on the assumption that "lint would have caught it."

## 10. Tables and dense data displays

- Every table (via the shared `Table` primitive or otherwise) must be wrapped so it can scroll horizontally on a narrow viewport rather than silently clipping columns or breaking the page's horizontal bounds. Check for a scrollable wrapper (`overflow-x-auto` or the primitive's built-in scroll container) around every table instance.
- Any non-`<table>` layout that behaves like one (a fixed-column metric/KPI row, a grid of aligned cells) should get the same treatment: `overflow-x-auto` on the row container plus truncation (an ellipsis utility) on individual cells, so the failure mode on a narrow screen is scroll or truncate — never silent clipping.

---

## How to report findings

- One markdown file per audit pass, findings grouped by severity, each with exact file/line and fix.
- Call out anything that's already correct only if it's directly relevant context for a nearby finding (e.g. "this sibling panel already uses the correct pattern, mirror it here") — don't pad the report with a list of everything that passed.
- End with a recommended execution order: fix anything that constitutes an active regression or accessibility hole first (something that used to work and now doesn't, or a control that's currently unusable via keyboard/screen reader), then structural issues affecting multiple files (a missing primitive migration, a missing token category), then isolated one-file polish items last.
- Do not change visual theme colors, spacing scale, or copy while fixing any of the above — every fix in this audit is about mechanism (responsiveness, token usage, primitive reuse, accessibility, hygiene), never about changing what the product looks like or says.
