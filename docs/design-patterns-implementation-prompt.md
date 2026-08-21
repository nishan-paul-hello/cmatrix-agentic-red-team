# Design Patterns Implementation Prompt — AI Multi-Agent Platform Frontend

**Purpose of this file:** This is a prompt/spec for an agentic code editor to apply architectural design patterns to the existing codebase. It is **not** a request for new features and **not** a request for any visual/UX change.

---

## 0. Non-Negotiable Constraints (read first, obey always)

1. **Zero visual/UX drift.** Every pixel, spacing, color, animation, copy string, and interaction currently rendered must look and behave identically after refactor. This is a pure internal-architecture refactor.
2. **No behavior change to any screen** (Dashboard, Missions, Mission Workspace, Specialists, Execution Console, Validation Center, Findings, Memory, Trajectory, Research Lab, Benchmarks, Reports, Cost/Usage, Audit Log, Settings, Command Palette, Login).
3. **Refactor in small, verifiable increments.** One pattern / one module at a time. After each change, the app must build, lint clean (`npm run lint`), and render identically.
4. **Never guess an API contract.** The app currently has no backend — all data is inline mock data. Patterns must introduce a clean seam for a future backend without inventing endpoints or response shapes that don't exist yet.
5. **Preserve existing file names/routes** used by Next.js App Router (`src/app/**`) unless a pattern explicitly requires a new file — in which case, re-export from the old path if anything external might import it.
6. **Every change must be justified by a named pattern below.** No unrelated stylistic rewrites, no dependency upgrades, no formatting-only diffs mixed into pattern commits.

---

## 1. Context (grounding — do not restate to the user, just use it)

- Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4. No backend, no data-fetching library, no state library beyond React Context.
- Domain: an **AI multi-agent autonomous security/pentest platform** — "missions" run by an orchestrator that dispatches "specialist" agents (recon, injection, auth, validation) against targets, produces findings, requires human escalation, and tracks cost/trajectory/memory/benchmarks.
- Known structural issues to fix via patterns below:
  - Several components exceed 1,000–2,150 lines (`EnvironmentalLayer.tsx`, `MemoryPage.tsx`, `NewMissionWizard.tsx`, `MissionWorkspace.tsx`, `ResearchLab.tsx`, `FindingsDashboard.tsx`, `BenchmarksHub.tsx`, `CostDashboard.tsx`, `ValidationCenter.tsx`) — god components mixing data, logic, and view.
  - Mock data (`MISSIONS`, `ENTRIES`, etc.) is duplicated/inlined per-component instead of centralized behind a swappable data layer.
  - Status/lifecycle strings (`"RUNNING"`, `"QUEUED"`, `"PAUSED"`, `"VALIDATING"`, `"SUCCESS"`, `"FAILED"`, `"TIMEOUT"`) are untyped magic strings repeated across files instead of a shared enum/state machine.
  - Zero use of `React.memo`, `useMemo`, `useCallback` anywhere — every list (Execution Console, Trajectory Browser, Audit Log) re-renders fully on any state change.
  - No virtualization on long, continuously-growing lists (execution logs, audit logs, trajectories).
  - No error boundaries anywhere; a single component throw takes down the app shell.
  - Only two contexts exist (`auth-context`, `mission-context`), both minimal; no pattern yet for cross-cutting agent/event state.
  - No abstraction layer that would let real agent/mission data (from a future backend or WebSocket) replace mock arrays without touching component internals.

---

## 2. Design Patterns to Implement

### A. Architectural / Structural Patterns

1. **Feature-based (vertical slice) module structure** — group each domain area (`missions/`, `specialists/`, `execution/`, `findings/`, `memory/`, `trajectory/`, `benchmarks/`, `cost/`, `audit/`, `research/`) with its own `components/`, `hooks/`, `types.ts`, and `data/` instead of one flat `components/` folder. Routes in `src/app/**` stay as thin composition points that import from the feature module.
2. **Container / Presentational split** — every god component splits into a **container** (owns state, effects, data access) and one or more **presentational** components (pure, props-in/JSX-out, no state beyond local UI toggles). Presentational components must be trivially snapshot-testable.
3. **Custom Hooks pattern** — extract all non-trivial logic (filtering, derived stats, polling, selection state, form logic) out of components into `use*` hooks colocated in the feature's `hooks/` folder (e.g., `useMissionFilters`, `useExecutionLog`, `useCostBreakdown`).
4. **Repository / Data-Access-Layer pattern** — introduce a `data/` layer per feature that exposes typed accessor functions (e.g., `getMissions()`, `getExecutionEntries(missionId)`) returning the *current* mock arrays. Components must call the repository function, never import the raw mock array directly. This is the seam that lets mock data be swapped for real API/WebSocket calls later with zero component changes.
5. **Adapter pattern** — wrap the repository layer so today's adapter returns local mock data and a future adapter can return `fetch`/WebSocket data, both satisfying the same interface (e.g., `MissionsSource`).
6. **Facade pattern** — contexts (`auth-context`, `mission-context`, and any new agent/event context) should expose a small, intention-revealing API (`login()`, `activeMission`, `subscribeToAgentEvents()`) rather than leaking internal state shape to consumers.
7. **Compound Component pattern** — for multi-part UI that already behaves like one (e.g., `CommandPalette`, `VDGNodeDrawer`, wizard steps in `NewMissionWizard`), formalize the parent/child relationship via context so subcomponents share state without prop drilling.
8. **Barrel exports** — each feature folder gets an `index.ts` re-exporting its public components/hooks, keeping cross-feature imports clean and giving you one place to see a feature's public surface.

### B. State Management Patterns

9. **Single Source of Truth + State Colocation** — state lives at the lowest common ancestor that needs it; nothing is duplicated between a page and its child components. Global state stays limited to what's genuinely cross-cutting (auth, active mission, live agent-event stream).
10. **Reducer pattern (`useReducer`)** — any state with more than 2–3 related fields or multi-step transitions (e.g., `NewMissionWizard` multi-step form, `MissionWorkspace` panel state) moves from scattered `useState` calls to a single reducer with named actions.
11. **Observer / Pub-Sub pattern** — introduce a lightweight event-bus (or context-based subscription) for anything that behaves like a live feed today (Execution Console entries, Trajectory updates, Audit Log). Components subscribe/unsubscribe rather than polling or being handed a full array each render. This is the pattern that will let a future WebSocket push agent events straight into the UI with no component rewrite.
12. **Optimistic UI Update pattern** — for any future user-triggered mission/agent action (pause, resume, escalate, approve), design the state update to apply immediately in the UI and reconcile once a backend confirms, with a defined rollback path. Implement the local-state half now so the seam exists.

### C. AI Multi-Agent–Specific Design Patterns (priority section)

13. **Orchestrator–Worker pattern** — model the relationship between a Mission (orchestrator) and its Specialists (workers) explicitly in types/state: the orchestrator owns mission-level status and delegates discrete tasks to specialist workers, each with its own status independent of the others.
14. **Finite State Machine (FSM) pattern for lifecycle** — replace free-text status strings with an explicit state machine per entity:
    - Mission: `QUEUED → RUNNING → VALIDATING → (PAUSED | COMPLETED | FAILED)`
    - Specialist/Task execution: `PENDING → RUNNING → (SUCCESS | FAILED | TIMEOUT)`
    Define allowed transitions in one place; UI reads state, never mutates it ad hoc.
15. **Blackboard pattern** — treat `MemoryPage` (skill library, failure memory) as a shared knowledge store that any specialist/agent can read from and write to, rather than a page-local dataset. Model it as a typed shared store separate from any single mission's state.
16. **Strategy pattern for specialist behavior** — each specialist type (recon, injection, auth, validation) should be represented as an interchangeable strategy object (capabilities, tools, display metadata) rather than hardcoded conditionals scattered through `Specialists.tsx` / `ExecutionConsole.tsx`.
17. **Command pattern for agent actions/tasks** — represent each executable task (`sqli_blind_time()`, `endpoint_enumerate()`, etc.) as a structured command object (name, params, tool, target) rather than a free-form string, so the same shape can later be dispatched to a real backend or replayed from the Trajectory Browser.
18. **Human-in-the-loop / Escalation pattern** — formalize `HumanEscalation.tsx` as a first-class pattern: any agent action that crosses a defined risk/confidence threshold routes through an explicit "awaiting human decision" state before proceeding, with approve/deny/modify as the only exits.
19. **Supervisor / Guardrail pattern** — `ValidationCenter` and `EvaluationScreen` should act as a supervising layer that gates findings/results before they're marked verified, independent of the agent that produced them (separation between "doer" and "checker").
20. **Streaming / Incremental Rendering pattern** — Execution Console and Trajectory views should be built to consume events incrementally (append-only, newest-in) rather than re-rendering a full re-fetched array, matching how token/event streams arrive from real agent runtimes.
21. **Circuit Breaker + Retry pattern for agent task execution** — define (even if mocked today) how a specialist's repeated tool failures (`FAILED`/`TIMEOUT`) trip a breaker that pauses further attempts and surfaces to the orchestrator/human, instead of retrying forever.
22. **Context-Window / Memory-Tiering pattern** — distinguish short-term (current mission run) memory from long-term (skill library, failure memory) memory explicitly in types, so future agent context assembly has a clear source of truth for "what does this agent know right now."
23. **Tool-Use Abstraction pattern** — represent every external "tool" a specialist can call (`sqlmap`, `curl`, `cve_bench`, `spider`, `requests`) as a typed tool descriptor (name, input schema, expected output shape) so the Execution Console renders any tool call uniformly instead of per-tool special-casing.

### D. Resilience & Error-Handling Patterns

24. **Error Boundary pattern** — wrap each major route/page (and especially data-heavy panels like `AttackGraphCanvas`, `EnvironmentalLayer`) in a React error boundary with a scoped fallback so one panel failing doesn't blank the whole app.
25. **Graceful Degradation / Fallback UI pattern** — every list/chart/graph component must define an explicit empty-state and error-state, not just a happy-path render.
26. **Fail-safe defaults** — reducers and repository functions must never throw on missing/malformed mock data; default to empty/neutral states.

### E. Performance & Scalability Patterns

27. **Memoization pattern** — apply `React.memo` to presentational components that receive stable props, `useMemo` for derived/filtered lists (mission filters, findings filters, cost aggregations), `useCallback` for handlers passed to memoized children.
28. **List Virtualization pattern** — any list that can grow unbounded at runtime (Execution Console entries, Audit Log, Trajectory Browser) must be windowed/virtualized rather than rendering every row.
29. **Code-Splitting / Lazy Loading pattern** — heavy, rarely-first-viewed panels (`AttackGraphCanvas`, `ResearchLab`, `BenchmarksHub`) load via `next/dynamic` so initial route payload stays small.
30. **Debounce/Throttle pattern** — `CommandPalette` search and any filter inputs across pages debounce user input before recomputation.
31. **Pagination pattern** — long tabular views (Audit Log, Findings, Reports) support paged/windowed data access through the repository layer, not just client-side slicing of a full in-memory array.

### F. Data & Type-Safety Patterns

32. **Centralized Domain Types** — one `types/` module per feature (or a shared `domain-types.ts`) defining `Mission`, `Specialist`, `ExecutionEntry`, `Finding`, `AuditEvent`, etc. Components import types, never redeclare local interfaces for the same concept.
33. **Enum/Const-Object pattern for status values** — replace repeated string-literal unions with a single exported const map (`MISSION_STATUS`, `TASK_STATUS`) used everywhere, eliminating typo risk and centralizing the FSM in §14.
34. **Schema Validation seam (future-proofing)** — structure the repository/adapter layer so a validation step (e.g., zod) can be inserted at the boundary where real backend data enters the app, without touching component code.
35. **Fixture/Mock Separation pattern** — mock data moves to `data/fixtures/*.ts` per feature, clearly labeled as fixtures, consumed only through the repository layer (§A.4) — never imported directly by a component.

### G. Code Quality / Maintainability Patterns

36. **Single Responsibility Principle enforcement** — hard cap: no component file should mix data-shaping, business logic, and presentation. Any file crossing ~300 lines is a signal to extract a hook, sub-component, or utility.
37. **DRY via shared UI primitives** — expand the existing `ui/` folder (`StatusBadge`, `GeometricMark`) with any other repeated visual patterns found across pages (badges, metric tiles, table shells, empty states) so they're implemented once.
38. **Consistent naming conventions** — one naming scheme for files, hooks, types, and event handlers across all features (audit as part of this pass, don't rename arbitrarily beyond what a pattern requires).
39. **Dependency Injection via Context/Props** — cross-cutting services (data repository, event bus) are provided via context/props, never imported as hardcoded singletons deep inside presentational components, so they can be swapped/mocked later.

### H. Testability Patterns

40. **Pure Function Extraction** — all derivable logic (cost totals, filter predicates, status-to-color mapping) becomes pure, exported functions so they're unit-testable without rendering a component.
41. **Seedable Mock/Stub pattern** — the repository layer (§A.4) should accept an injectable data source so future tests can stub agent/mission data without touching component code.

### I. Security & Audit Patterns (fitting for a security-tooling product)

42. **Audit Trail pattern** — formalize `AuditLogPage` as the canonical, append-only record of user and agent actions; every state-changing action elsewhere in the app should be designed to emit an audit event through one shared function, not ad hoc per page.
43. **Principle of Least Privilege (seam only)** — structure auth context so future role/permission checks (who can approve escalations, who can pause missions) have one obvious place to be added.
44. **Input Sanitization pattern** — any free-text entry point (mission target, command palette, settings) funnels through one shared sanitize/validate utility rather than being trusted inline.

### J. Observability Patterns

45. **Centralized Logging/Telemetry hook** — one `useTelemetry`/`logEvent` utility for key user actions (mission created, escalation approved, etc.), so instrumentation isn't scattered or duplicated.
46. **Feature Flag pattern** — wrap any new pattern-driven behavior (virtualized lists, new event bus) behind a simple flag/config so it can be toggled off instantly if it ever risks visible behavior change during rollout.

---

## 3. Implementation Order (surgical rollout — do not skip ahead)

Work in this order; each phase should be its own set of commits, fully verified before moving on.

1. **Phase 0 — Safety net:** Add error boundaries (§24) around each top-level route. No other changes. Verify identical rendering.
2. **Phase 1 — Types & constants:** Introduce centralized domain types (§32) and status enums/FSM (§14, §33). Update existing code to import them in place of local interfaces/string literals, with no logic changes.
3. **Phase 2 — Data layer:** Move mock arrays into `data/fixtures/*.ts`, add repository functions (§4) and adapters (§5). Update components to call repository functions instead of importing arrays directly.
4. **Phase 3 — Component decomposition:** Split god components into container/presentational pairs (§2) and extract custom hooks (§3), one component at a time, starting with the largest (`EnvironmentalLayer.tsx`, `MemoryPage.tsx`, `NewMissionWizard.tsx`).
5. **Phase 4 — Performance:** Add memoization (§27), virtualization on long lists (§28), code-splitting on heavy panels (§29), debounce on search (§30).
6. **Phase 5 — Event/streaming seam:** Introduce the pub-sub/event-bus pattern (§11, §20) for Execution Console, Trajectory, Audit Log — still fed by mock data, but structurally ready for a live source.
7. **Phase 6 — AI-agent domain modeling:** Implement orchestrator/worker (§13), strategy pattern for specialists (§16), command pattern for tasks (§17), blackboard for memory (§15), supervisor/guardrail (§19), human-in-the-loop (§18), circuit breaker (§21).
8. **Phase 7 — Polish:** Shared UI primitive extraction (§37), telemetry hook (§45), feature flags (§46), fixture-based test seams (§41).

After every phase: run `npm run lint`, `npm run build`, and do a visual pass against the pre-refactor UI for every touched route.

---

## 4. Definition of Done

- No component file mixes raw mock-data literals, business logic, and JSX in one place.
- No status is represented as a bare string literal outside the FSM/enum module.
- Every list that can grow at runtime is virtualized.
- Every route is wrapped in an error boundary with a defined fallback.
- Every derived value (totals, filters, groupings) is a pure, separately-testable function.
- Mock data lives only in `data/fixtures/`, accessed only through repository functions.
- The mission/specialist/task lifecycle is driven by one shared state machine, referenced everywhere it's displayed.
- **The rendered UI is pixel-identical to before the refactor.**
