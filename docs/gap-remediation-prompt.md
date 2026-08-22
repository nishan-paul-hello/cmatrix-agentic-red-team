# Gap Remediation Prompt — AI Multi-Agent Platform Frontend

**Purpose of this file:** This is a follow-up prompt for an agentic code editor. The
codebase was already refactored once against `design-patterns-implementation-prompt.md`
and largely passed — the feature-based structure, repositories, FSM, strategy/command/
circuit-breaker/event-bus patterns, virtualization, and telemetry/sanitize/audit
utilities all exist and the project builds and lints clean. This prompt targets the
**specific, verified gaps** left over from that pass. It is not a new redesign — it is
a punch-list. Do not re-touch anything not listed below.

---

## 0. Non-Negotiable Constraints (unchanged from the original refactor, still apply)

1. **Zero visual/UX drift.** Every pixel, spacing, color, animation, copy string, and
   interaction currently rendered must look and behave identically after this pass.
2. **No behavior change to any screen** (Dashboard, Missions, Mission Workspace,
   Specialists, Execution Console, Validation Center, Findings, Memory, Trajectory,
   Research Lab, Benchmarks, Reports, Cost/Usage, Audit Log, Settings, Command
   Palette, Login).
3. **Fix gaps one at a time, in the order listed in Section 2.** After each gap, the
   app must build (`npm run build`) and lint clean (`npm run lint`) with zero warnings,
   and render identically to before.
4. **Never guess an API contract.** Still no backend. Keep using the existing
   repository/adapter seam — do not invent endpoints.
5. **Preserve existing file names/routes** used by Next.js App Router (`src/app/**`)
   unless a fix explicitly requires a new file — in which case re-export from the old
   path if anything external might still import it.
6. **Every change must be justified by the gap it closes.** No unrelated stylistic
   rewrites, no dependency upgrades, no formatting-only diffs mixed into a gap's commit.
7. **Do not regress anything already working.** The existing `DataSource` interface,
   `FSM.ts` transition maps, `EventBus.ts`, `CircuitBreaker.ts`, `SpecialistStrategy.ts`,
   `TaskCommand.ts`, `Orchestrator.ts`, `useTelemetry.ts`, `sanitize.ts`, and
   `emitAuditEvent.ts` are correct as-is and must keep working exactly as they do today.

---

## 1. Context (grounding — do not restate to the user, just use it)

- Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. No backend, no
  data-fetching library, no state library beyond React Context.
- Domain: an **AI multi-agent autonomous security/pentest platform** — "missions" run
  by an orchestrator that dispatches "specialist" agents (recon, injection, auth,
  validation) against targets, produces findings, requires human escalation, and
  tracks cost/trajectory/memory/benchmarks.
- A prior refactor pass already introduced: feature-based module structure under
  `src/features/*`, per-feature repositories implementing `DataSource<T>`, centralized
  domain types and status enums in `src/types/domain-types.ts`, a shared FSM in
  `src/utils/FSM.ts`, an event bus in `src/utils/EventBus.ts`, a circuit breaker, a
  strategy object for specialists, a command object for tasks, an orchestrator/worker
  domain model, list virtualization via `@tanstack/react-virtual` in Trajectory and
  Execution Console, a telemetry hook, a sanitize utility, and a shared
  `emitAuditEvent` function. **All of that is correct and must be left alone.**
- A verification pass (build + lint + targeted grep) found **7 concrete gaps** against
  the original spec's own Definition of Done. Those gaps are the entire scope of this
  prompt.

---

## 2. Gaps to Fix (in order)

### Gap 1 — Repository bypass in three data files (highest priority)

**Problem:** These mock-data modules are imported **directly by components**, with no
repository sitting in front of them, violating the rule "components must call the
repository function, never import the raw mock array directly":

- `src/features/missions/data/workspaceMockData.ts` — exports `VDG_NODES`,
  `SPECIALISTS`, `SUB_NAV`, `INITIAL_LOG`, `STREAM_EVENTS`. Imported directly by:
  `MissionWorkspaceView.tsx`, `MissionWorkspaceContainer.tsx`, `MissionOverview.tsx`,
  `MissionSubNavPanel.tsx`, `MissionLiveState.tsx`, `AttackGraphCanvasContainer.tsx`,
  `AttackGraphCanvasView.tsx`, `AttackGraphNode.tsx`, `AttackGraphEdge.tsx`.
- `src/features/missions/data/wizardMockData.ts` — exports `STEPS`,
  `SURFACE_OPTIONS`, `MODE_OPTIONS`, `SURFACE_SPECIALISTS`. Imported directly by:
  `NewMissionWizardView.tsx`, `NewMissionWizardContainer.tsx`, `WizardContext.tsx`,
  `ReviewStep.tsx`, `ModeCards.tsx`, `SurfaceCards.tsx`, `Step1.tsx`.
- `src/features/research/data/researchMockData.ts` — exports `STAT_DATA`,
  `FAILURE_CLUSTERS`, `FAILURE_TIMELINE` (note: `ABLATION_RUNS`, `ABLATION_FLAG_KEYS`,
  `COMPONENTS` in the same file are fine, they're already only touched inside this
  file). Imported directly by: `StatisticalEval.tsx`, `FailureAnalysis.tsx`.

**Fix:**

1. Create `src/features/missions/data/WorkspaceRepository.ts` implementing
   `DataSource<...>` (mirror the shape of the existing `MissionRepository.ts` /
   `AttackGraphRepository.ts` — static `mockData`, a `seed()` method, `fetch()`, and
   `fetchAll()` with the same `{ page, limit, collection }` options signature). It
   should read from `workspaceMockData.ts` internally — do not delete or rename the
   mock data file itself, just stop letting components see it directly.
2. Create `src/features/missions/data/WizardRepository.ts` the same way, backed by
   `wizardMockData.ts`.
3. Create `src/features/research/data/ResearchRepository.ts` if one does not already
   fully cover `STAT_DATA` / `FAILURE_CLUSTERS` / `FAILURE_TIMELINE` (check the
   existing `ResearchRepository.ts` first — it may already cover some exports from
   this file but not these three; extend it rather than creating a second repository
   for the same feature if one exists).
4. Update every component listed above to obtain its data through the new
   repository (or hook wrapping it) instead of importing the named export from the
   mock-data file directly. Type-only imports (`type Endpoint`, `type Bench`, etc.)
   are fine to keep as direct imports — this fix is about **data**, not types.
5. If a component only needs the data synchronously at render time today (no loading
   state), it is acceptable to add a thin `use<Feature>Data()` hook that calls the
   repository's `fetchAll()` and stores it in state, matching how other features
   already consume their repositories. Look at how `Specialists.tsx` or
   `FindingsList.tsx` already do this and follow the same shape for consistency.

### Gap 2 — Inconsistent fixture placement

**Problem:** The spec's Fixture/Mock Separation pattern says mock data should live in
`data/fixtures/*.ts` per feature. Some features comply (`audit`, `execution`,
`escalation`, `trajectory`, `reports`, `specialists`, and part of `missions`), others
keep mock data loose directly under `data/` with no `fixtures/` subfolder:

- `src/features/environment/data/mockData.ts`
- `src/features/memory/data/mockData.ts`
- `src/features/cost/data/costMockData.ts`
- `src/features/benchmarks/data/benchmarksMockData.ts`
- `src/features/findings/data/findingsMockData.ts`
- `src/features/validation/data/validationMockData.ts`
- `src/features/research/data/researchMockData.ts`
- `src/features/missions/data/workspaceMockData.ts`
- `src/features/missions/data/wizardMockData.ts`

**Fix:**

1. For each file above, move it to `data/fixtures/<sameFileName>.ts` inside its
   feature (e.g. `src/features/environment/data/fixtures/mockData.ts`).
2. Update the corresponding repository file's import path to point at the new
   location.
3. Update every remaining import across the codebase (components, hooks, other
   repositories) to the new path. Use a project-wide search for the old import path
   string before deleting the old file — do not leave a dangling import.
4. Do this one feature at a time, running `npm run build` after each feature's move,
   so a broken import is caught immediately and attributable to one change.
5. Do **not** rename the exported symbols inside these files in this pass — only the
   file location changes. Symbol renames are out of scope here.

### Gap 3 — Bare status string literals outside the enum module

**Problem:** The Definition of Done states "No status is represented as a bare string
literal outside the FSM/enum module," but these still exist:

- `src/features/missions/domain/Orchestrator.ts:33` —
  `w.status === "RUNNING" || w.status === "VALIDATING"`
- `src/features/benchmarks/components/BenchmarkList.tsx:291` —
  `b.status === "QUEUED"`
- `src/features/benchmarks/components/BenchmarkDetail.tsx:86,282` — `"FAILED"` used
  as both an object key and a return value
- `src/features/memory/components/SkillLibrary.tsx:158,187` — `"SUCCESS"` used as a
  key and in a comparison
- `src/features/memory/components/StrategyBranching.tsx:28,36` — `"SUCCESS"`,
  `"RUNNING"` used as literal object values
- `src/features/memory/components/BranchTree.tsx:63,68` — `b.outcome === "SUCCESS"`,
  `b.outcome === "RUNNING"`
- `src/features/escalation/components/HumanEscalation.tsx:52` —
  `type === "HALT" ? "FAILURE" : "SUCCESS"`
- `src/features/execution/hooks/useExecutionFeed.ts:21,23,28,29,30,38` — repeated
  `entry.status === "FAILED"`, `"TIMEOUT"`, `"SUCCESS"` comparisons

**Fix:**

1. For each occurrence, import the relevant const-object enum from
   `src/types/domain-types.ts` (`MISSION_STATUS`, `TASK_STATUS`, `BENCHMARK_STATUS`,
   `SPEC_STATUS`, `FINDING_STATUS`, or `VDG_NODE_STATUS` as appropriate) and replace
   the string literal with the enum member (e.g. `TASK_STATUS.SUCCESS` instead of
   `"SUCCESS"`).
2. In `HumanEscalation.tsx`, check whether `"FAILURE"` / `"SUCCESS"` here refers to an
   escalation outcome that isn't currently modeled in `domain-types.ts`. If it maps to
   an existing status enum, use it. If escalation outcomes are a genuinely distinct
   concept not covered by any existing enum, add a new const-object enum
   `ESCALATION_OUTCOME = { APPROVED: "APPROVED", DENIED: "DENIED" } as const` (or
   rename to match the domain's actual existing vocabulary — check
   `EscalationRepository.ts` and its types first) to `domain-types.ts` rather than
   inventing a second ad hoc string union. Do not change the FSM transition
   behavior — only the representation of the values.
3. In `SkillLibrary.tsx`, `StrategyBranching.tsx`, and `BranchTree.tsx`, confirm
   whether `"SUCCESS"` / `"RUNNING"` there refer to `TASK_STATUS` semantically (recon
   attempt outcomes) before swapping — if the underlying mock data type
   (`Skill`, `Branch`, etc. in `memory/data/mockData.ts`) declares its own narrower
   local string union for this field, update that type to reference `TaskStatus` (or
   a subset of it) from `domain-types.ts` instead of maintaining a parallel literal
   type.
4. After the swap, run a project-wide search for the seven status words in quotes
   (`"RUNNING"`, `"QUEUED"`, `"PAUSED"`, `"VALIDATING"`, `"SUCCESS"`, `"FAILED"`,
   `"TIMEOUT"`) excluding `domain-types.ts` itself and any `fixtures`/mock-data files
   (mock *data* is allowed to contain literal status values as data — the rule is
   about *code* comparing against bare strings, not the fixture arrays holding
   status fields) to confirm nothing was missed.

### Gap 4 — Audit Log is neither virtualized nor repository-paginated

**Problem:** `src/features/audit/components/AuditLogPage.tsx` currently does
client-side `.slice(start, start + PAGE_SIZE)` over a fully-loaded in-memory array.
The spec requires Audit Log to be virtualized (long, continuously-growing list) and,
separately, says paginated views should be paged through the repository layer, not
via client-side slicing of a full array.

**Fix (pick the virtualization approach — it is the one explicitly named for Audit
Log in the original spec's list of unbounded lists; do not implement both a
virtualizer and a paginator for the same view, that would be redundant and risks
visual drift):**

1. Follow the same pattern already used in `TrajectoryPage.tsx` and
   `ExecutionConsoleView.tsx`: import `useVirtualizer` from `@tanstack/react-virtual`,
   compute row height/estimate, and render only the virtual window instead of
   `paginatedVisible.map(...)`.
2. Remove the `PAGE_SIZE` / `paginatedVisible` slicing logic once virtualization
   replaces it, but keep the existing type/result filters (`TYPE_FILTERS`,
   `RESULT_FILTERS`) exactly as they behave today — filtering logic is unrelated to
   this gap and must not change.
3. Confirm `AuditRepository.fetchAll()` is still called the same way it is today to
   populate the full filtered dataset that gets fed into the virtualizer — this gap
   is about the render strategy, not about how data is fetched.
4. Visually verify row spacing, borders, and the detail drawer (`drawerFields`)
   still render identically after switching from paginated `<tr>` rows to virtualized
   rows.

### Gap 5 — Error boundaries are route-level only

**Problem:** `error.tsx` exists per Next.js route, which is good, but the original
spec specifically called for boundaries around **individual heavy panels within a
page** — `AttackGraphCanvas` and `EnvironmentalLayer` by name — so that one panel
throwing does not blank the whole route, only that panel.

**Fix:**

1. Create a reusable `src/components/ui/PanelErrorBoundary.tsx` — a class component
   (React error boundaries must be class components; this is the one exception to
   "no new class-based state" in the rest of the codebase) implementing
   `componentDidCatch` / `getDerivedStateFromError`, accepting a `fallback` prop or
   rendering a small, self-contained fallback UI scoped to the panel's usual
   dimensions (not a full-screen takeover like the route-level `error.tsx`).
2. Wrap `AttackGraphCanvasView.tsx` (or its container, whichever is the actual
   mount point in `MissionWorkspaceView.tsx`) in `<PanelErrorBoundary>`.
3. Wrap `EnvironmentalLayer.tsx` similarly at its mount point.
4. Keep the wrapping minimal — no change to either component's internal logic, only
   an added parent boundary.
5. Manually verify (or add a temporary throw for testing, then remove it) that a
   thrown error inside one panel no longer takes down the surrounding page shell.

### Gap 6 — `React.memo` under-applied

**Problem:** Only 5 components use `React.memo` despite `useMemo`/`useCallback`
being used 23 and 21 times respectively across the codebase — meaning derived values
are memoized but the presentational components consuming them often are not, so
they can still re-render unnecessarily on unrelated parent state changes.

**Fix:**

1. Identify presentational (props-in/JSX-out, no internal state beyond local UI
   toggles) components in the highest-churn lists: Execution Console row component,
   Trajectory step row component, Audit Log row component, Findings list item,
   Benchmark list item, and Specialist card/row components.
2. Wrap each in `React.memo`. Where the component takes a callback prop (e.g.
   `onSelect`, `onExpand`), confirm the parent passes a `useCallback`-wrapped
   function — if it currently passes an inline arrow function, wrap it in
   `useCallback` in the parent so the `memo` wrapper is actually effective.
3. Do not apply `React.memo` to container components that own state/effects —
   memoizing a component that re-renders because its own state changed is a no-op
   at best and can mask real bugs.
4. This is a performance-only change — no prop shapes, no JSX output, no visual
   difference should result. Verify with a quick before/after render count check
   (e.g. temporary `console.count` in dev, removed before committing) if you want to
   confirm the memoization is effective, but remove any debug logging before
   finishing.

### Gap 7 — 15 component files still exceed the ~300-line SRP guidance

**Problem:** `TrajectoryPage.tsx` (469), `Specialists.tsx` (429), `Dashboard.tsx`
(408), `HumanEscalation.tsx` (406), `BenchmarkList.tsx` (404),
`StateMachineModal.tsx` (385), `BenchmarkDetail.tsx` (374), `ReportsPage.tsx` (352),
`HostTopology.tsx` (352), `CommandPaletteView.tsx` (348), `ValidationCenter.tsx`
(347), `AuditLogPage.tsx` (335), `TeamManagerDashboardView.tsx` (310),
`NewMissionWizardView.tsx` (309), `AblationLab.tsx` (308) all still cross the
spec's own stated ~300-line signal-to-extract threshold.

**Fix (treat this as lowest priority — only do this after Gaps 1–6 are done and
verified, since splitting large files is the highest-risk-of-visual-drift change
here):**

1. For each file, identify one or two natural extraction points: a sub-section of
   JSX that renders a self-contained block (a drawer, a modal, a filter bar, a
   table section) with its own local variables, and pull it into its own
   presentational component in the same feature's `components/` folder.
2. Prefer extracting **presentational** pieces (pure props-in/JSX-out) over further
   splitting business logic — the container/presentational split and custom hooks
   for these files were already done in the prior pass; this gap is specifically
   about files that are long due to JSX bulk (many similar rows/sections), not
   files that are long due to mixed concerns.
3. Do one file per commit. After each extraction, diff the rendered output (or do a
   manual visual pass) to confirm zero drift before moving to the next file.
4. It is acceptable to leave a file at, say, 310–340 lines if splitting it further
   would fragment a single cohesive visual block (e.g. one modal with many related
   fields) into unnaturally small pieces — the ~300 line number is a signal, not a
   hard requirement, per the original spec's own wording ("a signal to extract").
   Do not force an extraction that makes the code harder to follow just to hit a
   number.

---

## 3. Verification Checklist (run after every gap, not just at the end)

- `npm run lint` — must complete with zero warnings/errors.
- `npm run build` — must complete successfully, same route list as before
  (`/`, `/dashboard`, `/missions`, `/missions/[missionId]`, `/missions/new`,
  `/specialists` if present, `/audit-log`, `/benchmarks`, `/cost-usage`, `/memory`,
  `/memory/failure-memory`, `/memory/skill-library`, `/reports`,
  `/research/ablations`, `/research/failure-analysis`, `/research/statistics`,
  `/settings`, `/trajectory`, `/login`).
- Grep for the seven raw status strings outside `domain-types.ts` and fixture files
  — should return zero matches after Gap 3.
- Grep for direct imports of the nine relocated mock-data files by their old path —
  should return zero matches after Gap 2.
- Grep for any component (outside a feature's own `data/`/`repositories`/hooks
  layer) importing `VDG_NODES`, `SPECIALISTS`, `SUB_NAV`, `STEPS`,
  `SURFACE_OPTIONS`, `MODE_OPTIONS`, `STAT_DATA`, `FAILURE_CLUSTERS`, or
  `FAILURE_TIMELINE` directly — should return zero matches after Gap 1.
- Manual visual pass on Audit Log (scrolling, filtering, opening the detail drawer)
  after Gap 4.
- Manual pass forcing an error inside `AttackGraphCanvas` and `EnvironmentalLayer`
  (temporarily) to confirm the panel-level boundary catches it without blanking the
  route, then remove the forced error, after Gap 5.

## 4. Definition of Done (this pass only)

- No component imports a raw mock-data array directly; every data access for the
  nine files in Gaps 1–2 goes through a repository.
- Every feature's mock data lives under that feature's `data/fixtures/` folder.
- No status comparison anywhere in application code (excluding fixtures) uses a bare
  string literal — all reference the shared const-object enums.
- Audit Log renders via the same virtualization approach already used in Trajectory
  and Execution Console, with no client-side full-array pagination remaining.
- `AttackGraphCanvas` and `EnvironmentalLayer` are each wrapped in a scoped panel
  error boundary independent of the route-level `error.tsx`.
- The highest-churn list-row components use `React.memo`, paired with
  `useCallback`-wrapped handlers from their parents.
- Files listed in Gap 7 are reduced where it can be done without fragmenting a
  cohesive visual block; any file left over ~300 lines has an inline comment
  explaining why further extraction wasn't done.
- `npm run build` and `npm run lint` both pass clean after every individual gap fix,
  not just at the very end.
- **The rendered UI remains pixel-identical to before this remediation pass.**
