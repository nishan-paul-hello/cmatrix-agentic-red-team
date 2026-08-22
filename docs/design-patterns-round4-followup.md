# Design Patterns — Round 4 Follow-Up (1 remaining file)

**Purpose of this file:** This is a prompt for an agentic code editor. Everything from rounds 1–3 is now confirmed correct and complete, except one file. This document covers only that file.

**Non-negotiable constraint, above all else: zero UI/UX change.** Every pixel, spacing, color, animation, and interaction the Attack Graph currently renders must look and behave identically after this fix — same node positions, same colors, same edge lines, same filters, same drawer behavior. This is an internal-architecture-only change. No fix should touch a `className`, inline style, coordinate value, or interaction as a side effect of restructuring the code around it.

Do not stop to run `npm run lint`/`npm run build` mid-way — finish the whole file, then run `npx tsc --noEmit`, `npm run lint`, and `npm run build` once at the end.

---

## ✅ Everything else — confirmed done, do not touch

All prior rounds are complete and verified directly in the code:
- Repository/Adapter adoption across all features.
- `SettingsPageView` fully stateless, state extracted to `useSettingsData()`.
- Audit-trail centralization (`emitAuditEvent`), Command Palette sanitize, mission telemetry, audit-log pagination — all correct.
- `MissionWorkspaceView` (813→110 lines), `VDGNodeDrawerView` (503→182 lines), `ExecutionConsoleView` (496→149 lines) — all genuinely decomposed into well-named sub-components, zero business-state hooks left in any of them, virtualization + `React.memo` intact in `ExecutionConsoleView`.
- `CostDashboard.tsx` — `EmptyState` correctly added, mirroring `ModelBreakdown.tsx`.

## ❌ Remaining: `src/features/missions/components/workspace/AttackGraphCanvasView.tsx` (615 lines)

`AttackGraphToolbar.tsx` and `AttackGraphLegend.tsx` were already correctly extracted in round 3 — keep those as-is. What's left in `AttackGraphCanvasView.tsx` breaks down like this:

1. **Lines ~8–265: type definitions + hardcoded mock data** (`NODES: VDGNode[]`, `EDGES: Edge[]`, `NODE_STYLE` map) sitting directly inside the presentational View file. This is the actual bulk of the file's line count and is a data/fixture leak on top of being an SRP problem — a View component should not contain a ~120-entry mock dataset inline.
2. **Lines ~267–289: filter constant arrays** (`STATUS_FILTERS`, `VULN_FILTERS`).
3. **Lines ~289–300: coordinate transform helpers** (`lx`, `ly`).
4. **Lines ~300–615: the component function itself**, including inline SVG rendering loops for nodes (~line 440) and edges (~line 470).

### Fix, in order:

**Step 1 — Move the mock data out (this alone should cut roughly 250 lines).**
Move `NODES`, `EDGES`, and the `VDGNode`/`Edge` type definitions into `src/features/missions/data/fixtures/attackGraphMockData.ts` (create it, following the same shape as the other fixture files in this codebase, e.g. `executionMockData.ts`). Create a small `AttackGraphRepository` (or extend the existing mission-related repository if one is now the established convention for this feature — check what `MissionRepository`/other mission-domain repositories look like and match that pattern) that exposes `getNodes()`/`getEdges()`, implementing `DataSource<T>` like every other repository in this codebase. Update `AttackGraphCanvasContainer.tsx` to fetch nodes/edges through this repository and pass them down to `AttackGraphCanvasView` as props, instead of the View importing/declaring them as local constants. `NODE_STYLE` (a style-lookup map, not data) and the filter arrays can either move to the same fixture file as shared constants or stay in the View — whichever keeps the diff smallest; they're small and not the actual SRP problem.

**Step 2 — Extract the SVG rendering loops into sub-components.**
Once the mock data is gone, the remaining ~300–350 lines are almost entirely the component function. Pull the per-node and per-edge rendering (the two `.map(...)` loops around lines 440 and 470) into their own small presentational components — e.g. `AttackGraphNode.tsx` (renders one node: circle/shape, label, status styling, click handler) and `AttackGraphEdge.tsx` (renders one connecting line, using the existing `lx`/`ly` coordinate helpers, active/inactive styling). Follow the exact same pattern already proven in this codebase for `ExecutionEntryRow.tsx` — a single-item renderer wrapped in `React.memo` if the list is large enough to benefit (this canvas has a similar node-count profile to the execution list, so mirror that memoization choice). `lx`/`ly` can either be passed as props/imported directly by the new sub-components (they're pure coordinate math, not state — either is fine, pick whichever keeps the prop list smaller).

**Step 3 — Confirm the result.**
`AttackGraphCanvasView.tsx` should end up under, or reasonably close to, 300 lines, containing only the SVG container/layout, the filter-driven visibility logic, and composition of `AttackGraphNode`/`AttackGraphEdge`/`AttackGraphToolbar`/`AttackGraphLegend`. It should have zero `useState`/`useEffect` (data now arrives via props from the Container, matching every other View in this codebase). Every rendered coordinate, color, and shape must be pixel-identical to today's output — this is pure code motion, not a visual change.

---

After this file is done, run `npx tsc --noEmit`, `npm run lint`, and `npm run build` once, and fix whatever they surface. No rendered output should have changed — verify by comparing the Attack Graph screen's appearance before and after only if you want extra confidence; the build/lint/type-check pass is the actual gate.
