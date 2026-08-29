# RedGrid Frontend — Engineering Blueprint

**Purpose:** this is the standing reference for how this codebase is built. It is not an audit — it has no findings, no file:line references, no priority order. It's the set of rules distilled from four audit-and-fix rounds on `app-frontend.zip`, written so that any future change (new feature, new page, new component, bug fix, or another AI agent pass) follows the same conventions this codebase has already converged on. When in doubt on a future change, follow this file over instinct or generic best-practice defaults — it reflects decisions already made and verified for this specific app.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript 5.7 (strict) · Tailwind CSS v4 · shadcn (`base-nova` style, Base UI primitives, not Radix) · React Hook Form + Zod · Vitest · ESLint 9 (flat config) + Prettier.

---

## 1. Component architecture

- **Feature-folder structure.** Every feature lives under `src/features/<name>/` with a consistent internal shape: `components/`, `data/` (repositories + `fixtures/` for mock data), `hooks/`, `domain/` (pure business logic, framework-agnostic), and an `index.ts` barrel export. New features follow this exact shape — don't invent a new internal layout per feature.
- **Container/View split for anything stateful.** Non-trivial features split into `<Feature>Container.tsx` (state, data-fetching, event handlers) and `<Feature>View.tsx` (pure rendering, props in, JSX out) — see `NewMissionWizardContainer`/`View`, `SettingsPageContainer`/`View`, `TeamManagerDashboardContainer`/`View`, `AttackGraphCanvasContainer`/`View`. Simple, mostly-static features (e.g. `MissionsPage.tsx`) don't need the split — only add it once a component owns real state/logic, not preemptively.
- **`components/ui/`** is reserved for the shadcn primitive layer (Base UI wrappers, `cva`-based variants) plus a handful of truly generic, app-wide atoms (`EmptyState`, `MetricTile`, `StatusBadge`, `GeometricMark`, `KPIStrip`). Feature-specific UI, however small, belongs in `features/<name>/components/`, not here.
- **No dead primitives.** If a shadcn component is added to `components/ui/`, it must be imported somewhere in the same change. An installed-but-unused primitive is worse than not having it — it signals "this pattern is already handled" to the next contributor and causes them to skip auditing for it. Either wire it up or don't add it yet.
- **Don't hand-roll what a primitive already solves.** Before writing a custom modal, drawer, dropdown, popover, tabs, table, or tooltip from scratch (manual `fixed inset-0` + `role="dialog"` + focus management + `Escape`-key wiring, or `useState` + button-row tab switching), check `components/ui/` first. This codebase spent three fix-rounds migrating exactly this kind of hand-rolled logic onto `Dialog`/`Sheet`/`Tabs`/`Table` — do not reintroduce it in new code. If the primitive doesn't exist yet, add it via `npx shadcn@latest add <name>` (it will inherit theme tokens automatically via `components.json`) rather than building the equivalent by hand.
- **Prefer a real interactive element over ARIA-on-a-div.** A clickable region is a `<button type="button">` (styled via the `Button` component and its variants), not a `<div role="button" tabIndex={0} onKeyDown={...}>`. This applies doubly to backdrops/overlays — those are handled by the `Dialog`/`Sheet` primitive automatically; don't add manual roles to them.

## 2. Next.js / React Server vs. Client Components

- **Don't default to `"use client"`.** Every route currently under `src/app/(app)/**` is a Client Component because the app is still running entirely on local fixture data (`data/fixtures/*`). This is acceptable for the current mock-data phase, but it is **not** the pattern for new routes once a real backend exists: a `page.tsx`/`layout.tsx` should be a Server Component by default, fetching data server-side and passing it down as props. Only the leaf components that actually need interactivity, hooks, or browser APIs get `"use client"`.
- **When real data fetching lands, replace `useEffect`-based fetching in a client hook (the current `useMissionsData`/`useBenchmarksData`/etc. pattern) with a server-side fetch in the page component**, and wrap data-dependent regions in `<Suspense fallback={...}>` using the existing `EmptyState` component as the skeleton/fallback visual language.
- **Auth gating belongs server-side, not in a post-mount client check.** The current `useAuthGuard` pattern (`if (!isReady) return null` inside a client layout) causes a flash-of-blank-page on every navigation. Once real auth exists, gate protected routes in `middleware.ts` or a Server Component check instead.
- **Fonts always go through `next/font/google`** (see `app/layout.tsx`: `Geist` for sans, `JetBrains_Mono` for mono), never a raw `@import url(fonts.googleapis.com/...)` in CSS — that bypasses self-hosting, `font-display` control, and causes FOUT/CLS on the app's primary UI font.
- **Images go through `next/image`**, not raw `<img>` tags, for anything beyond a static SVG icon.

## 3. TypeScript & linting

The existing `eslint.config.mjs` is the contract — it is already strict and already fully passing (0 `any`, 0 `console.log` outside `warn`/`error`, 0 array-index keys, 0 floating promises, full `jsx-a11y` coverage). Any new code must pass it unmodified. Specific rules worth internalizing rather than just satisfying mechanically:

- `no-explicit-any` — type everything; if a type is genuinely unknown, use `unknown` and narrow it, never `any`.
- `no-array-index-key` — list keys are a stable domain id (`item.id`), never the array index.
- `consistent-type-imports` — `import { type Foo } from "..."` for type-only imports.
- `no-floating-promises` / `await-thenable` — every promise is awaited or explicitly voided; no fire-and-forget async calls.
- `jsx-a11y/*` — currently `click-events-have-key-events` and `no-noninteractive-element-interactions` are set to `"warn"` rather than `"error"` as a legacy allowance from before the a11y cleanup; new code should be written as if they were errors (avoid the pattern entirely) rather than relying on the warning threshold.
- Run `npm run lint:fix` and `npm run format` (Prettier + `@ianvs/prettier-plugin-sort-imports` + `prettier-plugin-tailwindcss`, 4-space indent) before considering any change finished — formatting and import order are automated, don't hand-format.

## 4. Design tokens (`globals.css`) — the single source of truth for styling constants

Every category of "magic number" this app has had a problem with (colors, panel widths, z-index) now has a token namespace in `globals.css`'s `@theme` block(s). **Before writing any new arbitrary Tailwind value (`w-[Npx]`, `z-[N]`, a hex color), check whether an existing token already covers it — and if a whole new category of repeated magic number shows up, add a token namespace for it instead of scattering the raw values.**

- **Colors** — `--background`, `--foreground`, `--primary`, `--card`, `--muted`, `--border`, `--success`, `--warning`, `--destructive`, `--info`, `--accent-purple`, etc., wired through `@theme inline` into Tailwind color utilities (`bg-background`, `text-muted-foreground`, ...). Never hardcode a hex value in a component — the only legitimate hex literals in the app are the couple of required string values in metadata exports (`themeColor` in `app/layout.tsx`), which must still match the token's value.
- **Panel/drawer widths** — `--width-panel-2xs` (140px) through `--width-panel-3xl` (760px), plus the narrower/wider variants (`-sm-narrow`, `-sm-alt`, `-md-wide`), and `--width-drawer-sm/md/lg`. These map onto real Tailwind classes (`w-panel-sm`, `max-w-panel-md-wide`, etc.) via the `@theme` block. Any new side panel, rail, or drawer should reuse the closest existing token; only add a new one if none of the current values are close enough, and add it to this same block rather than inlining a raw pixel value.
- **Z-index** — `--z-tooltip` (100) > `--z-modal` (50) > `--z-drawer` (40) > `--z-header` (30) > `--z-node-hover` (10) > `--z-node-base` (1). This is an ordered stacking scale, not a grab-bag — a new stacking context should slot into this ordering semantically (e.g. a new overlay above modals but below tooltips gets a value between 50 and 100, named for what it is, not borrowed from an unrelated existing token just because the number happens to work today).
- **Radius** — `--radius-sm` through `--radius-4xl`, all derived from a single `--radius` base via `calc()`. Don't hardcode a `rounded-[Npx]` — use the scale.
- **Reusable non-token utilities** — small, named `@utility` blocks for cross-cutting style patterns that aren't colors/sizes/z-index but are still reused enough to warrant a name: `page-eyebrow` (breadcrumb label), `filter-btn` (tab/filter button base), `cell-truncate` (table-cell ellipsis truncation). If a style combination starts repeating across 3+ components, this is the mechanism to reach for instead of copy-pasting the same Tailwind string everywhere.

## 5. Tailwind CSS v4 usage

- **Mobile-first, always.** Base (unprefixed) classes are the ≤640px layout; add `sm:` (≥640px) and `lg:` (≥1024px, matching the app shell's own desktop breakpoint in `Shell.tsx`) to progressively enhance for wider viewports. Never write a layout that only works at desktop width and needs a breakpoint to *fix* mobile — write mobile first, then override for desktop.
- **Every multi-column grid needs a responsive prefix.** `grid-cols-N` alone, with no `sm:`/`lg:` variant, is not acceptable — it should be `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (or whatever column counts fit the content), so it collapses to a single column on narrow viewports instead of overflowing or crushing.
- **Every fixed-width side panel/rail follows the same shape:** `w-full <breakpoint>:w-<token-or-value>` (mobile: full width, stacked; desktop: fixed width, side-by-side). This is true whether the value comes from a `--width-panel-*` token or, for genuinely one-off cases, a raw arbitrary value — the mobile-first gating is the non-negotiable part, the token-vs-arbitrary choice is secondary.
- **Two-pane (list+detail) and three-pane layouts stack vertically below `lg:`** and go side-by-side (`lg:flex-row`) at `lg:` and above — this is the same pattern as the width rule above, applied to the container rather than a single panel.
- **Small, non-layout fixed widths don't need to be fluid.** A narrow form-field width (`w-[72px]` for a numeric input, `w-[52px]` for a label column) or a small fixed-size badge/icon container is not a mobile-overflow risk and does not need `w-full`/breakpoint treatment — only viewport-relative panels, rails, drawers, and cards need the mobile-first pattern above. Don't over-apply the rule to things that were never at risk.
- **Viewport height uses `dvh`, never `vh`/`*-screen` utilities.** `h-dvh`/`min-h-dvh` account for mobile browser chrome (address bar collapse); `h-screen`/`100vh` do not and will clip or jump content on mobile Safari/Chrome. This app uses `dvh` everywhere a full-viewport height container is needed (`app/error.tsx`, `app/not-found.tsx`, `Shell.tsx`, `Login.tsx`).
- **Tables/dense grids get a horizontal-scroll escape hatch, never silent clipping.** Wrap the shared `Table` primitive usage (or any many-column data display) in a scrollable container so a phone-width viewport can scroll to see extra columns rather than having them cut off.
- **Static values stay in Tailwind classes; only genuinely dynamic, runtime-computed values go in `style={{...}}`.** A hardcoded `style={{ flex: 2.5 }}` should be a class; a computed `style={{ width: `${pct}%` }}` driven by data is correct and should stay inline — don't blanket-avoid inline styles, just don't use them for values that never change.
- **Fixed modal/dialog heights need a viewport-relative fallback.** A hardcoded `h-[Npx]` for dialog content should be `h-[min(Npx, Xvh)]` (or `max-h-[Xvh] overflow-y-auto`) so it shrinks/scrolls on short viewports instead of overflowing the dialog.

## 6. Accessibility

- Interactive elements are native elements (`<button>`, `<a>`, form controls) styled via the design system, not `<div>`/`<span>` with `role`/`tabIndex`/manual `onKeyDown` bolted on.
- Modals, drawers, dropdowns, and popovers get their focus trap, scroll lock, and `Escape`-to-close behavior for free from the Base UI-backed shadcn primitives (`Dialog`, `Sheet`, etc.) — don't reimplement any of these three behaviors manually; if a primitive is bypassed for a custom layout need, only override styling/positioning via the `className` prop the primitive already forwards, don't drop to the raw underlying primitive component and rebuild the wrapper from scratch (that's how a fixed dialog re-loses its mobile-safe sizing even after being "migrated" once).
- Every icon-only interactive control has an `aria-label`.
- `jsx-a11y` lint rules are the floor, not the target — write to the intent of the rule (real keyboard operability, real focus management), not just enough to silence the linter.

## 7. shadcn / Base UI conventions

- `components.json` config (`style: base-nova`, `baseColor: neutral`, `cssVariables: true`) means every generated primitive inherits the current theme tokens automatically — never hand-set colors on a generated primitive file after `shadcn add`; if it looks wrong, the theme token is wrong, not the primitive.
- This project uses **Base UI** (`@base-ui/react`) under shadcn, not Radix — when reading shadcn documentation or examples that assume Radix primitives/APIs, translate to the Base UI equivalent (e.g. `DialogPrimitive.Popup` instead of Radix's `Dialog.Content`) rather than installing `@radix-ui/*` packages for something Base UI already provides (the two `@radix-ui/*` deps already in `package.json`, `react-label` and `react-slot`, exist because Base UI doesn't cover those two specific primitives — that's the only reason to mix libraries here).
- Always use the primitive's top-level composed export (e.g. `DialogContent`) rather than assembling `Portal`/`Overlay`/`Popup` by hand for a one-off case — the composed export carries the mobile-safe sizing, centering, and token-based z-index that the raw pieces don't give you automatically.

## 8. Quick reference — before you write new UI, ask:

1. Does a shadcn primitive in `components/ui/` already do this? Use it; don't hand-roll it.
2. Does an existing `@theme` token (color, panel/drawer width, z-index, radius) already cover this value? Use it; don't inline a new magic number.
3. Is this layout mobile-first (works unprefixed at ≤640px, enhanced at `sm:`/`lg:`)? If it only works at desktop width, it's not done.
4. Is every interactive element a real `<button>`/`<a>`/form control, not a `div` with a role bolted on?
5. Is this a Server Component by default, with `"use client"` only on the leaf that actually needs it?
6. Does it pass `npm run lint` and `npm run format:check` unmodified?

If the answer to any of these is "no" for a reason not covered above, that's a sign either the code needs to change or this blueprint needs a new section — update this file when a new durable pattern gets established, the same way the z-index and panel-width token sections here were added after being figured out live during the fix rounds.
