# Design Patterns — Round 3 Follow-Up (2 remaining items)

**Purpose of this file:** This is a prompt for an agentic code editor. Round 2 closed 6 of 8 remaining gaps (repository adoption, Settings state extraction, audit-trail centralization, Command Palette sanitize, mission telemetry, and pagination — all verified and confirmed correct, do not touch them again). Two items are still incomplete. This file covers only those two.

**Non-negotiable constraint, above all else: zero UI/UX change.** Every pixel, spacing, color, animation, copy string, and interaction currently rendered must look and behave identically after every fix below. These are internal-architecture-only changes. If a fix appears to require a visible change to satisfy a pattern "properly," implement it in whatever internal form preserves the current UI exactly instead — correctness of internal architecture never overrides this. No fix should touch a `className`, inline style, layout, copy string, or interaction as a side effect of restructuring the code around it.

Write the best possible code for each item below — proper typing, proper separation, no shortcuts — but the goal is internal code quality and pattern-correctness, not UI improvement.

Implement both items in this document. Do **not** stop to run `npm run lint` or `npm run build` after each individual fix — do both, then run `npx tsc --noEmit`, `npm run lint`, and `npm run build` once at the end, and resolve whatever they surface. (As of this review, all three passed clean on the current codebase — keep them clean.)

---

## ✅ Already confirmed fixed in round 2 — do not touch

- Repository adoption for all `environment`/`memory` panels, `TeamManagerDashboard`, and `ExecutionConsole`'s `getParsedRows` — all now correctly route through their repositories.
- `SettingsPageContainer`/`SettingsPageView` — state fully extracted into `useSettingsData()`; View now has zero business-state hooks.
- `useExecutionFeed.ts` — now calls the shared `emitAuditEvent()`.
- `CommandPaletteContainer.tsx` — query now passed through `sanitizeInput()`.
- `MissionWorkspaceContainer.tsx` — pause/resume/terminate now call `logEvent`.
- `AuditLogPage.tsx` / `useAuditFeed.ts` / `ReportsPage.tsx` — real `page`/`limit` state now wired through `fetchAll()`.
- `NewMissionWizardView.tsx` (656→307 lines) and `TeamManagerDashboardView.tsx` (535→319 lines) — both genuinely broken into smaller named sub-components. **Use these two as the template for item 1 below** — they're the correct example of what "real" extraction looks like, as opposed to a wholesale file rename.

Full codebase currently passes `npx tsc --noEmit`, `npm run lint`, and `npm run build` clean — keep it that way through both fixes below.

---

## ❌ Remaining item 1: SRP / sub-component extraction — 4 files still oversized

`NewMissionWizardView` and `TeamManagerDashboardView` were correctly split into smaller sub-components in round 2. These four were not touched at all, or only trimmed slightly:

- **`src/features/missions/components/workspace/MissionWorkspaceView.tsx`** — still **813 lines**, unchanged since round 2.
- **`src/features/missions/components/workspace/AttackGraphCanvasView.tsx`** — **683 lines** (was 764 — a minor trim, not a real split).
- **`src/features/missions/components/workspace/VDGNodeDrawerView.tsx`** — **503 lines**, unchanged.
- **`src/features/execution/components/ExecutionConsoleView.tsx`** — **496 lines**, unchanged.

**Fix:** For each file above, extract its largest cohesive JSX sections into their own named presentational sub-components, following the file's existing visual structure exactly (component boundaries should fall at natural section breaks already visible in the JSX — a status strip, a metrics row, a tab bar, a panel body, a legend, a node-detail section, etc. — not arbitrary line-count cuts). Concretely:

- `MissionWorkspaceView.tsx` → likely candidates: a status strip, a metrics row (note: this file already uses the shared `MetricTile` primitive per an earlier fix — keep that), a tab bar, and one sub-component per major panel/tab body.
- `AttackGraphCanvasView.tsx` → likely candidates: the graph canvas/SVG rendering itself, a legend/key section, and any toolbar/controls section, as separate components.
- `VDGNodeDrawerView.tsx` → likely candidates: a header/metadata section, a tabs section, and per-tab body sections (findings, evidence, actions — whatever this drawer currently shows).
- `ExecutionConsoleView.tsx` → likely candidates: the virtualized row list (keep the existing `react-window`/`react-virtual` + `React.memo` setup exactly as-is), a header/filter bar, and a detail/drawer section if one exists.

Each new sub-component receives only plain props from its parent View — no new `useState`/`useEffect`/data fetching, no new repository calls. This is pure code motion: every `className`, inline style, and JSX element must move byte-for-byte unchanged into its new file. Do this until each file is under, or reasonably close to, 300 lines. Do not force a split that fragments a single cohesive visual block just to hit a number — if a section genuinely doesn't decompose cleanly, leave it and note why in a brief code comment rather than forcing an arbitrary cut.

Before starting, open `NewMissionWizardView.tsx`'s and `TeamManagerDashboardView.tsx`'s post-split structure (their sub-component files) and mirror the same extraction style — same prop-passing convention, same naming pattern — for consistency across the codebase.

## ❌ Remaining item 2: Empty state — `CostDashboard.tsx` still missing it

`ModelBreakdown.tsx` was correctly fixed in round 2 (`EmptyState` now used for its empty-data case). **`src/features/cost/components/CostDashboard.tsx` still has no `EmptyState` usage at all.**

**Fix:** Add the same `<EmptyState />` usage to `CostDashboard.tsx` for its empty-data case, mirroring exactly how it's used in `ModelBreakdown.tsx` (and `ContextState.tsx`/`CostUsage.tsx`/`ReportsPage.tsx`, all already correct) — same import, same conditional-render pattern, same props shape.

---

## Order

1. Item 2 first — trivial, one file, near-zero risk.
2. Item 1 — do one file at a time, largest first (`MissionWorkspaceView.tsx` → `AttackGraphCanvasView.tsx` → `VDGNodeDrawerView.tsx` → `ExecutionConsoleView.tsx`), since it's the larger and more failure-prone change.

After both items are implemented — not before — run `npx tsc --noEmit`, `npm run lint`, and `npm run build` once, and fix whatever they surface. No route's rendered output should have changed at any point; there is nothing to visually re-verify, only the build/lint/type-check pass.
