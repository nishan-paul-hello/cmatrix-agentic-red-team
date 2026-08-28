# RedGrid Frontend — Codebase Audit & Remediation Prompt

You are an AI coding agent working on the RedGrid frontend (Next.js 16 / React 19 / TypeScript 5.7 / Tailwind v4 / Shadcn `base-nova` style, single-theme dark UI). This file is both an audit of the current state and your task spec. Work through it section by section. Do not change visual branding (dark theme, red primary `#e31b23`, JetBrains Mono) — the goal is code quality, consistency, and responsiveness, not a redesign.

Stack confirmed from `package.json`/`components.json`: Next 16.3, React 19, TS 5.7, Tailwind 4 (CSS-first `@theme`, no `tailwind.config.js`), Shadcn (`base-nova` style, base color `neutral`, no prefix), Base UI + Radix primitives, React Hook Form 7 + Zod 4, TanStack Virtual, Vitest.

---

## 0. Scope of this audit

Reviewed: all config (`package.json`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `components.json`), `src/app/globals.css`, both root and `(app)` layouts, the `Shell`/navigation system, all `src/components/ui/*` primitives, representative Container/View pairs and hooks across every `src/features/*` module, the mission wizard, the attack-graph canvas, and static analysis via grep across all 232 `.tsx` files for known anti-patterns (inline styles, arbitrary values, dark-mode dead code, `any`, array-index keys, image usage, console logs, duplicate filenames, responsive-class coverage).

---

## 1. What's already good — preserve these patterns

- **Feature-sliced architecture** (`src/features/<domain>/{components,data,domain,hooks,index.ts}`) is consistent and should be the template for all new code.
- **Container/View split** is used in the more complex features (`MissionWorkspaceContainer` → `MissionWorkspaceView`, `SettingsPageContainer` → `SettingsPageView`, `NewMissionWizardContainer` → `...View`, `AttackGraphCanvasContainer` → `...View`, `TeamManagerDashboardContainer` → `...View`). This is the right pattern — presentational component receives only primitives/callbacks, container owns state/data. **It is only applied to 8 of the ~30 top-level feature components.** Extend it everywhere a component both fetches/holds state and renders a non-trivial UI (see §4).
- **Repository pattern** (`*Repository.ts` per feature, backed by `data/fixtures/*MockData.ts`) cleanly separates data access from UI, ready to swap fixtures for real API calls later.
- **ESLint config is strict and good**: `no-explicit-any` (error), `no-array-index-key` (error), exhaustive hooks deps, exhaustive switch, `no-floating-promises`, full `jsx-a11y` ruleset, import cycle detection, consistent type-only imports. Static analysis confirms this is actually enforced: zero `any`, zero array-index keys, zero stray `console.log` in the codebase.
- **`Shell.tsx`** is a genuinely good responsive/accessible reference: mobile off-canvas drawer with `focus-trap-react`, `aria-label`s on both nav landmarks, Escape-to-close, `lg:` breakpoint used correctly to swap mobile header/drawer for desktop sidebar, `min-w-0` used correctly on the flex main column to prevent overflow. **Use this file as the responsive/a11y baseline for every other page.**
- CVA (`class-variance-authority`) is used correctly for variant-driven primitives (`button.tsx`, likely others) instead of conditional string concatenation.
- Zod + React Hook Form + `@hookform/resolvers` is wired correctly in the mission wizard via a shared `WizardContext`.
- shadcn/Base UI/Radix primitives are used as intended, not forked-and-hacked.

---

## 2. Confirmed problems, with evidence

### 2.1 Inline styles used where Tailwind utilities already exist (high priority)
`grep -rc "style={{" src` → **365 occurrences** across the codebase, concentrated in `research/*` (StatisticalEval, AblationLab, AblationLabTable, FailureAnalysis — 9-12 hits each), `missions/wizard/*` (SurfaceCards, ModeCards), `environment/HostTopologyDiagram`, `specialists/SpecGrid`, `cost/*`.

Two categories exist and must be treated differently:
- **Legitimate**: computed pixel positions/widths for canvas-style layouts (e.g. `AttackGraphNode.tsx` positioning nodes with `left`, `top`, `width` from a layout algorithm; percentage bar widths driven by data in `StatisticalEval.tsx`). Leave these as inline styles — Tailwind can't express runtime-computed geometry.
- **Not legitimate**: static layout/spacing done via `style={{ display: "flex", gap: 6 }}` when `className="flex gap-1.5"` does the same thing, and manual `background`/`border`/`color` toggling with `var(--token)` strings that duplicate what a `cva` variant or a conditional Tailwind class already expresses better. Confirmed example: `src/features/missions/components/wizard/Step1.tsx` (benchmark-suite button group) mixes a Tailwind-classed `<Button>` with an inline `style` block doing selected/unselected color switching that should be a `cva` variant (`selected`/`unselected`) or `data-state` + Tailwind conditional classes instead.

**Action**: audit every `style={{...}}` in the flagged files. Keep only genuinely dynamic/computed values (numeric geometry, data-driven percentages, animation keyframe params that Tailwind can't express). Convert everything else to Tailwind classes or `cva` variants with `data-*` attributes for state.

### 2.2 Responsive coverage is inconsistent
- Only `sm:` (71), `md:` (20), `lg:` (52) breakpoints are used anywhere; **`xl:` and `2xl:` are used zero times** in the whole app.
- **185 of 232 `.tsx` files contain no responsive prefix at all.** Some of that is legitimately fine (small leaf components that inherit responsive layout from a parent, e.g. a single badge). But it also includes dense, information-heavy screens that will break on narrow viewports: `MissionWorkspaceView.tsx` (1 responsive class total — only wraps a container `flex-col lg:flex-row`, nothing inside adapts), `VDGNodeDrawerView.tsx` (0), `BenchmarkTable.tsx` (0), most of `research/*` and `benchmarks/*`.
- These are exactly the screens most likely to be used on a laptop at 1280px or a tablet, and there's no evidence any of them were tested below desktop width. A 3-column workspace, a wide data table, and a fixed-width drawer are the three UI shapes most prone to breaking on smaller viewports, and all three are unaudited here.

**Action**: treat `Shell.tsx` as the baseline for what "responsive" means in this app (mobile-first base styles, `lg:` for desktop layout changes) and bring every page-level and drawer/table component up to that bar. At minimum: mission workspace 3-column layout needs a defined mobile/tablet behavior (stack, tabs, or off-canvas panels — pick one pattern and apply it everywhere instead of inventing a new one per screen), data tables need a horizontal-scroll or responsive-card fallback below a defined breakpoint, and drawers (`VDGNodeDrawer`, `ExecDrawer`, escalation panels) need a full-width mobile treatment instead of a fixed `w-[NNNpx]`.

### 2.3 Fixed pixel widths instead of responsive/fluid sizing
`grep -rhoE "w-\[[0-9]+px\]" src` surfaces **~40 distinct fixed-width arbitrary values** (`w-[72px]`, `w-[140px]`, `w-[480px]`, `w-[700px]`, `w-[760px]`, etc.), plus a handful of fixed heights (`h-[530px]`, `h-[420px]`). Some of these (panel/drawer widths) are already correctly promoted to named theme tokens in `globals.css` (`--width-panel-sm/md/lg/xl/2xl`, `--width-drawer-sm/md/lg`) — good pattern, but it isn't used consistently; many components still hardcode a raw `w-[NNNpx]` instead of the matching `w-panel-*`/`w-drawer-*` token that already exists for that purpose.

**Action**: (1) replace ad hoc `w-[NNNpx]`/`h-[NNNpx]` with the existing `--width-panel-*`/`--width-drawer-*` tokens wherever the value matches or is close to an existing token — extend the token set in `@theme` rather than adding new one-off arbitrary values; (2) for anything wider than ~400px (`w-[480px]`, `w-[700px]`, `w-[760px]`), replace the fixed width with `max-w-*` + `w-full` so it can shrink on smaller viewports instead of forcing horizontal scroll or overflow.

### 2.4 Dead dark-mode code in shadcn primitives
`globals.css` declares `@custom-variant dark (&:is(.dark *));` but there is no `.dark` class ever applied anywhere (this app is single-theme dark by design, no toggle). Despite that, **8 of the `src/components/ui/*` primitives still carry `dark:` variant classes** left over from the shadcn template: `button.tsx`, `input.tsx`, `textarea.tsx`, `toggle.tsx`, `badge.tsx`, `radio-group.tsx`, `switch.tsx`, `select.tsx` (14 `dark:` occurrences total).

**Action**: strip the `@custom-variant dark` declaration from `globals.css` and remove every `dark:` class from the 8 files above. These classes never activate and are pure dead weight/confusion for anyone reading the component later, exactly the kind of leftover the project already flagged as unwanted.

### 2.5 Duplicated component names across features (collision risk)
`StatusBadge.tsx` exists in two places (`src/features/missions/components/workspace/StatusBadge.tsx` and presumably a shared/UI location) and `TextInput.tsx` exists in two places (`src/features/missions/components/wizard/TextInput.tsx` and `src/features/settings/components/TextInput.tsx`). Same-name components in different features aren't inherently wrong under a feature-sliced architecture, but it's worth confirming each pair is *intentionally* feature-scoped and not an accidental duplicate that should be a single shared component in `src/components/ui/`.

**Action**: diff each pair. If they render the same thing, consolidate into `src/components/ui/`. If they're genuinely different (e.g. one is a Radix-wrapped generic input, the other a wizard-specific field), rename one to disambiguate (`WizardTextInput`, `SettingsTextInput`) so a future `grep`/import autocomplete doesn't pick the wrong one.

### 2.6 Repeated non-exhaustive string-array checks instead of a lookup map
`MissionWorkspaceView.tsx` determines which sub-nav panel to render, and separately whether to show the right-hand `MissionLiveState` panel, using **two independent hardcoded arrays of the same 12 sub-nav string literals**, one of them negated across an 11-line `&&` chain. This works today but (a) is easy to get out of sync — adding a 13th sub-nav view requires remembering to update both arrays, and the type system won't catch a mismatch since these are plain string comparisons, not the `MissionSubNav` union being exhaustively switched; (b) `switch-exhaustiveness-check` is already enabled in ESLint but doesn't apply here because this isn't a `switch`.

**Action**: replace both structures with a single `Record<MissionSubNav, { panel: ComponentType; showLiveState: boolean }>` (or two small `Record<MissionSubNav, boolean>` maps) keyed off the actual `MissionSubNav` union, so TypeScript enforces exhaustiveness and there is exactly one place to add a new sub-nav view.

### 2.7 Near-absent test coverage
Only two test files exist for the whole app: `tests/fsm.test.ts` and `tests/utils.test.ts`. Zero component tests, zero hook tests, despite `vitest` being fully configured and despite non-trivial logic living in `domain/` files (`Orchestrator.ts`, `CircuitBreaker.ts`, `Blackboard.ts`, `SpecialistStrategy.ts`, `EscalationManager.ts`, `Supervisor.ts`, `FSM.ts`) and in custom hooks (`useAuditFilters`, `useDebounce`, `useWizardData`, etc.).

**Action**: this is out of scope for a pure UI/responsiveness pass, but flag it — at minimum the `domain/*.ts` state-machine/strategy classes should get unit tests, since they're the highest-risk, least-visual code in the app and currently have zero coverage.

### 2.8 Accessibility is good in some places, thin in others
`Shell.tsx` sets a strong baseline (landmark `aria-label`s, focus trap, `aria-hidden` on decorative dots). But app-wide there are only **26 `aria-label` occurrences and 2 `alt` attributes** across 232 files — plausible for an icon-heavy dark dashboard where most icons are decorative and sit next to visible text labels, but worth a deliberate pass rather than assuming: every icon-only `<Button>` (settings gear, close/X buttons, filter chips, drawer close buttons) needs either visible text or an `aria-label`, and every interactive `<div role="button">` (e.g. `AttackGraphNode.tsx`, which already correctly adds `role="button"`, `tabIndex`, and an `onKeyDown` Enter/Space handler — good) needs to be checked for the same three attributes wherever a clickable `div`/`span` pattern repeats.

**Action**: grep for `onClick=` on non-button/non-link elements across the codebase and confirm each has `role`, `tabIndex`, and a keyboard handler matching the `AttackGraphNode.tsx` pattern; treat that file as the template.

### 2.9 Minor / lower priority
- `next/image` is used in only 2 places; confirm every other raster image in the app (there appear to be very few — mostly SVG marks) doesn't need it, but check the two `opengraph-image.png`/logo usages are the only raster assets.
- `postcss.config.mjs`/`components.json` show a clean, current Tailwind v4 CSS-first setup (no `tailwind.config.js`, `@theme inline` + a second `@theme` block for custom panel/drawer width tokens) — no action needed, just confirming there's no legacy v3 config lingering anywhere to remove.

---

## 3. Design-system consistency checklist (apply while fixing the above)

When touching any component, bring it in line with these already-established project conventions rather than inventing new ones:

1. **Color**: only ever reference the CSS custom properties defined in `:root` in `globals.css` (`--background`, `--foreground`, `--card`, `--primary`, `--muted-foreground`, `--success`, `--warning`, `--destructive`, `--info`, `--accent-purple`, etc.) via their Tailwind token classes (`bg-background`, `text-muted-foreground`, ...). Never introduce a new raw hex value in a component — extend `:root` and the matching `@theme inline` mapping instead.
2. **Spacing/sizing**: prefer Tailwind's default scale; if a value must be custom and reused (panel widths, drawer widths, cell max-width — already partly done), add it to the `@theme` block in `globals.css`, don't inline it.
3. **Typography**: the whole app is intentionally monospace (`* { font-family: var(--font-mono); }`) — don't introduce `font-sans` on individual components.
4. **Variants**: any component with 2+ visual states (selected/unselected, active/inactive, severity levels) should express that with `cva` + `variant` prop or `data-state`/`aria-*` attribute + Tailwind's `data-[state=...]:` / `aria-[expanded=true]:` selectors — matching the pattern already used in `button.tsx` — not with inline `style` toggling.
5. **Mobile-first**: write the unprefixed (mobile) class first, then layer `sm:`/`lg:` overrides, matching `Shell.tsx`. Don't write a desktop-first component and bolt on a `max-lg:` fix later.
6. **No new arbitrary values** (`w-[NNNpx]`, `#hexvalue`) unless there is genuinely no existing token and it's a one-off; if it will recur, add it to `@theme` first.
7. **Container/View split** for any feature component that both owns non-trivial state/data-fetching and renders a non-trivial tree — match `MissionWorkspaceContainer`/`...View` as the template.
8. **Accessibility**: any custom clickable element follows the `AttackGraphNode.tsx` template (`role="button"`, `tabIndex={0}`, `onKeyDown` for Enter/Space, `aria-label` if there's no visible text).

---

## 4. Suggested execution order

1. Strip dead `dark:` classes + `@custom-variant dark` (§2.4) — fast, zero-risk, do first.
2. Fix `Step1.tsx`-style inline-style-instead-of-Tailwind cases across `research/*`, `missions/wizard/*`, `specialists/SpecGrid`, `cost/*` (§2.1) — convert static styling only, leave computed-geometry inline styles alone (`AttackGraphNode.tsx`, `HostTopologyDiagram.tsx`, data-driven bar widths).
3. Replace one-off `w-[NNNpx]`/`h-[NNNpx]` with existing/extended `@theme` tokens (§2.3).
4. Responsive pass on the identified weak screens in priority order: mission workspace 3-column layout → drawers (`VDGNodeDrawer`, `ExecDrawer`, escalation) → data tables (`BenchmarkTable` and siblings) → `research/*` screens (§2.2).
5. Refactor `MissionWorkspaceView`'s duplicated sub-nav arrays into a typed `Record` (§2.6).
6. Resolve the `StatusBadge`/`TextInput` duplicate-name pairs (§2.5).
7. Accessibility sweep for custom clickable elements (§2.8).
8. (Separate follow-up, not a UI task) add unit tests for `domain/*.ts` state machines (§2.7).

Do not batch all of this into one giant diff — ship it feature-by-feature (audit-log, then benchmarks, then missions, etc.) so each PR stays reviewable, and run `npm run lint` (already `--max-warnings 0`) and `npm run test` after each feature.
