# RedGrid Frontend — Audit Findings

Audited against `app-frontend/src/` per the standing audit prompt, Sections 1–10. Each finding was verified by opening the file; call sites and parent containers were checked, not just the grep hit. Lint/format/build/typecheck were not re-run (confirmed already passing).

**Overall shape of the codebase:** this is a well-structured, mostly-disciplined codebase — feature-sliced folders, a real design-token scale (colors, radius, z-index, panel widths) in `globals.css`, a strict ESLint config with `jsx-a11y` rules all at `"error"`, consistent use of the shadcn `Table`/`Dialog`/`Sheet`/`Tabs` composed exports almost everywhere, `next/font` + `next/image` used correctly, and `h-dvh` used consistently instead of `h-screen`. The findings below are real, but they're a fairly short list of a recurring pattern (repeated in ~8 files), a couple of genuine logic bugs, and a long tail of static-value inline styles — not a broad quality problem.

---

## Critical

### C1. Two color/state bugs in the mission pause/terminate controls — visual state doesn't actually change

**File:** `features/missions/components/workspace/MissionSubNavPanel.tsx`

Line 107:
```
color: paused ? "var(--warning)" : "var(--warning)",
```
Both branches resolve to the same value, so the PAUSE/RESUME button's text color never changes based on `paused` state, even though the sibling `border` property on line 106 correctly does (`paused ? "var(--warning)" : "var(--border)"`).

Lines 138–139:
```
background: terminated ? "var(--border)" : "var(--border)",
border: `1px solid ${terminated ? "var(--border)" : "var(--border)"}`,
```
Both branches of both properties are identical, so the TERMINATE button's background/border never change with `terminated` state — only `color` (line 140, `terminated ? "var(--muted-foreground)" : "var(--primary)"`) actually varies. This looks like a copy-paste error where the `false` branch was never filled in with the intended emphasis color (likely `var(--primary)` to make the still-active terminate action read as a destructive/danger control).

**Why it's wrong:** this is an active, user-facing bug — the controls that let an operator pause or kill a running mission don't visually confirm state changes the way they were clearly designed to (the pattern is copied from the working `border` case right above it).

**Fix:**
```diff
- color: paused ? "var(--warning)" : "var(--warning)",
+ color: paused ? "var(--warning)" : "var(--muted-foreground)",
```
```diff
- background: terminated ? "var(--border)" : "var(--border)",
- border: `1px solid ${terminated ? "var(--border)" : "var(--border)"}`,
+ background: terminated ? "var(--border)" : "transparent",
+ border: `1px solid ${terminated ? "var(--border)" : "var(--primary)"}`,
```
(Exact non-terminated colors should be confirmed against the design intent — the point is the two branches must differ.) While fixing this, also migrate off the imperative `onMouseEnter`/`onMouseLeave` DOM `style` mutation (lines 110, 113–114, 146, 152–153) onto Tailwind `hover:` classes using the existing `--warning`/`--primary`/`--border` tokens (already exposed as `text-warning`, `border-warning`, etc. in `globals.css`) — same root cause: hand-rolled state styling bypassing the token system instead of `hover:border-warning`-style classes.

---

## High

### H1. Eight list+detail panels don't collapse to a single column below `lg:` — same bug, same fix, repeated 8 times

Per the audit's own instruction to "fix the pattern once ... apply the identical diff shape to the rest," this is one bug appearing in eight files. Each pairs an unconditional `flex` row (no `flex-col`/`lg:flex-row`) with a fixed-width detail rail (no `w-full` base, no breakpoint), so the detail panel renders side-by-side with the list/table on every viewport, including mobile — where it will crush the list content into a sliver.

| File | Container line | Panel line |
|---|---|---|
| `features/research/components/AblationLab.tsx` | 12: `<div className="flex min-h-0 flex-1 overflow-hidden">` | `AblationLabDetailPanel.tsx:13`: `w-panel-sm-alt flex flex-shrink-0 flex-col overflow-y-auto border-l …` |
| `features/environment/components/HostTopology.tsx` | 24: `<div className="flex h-full min-h-0">` | `HostDetailPanel.tsx:5`: `w-panel-sm bg-background flex-shrink-0 overflow-y-auto` |
| `features/environment/components/EvidencePanel.tsx` | 28: `<div className="flex min-h-0 flex-1 overflow-hidden">` | 92: `w-panel-sm bg-background border-border shrink-0 overflow-y-auto border-l …` |
| `features/environment/components/FailuresPanel.tsx` | 28: `<div className="flex min-h-0 flex-1 overflow-hidden">` | 109: `w-panel-sm bg-background border-border shrink-0 overflow-y-auto border-l …` |
| `features/memory/components/SkillLibrary.tsx` | 23: `<div className="flex min-h-0 flex-1 overflow-hidden">` | 24: `w-panel-sm border-border flex flex-shrink-0 flex-col overflow-hidden border-r` |
| `features/memory/components/ContextUtilization.tsx` | 36: `<div className="flex min-h-0 flex-1 overflow-hidden">` | 135: `w-panel-sm border-border flex flex-shrink-0 flex-col overflow-y-auto border-l p-4` |
| `features/memory/components/VulnPatterns.tsx` | 23: `<div className="flex min-h-0 flex-1 overflow-hidden">` | 24: `w-panel-md border-border flex-shrink-0 overflow-y-auto border-r` |
| `features/cost/components/ContextState.tsx` | 34: `<div className="flex min-h-0 flex-1 overflow-hidden">` | 113: `w-panel-sm-alt flex flex-shrink-0 flex-col overflow-y-auto border-l …` |

**Why it's wrong:** matches the audit's two-pane rule directly — "the container must switch between `flex-col` (stacked, mobile) and `lg:flex-row` (side-by-side, desktop) — not render both panes side-by-side unconditionally." None of these eight do; contrast with the *correct* version of this exact pattern already in the codebase, e.g. `features/missions/components/workspace/MissionWorkspaceView.tsx:70` (`flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row`) paired with `MissionLiveState.tsx:11` (`lg:w-panel-sm-alt flex w-full flex-shrink-0 flex-col … border-t lg:border-t-0 lg:border-l`) — that sibling panel already does this right and is the template to mirror.

**Fix (identical shape for all 8):**
- Container: add `flex-col lg:flex-row` (e.g. `flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row`).
- Panel: change `w-panel-*` → `w-full lg:w-panel-*`, and flip the border side so it only applies at `lg:` (e.g. `border-t lg:border-t-0 lg:border-l` instead of a bare `border-l`), matching `MissionLiveState.tsx`'s pattern exactly.

No new token is needed — all the widths already exist in `@theme` (`--width-panel-sm`, `--width-panel-md`, `--width-panel-sm-alt`).

---

## Medium

### M1. Two hand-rolled tab implementations where the `Tabs` primitive already exists and is used correctly elsewhere

**`features/findings/components/FindingDetail.tsx`** (lines 13, 50–60) and **`features/findings/components/EvidenceViewer.tsx`** (lines 6, 14–23): both hold `useState` for an active-tab string, render a manual row of `Button`s that call the setter, and conditionally render bodies via `tab === "X" &&` — the exact hand-rolled pattern the audit calls out, with a `Tabs` primitive (`components/ui/tabs.tsx`) available and already used correctly in the same codebase (e.g. `features/memory/components/MemoryPage.tsx:34-51`, `features/benchmarks/components/BenchmarkDetail.tsx:29-32`, both of which control `Tabs`/`TabsList`/`TabsTrigger` with `value`/`onValueChange` instead of raw buttons).

**Why it's wrong:** loses whatever the `Tabs` primitive's composed export provides for free (keyboard arrow-key navigation between tabs, correct ARIA roles/`aria-selected` wiring) — same category of issue the audit prompt flags in Section 3/4 (a primitive existing and not being used means reinventing, and often under-implementing, its accessibility behavior).

**Fix:** migrate both onto `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent`, following the exact shape already in `MemoryPage.tsx`. Since `BenchmarkDetail.tsx` already shows the correct migrated form of a near-identical tab bar (`OVERVIEW`/`TASKS`/`CATEGORIES` vs. `FindingDetail`'s `OVERVIEW`/`EVIDENCE`/`ATTACK PATH`/`VALIDATION`/`TRAJECTORY`), that diff shape can be copied directly.

### M2. `z-header` token reused for sticky table headers — semantically unrelated to what it was named for

**Files:**
- `features/audit/components/AuditLogPage.tsx:129`: `<TableRow className="bg-card z-header sticky top-0">`
- `features/missions/components/MissionsPage.tsx:100`: `<TableRow className="bg-card z-header sticky top-0">`

`--z-header: 30` (in `globals.css`'s `@theme` block) is the app chrome's top-bar layer (used correctly in `Shell.tsx`'s header and `components/ui/select.tsx`'s internal scroll buttons). These two files borrow it for a `position: sticky` table header row inside a scrollable table body — unrelated to the app shell, coupled only because the number happens to lift the row above scrolling rows today.

**Why it's wrong:** this is exactly the false-coupling case the audit prompt calls out — if the app-chrome header's stacking layer is ever changed (e.g. because a new overlay needs to sit above it), these two sticky table headers move with it for no reason connected to their own purpose. This pattern (repeated in 2 files) is a "third-or-later occurrence of the same kind of magic number" once you count `select.tsx`'s reuse too — the scale has no token for "sticky-within-scroll-container," which is a distinct semantic layer from "app chrome header."

**Fix:** add a dedicated token, e.g. `--z-sticky: 20;` in the z-index scale in `globals.css` (between `--z-node-hover: 10` and `--z-header: 30`), and switch both `TableRow` sticky headers to `z-sticky` instead of `z-header`.

### M3. Nineteen data-fetching effects use `void` to silence the linter but never handle rejection

**Files (representative — same pattern in all 19):** `features/environment/components/{EndpointsPanel,EvidencePanel,HostTopology,AuthStatesPanel,CredentialsPanel,ELFindingsPanel,ParametersPanel,ServicesPanel,FailuresPanel,CVECandidatesPanel}.tsx`, `features/missions/components/workspace/MissionWorkspaceContainer.tsx`, `features/reports/hooks/useReportsData.ts`, `features/core/components/Dashboard.tsx`, `features/specialists/components/TeamManagerDashboardContainer.tsx`, `features/memory/components/{ContextUtilization,TechnicalActions,VulnPatterns,StrategyBranching,BranchTree}.tsx`.

Example (`features/core/components/Dashboard.tsx:58`):
```
void Promise.all([...]).then(([missionData, specsData]) => { ... });
```
There is no `.catch()` anywhere in any of these 19 files. `void` satisfies `@typescript-eslint/no-floating-promises` (which is why lint is clean), but it doesn't handle a rejection — if the promise rejects, this becomes an unhandled promise rejection at runtime with no user-facing error state. Contrast with `features/missions/components/workspace/AttackGraphCanvasContainer.tsx:27-38`, which does the same `Promise.all(...).then(...)` but correctly appends `.catch((err) => { ... })` — proof this codebase already knows the right pattern, just doesn't apply it consistently.

**Why it's wrong:** currently low-risk because every repository call reads local fixtures and effectively never rejects — but every one of these repositories already has a `// VALIDATION SEAM: insert schema.parse(data) here once a real backend replaces mock data` comment marking where real, fallible network calls will land (see Section 8 finding below). The moment that happens, these 19 components will silently break with no error UI, while the 1 that already has `.catch()` will degrade gracefully.

**Fix:** either add `.catch()` to each fetch effect (matching `AttackGraphCanvasContainer.tsx`), or — better, since this is 19 near-identical call sites — extract a small shared hook (e.g. `useRepositoryFetch`) that wraps a repository call with loading/error state and a single `.catch()`, and have all 19 components adopt it. This also gives Section 8's forward-looking Server Component migration a single seam to change instead of 19.

### M4. Identity/metadata row missing the overflow treatment its sibling row already has

**File:** `features/missions/components/workspace/MissionStatusStrip.tsx`

Line 17: `<div className="border-border flex items-center gap-6 border-b px-4 py-2">` — holds `MISSION`, `TARGET`, `MODE`, `SURFACE`, and a status pill, with no `overflow-x-auto` and no `flex-wrap`.

Two lines below it, line 34's metrics row (`<div className="flex w-full items-center gap-0 overflow-x-auto">`) wraps its `KPIStrip` in `overflow-x-auto` specifically to survive narrow viewports.

**Why it's wrong:** on a narrow viewport, the identity row has no scroll or wrap affordance and will clip or force horizontal page scroll, unlike the row directly below it that was built for exactly this. This is the "non-`<table>` layout that behaves like one" case from Section 10 — a fixed-column metadata row needs the same `overflow-x-auto` treatment.

**Fix:** add `overflow-x-auto` (and ideally `flex-shrink-0` on each `Meta`/`Sep` child) to the identity row, mirroring the metrics row two lines below.

---

## Low

### L1. Static inline styles that should be Tailwind classes (widespread — representative sample)

Section 6's rule: static values (same every render) belong in classes; dynamic/data-driven values are correctly left inline. The codebase gets the *dynamic* half right almost everywhere (percentage widths from data, `color`/`background` driven by a status/severity lookup, virtualizer-computed heights in `TrajectoryPage.tsx`/`AuditLogPage.tsx`/`ExecutionConsoleView.tsx` are all legitimately left as inline styles). But there's a long tail of genuinely static values that aren't:

- `features/environment/components/HostDetailPanel.tsx:59-61` — `style={{ borderRadius: "50%" }}` → `rounded-full`.
- `features/findings/components/AttackPath.tsx:5-7,14-16,30-32` — `gap: 0` → `gap-0`; `opacity: 0.5` → `opacity-50`; `borderRadius: "50%"` → `rounded-full`.
- `features/environment/components/HostTopologyDiagram.tsx:27-29,45-47` — `gap: 0` → `gap-0`; `paddingTop: 2` → `pt-0.5`.
- `features/validation/components/EvaluationScreen.tsx:62-64,77-79,95-97` — `margin: "24px 0"` → `my-6`; `paddingBottom: 32` → `pb-8`; `zIndex: 1` → a real z-index token per Section 5, not a bare `1`.
- `features/findings/components/TrajectoryTab.tsx:16-18` — `margin: "4px 0"` → `my-1`.
- `features/missions/components/wizard/WizardMissionSummary.tsx:54-56` — `display: "-webkit-box", WebkitLineClamp: 6, WebkitBoxOrient: "vertical", overflow: "hidden"` → Tailwind's built-in `line-clamp-6` utility does exactly this.
- `features/missions/components/workspace/MissionSubNavPanel.tsx:54-56,69-71` — `padding: "0 4px"` → `px-1`.
- `features/execution/components/exec-drawer-tabs/{ExecDrawerRawTab,ExecDrawerTrajectoryTab}.tsx` — `margin: 0` / `paddingTop: 4` / `display: "flex", gap: 0` → `m-0` / `pt-1` / `flex gap-0`.

Two-state boolean "variants" expressed via ternary inline styles instead of conditional Tailwind classes (not truly runtime-arbitrary data, just a two-way switch Tailwind can express natively):
- `features/findings/components/AttackPath.tsx:21-23,36-38` — `padding: large ? "10px 16px" : "7px 12px"`, `fontSize: large ? 11 : 10`.
- `features/missions/components/wizard/NewMissionWizardView.tsx:140-142` — `padding: step === 5 ? "8px 32px" : "8px 24px"`.
- `features/missions/components/workspace/MissionSubNavPanel.tsx:105-114,137-153` — same file as Critical finding C1; once that's fixed, the whole `style={{...}}` block for both buttons should move to conditional Tailwind classes rather than inline styles + imperative hover handlers.

**Fix:** convert each to the equivalent Tailwind utility class (values above map cleanly onto the existing spacing/radius scale); for the boolean-variant cases, use a conditional class string (`className={large ? "px-4 py-2.5 text-[11px]" : "px-3 py-1.5 text-[10px]"}`) instead of inline `style`.

### L2. Dead ternary — `padding: inline ? 0 : "0"`

**File:** `features/findings/components/EvidenceViewer.tsx:9-11`
```
style={{
    padding: inline ? 0 : "0",
}}
```
Both branches evaluate to zero regardless of the `inline` prop, so the `inline` prop has no visible effect here (it's likely meant to add padding in the non-inline case). Not a crash, but dead code masking what was probably intended to be `inline ? 0 : "20px"` or similar, and it should be a Tailwind class either way (`p-0` / conditional padding class) rather than inline style.

---

## Recommended execution order

1. **C1** — active bug, ships incorrect state feedback on a mission-control action today. Fix first.
2. **H1** — structural, affects 8 files with an identical fix shape; do this before the file-count grows further, using `MissionLiveState.tsx` as the template.
3. **M3** — structural, 19 files, and worth doing as a shared hook rather than 19 individual `.catch()` additions, since it sets up the Section 8 backend migration cleanly.
4. **M1** (2 files) and **M2** (2 files + 1 token addition) — smaller structural/primitive-migration items.
5. **M4** — one-file polish, but cheap and directly adjacent to an already-correct sibling pattern.
6. **L1 / L2** — isolated, one-file-at-a-time polish; no urgency, batch into a single cleanup pass since none change behavior.

No visual theme colors, spacing scale, or copy were touched or recommended for change anywhere above — all fixes are mechanism-only, per the audit's own constraint.
