# RedGrid Frontend — Audit Findings (2026-08-29)

Audited against the standing audit prompt, sections 1–10, `app-frontend/src/` (348 files). Lint/typecheck/build were not re-run per instructions — this is a manual, per-file read of the actual code and Tailwind output, not a rule-based pattern match.

**Bottom line up front:** this codebase is well above average. The token system (widths, z-index, radius) is genuinely comprehensive and mostly honored, the `Table`/`Dialog`/`Sheet` primitives are used correctly almost everywhere (composed exports, not hand-assembled sub-primitives), accessibility is taken seriously (every icon-only button has an `aria-label`, no `role="button"` misuse, no raw `<img>`/`<table>`), and the hygiene sweep (Section 9: `any`, `console.log`, `key={index}`, `var`, loose equality) came back completely clean. It is not flawless — the findings below are real, specific, and mostly small in blast radius. There is nothing here that suggests systemic carelessness; there's one real functional bug, one clear duplication, and a handful of polish items.

---

## Critical

*(none — no active regressions or broken user flows found beyond the High item below)*

## High

### H1. Evidence Viewer dialog is stuck at 384px wide on desktop, not the intended ~700px
**File:** `features/findings/components/FindingDetail.tsx:163`
```tsx
<DialogContent className="border-border bg-background flex max-h-[80vh] max-w-[700px] flex-col overflow-hidden p-0">
```
The shared `DialogContent` primitive (`components/ui/dialog.tsx:53`) ships with `max-w-[calc(100%-2rem)] sm:max-w-sm` as its default. `cn()` uses `twMerge`, which only dedupes classes within the *same variant*. Overriding the base `max-w-[700px]` here does not remove `sm:max-w-sm` — both end up in the final class list, and at any viewport ≥640px the `sm:` media query wins, so the dialog is capped at `24rem` (384px) instead of 700px. The "EVIDENCE VIEWER" modal is meant to be spacious on desktop; instead it renders cramped there and correctly-sized only below 640px, the opposite of the intent.

Two sibling components do this correctly and should be the template:
- `features/validation/components/StateMachineModal.tsx:45` — `className="w-panel-2xl sm:max-w-panel-2xl max-w-full p-6"`
- `features/specialists/components/UCBModal.tsx:55` — `className="w-panel-lg sm:max-w-panel-lg max-w-full gap-0 p-0"`

Both explicitly neutralize the primitive's base (`max-w-full`) and re-supply their own `sm:` variant, so nothing from the default sneaks through.

**Fix:** use the same pattern and reuse a width token instead of a bare pixel value — 700px sits between `--width-panel-2xl` (620px) and `--width-panel-3xl` (760px) in `globals.css`; `panel-3xl` is the closer/safer choice for a viewer that needs room:
```tsx
<DialogContent className="border-border bg-background flex max-h-[80vh] w-panel-3xl sm:max-w-panel-3xl max-w-full flex-col overflow-hidden p-0">
```

---

## Medium

### M1. `EvaluationScreen.tsx` reimplements the existing `EOrdIndicator` component instead of reusing it
**File:** `features/validation/components/EvaluationScreen.tsx:59-126`

`features/missions/components/workspace/EOrdIndicator.tsx` already exists as a reusable "E_ord evidence-level stepper" (track + ticks + active-value caption, driven by `EORD_LABELS`), and is used once, in `VDGNodeDrawerSections.tsx:88`. `EvaluationScreen.tsx` hand-rolls a second, ~65-line copy of the same widget inline: same `EORD_LABELS` import, same track/fill/tick-dot structure, same "current value" caption — just built with absolute-positioned labels (`style={{ transform, left }}`) instead of `EOrdIndicator`'s flex layout, and a text glyph (`▲`) instead of a CSS-triangle marker. This is exactly the kind of divergent duplicate the "reuse over reinvention" principle exists to prevent: the two implementations will drift (they already have different marker styles and different caption copy — one says "Raised from X after timing confirmation", the other doesn't), and a future design change to the indicator will need to be made twice, with no guarantee both call sites are found.

**Fix:** extend `EOrdIndicator` to accept the extra caption content `EvaluationScreen` needs (an optional `caption`/`sub` prop) and have `EvaluationScreen` import and use it instead of reimplementing it.

### M2. `toggle-group.tsx` borrows the app-header's z-index token for an unrelated purpose
**File:** `components/ui/toggle-group.tsx:73`
```tsx
"focus:z-header focus-visible:z-header shrink-0 ..."
```
This lifts a focused toggle-group item above its siblings so the focus ring isn't clipped by adjacent buttons' borders — a purely local, small-scale stacking need. `z-header` (`--z-header: 30`) is the token for the app chrome's top header bar (used correctly in `Shell.tsx`-style layout, not seen misused elsewhere). Reusing it here works today only because 30 happens to be higher than everything nearby in this local context — it creates a false coupling: a future change to the header's stacking (or to what sits near a toggle group) can silently break this focus-ring elevation, and vice versa, for no reason a reader could anticipate from the class name.

**Fix:** this is a distinct concept (local focus-elevation within a small group of siblings) and deserves its own token rather than borrowing `z-header`. Add something like `--z-focus: 5` to the `@theme` block in `globals.css` (scoped low, well under `z-sticky`/`z-drawer`) and reference that here.

### M3. Sixteen of twenty route entry points are `"use client"` for reasons unrelated to data fetching
**Files:** every `page.tsx` under `app/(app)/*` and `app/(app)/*/*` except the four not listed below — e.g. `app/(app)/dashboard/page.tsx`, `app/(app)/missions/page.tsx`, `app/(app)/missions/[missionId]/page.tsx`, `app/(app)/missions/new/page.tsx`, `app/(app)/trajectory/page.tsx`, `app/(app)/audit-log/page.tsx`, `app/(app)/settings/page.tsx`, `app/(app)/benchmarks/page.tsx`, `app/(app)/reports/page.tsx`, `app/(app)/cost-usage/page.tsx`, `app/(app)/memory/page.tsx`, `app/(app)/memory/failure-memory/page.tsx`, `app/(app)/memory/skill-library/page.tsx`, `app/(app)/research/statistics/page.tsx`, `app/(app)/research/failure-analysis/page.tsx`, `app/(app)/research/ablations/page.tsx`

Per the audit prompt's own carve-out this is acceptable *today* — every one of these routes is still running on mock/fixture data (confirmed via each feature's `*Repository.ts`, e.g. `features/audit/data/AuditRepository.ts`, which even has a `// VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data` comment marking the intended migration point). None of it is a bug today. Flagging it forward-looking as instructed: the actual reason every one of these is client-only is `useRouter()`/`useMission()` context access at the route root, not data fetching — so when a real backend lands, the migration isn't just "swap `useEffect` for a server fetch," it's "introduce a Server Component at the route level and push the `useRouter`/context usage down into a small client child," or these will keep carrying the client-only pattern forward by default. Same root cause applies to the `useEffect`-on-mount fetch hooks (`useAuditFeed`, `useMissionsData`, `useFindingsData`, etc.) — they're correctly client-only *for mock data* via a clean repository abstraction, and that abstraction is exactly what makes the future migration easy, but they'll need to move server-side at the same time as the pages that own them.

**No action needed now.** Worth a tracked follow-up item so the future backend integration doesn't inherit "everything is a Client Component" as the default.

---

## Low

### L1. Redundant `z-0` on decorative background layers doesn't map to the token scale
**Files:** `app/not-found.tsx:20`, `features/auth/components/Login.tsx:51`
```tsx
<div className="grid-bg-lg pointer-events-none absolute inset-0 z-0 opacity-20" aria-hidden="true" />
```
Both instances are the first element in their container, with the real content wrapped in a sibling `relative` div immediately after — DOM order plus `position: relative` already puts the content above this layer with no z-index needed at all. `z-0` isn't part of the app's z-index scale (`--z-node-base` starts at 1) and doesn't correspond to any named token, so as written it reads like it's doing real stacking work when it isn't.

**Fix:** simplest correct fix is to just delete `z-0` from both — nothing relies on it.

### L2. Static values mixed into otherwise-dynamic inline `style` objects
A handful of spots combine a genuinely dynamic value (color/position driven by data) with a constant that never changes, in the same `style={{ }}` object — e.g.:
- `features/missions/components/workspace/VDGNodeDrawerSections.tsx:222-225` — `borderRadius: "50%"` is static (should be `rounded-full`), sits next to the legitimately dynamic `border: `1px solid ${t.color}``.
- `features/missions/components/workspace/AttackGraphNode.tsx:66-68, 150-152` — `inset: -3` / `inset: -4`, `pointerEvents: "none"` are static and could be `-inset-[3px] pointer-events-none`; the `background`/`color` values alongside them are correctly dynamic and should stay inline.
- `features/research/components/FailureAnalysis.tsx:141-143` — `style={{ flex: 2 }}` has no data dependency at all; this one column header's flex-basis is just a Tailwind `flex-[2]` class waiting to happen.

None of these are bugs — the rendered output is correct — but they dilute the "inline style = data-driven" convention the rest of the codebase follows well (most inline styles here genuinely are color-from-status or position-from-layout-data, which is the right call). Worth a pass to split the static parts into classes next time these files are touched; not worth a dedicated pass on its own.

### L3. `EXEC_COLUMN_WIDTHS` column widths are recomputed via inline style on every row instead of being static classes
**Files:** `features/execution/components/ExecutionEntryRow.tsx:27-61`, constant defined in `features/execution/components/ExecutionConsoleConstants.ts:1`
```ts
export const EXEC_COLUMN_WIDTHS = [48, 80, 108, 160, 72, 64, 72] as const;
```
Each of the 7 columns applies its width via `style={{ width: EXEC_COLUMN_WIDTHS[N] }}`. These are fixed constants, identical on every row, not derived from the row's data (`e`) — the textbook "static value that should be a class" case. Functionally harmless (React handles this fine, and `React.memo` on the row limits the cost), but it's the same category as L2's flex example, just applied 7× per row across every visible row.

**Fix:** if a project-wide token scale extension isn't warranted for one table, `w-[48px]` etc. as literal Tailwind arbitrary-value classes (not `style`) would already be enough to move this out of inline-style territory; if this column layout is expected to recur elsewhere, it's a candidate for named width tokens the way panels/drawers already have.

---

## What's already correct (noted only where it's the right pattern to mirror)

- **Responsive layout (Section 1):** every top-level page/hub component (`TrajectoryPage`, `AuditLogPage`, `ValidationCenter`, `MissionWorkspaceView`, `ReportsPage`, `TeamManagerDashboardView`, `HumanEscalation`, `ExecutionConsoleView`, `SettingsPageView`, `HostTopology`, `EnvironmentalLayer`'s children) consistently follows `flex-col` → `lg:flex-row` (or `md:flex-row` for the settings sub-nav), matching the app shell's own `lg:` desktop threshold. All 25 `grid-cols-N` usages found have `sm:`/`lg:` (and in a few cases `md:`/`xl:`) variants.
- **Fixed widths/heights (Section 2):** aside from H1, every layout-role width found (`lg:w-panel-sm`, `lg:w-panel-md`, `md:w-40`, etc.) correctly starts from `w-full` on mobile and reuses the `--width-panel-*`/`--width-drawer-*` token scale via its generated class (never the `w-[var(--width-panel-sm)]` long-hand). No `h-screen`/`min-h-screen`/raw `100vh` anywhere — `h-dvh` is used consistently. The two fixed-height modal content areas found (`StateMachineModal.tsx:56`, `CommandPaletteView.tsx:106`) both already use `min(Npx, Xvh)`.
- **Primitives (Section 3):** no dead `components/ui/` exports, no hand-rolled modals/tabs/dropdowns (the one `role="dialog"` string match, in `OraclePanel.tsx`, is a false-positive-shaped hit — it's a query selector checking whether *another* real dialog is open before handling Escape, not a self-declared modal), no raw `<table>` outside `table.tsx`, and every `DialogContent` call site (besides H1's width bug) correctly uses the composed export rather than rebuilding it from `@base-ui/react` sub-primitives.
- **Accessibility (Section 4):** all 13 icon-only buttons found have `aria-label`s (including the two icons that come from `DialogPrimitive.Close`/`SheetPrimitive.Close`, which use visually-hidden text instead, which is equally valid). No `role="button"` anywhere. Every `jsx-a11y` rule in `eslint.config.mjs` is `"error"`, not `"warn"` — there's no config-level leniency being quietly relied on.
- **Tokens (Section 5):** only one hardcoded hex color exists in the entire `.tsx` tree (`app/layout.tsx:52`, `themeColor: "#080808"` in the `viewport` export, which is exactly the metadata-literal exception the rule allows for, and it does mirror `--background: #080808` in `globals.css`). Z-index and radius are almost entirely token-driven; the `rounded-[min(var(--radius-md),Npx)]` pattern in `button.tsx`/`toggle.tsx`/`select.tsx` still routes through the token, it's just clamped, so it doesn't count against the scale.
- **Fonts/images (Section 7):** fonts load via `next/font/google` in the root layout only, no CSS `@import` from Google Fonts anywhere; no raw `<img>` tags, `next/image` used everywhere images appear.
- **Server/Client boundary (Section 8):** no `useEffect`-fetch pattern reads anything but mock repositories, and there's no post-mount auth-gating flash — auth is handled entirely in `middleware.ts` via a cookie redirect, before any client code runs. (See M3 for the forward-looking note.)
- **Tables (Section 10):** the shared `Table` primitive wraps itself in `overflow-x-auto` by default (`components/ui/table.tsx:14`), and no call site overrides `containerClassName` to remove it — all 20 usages get horizontal scroll for free. The one KPI-style non-`<table>` row that uses `min-w-max` (`MissionStatusStrip.tsx`) is correctly wrapped in its own `overflow-x-auto` container; `KPIStrip`'s default/card variants avoid the problem entirely by stacking vertically below `md:` instead of needing scroll.
- **TypeScript/hygiene (Section 9):** zero hits for `any` in any form, `console.log`, `key={index}`/`key={i}`, `var`, or loose equality outside the two `!= null`/`== null` comparisons the project's own ESLint config (`eqeqeq: ["error","always",{null:"ignore"}]`) explicitly permits.

---

## Recommended execution order

1. **H1** — fix the Evidence Viewer dialog width. It's a live, user-visible layout bug on the most common screen sizes (any desktop/tablet ≥640px), one-line-scoped, and the correct pattern already exists twice in the codebase to copy from.
2. **M1** — consolidate `EvaluationScreen`'s duplicate indicator into `EOrdIndicator`. Structural (affects two files, prevents future drift), low risk, clear reference implementation.
3. **M2** — give the toggle-group focus ring its own z-index token instead of borrowing `z-header`. Small, isolated, but exactly the kind of "coincidentally works" coupling that's cheap to fix now and expensive to debug later.
4. **L1, L2, L3** — one-file (or few-line) polish items. No functional impact; batch these into the same pass as nearby work rather than a dedicated pass.
5. **M3** — no code change now; file as a tracked follow-up for whenever real backend integration begins, so the Server/Client Component boundary is planned rather than inherited by default.

No visual theme colors, spacing, or copy were changed or recommended for change anywhere in this report — everything above is about mechanism only.
