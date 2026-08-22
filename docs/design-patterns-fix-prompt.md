# Design Patterns Follow-Up — Remaining Fixes

**Purpose of this file:** Follow-up prompt for the agentic code editor after the design-patterns refactor. This is a **targeted fix pass**, not a new refactor. It addresses the specific gaps found in review. It is **not** a request for any new feature and **not** a request for any visual/UX change.

---

## 0. Non-Negotiable Constraints (read first, obey always)

1. **Zero visual/UX drift.** Every pixel, spacing, color, animation, copy string, and interaction currently rendered must look and behave identically after this fix pass. Nothing in this file authorizes any visible change — not a fallback screen's styling beyond a minimal, on-brand placeholder, not a spacing tweak, not a copy change, nothing.
2. **No behavior change to any screen** (Dashboard, Missions, Mission Workspace, Specialists, Execution Console, Validation Center, Findings, Memory, Trajectory, Research Lab, Benchmarks, Reports, Cost/Usage, Audit Log, Settings, Command Palette, Login) under normal (non-error) operation.
3. **Fix in small, verifiable increments.** One item at a time. After each change, the app must build, lint clean (`npm run lint`), typecheck clean (`tsc --noEmit`), and render identically.
4. **Every change must be justified by the specific item below.** No unrelated stylistic rewrites, no dependency upgrades, no formatting-only diffs mixed into fix commits.
5. **Do not re-touch what's already correct.** The repository/adapter layer, FSM/enum module, virtualization, code-splitting, circuit breaker, blackboard, strategy/command patterns, event bus, sanitize, feature flags, and telemetry hook are already implemented and verified working — do not modify them except where explicitly listed below.

---

## 1. What's Already Done (verified — do not redo)

A prior pass implemented the full design-patterns spec across the codebase. Verified by running `npm ci`/`install`, `tsc --noEmit`, `npm run lint`, `npm run build`, and `npm run format:check` — **all pass clean** — plus a manual read-through of the code. Confirmed working:

- **God components decomposed** into container/presentational pairs with extracted hooks (`EnvironmentalLayer`, `MemoryPage`, `NewMissionWizard`, `MissionWorkspace`, `ResearchLab`, `FindingsDashboard`, `BenchmarksHub`, `CostDashboard`, `ValidationCenter`). No component file exceeds ~300 lines outside mock-data/type files.
- **Feature-based module structure** — every domain area has its own `components/`, `hooks/`, `data/`, and barrel `index.ts`.
- **Repository / Adapter / DI pattern** — every feature has a `*Repository.ts` implementing a shared `DataSource<T>` interface (`fetch`/`fetchAll`/`create`/`update`/`delete`), with `VALIDATION SEAM` comments marking where schema validation (zod) will attach later, and a `.seed()` method for test stubbing. Components consume repositories, not raw fixture arrays.
- **Centralized types, enums, and FSM** — `src/types/domain-types.ts` defines all domain types and `*_STATUS` const objects; `src/utils/FSM.ts` defines `canTransition*` guards per entity (Mission, Task, Specialist, Finding, Benchmark, VDG node). No bare status string literals outside this module.
- **List virtualization** — real `@tanstack/react-virtual` wired into Execution Console, Trajectory, and Audit Log.
- **Code-splitting** — `next/dynamic` used for Benchmarks and the three Research Lab subpages, and for Attack Graph Canvas.
- **AI-agent-specific patterns** — Orchestrator/Worker model, Blackboard (shared memory store), Strategy objects per specialist type, Command objects for tasks, Circuit Breaker (wired into the execution feed and actually called), Event Bus / Pub-Sub for live-feed-shaped data.
- **Cross-cutting seams** — `ServicesContext` for DI of event bus / circuit breaker / blackboard, `sanitizeInput` utility used at several free-text entry points, `FEATURE_FLAGS` config, and a `useTelemetry`/`logEvent` hook used across several features.

Do not re-implement, rename, or restructure any of the above. This fix pass only touches the items in Section 2.

---

## 2. What Needs to Be Fixed

### 2.1 Error boundaries don't cover every route (§24 gap)

**Current state:** `PanelErrorBoundary` (`src/components/PanelErrorBoundary.tsx`) exists and is used in exactly two places: `EnvironmentalLayer.tsx` and `AttackGraphCanvasView.tsx`. None of the 18 route `page.tsx` files, and not the shared `(app)/layout.tsx` shell, are wrapped. A throw in any other panel (Settings, Cost/Usage, Findings, Reports, etc.) currently blanks the whole app shell.

**Fix required:**
- Wrap the `AppLayoutInner` render tree in `src/app/(app)/layout.tsx` (around `<Shell>{children}</Shell>` or around `{children}` inside `Shell`, whichever preserves current DOM/visual output exactly) in a top-level `PanelErrorBoundary` instance, so any uncaught render error in a route still leaves the nav shell (`Shell`, `CommandPalette`) intact.
- Additionally wrap each `page.tsx` under `src/app/(app)/**` (and `src/app/login/page.tsx`) in its own `PanelErrorBoundary`, so one panel's failure doesn't blank sibling panels either — this matches the existing pattern already used for `EnvironmentalLayer` and `AttackGraphCanvasView`.
- The fallback UI must be a minimal, neutral "something went wrong" panel that **only ever renders on an actual thrown error** — it must never appear during normal operation, and its exact appearance may be a plain, on-brand placeholder since there is no existing fallback UI to preserve pixel-for-pixel. Do not add fallback UI anywhere that changes what's rendered on the happy path.
- Do not remove or alter the two existing `PanelErrorBoundary` usages.

### 2.2 Mission pause/resume bypasses the FSM (§14 gap)

**Current state:** In `src/features/missions/components/workspace/MissionWorkspaceContainer.tsx`, pause/resume is tracked via a separate local `paused: boolean` field in the reducer state, independent of `mission.status`. The mission's actual `status` field is never transitioned to/from `MISSION_STATUS.PAUSED` through `canTransitionMission` when the user pauses or resumes — meaning the one shared state machine is not actually driving this particular lifecycle change, even though it's driving status display elsewhere.

**Fix required:**
- When the pause/resume action fires, transition `mission.status` through `canTransitionMission(currentStatus, MISSION_STATUS.PAUSED)` / `canTransitionMission(MISSION_STATUS.PAUSED, MISSION_STATUS.RUNNING)` instead of (or in addition to, if the boolean is needed for some UI-only concern) toggling an independent boolean.
- If `canTransitionMission` rejects the transition, the existing pause/resume UI action must no-op exactly as it would today for any other invalid transition — no new user-facing error state, no visual change.
- Preserve the exact current UI: button labels, icons, disabled states, and timing of when the log entries (`MISSION_PAUSED` / `MISSION_RESUMED`) are emitted must not change.
- Do not change how `paused` is read by any presentational component if that would alter rendering — only change *how the underlying status transition is authorized/recorded*.

### 2.3 Minor — pagination pattern not exercised by the UI (§31, low priority)

**Current state:** Repository `fetchAll()` methods accept `page`/`limit`, but hooks for Audit Log, Findings, and Reports call `fetchAll({ limit: 1000 })` and rely on client-side virtualization rather than actually paging through the repository. This is functionally fine (virtualization solves the same runtime-growth problem) but doesn't match the letter of §31.

**Fix required (optional, lowest priority — do only after 2.1 and 2.2 are done and verified):**
- No UI change of any kind. Do not add pagination controls, page numbers, or "load more" affordances — that would be a UX change, which is disallowed.
- If addressed at all, it should be limited to making the repository-level paging genuinely exercised internally (e.g., the hook fetching in pages behind the scenes and appending to the same in-memory list the virtualizer already renders), with the rendered output byte-for-byte identical to today. If this cannot be done without any risk of visible behavior change, skip it and leave a comment explaining why, rather than risk drift.

### 2.4 Minor — barrel exports leak raw fixture data (low priority)

**Current state:** `src/features/findings/index.ts`, `src/features/research/index.ts`, and `src/features/validation/index.ts` (and similar) include `export * from ".../data/fixtures/...";`, re-exporting raw mock arrays on the feature's public barrel surface, even though nothing currently imports them that way.

**Fix required:**
- Remove the `export * from ".../data/fixtures/..."` lines from these barrels; re-export only the specific non-data symbols (types, display-constant maps like `SEV_C`/`STATUS_C`, tab types) that components actually need from those fixture files, by name, instead of the raw dataset.
- Update any import that currently relies on the wildcard barrel re-export to import directly from the fixture file's specific named export, or from the repository, as appropriate. Verify with `tsc --noEmit` and `npm run build` that nothing breaks.
- No visual or behavioral change should result from this — it is a pure import-hygiene fix.

---

## 3. Order of Work

1. **2.1 Error boundaries** — highest priority; purely additive, lowest risk of visual drift.
2. **2.2 Mission FSM fix** — verify carefully against the Mission Workspace pause/resume UI before and after; this is the only item with any real behavioral surface area.
3. **2.4 Barrel export cleanup** — mechanical, do after 2.1/2.2 are verified.
4. **2.3 Pagination** — optional, only if time permits and only if zero-risk to visible behavior.

After each item: run `npm run lint`, `npx tsc --noEmit`, `npm run build`, `npm run format:check`, and do a visual pass against the pre-fix UI for every touched route. **Do not proceed to the next item until all four checks pass and the visual pass shows no drift.**

## 4. Definition of Done

- Every route under `src/app/(app)/**` and `src/app/login/page.tsx` is wrapped in an error boundary with a defined, non-intrusive fallback that never renders on the happy path.
- Mission pause/resume transitions `mission.status` through `canTransitionMission`, not an independent boolean.
- No feature barrel re-exports a raw fixture/mock array wholesale.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`, and `npm run format:check` all pass with zero errors/warnings.
- **The rendered UI and all interactions are pixel-identical and behaviorally identical to before this fix pass, except for the presence of an error fallback in the event of an actual crash — which does not occur under normal operation.**
