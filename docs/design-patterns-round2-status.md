# Design Patterns — Round 2 Status & Remaining Fixes

**Purpose of this file:** This is a prompt for an agentic code editor, following up on the previous gap-fix pass. It records what was verified as genuinely fixed (leave alone) and what still needs work (fix now). Every item below was confirmed against the actual code, not assumed from file names.

**Non-negotiable constraint, above all else: zero UI/UX change.** Every pixel, spacing, color, animation, copy string, and interaction currently rendered must look and behave identically after every fix below. These are internal-architecture-only changes. If any fix appears to require a visible change to satisfy a pattern "properly," implement it in whatever internal form preserves the current UI exactly instead — correctness of internal architecture never overrides this. No fix should touch a `className`, inline style, layout, copy string, or interaction as a side effect of restructuring the code around it.

Write the best possible code for each remaining gap — proper typing, proper separation, no shortcuts — but the goal is internal code quality and pattern-correctness, not UI improvement.

Implement every fix in this document. Do **not** stop to run `npm run lint` or `npm run build` after each individual fix — work through the entire list first. Run `npm run lint`, `npm run build`, and `npx tsc --noEmit` once, only after everything below is complete, and resolve whatever they surface at that point. (As of this review, all three passed clean on the current codebase — keep them clean.)

---

## ✅ Confirmed genuinely fixed — do not touch

These were verified directly in the code. Leave them exactly as they are; do not "improve" or re-touch them as part of this pass.

- **Magic strings / centralized enums** — `AUDIT_RESULT` and `VdgNodeStatus` now live in `domain-types.ts` / `FSM.ts`, all call sites updated correctly.
- **Repository + Adapter pattern (partial)** — 12 new repositories built (`AuditRepository`, `BenchmarksRepository`, `CostRepository`, `EnvironmentRepository`, `EscalationRepository`, `ExecutionRepository`, `FindingsRepository`, `MemoryRepository`, `ReportsRepository`, `ResearchRepository`, `TrajectoryRepository`, `ValidationRepository`), all correctly implementing the shared `DataSource<T>` interface with real `fetchAll(options)` signatures. `MissionRepository`/`SpecialistRepository` upgraded to the same interface. (Note: adoption of these repositories by components is incomplete — see the fix list below. The repositories themselves are correct.)
- **Compound Component pattern** — `createContext` genuinely implemented in `CommandPaletteView`, `VDGNodeDrawerView`, and `NewMissionWizardView`.
- **Wizard reducer** — `useNewMissionWizard.ts` correctly uses `useReducer` instead of scattered `useState`.
- **Trajectory feed flag consistency** — `useTrajectoryFeed` now gated behind `useFeatureFlag("ENABLE_LIVE_FEEDS")`, matching the other two live feeds.
- **Orchestrator–Worker wiring** — `MissionOrchestratorModel`/`WorkerSpecialist` now actually constructed and consumed in `MissionWorkspaceContainer`/`MissionWorkspaceView`.
- **Blackboard DI fix** — `SkillLibrary.tsx`/`FailureMemory.tsx` now consume the blackboard via `useServices()` context, not a direct singleton import.
- **Escalation risk threshold** — `RiskAssessment` type + `shouldEscalate()` now correctly gate `HumanEscalation`.
- **Supervisor/Guardrail typing** — `GuardrailResult` / `verifiedBy: "SUPERVISOR"` now modeled and used in `ValidationCenter` + `useValidationData.ts`.
- **Memory tiering** — `MemoryTier = "SHORT_TERM" | "LONG_TERM"` added to `domain-types.ts` and reflected in `ContextUtilization.tsx`.
- **Tool-use schema** — `inputSchema`/`outputShape` added to `ToolDescriptor` in `TaskCommand.ts`.
- **Code-splitting** — `ResearchLab`/`AblationLab` now correctly lazy-loaded via `next/dynamic`, matching the existing Benchmarks pattern.
- **DRY / shared primitives** — `MetricTile` now reused in `MissionWorkspaceView`'s metrics row instead of hand-rolled markup.
- **Least-privilege seam** — `role: "ANALYST" | "ADMIN" | null` and `canApprove()` added to `auth-context.tsx`.
- **NewMissionWizardContainer** — this is the best example of the Container/Presentational pattern done right in the whole codebase: it delegates all state to `useNewMissionWizard()`, pulls `eventBus`/`logEvent` via context, and its View is fully prop-driven with zero internal business state. **Use this file as the template for the remaining Container/View fixes below.**
- Full codebase currently passes `npx tsc --noEmit`, `npm run lint`, and `npm run build` clean — keep it that way through every fix below.

---

## ❌ Still needs work

### 1. Repository adoption is incomplete — several features still bypass their own new repository

The repositories from the list above exist and are correct, but these components were never updated to use them and still import raw mock data directly:

- **All 11 files in `src/features/environment/components/`** (`EndpointsPanel`, `EvidencePanel`, `EnvironmentalLayer`, `HostTopology`, `AuthStatesPanel`, `CredentialsPanel`, `ELFindingsPanel`, `ParametersPanel`, `ServicesPanel`, `FailuresPanel`, `CVECandidatesPanel`) — all still `import { ... } from "@/features/environment/data/mockData"` directly. `EnvironmentRepository.ts` has zero consumers anywhere in the codebase.
- **All 7 files in `src/features/memory/components/`** (`ContextUtilization`, `TechnicalActions`, `VulnPatterns`, `StrategyBranching`, `BranchTree`, `MemoryPage`, plus the two already-fixed Blackboard ones) — still import raw `mockData` directly for non-blackboard data. `MemoryRepository.ts` has zero consumers anywhere.
- **`TeamManagerDashboardContainer.tsx`** — still imports `getTeamDashboardData` from `@/features/specialists/data/fixtures/teamDashboardMockData` directly. No repository was ever created for this data source — one needs to exist (a `TeamDashboardRepository`, implementing `DataSource<T>` like the others).
- **`ExecutionConsoleContainer.tsx`** — still calls `getParsedRows()` directly from `@/features/execution/data/fixtures/executionMockData`, in addition to (correctly) using `useExecutionFeed`/`ExecutionRepository` elsewhere. `ExecutionRepository.ts` doesn't currently wrap this method — extend it to do so.

**Fix:** For each item above, route the component through its corresponding repository's `fetchAll()`/`fetch()` methods instead of importing the fixture/mockData module directly, exactly as already done correctly in `useExecutionFeed.ts`'s data-loading call and in `TrajectoryRepository`'s usage inside `useTrajectoryFeed.ts`. Create the one missing repository (`TeamDashboardRepository`) following the same template as the other 12.

### 2. Container/Presentational split is only nominal for two files — real extraction still needed

The `*Container.tsx` / `*View.tsx` file pairs exist for all 7 originally-flagged components, but two of them didn't actually move state out:

- **`SettingsPageContainer.tsx`** extracts only one piece of state (`tab`). **`SettingsPageView.tsx` still contains 31 separate `useState` calls** holding real business/config state — cost ceilings, model selection (`specialist`, `manager`, `validator`), timeouts, retry caps, session/retention settings, etc. This is exactly the state the pattern requires living outside the presentational layer.
- **`VDGNodeDrawerContainer.tsx`** is a pure pass-through (13 lines, forwards `node`/`onClose` with no logic) — all rendering and any derived logic stays in `VDGNodeDrawerView.tsx`. If, after inspection, this component genuinely has no state to extract (it's driven entirely by props from its parent), that's acceptable — but confirm this deliberately rather than leaving an empty wrapper by default; if there is any internal derived/computed state inside the View, it belongs in the Container.

**Fix:** Move all 31 `useState` calls (and any associated handlers/effects) out of `SettingsPageView.tsx` into `SettingsPageContainer.tsx` (or into a dedicated `useSettingsData`/`useSettingsForm` hook consumed by the Container, mirroring the `useNewMissionWizard` pattern), passing the resulting values/setters down as props exactly as `NewMissionWizardContainer` does. `SettingsPageView` should end up with zero `useState`/`useEffect`/`useReducer` calls, same as `NewMissionWizardView`. For `VDGNodeDrawer`, confirm whether the container is warranted; if the drawer is genuinely stateless and prop-driven, leave it as-is and note that in a code comment rather than treating it as unresolved.

### 3. SRP / file-size goal not actually met — files didn't shrink

The point of the Container/View split was also to break up oversized files (§36 of the original report), but line counts barely moved because the entire JSX bulk was relocated wholesale into the `*View.tsx` file instead of being broken into smaller named sub-components. Confirmed still over 300 lines after the split:
`MissionWorkspaceView.tsx` (813), `AttackGraphCanvasView.tsx` (764), `SettingsPageView.tsx` (689), `NewMissionWizardView.tsx` (656), `VDGNodeDrawerView.tsx` (599), `TeamManagerDashboardView.tsx` (535), `ExecutionConsoleView.tsx` (496).

**Fix:** For each `*View.tsx` file above, extract the largest cohesive JSX sections into their own named presentational sub-components (e.g., for `MissionWorkspaceView.tsx`: a `WorkspaceStatusStrip.tsx`, `WorkspaceMetricsRow.tsx`, `WorkspaceTabs.tsx`, `WorkspacePanels.tsx` — whatever the natural sections are, following the file's existing visual structure exactly). Each sub-component receives plain props from its parent View — no new state, no new data fetching. This is pure code motion: every `className`, inline style, and JSX element must move byte-for-byte unchanged into its new file. Do this until each file is under, or reasonably close to, 300 lines. Do not force artificial splits that fragment a single cohesive visual block just to hit a number.

### 4. Graceful degradation — two components still missing empty states

The shared `EmptyState` primitive was correctly added to `ContextState.tsx`, `CostUsage.tsx`, and `ReportsPage.tsx`, but **`CostDashboard.tsx` and `ModelBreakdown.tsx` were missed**.

**Fix:** Add the same `<EmptyState />` usage to `CostDashboard.tsx` and `ModelBreakdown.tsx` for their empty-data case, mirroring exactly how it's used in the three files that already have it.

### 5. Audit trail centralization — original duplication site not migrated

`src/features/audit/emitAuditEvent.ts` was built correctly and is used in `HumanEscalation.tsx`. But **`useExecutionFeed.ts` — the exact file the fix was meant to de-duplicate — still hand-builds the audit event payload inline** (`eventBus.publish<AuditEntry>(AUDIT_EVENT, { id: ..., ts: ..., ... })`) instead of calling the shared function.

**Fix:** Replace the inline object-construction block in `useExecutionFeed.ts` with a call to `emitAuditEvent(eventBus, { type, actor, action, resource, result, detail })`, matching the call already used in `HumanEscalation.tsx`. Remove the now-redundant inline `id`/`ts` construction from this file.

### 6. Input sanitization — Command Palette still missing it

`sanitize()` was correctly added to `SettingsPageView.tsx`. **`CommandPalette`'s search query is still not passed through `sanitize()`** — it currently only goes through `useDebounce`.

**Fix:** In `CommandPaletteContainer.tsx`, wrap the query value through `sanitize()` before it's used for matching/filtering (or before `setQuery` stores it), consistent with how `useNewMissionWizard.ts` already sanitizes its target-input field.

### 7. Telemetry — Mission pause/resume/terminate still not logged

Telemetry was correctly added to `ValidationCenter.tsx` (`FINDING_VERIFIED`/`FINDING_REJECTED`). **`MissionWorkspaceContainer.tsx`'s pause/resume/terminate dispatch actions (`SET_PAUSED`, `SET_TERMINATED`) still have no corresponding `logEvent` calls.**

**Fix:** Add `logEvent(...)` calls (via the existing `useTelemetry` hook — already imported/used elsewhere in this feature, e.g. in `NewMissionWizardContainer.tsx`) at the point each of these actions is dispatched in `MissionWorkspaceContainer.tsx`, using the same call shape already used in `ValidationCenter.tsx`.

### 8. Pagination — not yet consumed by any component

The repository layer now supports `fetchAll({ page, limit })` (confirmed working in `AuditRepository.ts` and `MissionRepository.ts`), but **no component actually calls it with pagination arguments yet** — `AuditLogPage.tsx`, the findings list, and `ReportsPage.tsx` still fetch everything at once (`fetchAll({ limit: 1000 })`, effectively unpaginated).

**Fix:** In `AuditLogPage.tsx`, the findings dashboard component, and `ReportsPage.tsx`, add a `page` state and call `fetchAll({ page, limit })` with a real page size, loading additional pages as needed (e.g. on scroll-to-end, compatible with the existing virtualization already in place in `AuditLogPage.tsx`) instead of requesting the full dataset in one call.

---

## Suggested order for this pass

1. Item 1 (repository adoption) — mechanical, low-risk, same pattern repeated across ~20 files.
2. Item 5, 6, 7 (audit/sanitize/telemetry) — small, isolated, low-risk.
3. Item 4 (empty states) — trivial, two files.
4. Item 2 (Settings container extraction) — the highest-value remaining fix; do this carefully since it's moving the most state.
5. Item 3 (sub-component extraction for SRP) — do this only after item 2, since Settings' state extraction will naturally reshape what needs splitting.
6. Item 8 (pagination) — do last, since it's the most likely to require judgment calls about UX-invisible loading behavior (must not introduce any visible loading flicker or layout shift — if in doubt about whether a change here would be visually detectable, leave the current full-fetch behavior in place and flag it instead of guessing).

After every item above is implemented — not before — run `npx tsc --noEmit`, `npm run lint`, and `npm run build` once, and fix whatever they surface. No route's rendered output should have changed at any point; there is nothing to visually re-verify, only the build/lint/type-check pass.
