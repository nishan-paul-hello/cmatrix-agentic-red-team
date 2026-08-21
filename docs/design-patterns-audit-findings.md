# Design Patterns Refactor — Complete Audit & Follow-Up Prompt

**Purpose:** Full pattern-by-pattern verification of `app-frontend.zip` against every one of the 46 patterns named in `design-patterns-implementation-prompt.md`, based on direct code inspection (grep + file reads across the whole `src/` tree, not just spot checks). This replaces the earlier partial version of this document. Feed this back to the agentic editor as the next task.

**Method:** Every pattern below was checked against the actual code — either "does the described construct exist," "is it wired into the app," or "is it applied consistently across all the files the spec named." Status legend:
- ✅ **Done** — implemented and actually used where the spec required it
- 🟡 **Partial** — implemented in some places but not others, or implemented but not fully wired in
- ⚫ **Dead code** — implemented correctly but never imported/used anywhere
- ❌ **Missing** — not implemented at all

**One environment caveat:** this sandbox has no network egress, so `npm run lint` / `npm run build` could not be executed here to independently confirm a clean build. Run both locally before/after applying the fixes below.

**Headline verdict:** roughly 20% of the 46 patterns are fully done, ~48% are partial, ~4% are dead code, ~24% are missing outright. The work is real, not cosmetic — but it stopped partway through a full sweep, leaving two coding styles coexisting and a few patterns built but never connected to the app.

---

## A. Architectural / Structural Patterns

**1. Feature-based module structure — 🟡 Partial**
`environment/`, `research/`, `validation/`, `findings/`, `missions/`, `benchmarks/`, `cost/`, `memory/`, `execution/`, `trajectory/`, `audit/`, `escalation/`, `reports/`, `specialists/` were correctly split into `features/<name>/{components,hooks,data,domain}`.
**But** 16 screens were never migrated and still sit flat in `src/components/`: `ExecutionConsole.tsx`, `Specialists.tsx`, `Dashboard.tsx`, `HumanEscalation.tsx`, `TrajectoryPage.tsx`, `AuditLogPage.tsx`, `SettingsPage.tsx` (674 lines, completely untouched by any pattern), `TeamManagerDashboard.tsx`, `CommandPalette.tsx`, `VDGNodeDrawer.tsx`, `AttackGraphCanvas.tsx`, `Shell.tsx`, `MissionsPage.tsx`, `EvaluationScreen.tsx`, `Login.tsx`, `TrajectoryBrowser.tsx`. Note the naming collision this causes: `src/components/ui/StatusBadge.tsx` (PascalCase, shared) vs. `src/features/missions/components/workspace/statusBadge.tsx` (camelCase, local) — two different components, near-identical names.

**2. Container/Presentational split — 🟡 Partial**
Applied to the god components explicitly named in the spec (`EnvironmentalLayer`, `MemoryPage`, `NewMissionWizard`, `BenchmarksHub`, `ResearchLab`, `FindingsDashboard`, `CostDashboard`, `ValidationCenter`) via hooks + sub-components. **Not applied** to `MissionWorkspace.tsx` (797 lines — the single largest file in the app, still one monolithic component) or to any of the 16 flat files in §1.

**3. Custom Hooks pattern — 🟡 Partial**
`useExecutionFeed`, `useAuditFeed`, `useTrajectoryFeed`, `useNewMissionWizard`, `useCostData`, `useMemoryData`, `useFindingsData`, `useValidationData`, `useBenchmarksData`, `useResearchData`, `useEnvironmentalData`, `useElapsed` are all correctly extracted and colocated.
**Gap:** three feature folders have no `hooks/` directory at all — `escalation/`, `reports/`, `specialists/`. Their flat-file components (`HumanEscalation.tsx`, `ReportsPage.tsx`, `Specialists.tsx`) do `useState`/`useEffect` data-fetching directly in the component body instead of an extracted hook — exactly the pattern the other features correctly avoid.

**4. Repository / Data-Access-Layer pattern — 🟡 Partial, one confirmed violation**
`MissionRepository` and `SpecialistRepository` are real classes: async, `.seed()`-injectable, correctly abstracting the mock array. Every other feature instead uses plain getter functions exported directly from the fixture file (`getExecutionEntries()`, `getReportsData()`, `getEscalationContextBlocks()`, `getAuditEntries()`) — functionally similar but not seedable/injectable like the two real repositories, and not sharing a common interface with them (see §5).
**Confirmed rule violation:** `src/features/cost/components/CostUsage.tsx` imports `CEILING, SPECIALISTS_COST, TIMELINE, TOTAL` **directly** from `../data/costMockData` — bypassing any getter function entirely. This is the one clear-cut breach of the explicit instruction *"Components must call the repository function, never import the raw mock array directly."*

**5. Adapter pattern — ❌ Missing**
There is no shared interface (e.g. `MissionsSource` / `DataSource<T>`) that the class-based repositories and the function-based getters both satisfy. Two different data-access shapes coexist with no common contract — so "swap mock for real API" is two different jobs instead of one seam, defeating the point of the pattern.

**6. Facade pattern — 🟡 Partial**
`auth-context` (`authenticated`, `login()`, `logout()`) and `mission-context` (`activeMissionId`, `setActiveMissionId()`) both expose small, intention-revealing APIs correctly. The spec anticipated "any new agent/event context" — none was added; the event bus (§11) was built as a raw singleton instead of a context, so there's no facade over it at all.

**7. Compound Component pattern — ❌ Missing**
Total context count in the app is still 2 (auth, mission) — identical to before the refactor. `NewMissionWizard` still threads ~20 state values/setters as flat destructured props into step subcomponents (`FieldBlock`, `RadioGroup`, `ModeCards`, `SurfaceCards`, `ReviewStep`) instead of sharing state via a wizard-scoped context. `CommandPalette` and `VDGNodeDrawer`, also named in the spec, show no context-based parent/child relationship either.

**8. Barrel exports — ❌ Missing**
`find src/features -name index.ts` returns zero results. No feature folder has a public-surface `index.ts`. Fully unimplemented, not partial.

---

## B. State Management Patterns

**9. Single Source of Truth + State Colocation — ✅ Done, mostly**
No obvious duplicated state between a page and its children was found. Global state stays limited to auth + active mission, as intended. No violations found here.

**10. Reducer pattern (`useReducer`) — ❌ Missing**
Zero `useReducer` calls exist anywhere in the codebase. `useNewMissionWizard.ts` — the exact case the spec names — still has 15 separate `useState` calls for one multi-step form. `MissionWorkspace.tsx` panel state (subNav, log, paused, terminated) — the other named case — is also still plain `useState`, un-consolidated.

**11. Observer / Pub-Sub pattern — 🟡 Partial**
`utils/EventBus.ts` is a real, correctly-implemented typed pub/sub singleton with subscribe/unsubscribe/publish. `useExecutionFeed`, `useAuditFeed`, `useTrajectoryFeed` all correctly subscribe to it instead of polling. **But:** nothing in the app ever calls `.publish()` on it except itself — no user action (create mission, approve escalation, complete a task) actually publishes an event, so the live-feed seam exists structurally but has never been proven to carry a real event end-to-end. Also see §39 — it's a hardcoded singleton import, not DI'd via context.

**12. Optimistic UI Update pattern — ❌ Missing**
No optimistic-update/rollback scaffolding exists anywhere (searched for "optimistic," "rollback," pending-then-reconcile state shapes — nothing). The spec explicitly says *"Implement the local-state half now so the seam exists"* — this was skipped entirely, including for the pause/resume/escalate/approve actions it names.

---

## C. AI Multi-Agent–Specific Design Patterns

**13. Orchestrator–Worker pattern — ⚫ Dead code**
`features/missions/domain/Orchestrator.ts` defines `MissionOrchestratorModel` with a working `hasActiveWorkers()` method — well-written. It is **never imported anywhere in the app.** Mission/specialist relationship in the actual UI is still handled by ad hoc filtering, not this model. This is one of the "priority section" patterns and it's fully dark.

**14. Finite State Machine (FSM) pattern — 🟡 Partial**
Status *values* are correctly centralized as const objects (`MISSION_STATUS`, `TASK_STATUS`, `SPEC_STATUS`, `BENCHMARK_STATUS`) in `domain-types.ts`. **But there is no transition table or `canTransition()` guard anywhere** — nothing stops any status being set to any other status; the FSM is enum-only, not a state machine. Also, `Finding.status` is still typed as a bare `string` with a comment listing valid values instead of an actual enum (`FINDING_STATUS` doesn't exist) — the exact "magic string" problem this section exists to fix, left half-done.

**15. Blackboard pattern — ✅ Done**
`features/memory/domain/Blackboard.ts` implements `InMemoryBlackboard` with `readSkills/writeSkill/readFailures/writeFailure`, and it's actually used by both `SkillLibrary.tsx` and `FailureMemory.tsx`. Correctly implemented and wired in.

**16. Strategy pattern for specialist behavior — ✅ Done**
`features/specialists/domain/SpecialistStrategy.ts` cleanly maps each role to capabilities/display metadata via `getStrategyForRole()`, used in `Specialists.tsx`. No hardcoded per-specialist conditionals found.

**17. Command pattern for agent actions/tasks — 🟡 Partial**
`features/execution/domain/TaskCommand.ts` (`TaskCommand` interface + `formatCommand()`) is well-designed and used in `ExecEntry.command` (Execution Console). **But** it's not applied consistently: `TrajStep` (Trajectory Browser data) still represents each step as a free-form `summary: string` ("Service scan dispatched via execution agent (nmap -sV)...") rather than a structured `TaskCommand` — which directly undercuts the spec's stated reason for this pattern, *"so the same shape can later be dispatched to a real backend or replayed from the Trajectory Browser."*

**18. Human-in-the-loop / Escalation pattern — ✅ Done, reasonably**
`HumanEscalation.tsx` has three explicit exits (`RESPONSE`, `AUTHORIZE_ALL`, `HALT`) which map reasonably to approve/modify/deny, and `EscalationManager.ts` formalizes categories/history. `ESCALATION_APPROVED` telemetry fires on approval. This is a reasonable, working implementation of the pattern (allowing for the pre-existing UI/copy being preserved per the zero-drift constraint).

**19. Supervisor / Guardrail pattern — 🟡 Partial**
`features/validation/domain/Supervisor.ts` (`SupervisorGuardrail.evaluateEvidence()`) is implemented and used by `EvaluationScreen.tsx`. **But** `ValidationCenter.tsx` — the other component the spec explicitly names for this pattern — never imports it; it reads `finding.status` directly off mock data with no supervisor gating at all. Only half of the named "doer vs. checker" surface is actually gated.

**20. Streaming / Incremental Rendering pattern — ✅ Done**
Execution Console, Trajectory, and Audit Log all consume append-only feeds via the hooks in §11 (`setEntries((prev) => [newEntry, ...prev])`), not full re-fetch-and-replace. Correctly implemented for the three lists named.

**21. Circuit Breaker + Retry pattern — ⚫ Dead code**
`features/execution/domain/CircuitBreaker.ts` (`ToolCircuitBreaker`, `globalCircuitBreaker`) is fully and correctly implemented — CLOSED/OPEN/HALF_OPEN, threshold, timeout, all present. **It is never imported anywhere else in the codebase.** Execution Console shows `FAILED`/`TIMEOUT` statuses but nothing ever calls `recordFailure()` or checks `canExecute()`. A second fully-dark pattern from the priority section.

**22. Context-Window / Memory-Tiering pattern — ❌ Missing**
No type anywhere distinguishes short-term (current mission run) memory from long-term (skill library, failure memory). The Blackboard (§15) covers long-term only; there's no corresponding short-term/"current context" type, even though `ContextUtilization.tsx` exists and would be the natural place for it.

**23. Tool-Use Abstraction pattern — ❌ Missing**
No typed tool descriptor (name, input schema, expected output shape) exists anywhere in the codebase. `TaskCommand.tool` is just a bare `string`. Execution Console still renders each tool call without any per-tool-uniform structure — this pattern was not started.

---

## D. Resilience & Error-Handling Patterns

**24. Error Boundary pattern — 🟡 Partial**
Every route inside the `(app)` route group correctly has an `error.tsx` (10 of them, all following the Next.js convention properly). **Gap:** `src/app/page.tsx`, `src/app/not-found.tsx`, and `src/app/login/page.tsx` sit outside that group and have **no error boundary at all** — a throw during login would blank the whole app, which is precisely what this pattern is meant to prevent, and login is arguably the single most exposed, least-tested route.

**25. Graceful Degradation / Fallback UI pattern — ✅ Done, mostly**
`ui/EmptyState.tsx` exists and is used across several feature panels. Empty/loading states appear present in the feed-based hooks (`entries` starts as `[]`, components render conditionally). No missing-error-state was found in the components inspected, though this wasn't checked exhaustively screen-by-screen.

**26. Fail-safe defaults — ✅ Done**
Repository/getter functions consistently fall back to safe defaults (`mockData.find(...) ?? null`, empty arrays as initial state) rather than throwing. No violations found.

---

## E. Performance & Scalability Patterns

**27. Memoization pattern — 🟡 Partial**
`React.memo` used in exactly 3 files (`ExecutionConsole`, `AuditLogPage`, `TrajectoryPage`) — the three components that needed it to make virtualization work correctly. `useMemo` (3 call sites) and `useCallback` (10 call sites) are concentrated in the same handful of files plus the two contexts. Filter-heavy screens like `MissionsPage.tsx` still run an unmemoized `.filter()` on every render. The spec's instruction was blanket ("apply to presentational components that receive stable props") — what exists was applied reactively to fix virtualization, not swept across the app.

**28. List Virtualization pattern — ✅ Done**
`@tanstack/react-virtual`'s `useVirtualizer` is correctly wired into Execution Console, Audit Log, and Trajectory Browser — the three lists named in the spec.

**29. Code-Splitting / Lazy Loading pattern — 🟡 Partial**
`AttackGraphCanvas` (via `MissionWorkspace`) and `BenchmarksHub` are correctly lazy-loaded via `next/dynamic`. `ResearchLab` is lazy-loaded **only** on the `/research/ablations` route — the other two routes that render the same component, `/research/statistics` and `/research/failure-analysis`, import it statically. Same component, inconsistent loading strategy depending on which URL got there first.

**30. Debounce/Throttle pattern — ✅ Done**
`useDebounce` is correctly applied to Command Palette search and Audit Log's search/filter input — the two cases the spec names. No other filter/search inputs were found that needed it (checked all `setSearch`/`setQuery`-style state).

**31. Pagination pattern — ❌ Missing**
Every repository/getter function (missions, audit, reports, findings) returns the *entire* array; there is no page/offset/limit parameter anywhere in the data layer. Audit Log, Findings, and Reports rely on client-side filtering plus virtualization, not paged access through the repository — which the spec explicitly said would be insufficient: *"not just client-side slicing of a full in-memory array."*

---

## F. Data & Type-Safety Patterns

**32. Centralized Domain Types — 🟡 Partial**
`domain-types.ts` correctly centralizes `Mission`, `ExecEntry`, `Specialist`, `Finding`, `AuditEntry` and the four status enums. But most other feature-specific types (`Report`, `Bench`, `TrajStep`, `VFinding`, `VDGNode`, `LogEntry`, `EscalationCategory`, `SkillRecord`/`FailureRecord`) live inline inside `data/*.ts` or `domain/*.ts` files rather than a dedicated `types.ts` per feature as the spec's own wording implies ("one `types/` module per feature *or* a shared `domain-types.ts`") — functionally acceptable per the letter of the rule, but inconsistent in practice: some types are centralized, most are scattered by feature with no consistent file name across features.

**33. Enum/Const-Object pattern for status values — 🟡 Partial**
Four of five status concepts are done correctly. `Finding.status` (see §14) is the one holdout still typed as a raw `string`.

**34. Schema Validation seam — ❌ Missing / unverifiable**
No `zod` (or equivalent) import, no validation boundary function, exists anywhere in the repository/getter layer. The `zod-validation-error` package present in `package-lock.json` (surfaced during a dependency-install attempt in this audit) suggests it may have been *intended*, but nothing in `src/` actually uses it. This seam was not built.

**35. Fixture/Mock Separation pattern — 🟡 Partial**
Most features correctly keep mock data in `data/fixtures/*.ts` (execution, trajectory, audit, escalation, reports, specialists), or at least a `data/` folder (cost, memory, research, environment, findings, benchmarks, validation) accessed via getters. **The one confirmed violation** is `CostUsage.tsx` importing raw constants from `costMockData.ts` directly — see §4.

---

## G. Code Quality / Maintainability Patterns

**36. Single Responsibility Principle enforcement — 🟡 Partial**
The god components the spec explicitly named (`EnvironmentalLayer`, `MemoryPage`, `NewMissionWizard`, `ResearchLab`, `FindingsDashboard`, `BenchmarksHub`, `CostDashboard`, `ValidationCenter`) were all brought under (roughly) the ~300-line guidance via decomposition. **`MissionWorkspace.tsx` was not** — it's 797 lines, the largest file in the app, and mixes state, effects, and JSX in one place, same as before the refactor. Several flat `src/components/` files also still exceed 300 lines with no decomposition: `AttackGraphCanvas.tsx` (768), `SettingsPage.tsx` (674), `TeamManagerDashboard.tsx` (549), `VDGNodeDrawer.tsx` (545), `ExecutionConsole.tsx` (508 — though this one does have logic extracted into hooks/domain files despite its length).

**37. DRY via shared UI primitives — 🟡 Partial**
`ui/StatusBadge.tsx`, `GeometricMark.tsx`, `MetricTile.tsx`, `EmptyState.tsx` all exist. But `StatusBadge` itself is used in only 3 places — `AuditLogPage.tsx`, `CommandPalette.tsx`, `AttackGraphCanvas.tsx`, `features/environment/components/EndpointsPanel.tsx`, and `features/findings/components/FindingsList.tsx` all hand-roll the same rounded/bordered/letter-spaced badge markup inline instead of reusing it. Status-to-color mapping is similarly duplicated as inline objects in 5 separate files rather than one shared, exported function (see §40).

**38. Consistent naming conventions — 🟡 Partial**
Most of the codebase is consistently PascalCase-for-components / camelCase-for-hooks-and-utils. Three files break this: `features/missions/components/workspace/specialistStatusDot.tsx`, `nodeStyle.tsx`, and `statusBadge.tsx` are all lowercase-first despite being component files (and `statusBadge.tsx` collides in name, differing only by case, with the actual shared `ui/StatusBadge.tsx`).

**39. Dependency Injection via Context/Props — ❌ Missing (regression relative to spec intent)**
`globalEventBus` and `globalCircuitBreaker` (where it's used at all — see §21, it isn't) are hardcoded module-level singletons, imported directly by name into hooks (`useExecutionFeed`, `useAuditFeed`, `useTrajectoryFeed`). The spec explicitly names this exact scenario: *"cross-cutting services (data repository, event bus) are provided via context/props, never imported as hardcoded singletons deep inside presentational components, so they can be swapped/mocked later."* This is the opposite of what was asked for.

---

## H. Testability Patterns

**40. Pure Function Extraction — 🟡 Partial**
`formatCommand()` (TaskCommand.ts) is a good example of this pattern done right — pure, exported, independently testable. But the broader case the spec names — "status-to-color mapping" — was not extracted: 5 different files (`AuditLogPage.tsx`, `VDGNodeDrawer.tsx`, `AttackGraphCanvas.tsx`, `BenchmarkList.tsx`, `ContextUtilization.tsx`) each define their own inline color-mapping object rather than one shared, exported, unit-testable function.

**41. Seedable Mock/Stub pattern — 🟡 Partial**
`MissionRepository.seed()` and `SpecialistRepository.seed()` exist and work. No other feature's data-access layer (execution, audit, trajectory, cost, reports, escalation, etc.) has an equivalent seed/injection point — they're plain getter functions with no way to substitute test data without editing the fixture file directly.

---

## I. Security & Audit Patterns

**42. Audit Trail pattern — 🟡 Partial, effectively not wired**
`AuditLogPage` correctly consumes a live feed via `useAuditFeed` + the `AUDIT_EVENT` channel on the event bus, which is the right shape. **But nothing in the app ever publishes to `AUDIT_EVENT`.** No state-changing action anywhere — mission created, escalation approved, task completed — calls `globalEventBus.publish(AUDIT_EVENT, ...)`. `NewMissionWizard` fires telemetry (`MISSION_CREATED`) but not an audit event. The canonical append-only record the spec describes is structurally present but functionally disconnected from the rest of the app; today's Audit Log only ever shows its own static seed data.

**43. Principle of Least Privilege (seam only) — 🟡 Thin**
`auth-context.tsx` exposes only `authenticated: boolean` — there's no `role`/`permissions` field or placeholder at all. The spec only asked for "one obvious place to be added," which arguably exists (the context itself), but there's no shape hint (e.g. a commented-out or stubbed `role` field) showing where role checks would actually plug in — a future implementer would need to change the context's shape, not just add a check.

**44. Input Sanitization pattern — ❌ Missing**
No `sanitize`/`validate` utility exists anywhere in the codebase. Mission target URL (`NewMissionWizard`), Command Palette search, and Settings free-text fields are all used raw with no shared funnel function, contrary to the explicit instruction.

---

## J. Observability Patterns

**45. Centralized Logging/Telemetry hook — 🟡 Partial**
`useTelemetry` (`hooks/useTelemetry.ts`) is clean and correctly centralizes the log-call shape. It's used in exactly 2 places: `HumanEscalation.tsx` (`ESCALATION_APPROVED`) and `NewMissionWizard.tsx` (`MISSION_CREATED`). Two of the four event names it defines — `TASK_COMPLETED` and `ORACLE_EVALUATED` — are declared in the type union but **never fired anywhere in the app.** Dead enum values, not dead code exactly, but a sign the instrumentation pass didn't reach as far as it was scoped to (Execution Console task completion, Evaluation Screen oracle results).

**46. Feature Flag pattern — 🟡 Partial, one flag not actually gating anything**
`utils/FeatureFlags.ts` defines `ENABLE_LIVE_FEEDS` and `ENABLE_VIRTUALIZATION` via `useFeatureFlag()`. `ENABLE_LIVE_FEEDS` is correctly checked in `useExecutionFeed` (gates whether the event-bus subscription happens). `ENABLE_VIRTUALIZATION` is **not read by any of the three virtualized components** (`AuditLogPage`, `ExecutionConsole`, `TrajectoryPage` all call `useVirtualizer` unconditionally) — the flag exists but doesn't flag anything, contrary to the spec's stated purpose ("toggled off instantly if it ever risks visible behavior change").

---

## Summary scorecard

| Status | Count | Patterns |
|---|---|---|
| ✅ Done | 9 | §9, §15, §16, §18, §20, §25, §26, §28, §30 |
| 🟡 Partial | 25 | §1, §2, §3, §4, §6, §11, §14, §17, §19, §24, §27, §29, §32, §33, §35, §36, §37, §38, §40, §41, §42, §43, §45, §46 (24 listed; §6 straddles Done/Partial — see narrative) |
| ⚫ Dead code | 2 | §13 (Orchestrator), §21 (Circuit Breaker) |
| ❌ Missing | 10 | §5, §7, §8, §10, §12, §22, §23, §31, §34, §39, §44 |

---

## Recommended next-pass order

1. **Fix the one clear rule-break:** `CostUsage.tsx` raw import → route through a getter (§4/§35).
2. **Decide on the two dead patterns (§13, §21):** either wire `MissionOrchestratorModel` into `MissionWorkspace`/`Dashboard` and `globalCircuitBreaker` into the execution flow, or delete them — half-built, unused domain models will silently rot.
3. **Migrate the 16 flat `src/components/` files** into feature folders (§1–3) — this is the single biggest structural debt and the root cause of several smaller inconsistencies (missing hooks folders, naming collisions, SRP violations).
4. **Wire the Audit Trail end-to-end (§42):** have mission creation, escalation approval, and task completion actually `publish()` to `AUDIT_EVENT` so the Audit Log reflects real app activity, not just its seed data.
5. **Add the FSM transition guard + fix `Finding.status` typing (§14, §33).**
6. **Convert `useNewMissionWizard` and `MissionWorkspace` panel state to `useReducer` (§10).**
7. **Wrap the event bus (and circuit breaker, once wired) in a Context/Provider** instead of a singleton import (§39).
8. **Add barrel `index.ts` files per feature (§8).**
9. **Sweep the remaining gaps** — Adapter interface (§5), Compound Component context for the wizard (§7), pagination in the repository layer (§31), input sanitization utility (§44), pure status-color function extraction (§40), consistent code-splitting for `ResearchLab`'s three routes (§29), naming-convention fixes for the 3 lowercase files (§38).
10. **Run `npm run lint` and `npm run build` locally** — not verified in this audit due to no network access in the sandbox — and do the visual-parity pass the original spec's Definition of Done requires before calling any of this finished.
