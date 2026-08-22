# Design Patterns Gap Report — Surgical Fix Prompt

**Purpose of this file:** This is a prompt for an agentic code editor. It documents every gap found between `design-patterns-implementation-prompt.md` (the original spec) and the actual codebase, as of this audit. Each item below names the exact file(s)/line(s) that prove the gap and the exact fix required. **Do not re-litigate patterns marked ✅ DONE — leave that code alone.** Work only on ❌ MISSING and ⚠️ PARTIAL items.

**Non-negotiable constraint, above all else: zero UI/UX change.** Every pixel, spacing, color, animation, copy string, and interaction currently rendered must look and behave identically after every fix below. These are internal-architecture-only changes. If any fix in this document appears to require a visible change to satisfy a pattern "properly," implement it in whatever internal form preserves the current UI exactly instead — correctness of internal architecture never overrides this.

Write the best possible code for each gap — proper typing, proper separation of concerns, no shortcuts, no half-measures — but the goal is internal code quality and pattern-correctness, not UI improvement. The UI is out of scope entirely; no fix should touch a `className`, inline style, layout, copy string, or interaction as a side effect of restructuring the code around it.

Implement every gap in this document. Do **not** stop to run `npm run lint` or `npm run build` after each individual fix, file, or section — work through the entire document first. Run `npm run lint` and `npm run build` once, only after every fix below is complete, and resolve whatever they surface at that point.

Legend: ✅ DONE · ⚠️ PARTIAL (exists but incomplete/inconsistent) · ❌ MISSING (not implemented at all)

---

## Section A — Architectural / Structural Patterns

### §1 Feature-based module structure — ✅ DONE
All 17 domains (`audit, auth, benchmarks, core, cost, environment, escalation, execution, findings, memory, missions, reports, research, settings, specialists, trajectory, validation`) exist under `src/features/*` with their own `components/`, `data/`, `index.ts`. No action needed.

### §2 Container / Presentational split — ❌ MISSING (widespread)
No component in the codebase is split into a `*Container` (state/effects) + presentational pair. State, effects, and hundreds of lines of inline JSX all live in one file. Confirmed worst offenders:
- `src/features/missions/components/workspace/MissionWorkspace.tsx` (851 lines) — `useReducer`, two `useEffect`s, and a `setInterval` poller (lines 73–107) sit directly above ~740 lines of inline JSX (status strip, metrics row, tabs, panels) in the same function, same file.
- `src/features/missions/components/workspace/AttackGraphCanvas.tsx` (768 lines)
- `src/features/settings/components/SettingsPage.tsx` (674 lines)
- `src/features/missions/components/wizard/NewMissionWizard.tsx` (584 lines)
- `src/features/specialists/components/TeamManagerDashboard.tsx` (549 lines)
- `src/features/missions/components/workspace/VDGNodeDrawer.tsx` (545 lines)
- `src/features/execution/components/ExecutionConsole.tsx` (508 lines) — has hooks/memoization done right, but still one file mixing state + full render tree.

**Fix (surgical, largest file first per Phase 3 order):**
For each file above, extract a `<Name>Container.tsx` that owns all `useState`/`useReducer`/`useEffect`/hook calls and renders a new pure `<Name>View.tsx` (or split further into named sub-sections, e.g. `WorkspaceStatusStrip.tsx`, `WorkspaceMetricsRow.tsx`, `WorkspaceTabs.tsx` for `MissionWorkspace`). The container passes only plain props/callbacks down. No presentational component may call `useState`, `useReducer`, `useEffect`, or import a repository/hook that fetches data — local UI-only toggles (e.g. an accordion open/close) are the only state allowed inside a presentational component. Re-export the container as the file's default export from the original path so route imports (`src/app/**`) don't change. This is a pure code-motion exercise: every `className`, every inline style object, every JSX element and its props must move to the new file byte-for-byte unchanged — the rendered DOM output must be identical before and after the split.

### §3 Custom Hooks pattern — ⚠️ PARTIAL
Hooks folders exist for 15/17 features (`auth` and `settings` have none — verify whether they need one before adding a placeholder). But several existing hooks are **not** the derived-logic hooks the spec calls for — they only hold trivial UI toggle state, while the actual filtering/aggregation logic stays inline in components:
- `src/features/findings/hooks/useFindingsData.ts` — only `{ detail, setDetail, tab, setTab }`. No filter/derived logic despite `ValidationTab.tsx:30` containing an inline `.filter(...)` predicate that should be a pure function called from this hook.
- `src/features/cost/hooks/useCostData.ts` — only `{ tab, setTab }`. No `useCostBreakdown` exists anywhere, despite being explicitly named in the spec (§3). Cost aggregation math is embedded directly in `src/features/cost/components/*.tsx` (confirmed zero `useMemo`/hook-extracted `reduce()` calls in that folder).
- `src/features/benchmarks/hooks/useBenchmarksData.ts` — only `{ detail, setDetail }`. Meanwhile `BenchmarkList.tsx` (see §4 below) does raw filtering/reduction inline against a directly-imported mock array.
- No `useMissionFilters` hook exists. `src/features/missions/components/MissionsPage.tsx:54` computes `filter((m) => m.status === filter)` inline in the component body every render.

**Fix:**
1. Create `useMissionFilters(missions, filter)` in `src/features/missions/hooks/`, move the line-54 filter logic into it, wrap in `useMemo`. Update `MissionsPage.tsx` to call it.
2. Create `useCostBreakdown()` in `src/features/cost/hooks/` that returns memoized aggregation results consumed by `CostDashboard.tsx`, `CostUsage.tsx`, `ContextState.tsx`, `ModelBreakdown.tsx`. Move any `reduce`/aggregation math currently inline in those four files into this hook as pure functions (see §40).
3. Extend `useFindingsData.ts` to own the filter predicate currently inline in `ValidationTab.tsx:30`.
4. Extend `useBenchmarksData.ts` to own the `filter`/`reduce` logic currently inline in `BenchmarkList.tsx:9-10,74,79,87` and `BenchmarkDetail.tsx:19-20,327`.

### §4 Repository / Data-Access-Layer pattern — ❌ MISSING for 14 of 16 domains
Only two repositories exist in the codebase: `src/repositories/MissionRepository.ts` and `src/repositories/SpecialistRepository.ts`. Every other domain has components importing raw mock arrays **directly**, in direct violation of the spec's explicit rule ("Components must call the repository function, never import the raw mock array directly"). Confirmed direct-import offenders:
- `src/features/execution/components/ExecutionConsole.tsx:4` — `import { getParsedRows } from ".../executionMockData"` (function exists but lives in the fixture file itself, not a repository)
- `src/features/specialists/components/TeamManagerDashboard.tsx` — imports from fixtures directly
- `src/features/trajectory/components/TrajectoryPage.tsx:4` — `import { type TrajStep } from ".../trajectoryMockData"`
- `src/features/environment/components/{EndpointsPanel,EvidencePanel,EnvironmentalLayer,HostTopology,AuthStatesPanel,CredentialsPanel,ELFindingsPanel,ParametersPanel,ServicesPanel,FailuresPanel,CVECandidatesPanel}.tsx` — all 10 import `mockData` directly
- `src/features/memory/components/{ContextUtilization,TechnicalActions,VulnPatterns,StrategyBranching,BranchTree,MemoryPage,FailureMemory}.tsx` — all 7 import `mockData` directly (note: `FailureMemory.tsx` and `SkillLibrary.tsx` at least route through `globalBlackboard`, see §15/§39, but that's a separate singleton problem, not a repository)
- `src/features/benchmarks/components/BenchmarkList.tsx:3` and `BenchmarkDetail.tsx` — `import { BENCHMARKS, ... } from ".../benchmarksMockData"`
- `src/features/audit/data/fixtures/auditMockData.ts` consumed directly in places, and `src/features/escalation`, `src/features/reports` also have `data/fixtures` folders with no repository wrapper.

**Fix:** For every feature listed above, create `src/features/<feature>/data/<Feature>Repository.ts` following the exact shape of `MissionRepository.ts` (static class, `private static mockData`, `static seed()`, `static async get*()` with a simulated-latency `Promise`). Move the existing fixture-reading function's body into the repository. Update every component/hook listed above to import the repository instead of the fixture/mockData file. The fixture file itself becomes private to its repository (only the repository file may import from `data/fixtures/*` or `data/mockData.ts`).

### §5 Adapter pattern — ❌ MISSING (interface exists, zero implementations)
`src/types/adapters.ts` defines a `DataSource<T>` interface (`fetch`, `fetchAll` with `{page, limit}`, `create`, `update`, `delete`). **Nothing in the codebase implements or imports this interface** — confirmed via full-repo search, zero hits outside the declaration file itself. `MissionRepository` and `SpecialistRepository` are static classes with ad hoc method names (`getMissions`, `getMissionById`, `getTimeline`) that do **not** conform to `DataSource<T>`, and neither accepts the `{page, limit}` option the interface promises. This is dead code today, not a seam.

**Fix:**
1. Rewrite `MissionRepository` and `SpecialistRepository` (and every new repository created per §4) as classes that `implements DataSource<Mission>` / `DataSource<Specialist>` / etc., with `fetch(id)`, `fetchAll(options?)`, `create`, `update`, `delete` — even if `create`/`update`/`delete` just mutate the in-memory `mockData` array and return it (mock-adapter behavior, per spec's own §4: "today's adapter returns local mock data").
2. Keep the currently-named convenience methods (`getMissions`, `getMissionById`) as thin wrappers calling `fetchAll()`/`fetch()` internally so existing call sites don't need to change signatures in this pass — only their internals need to route through the interface-conformant methods.

### §6 Facade pattern (contexts) — ✅ DONE
`auth-context.tsx`, `mission-context.tsx`, `services-context.tsx` all expose small intention-revealing APIs (`login()`, `logout()`, `activeMissionId`, `eventBus`, `circuitBreaker`) with no leaked internal shape. No action needed — **do not touch these three files** except where §39 below requires adding `blackboard` to `ServicesContextType`.

### §7 Compound Component pattern — ❌ MISSING for all three named components
The spec explicitly names `CommandPalette`, `VDGNodeDrawer`, and wizard steps in `NewMissionWizard` as candidates. Confirmed: **zero `createContext` calls** exist in any of these three files. Each manages sub-part state via local `useState`/props instead of a shared compound-component context, meaning any prop drilling between "steps" or "sub-panels" inside them is manual.

**Fix:**
1. `NewMissionWizard.tsx` — introduce a `WizardContext` (step index, form state, `next()`/`back()`/`goToStep()`) via `createContext`, and refactor each wizard step into a child component (`<Wizard.Step1/>`, `<Wizard.Step2/>`, etc., or equivalent) that reads from context instead of receiving every field as a prop.
2. `VDGNodeDrawer.tsx` — introduce a `NodeDrawerContext` if it has multiple sub-sections (tabs, metadata panel, actions panel) sharing selection state; formalize parent/child relationship.
3. `CommandPalette.tsx` — if it has distinct sub-parts (search input, result list, result item, footer hint), wire them through a `CommandPaletteContext` for shared `query`/`activeIndex`/`onSelect` state instead of prop drilling.
Do this only after §2's container/presentational split for these files, since the split will make the sub-parts explicit.

### §8 Barrel exports — ✅ DONE
Every feature has `index.ts`. No action needed.

---

## Section B — State Management Patterns

### §9 Single Source of Truth + State Colocation — ✅ largely DONE, ⚠️ one instance to verify
`activeMissionId` lives only in `mission-context.tsx`; `authenticated` only in `auth-context.tsx`. No duplication found between page/child state during this audit. Flag for a follow-up pass once §2 container/presentational splits land — verify no split introduces duplicated state between a new container and its new presentational children (e.g., don't let `MissionWorkspace` container and a new `WorkspaceStatusStrip` presentational component both hold `paused`).

### §10 Reducer pattern (`useReducer`) — ⚠️ PARTIAL
`MissionWorkspace.tsx` correctly uses `useReducer` (`workspaceReducer`, lines 52–72) for its multi-field panel state. **`NewMissionWizard.tsx` (584 lines, multi-step form) does not** — confirmed it still uses `useState` (see `sanitize` import found in `src/features/missions/hooks/useNewMissionWizard.ts`, but that hook was not confirmed to use `useReducer`).

**Fix:** Audit `src/features/missions/hooks/useNewMissionWizard.ts` — if the wizard's step/field state is more than 2–3 related `useState` calls (spec's own threshold), convert to `useReducer` with named actions (`SET_FIELD`, `NEXT_STEP`, `BACK_STEP`, `SUBMIT`), mirroring the pattern already proven correct in `MissionWorkspace.tsx`'s `workspaceReducer`.

### §11 Observer / Pub-Sub pattern — ✅ DONE for the three named consumers, ⚠️ one inconsistency
`globalEventBus` (`src/utils/EventBus.ts`) is correctly wired for the three feeds the spec names:
- `src/features/execution/hooks/useExecutionFeed.ts` — subscribes to `EXECUTION_EVENT`, also **publishes** `AUDIT_EVENT` on completion (good cross-feature wiring).
- `src/features/audit/hooks/useAuditFeed.ts` — subscribes to `AUDIT_EVENT`.
- `src/features/trajectory/hooks/useTrajectoryFeed.ts` — subscribes to `TRAJECTORY_EVENT`.

**Inconsistency found:** `useAuditFeed.ts` and `useExecutionFeed.ts` gate their live subscription behind `useFeatureFlag("ENABLE_LIVE_FEEDS")` (correct per §46), but **`useTrajectoryFeed.ts` subscribes unconditionally** with no feature-flag check (lines 15–19 of that file — no `useFeatureFlag` import at all).

**Fix:** Add the same `useFeatureFlag("ENABLE_LIVE_FEEDS")` gate to `useTrajectoryFeed.ts` that already exists in the other two feed hooks, for consistency and so the flag can actually kill all three live feeds together.

### §12 Optimistic UI Update pattern — ❌ MISSING
No rollback/optimistic-apply scaffolding found anywhere for mission/agent actions (pause, resume, escalate, approve). `HumanEscalation.tsx` uses a plain `submitted` boolean (`useState`, line 17) with no rollback path if a (future) backend rejects the decision.

**Fix:** In `HumanEscalation.tsx` (and any pause/resume/approve action in `MissionWorkspace.tsx`/`ValidationCenter.tsx`), apply the state change immediately on user action, then wrap the "confirmation" in a `Promise` (even a mock one that always resolves today) with a `catch` that reverts the optimistic state and shows an inline error. This is scaffolding only — no real backend exists yet, but the rollback code path must exist per spec §12 ("Implement the local-state half now so the seam exists").

---

## Section C — AI Multi-Agent–Specific Patterns

### §13 Orchestrator–Worker pattern — ⚠️ PARTIAL, not wired into the actual mission runtime
`src/features/missions/domain/Orchestrator.ts` correctly defines `MissionOrchestratorModel`/`WorkerSpecialist` with a `hasActiveWorkers()` method. **It is only consumed in `src/features/core/components/Dashboard.tsx`** (a stat card, presumably). `MissionWorkspace.tsx` — the actual mission-runtime screen where the orchestrator/worker relationship matters most — has **zero references** to `Orchestrator`/`WorkerSpecialist` and instead manages its own ad hoc `log`/`paused`/`terminated` reducer state with no explicit worker-status modeling.

**Fix:** Refactor `MissionWorkspace.tsx`'s state (post §2 split) to construct a `MissionOrchestratorModel` from the active mission + its specialists (via the new repository from §4), and derive specialist-status UI (currently likely hardcoded per-specialist blocks) from `orchestrator.workers` instead of ad hoc fields.

### §14 Finite State Machine pattern — ✅ DONE
`src/utils/FSM.ts` defines `MISSION_TRANSITIONS`, `TASK_TRANSITIONS`, `BENCHMARK_TRANSITIONS`, `SPEC_TRANSITIONS` as `Record<Status, Set<Status>>`, imported from `domain-types.ts` enums. This is exactly the pattern requested. No action needed. (Cross-reference §33 below for leaks where raw strings bypass this module.)

### §15 Blackboard pattern — ⚠️ PARTIAL, DI violation
`src/features/memory/domain/Blackboard.ts` correctly defines a `Blackboard` interface + `InMemoryBlackboard` implementation (`readSkills`, `readFailures`, `readContext`, `writeSkill`, `writeFailure`, `writeContext`) separate from page-local state — the pattern itself is well-built. **However** it's consumed via a bare singleton import (`import { globalBlackboard } from ".../Blackboard"`) directly inside two presentational components — `SkillLibrary.tsx` and `FailureMemory.tsx` — rather than through context/DI. This duplicates the exact problem §39 forbids, and `MemoryPage.tsx` itself (the container that composes `SkillLibrary`/`FailureMemory`/others) does not reference the blackboard at all despite being the natural place to own it.

**Fix:** Add `blackboard: Blackboard` to `ServicesContextType` in `src/lib/services-context.tsx` (alongside the existing `eventBus`/`circuitBreaker`), provide `globalBlackboard` there. Update `SkillLibrary.tsx` and `FailureMemory.tsx` to consume it via `useServices()` instead of the direct singleton import.

### §16 Strategy pattern for specialists — ✅ DONE
`src/features/specialists/domain/SpecialistStrategy.ts` exists and is consumed in `Specialists.tsx`. No action needed.

### §17 Command pattern for agent tasks — ✅ DONE
`src/features/execution/domain/TaskCommand.ts` defines `TaskCommand`/`ToolDescriptor`/`formatCommand`, consumed in `ExecutionConsole.tsx`. No action needed on the core pattern — see §23 for a related gap in `ToolDescriptor`'s completeness.

### §18 Human-in-the-loop / Escalation pattern — ⚠️ PARTIAL, missing the threshold gate
`HumanEscalation.tsx` exists and models `activeReason: EscalationReason`, `response`, `submitted` state, with approve/deny/modify-style exits. **But there is no risk/confidence threshold logic anywhere in the file** (confirmed: zero occurrences of "threshold", "confidence", or "risk" in the component) — the spec requires escalation to trigger "any agent action that crosses a defined risk/confidence threshold," but currently there's no code path that decides *when* to escalate; the escalation UI is just always-present/manually triggered.

**Fix:** Add a typed `RiskAssessment { score: number; threshold: number }` (or similar) to the domain types, and a pure function `shouldEscalate(assessment): boolean` (see §40) that gates whether `HumanEscalation` is shown/triggered for a given agent action, rather than the component being unconditionally rendered/invoked.

### §19 Supervisor / Guardrail pattern — ❌ MISSING
`ValidationCenter.tsx` (286 lines) and `EvaluationScreen.tsx` (165 lines) contain no language or structure separating "doer" from "checker" — confirmed zero occurrences of "verify/gate/independent/supervisor" in `ValidationCenter.tsx`. Findings/results appear to just carry a status field with no independent gating step modeled.

**Fix:** Introduce a `GuardrailResult { findingId: string; verifiedBy: "SUPERVISOR"; verdict: "PASS" | "FAIL" | "NEEDS_REVIEW"; notes?: string }` type. `ValidationCenter`/`EvaluationScreen` should read/write `GuardrailResult` records that are explicitly separate from the originating agent's own finding record — i.e., a finding's `status` field should not itself be the source of truth for "verified"; a `GuardrailResult` keyed to the finding is.

### §20 Streaming / Incremental Rendering pattern — ✅ DONE
Execution Console, Trajectory, and Audit Log all append-only via `globalEventBus` subscriptions (see §11) rather than re-fetching full arrays. No action needed.

### §21 Circuit Breaker + Retry pattern — ⚠️ PARTIAL, scoped to one feature only
`src/features/execution/domain/CircuitBreaker.ts` (`ToolCircuitBreaker`, `globalCircuitBreaker`) is correctly wired through `services-context.tsx` and consumed in `useExecutionFeed.ts` (`recordFailure`/`recordSuccess` per tool). This is good. But the spec's intent — "surfaces to the orchestrator/human" when a breaker trips — is **not wired anywhere**: there is no code path connecting a tripped breaker to `HumanEscalation.tsx` or to the `Orchestrator` model from §13.

**Fix:** When `ToolCircuitBreaker` trips (add/confirm a `isOpen(toolId)` or `onTrip` callback if not present), publish an event (reuse `globalEventBus`) that `HumanEscalation`/`MissionOrchestratorModel` can subscribe to, so a tripped breaker actually surfaces as an escalation candidate rather than being a silent internal counter.

### §22 Context-Window / Memory-Tiering pattern — ❌ MISSING
No short-term vs. long-term memory distinction exists in types anywhere — confirmed zero occurrences of "shortTerm/longTerm/tier" in `src/features/memory/components/ContextUtilization.tsx` or `domain-types.ts`. `Blackboard.ts` (§15) does separate skills/failures (long-term) from `contexts: Map` (which could be short-term) but this distinction is never surfaced as a named type or exposed to `ContextUtilization.tsx`, which is the component whose entire job is to display exactly this.

**Fix:** Add explicit `MemoryTier = "SHORT_TERM" | "LONG_TERM"` to `domain-types.ts`. Tag `Blackboard`'s `contexts` map as short-term and `skills`/`failures` as long-term explicitly (e.g., `readContext` returns records tagged `tier: "SHORT_TERM"`). Update `ContextUtilization.tsx` to read and visually distinguish tiers via this typed field rather than any current implicit/undifferentiated list.

### §23 Tool-Use Abstraction pattern — ⚠️ PARTIAL
`ToolDescriptor` (in `TaskCommand.ts`, §17) only has `{ id, version?, category? }` — it does **not** include the "input schema" or "expected output shape" the spec explicitly requires ("typed tool descriptor (name, input schema, expected output shape)"). Confirmed no `inputSchema`/`outputSchema` field anywhere in the file. Also unverified whether `ExecutionConsole.tsx` still has per-tool special-casing (e.g. `if (tool.id === 'sqlmap') {...}` branches) that this pattern is meant to eliminate — audit that file for tool-specific conditionals during the fix.

**Fix:** Extend `ToolDescriptor` with `inputSchema: Record<string, "string"|"number"|"boolean">` (or a small typed shape, no need for a full schema library yet) and `outputShape: Record<string, "string"|"number"|"boolean"|"array">`. Audit `ExecutionConsole.tsx` render logic for any `tool.id ===` conditionals and replace them with generic rendering driven by `inputSchema`/`outputShape`.

---

## Section D — Resilience & Error-Handling Patterns

### §24 Error Boundary pattern — ✅ DONE
`error.tsx` present at root and for every route segment (`research`, `trajectory`, `audit-log`, `settings`, `missions`, `benchmarks`, `reports`, `dashboard`, `cost-usage`, `memory`, `login`). No action needed.

### §25 Graceful Degradation / Fallback UI — ❌ MISSING in the `cost` feature and `reports`
A shared `EmptyState.tsx` primitive already exists in `src/components/ui/` (see §37), but it is **not used** in:
- `src/features/cost/components/ContextState.tsx`
- `src/features/cost/components/CostDashboard.tsx`
- `src/features/cost/components/CostUsage.tsx`
- `src/features/cost/components/ModelBreakdown.tsx`
- `src/features/reports/components/ReportsPage.tsx`

None of these five files contain "empty/Empty/no data/isLoading" — confirmed via full-file search. They will render blank/broken layouts on an empty dataset today.

**Fix:** Import and use the existing `<EmptyState />` primitive from `src/components/ui/EmptyState.tsx` in all five files above for their empty-data case, matching however it's already used in `AuditLogPage.tsx`/`TrajectoryPage.tsx`/`ExecutionConsole.tsx` (which do virtualization + presumably already handle empty state — verify and mirror their exact usage pattern).

### §26 Fail-safe defaults — ⚠️ PARTIAL
`MissionRepository.getMissionById` returns `mission ?? null` (safe). Not yet verified across every new repository created under §4 — **when creating the new repositories, every `get*`/`fetch*` method must default to `[]` or `null`, never throw, even if the underlying fixture array is empty or a lookup misses.** Add this as an explicit checklist item for every repository written under §4, not a separate pass.

---

## Section E — Performance & Scalability Patterns

### §27 Memoization pattern — ⚠️ PARTIAL, concentrated in only 3 files
`React.memo` used in exactly 3 files: `AuditLogPage.tsx`, `ExecutionConsole.tsx`, `TrajectoryPage.tsx` (the three virtualized-list screens — correct where applied). Codebase-wide: only 5 files use `useMemo`, only 8 use `useCallback`, out of 189 total `.ts(x)` files. Confirmed un-memoized derived computations recomputed on every render:
- `src/features/missions/components/MissionsPage.tsx:54` — `missions.filter(...)` inline, no `useMemo`.
- `src/features/benchmarks/components/BenchmarkList.tsx:9-10,74,79,87` — **five separate** `BENCHMARKS.filter(...)`/`.reduce(...)` calls directly in JSX/render body, several duplicating the same `.filter((b) => b.status === "COMPLETE")` computation multiple times per render (lines 74, 79, 87 each redo the filter independently).
- `src/features/benchmarks/components/BenchmarkDetail.tsx:19-20,327` — same issue, `TASK_DATA.filter(...)` computed per category on every render.
- `src/features/cost/components/*.tsx` — zero `useMemo` anywhere in the folder despite being explicitly named in the spec ("cost aggregations").

**Fix:** This resolves naturally once §3's hook extraction happens — move each of the above into its owning hook (`useMissionFilters`, `useBenchmarksData`, `useCostBreakdown`) wrapped in `useMemo`, keyed on its actual dependencies. For `BenchmarkList.tsx` specifically, compute the `BENCHMARKS.filter((b) => b.status === "COMPLETE")` result **once** and reuse it for lines 74/79/87 rather than recomputing three times.

### §28 List Virtualization pattern — ✅ DONE
`@tanstack/react-virtual` (`useVirtualizer`) used in `TrajectoryPage.tsx`, `AuditLogPage.tsx`, `ExecutionConsole.tsx` — exactly the three lists the spec names. No action needed.

### §29 Code-Splitting / Lazy Loading — ⚠️ PARTIAL
`next/dynamic` found in exactly 2 files: `src/app/(app)/benchmarks/page.tsx` and `MissionWorkspace.tsx` (likely lazy-loading `AttackGraphCanvas` from within it — verify). The spec names three specific heavy panels: `AttackGraphCanvas`, `ResearchLab`, `BenchmarksHub`. **`ResearchLab` is not confirmed lazy-loaded** — no `next/dynamic` found in the `research` feature's route or any parent that renders it.

**Fix:** Confirm `src/app/(app)/research/page.tsx` (or wherever `ResearchLab`/`AblationLab` is composed) — if it's a direct static import, convert to `next/dynamic(() => import(".../ResearchLab"))` matching the existing pattern already used for benchmarks.

### §30 Debounce/Throttle pattern — ✅ DONE
`useDebounce` correctly used in `CommandPalette.tsx:141` (search) and `AuditLogPage.tsx:133` (search). No action needed. (Verify no other page added a filter input since this audit without debouncing it — not found as of this pass.)

### §31 Pagination pattern — ❌ MISSING
No repository or component implements paged access. `MissionRepository.getMissions()` and `SpecialistRepository.getSpecialists()` return the full array every time — no `page`/`limit` params despite `DataSource<T>.fetchAll(options?: {page, limit})` (§5) suggesting this was the intended shape. Audit Log, Findings, and Reports (the three views the spec explicitly names) all appear to slice the full in-memory array client-side (confirmed no pagination-related code in any of these three features' components/hooks).

**Fix:** Once repositories conform to `DataSource<T>` (§5 fix), implement `fetchAll({ page, limit })` for real — slice the mock array server-side-style inside the repository, not in the component. Update `AuditLogPage.tsx`, `FindingsDashboard.tsx`/whatever the findings list component is, and `ReportsPage.tsx` to call `fetchAll({ page, limit })` and manage a `page` state, rather than rendering a full in-memory array (note: this is compatible with the existing virtualization in `AuditLogPage.tsx` — virtualization windows the DOM, pagination windows the data fetch; both can coexist, virtualization first, pagination on top of infinite-scroll pages).

---

## Section F — Data & Type-Safety Patterns

### §32 Centralized Domain Types — ✅ mostly DONE, ⚠️ one leak
No duplicate `interface Mission`/`Finding`/`Specialist` found outside `domain-types.ts` — good. **One leak:** `src/features/missions/data/workspaceMockData.ts:19` defines its own separate status union — `"COMPLETED" | "EXPLOITED" | "ELIGIBLE" | "IN_PROGRESS" | "DEPENDENT" | "INFEASIBLE"` — for VDG node status, entirely outside `domain-types.ts` and outside the FSM in `utils/FSM.ts`.

**Fix:** Move this union into `domain-types.ts` as a named `VdgNodeStatus` type (or fold it into an existing enum if it's conceptually the same lifecycle), and add a corresponding transitions table to `FSM.ts` (§14) so this status also benefits from the "UI reads state, never mutates it ad hoc" guarantee. Update `src/features/missions/components/workspace/NodeStyle.tsx:10` (`case "COMPLETED":` and similar) to import the enum instead of switching on bare strings.

### §33 Enum/Const-Object pattern for status — ⚠️ PARTIAL, magic strings still leak
`MISSION_STATUS`/`TASK_STATUS`/`BENCHMARK_STATUS`/`SPEC_STATUS` const objects exist and are used correctly in most places. Confirmed leaks:
- `src/features/audit/components/AuditLogPage.tsx:45` — `const RESULT_FILTERS = ["ALL", "SUCCESS", "FAILURE", "WARNING"] as const;` is a local literal union, not sourced from a shared `AUDIT_RESULT` const object.
- `src/features/audit/data/fixtures/auditMockData.ts` — every entry's `result: "SUCCESS"` field is a bare string literal (12+ occurrences), not referencing a shared enum.
- `src/features/validation/components/StateMachineModal.tsx:75,178` — `id: "SUCCESS"` / `label: "SUCCESS"` bare strings.
- `src/features/missions/components/wizard/NewMissionWizard.tsx:566` — `result: "SUCCESS"` bare string.
- `src/features/missions/data/workspaceMockData.ts:44` — `status: "COMPLETED"` bare string (tied to the §32 leak above).

**Fix:** Add an `AUDIT_RESULT = { SUCCESS: "SUCCESS", FAILURE: "FAILURE", WARNING: "WARNING" } as const` to `domain-types.ts` alongside the existing status const objects. Replace every bare-string occurrence listed above with the const object reference (e.g. `AUDIT_RESULT.SUCCESS`). Do this as one dedicated commit per the spec's own "one pattern per commit" rule — it's a pure find-and-replace with zero behavior change.

### §34 Schema Validation seam — ❌ MISSING
No `zod` (or any validation library) in `package.json`, confirmed zero references anywhere in `src`. The repository/adapter layer (§4/§5) has no designated insertion point for a future validation step.

**Fix:** No need to add `zod` as a dependency yet (out of scope — don't add new dependencies per a future backend that doesn't exist). Instead, add a clearly-commented seam: in each repository's `fetch`/`fetchAll` method (post §5 fix), add a single-line comment `// VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data` immediately before the `resolve(...)` call, so the insertion point is unambiguous later. This satisfies "structure the layer so a validation step can be inserted... without touching component code" without prematurely adding a dependency.

### §35 Fixture/Mock Separation pattern — ⚠️ PARTIAL
`src/data/fixtures/` exists for `missions`/`specialists` (consumed only by their repositories — correct). But most other features keep mock data as `data/mockData.ts` or `data/fixtures/*.ts` **imported directly by components** (this is the same list of files as §4 — the two gaps are the same root cause). No separate fix needed here beyond completing §4; once every component is routed through a repository, this pattern is automatically satisfied. **Do not create a second parallel fix — §4's fix closes this too.**

---

## Section G — Code Quality / Maintainability Patterns

### §36 Single Responsibility Principle (≥300-line cap) — ❌ MISSING, 19 files over the cap
Full list of files exceeding the spec's ~300-line signal threshold, worst first:
`MissionWorkspace.tsx` (850), `AttackGraphCanvas.tsx` (768), `SettingsPage.tsx` (674), `NewMissionWizard.tsx` (584), `TeamManagerDashboard.tsx` (549), `VDGNodeDrawer.tsx` (545), `ExecutionConsole.tsx` (508), `TrajectoryPage.tsx` (469), `Specialists.tsx` (429), `Dashboard.tsx` (408), `HumanEscalation.tsx` (389), `BenchmarkList.tsx` (389), `BenchmarkDetail.tsx` (387), `StateMachineModal.tsx` (384), `CommandPalette.tsx` (370), `HostTopology.tsx` (340), `AuditLogPage.tsx` (337), `AblationLab.tsx` (308), `ReportsPage.tsx` (307).

**Fix:** This is resolved by §2 (container/presentational extraction) and §3 (hook extraction) for the files already covered there. For the remaining files not otherwise addressed above — `TeamManagerDashboard.tsx`, `Specialists.tsx`, `Dashboard.tsx`, `BenchmarkDetail.tsx`, `StateMachineModal.tsx`, `HostTopology.tsx`, `AblationLab.tsx`, `ReportsPage.tsx` — apply the same container/presentational + hook-extraction treatment until each is under (or reasonably close to) 300 lines. Do not force artificial splits that fragment single cohesive JSX blocks — the goal is separating data/logic/presentation, not hitting a line count for its own sake. As with §2, treat this purely as code motion: no rendered output may change.

### §37 DRY via shared UI primitives — ⚠️ PARTIAL, under-adopted
`src/components/ui/` has `EmptyState.tsx`, `GeometricMark.tsx`, `MetricTile.tsx`, `StatusBadge.tsx` — a good start. But confirmed under-use: the `cost`/`reports` features don't use `EmptyState` (§25), and `MissionWorkspace.tsx`'s metrics row (lines 150–182, the `{ label, value }` array mapped into styled tiles) is hand-rolled inline instead of using the existing `MetricTile.tsx` primitive.

**Fix:** After confirming `MetricTile.tsx`'s prop shape, replace `MissionWorkspace.tsx`'s inline metrics-row map (lines 150–182) with `<MetricTile />` instances. Audit `SettingsPage.tsx`, `BenchmarkDetail.tsx`, and `CostDashboard.tsx` for similarly hand-rolled badges/tiles that duplicate `StatusBadge`/`MetricTile` and consolidate.

### §38 Consistent naming conventions — ⚠️ PARTIAL, needs a dedicated audit pass
Hook naming (`use*`) is consistent. Component naming is mixed: some pages are `*Page.tsx` (`MissionsPage`, `AuditLogPage`), some are bare feature names (`Dashboard`, `Specialists`, `ValidationCenter`), some are `*Console`/`*Center`/`*Lab`/`*Hub` (`ExecutionConsole`, `ValidationCenter`, `AblationLab`, `BenchmarksHub`). This isn't necessarily wrong (spec says "audit as part of this pass, don't rename arbitrarily") but should be a deliberate, documented decision, not incidental drift.

**Fix:** Pick one convention (recommend: top-level route-composing component per feature = `<Feature>Page.tsx`; everything else keeps its descriptive name) and document it in a short `NAMING.md` or a comment block in `src/features/README.md` (create if absent) so future files follow it. **Do not mass-rename existing files in this pass** — that risks breaking imports across 189 files for a purely cosmetic gain; only apply the convention to new files created while fixing the other gaps in this report.

### §39 Dependency Injection via Context/Props — ⚠️ PARTIAL, 3 confirmed singleton-import violations
`ServicesContext` (`services-context.tsx`) correctly provides `eventBus`/`circuitBreaker` via context, consumed correctly in `useAuditFeed.ts`/`useExecutionFeed.ts`. **But:**
- `src/features/memory/components/SkillLibrary.tsx:4` — `import { globalBlackboard } from ".../Blackboard"` (direct singleton import, bypasses context)
- `src/features/memory/components/FailureMemory.tsx:5` — same violation

This duplicates the exact anti-pattern §39 exists to prevent — a presentational component reaching into a hardcoded singleton instead of receiving it via context.

**Fix:** Same fix as §15 above (they're the same root cause) — add `blackboard` to `ServicesContextType`, consume via `useServices()` in both files, remove the direct `Blackboard.ts` import from the two component files.

---

## Section H — Testability Patterns

### §40 Pure Function Extraction — ❌ MISSING, tightly coupled to §3/§27
No dedicated `utils`/`lib` pure-function modules exist for the derived logic named in the spec ("cost totals, filter predicates, status-to-color mapping") **except** `src/utils/statusColors.ts` (status-to-color mapping is already correctly extracted — ✅ that one sub-item is done). Cost totals and filter predicates remain inline in components (same files listed in §3/§27).

**Fix:** As part of §3's hook-extraction fix, don't just move the `.filter()`/`.reduce()` calls into the hook — extract the predicate/aggregation itself as a separately-exported pure function from a co-located `<feature>/utils.ts` (e.g. `src/features/cost/utils.ts` exporting `computeCostBreakdown(entries): CostBreakdown`), and have the hook simply call `useMemo(() => computeCostBreakdown(entries), [entries])`. This gives you both the hook (§3) and a directly unit-testable pure function (§40) from one extraction, rather than two separate passes.

### §41 Seedable Mock/Stub pattern — ✅ DONE for the 2 existing repositories, extend to new ones
`MissionRepository.seed()` and `SpecialistRepository.seed()` already exist and correctly allow injecting test data. **Fix:** every new repository created under §4 must include the same `static seed(data: T[])` method — add this to the repository template/checklist, not as a separate task.

---

## Section I — Security & Audit Patterns

### §42 Audit Trail pattern — ⚠️ PARTIAL, not centralized
`AuditLogPage.tsx` is a reasonable canonical display, but **audit-event emission is not centralized through one shared function** — confirmed `eventBus.publish(AUDIT_EVENT, {...})` is called with a hand-built payload object directly inside `useExecutionFeed.ts` (lines constructing `id`, `ts`, `type`, `actor`, `action`, `resource`, `result`, `ip`, `detail` inline). If a second feature needs to emit an audit event (e.g. `HumanEscalation` approving something), it will have to duplicate this entire object-construction block rather than calling one function.

**Fix:** Create `src/features/audit/emitAuditEvent.ts` exporting `emitAuditEvent(eventBus: EventBus, params: { type: AuditEventType; actor: string; action: string; resource: string; result: AuditResultValue; detail: string })` that builds the `id`/`ts`/`ip` boilerplate internally and calls `eventBus.publish(AUDIT_EVENT, ...)`. Update `useExecutionFeed.ts` to call this instead of hand-building the object. Wire `HumanEscalation.tsx`'s approve/deny/modify actions (currently just local `submitted` state, per §12) to also call `emitAuditEvent` when a decision is made — currently no escalation decision produces an audit trail entry at all.

### §43 Principle of Least Privilege (seam only) — ❌ MISSING
`auth-context.tsx` has exactly `{ authenticated: boolean; login; logout }` — no `role`/`permission` field at all. The only "role" string in the codebase is an ARIA `role="button"` attribute in `HumanEscalation.tsx:126` — unrelated to authorization. There is currently no obvious single place to add a future permission check.

**Fix:** Add an optional `role: "ANALYST" | "ADMIN" | null` field to `AuthContextValue` in `auth-context.tsx`, defaulted to `null`/`"ANALYST"` today (no real role selection UI needed yet — this is a seam, per spec, not a feature). Add a `canApprove(action: string): boolean` function co-located with the context (can just `return true` today) so `HumanEscalation.tsx`'s approve/deny buttons have one obvious call site to gate later.

### §44 Input Sanitization pattern — ⚠️ PARTIAL
`src/utils/sanitize.ts` exists and is correctly consumed by `src/features/missions/hooks/useNewMissionWizard.ts` (mission target input — good, that's the highest-risk free-text field). **Not used** in:
- `src/features/core/components/CommandPalette.tsx` — search query goes through `useDebounce` (§30, done) but never through `sanitize()`.
- `src/features/settings/components/SettingsPage.tsx` — confirmed zero `sanitize` usage despite the spec explicitly naming "settings" as a required sanitize entry point.

**Fix:** Identify every free-text `<input>`/`<textarea>` in `SettingsPage.tsx` (674 lines — audit during the §36 split) and route its `onChange` value through `sanitize()` before it's stored in state. Do the same for `CommandPalette.tsx`'s query value before it's used to filter/match commands (even though it's not persisted, the spec names Command Palette explicitly as a required sanitize point — treat it as non-negotiable rather than arguing risk level).

---

## Section J — Observability Patterns

### §45 Centralized Logging/Telemetry hook — ⚠️ PARTIAL, under-adopted
`src/hooks/useTelemetry.ts` exists and is correctly consumed in `HumanEscalation.tsx` and `NewMissionWizard.tsx` (mission created, escalation approved — the two examples the spec names, good). **Not wired** to other clearly state-changing actions: mission pause/resume/terminate in `MissionWorkspace.tsx` (has `dispatch({ type: "..." })` calls with no corresponding telemetry call), and finding-verification actions in `ValidationCenter.tsx`/`EvaluationScreen.tsx`.

**Fix:** Add `logEvent(...)` calls (using the existing `useTelemetry` hook, no new utility needed) at each dispatch site in `MissionWorkspace.tsx`'s reducer actions (pause, resume, terminate) and at the verify/reject action in `ValidationCenter.tsx`/`EvaluationScreen.tsx`, matching the exact call shape already used in `HumanEscalation.tsx`.

### §46 Feature Flag pattern — ⚠️ PARTIAL
`src/utils/FeatureFlags.ts` + `useFeatureFlag` exist and correctly gate the live-feed subscriptions in `useAuditFeed.ts`/`useExecutionFeed.ts` (see §11's inconsistency note — `useTrajectoryFeed.ts` is missing this same gate; fixing that closes both §11 and this item simultaneously, don't do it twice). No other new pattern-driven behavior (virtualization, container/presentational splits) needs a flag per the spec's own scope ("wrap any new pattern-driven behavior... behind a flag" — this applies to the live-feed/event-bus rollout specifically, not to the structural refactors in this whole document, which are required to be behavior-invisible by the constraints in §0 anyway).

---

## Suggested Fix Order (respecting the original spec's Phase discipline)

Work top-to-bottom. Each numbered group is one or more logical changes — implement them in order, but do not pause to build/lint/verify between groups; move straight through to the next group:

1. **§33, §32 leaks** — pure find-and-replace of magic strings into existing/new enums. Zero risk, do first.
2. **§4 + §5 together** — build out the missing repositories/adapters for all 14 remaining features. This is the biggest lever: it also resolves §35 automatically.
3. **§3 + §27 + §40 together** — for each feature touched in step 2, extract its filter/aggregation logic into a hook + pure function, memoized. This also substantially shrinks the §36 SRP violations in `BenchmarkList.tsx`, `BenchmarkDetail.tsx`, `MissionsPage.tsx`.
4. **§2 + §7** — container/presentational split + compound components for the 8 remaining oversized files not already shrunk by step 3.
5. **§15 + §39** — fix the two Blackboard singleton-import violations by routing through `ServicesContext`.
6. **§25, §37** — wire `EmptyState`/`MetricTile` into `cost`/`reports`/`MissionWorkspace`.
7. **§44, §43, §42, §45** — security/audit/observability seams (sanitize in Settings/CommandPalette, role seam in auth-context, centralized `emitAuditEvent`, telemetry on mission/validation actions).
8. **§18, §19, §22, §23** — the remaining AI-domain modeling gaps (escalation threshold, supervisor/guardrail typing, memory tiering, tool schema).
9. **§10, §12, §13, §21, §29, §31, §34, §38, §46** — remaining small/medium items, each independent and low-risk, can be parallelized across separate commits.

After every gap in this document has been implemented — not before — run `npm run lint` and `npm run build` once, and fix whatever they surface. Since every fix above is internal-architecture-only (see the constraint at the top of this document), no route's rendered output should have changed at any point; there is no UI to re-verify, only the build/lint pass.
