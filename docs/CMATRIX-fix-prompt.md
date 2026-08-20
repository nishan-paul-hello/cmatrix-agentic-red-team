# CMatrix Mockup — AI Agent Fix Prompt

## Role

You are an expert React/TypeScript coding agent. Fix the defects listed below in the CMatrix mockup codebase at `docs/CMATRIX/src/`. Do **not** invent new features, do **not** change anything that already works, do **not** modify files for findings marked ✅ FIXED. Fix only what this document specifies.

---

## Source of Truth (read fully before touching code)

1. `docs/paper-research/cmatrix-architecture/architecture.md` — canonical system spec
2. `docs/paper-research/cmatrix-architecture/image-generation-prompt.md` — UI/UX design spec (palette, typography, layout, 49-screen manifest)
3. `docs/CMATRIX/src/` — the codebase to fix

### Non-negotiable design rules (from image-generation-prompt.md §A)

- **Monospace font everywhere** — JetBrains Mono, fallback IBM Plex Mono / Roboto Mono
- **Fixed color palette** — only the hex values in §A1. No blue (#3B82F6 or any blue is a violation)
- **Global negative prompt** — no glassmorphism, no drop shadows, no gradients, no rounded corners >4px, no blue/purple/cyan neon
- **Border: 1px solid, corner-radius: 2–4px max**
- **Fixed vocabulary** — `ELIGIBLE`, `IN_PROGRESS`, `EXPLOITED`, `BLOCKED`, `INFEASIBLE`, `DEPRIORITIZED`, `ORACLE CONFIRMED`, `VALIDATED`, `PENDING`, `RETRY`, `RULED OUT`, `RUNNING`, `PAUSED`, `TERMINATED`, `QUEUED` — never paraphrase these

---

## SECTION A — Critical Bugs (Fix These First)

---

### A1 — Missions and Dashboard show identical page [NEW BUG]

**File:** `src/App.tsx` lines 80–85

**Root cause:**
```tsx
{view === "dashboard" && (activeNav === "dashboard" || activeNav === "missions") && (
  <Dashboard ... />
)}
```
Both `"dashboard"` and `"missions"` nav items render the exact same `<Dashboard>` component. Clicking "Missions" in the sidebar shows the same command-center page as "Dashboard" — they are indistinguishable.

**Fix:** Create `src/components/MissionsPage.tsx` — a dedicated missions list page. It should show:

- Page header: breadcrumb `OPERATIONS`, title `MISSIONS`
- A "NEW MISSION →" button (red, top right of header)
- A filter strip with status chips: `ALL · RUNNING · PAUSED · VALIDATING · QUEUED · COMPLETED`
- A full-width missions table with columns: `ID · TARGET · SURFACE · MODE · STATUS · NODES · FINDINGS · COST · STARTED`
- Each row is clickable (calls `onOpenMission(id)`)
- Status badge uses the same `StatusBadge` pattern as `Dashboard.tsx`
- Reuse the same `MISSIONS` data array from `Dashboard.tsx` (move it to a shared file `src/lib/data.ts` and import in both)

Then in `App.tsx`, change line 80 to:
```tsx
{view === "dashboard" && activeNav === "dashboard" && (
  <Dashboard onNewMission={...} onOpenMission={...} />
)}
{view === "dashboard" && activeNav === "missions" && (
  <MissionsPage onNewMission={...} onOpenMission={...} />
)}
```

---

### A2 — "Trajectory" missing from outer sidebar RESEARCH group [NEW BUG]

**Context (read carefully):**
- The **inner sidebar** (inside `MissionWorkspace.tsx`) has a "Trajectory" sub-nav item — this is the per-mission step timeline. It already works. Do **not** change it.
- The **outer sidebar** (`Shell.tsx` NAV_GROUPS) is missing "Trajectory" from the RESEARCH group.

**Spec reference** (`image-generation-prompt.md` §A3 sidebar description):
> RESEARCH (Trajectory, Benchmarks, Ablations, Statistics, Failure Analysis, Reports)

So "Trajectory" must appear in the outer sidebar under RESEARCH — as a **global/cross-mission** trajectory browser, not the per-mission view.

**Fix — 3 steps:**

**Step 1:** In `Shell.tsx`, add `"trajectory"` to the `NavItem` type and to `NAV_GROUPS` under RESEARCH (first item in that group):
```tsx
export type NavItem =
  | "dashboard" | "missions"
  | "memory" | "skill-library" | "failure-memory"
  | "trajectory" | "benchmarks" | "ablations" | "statistics" | "failure-analysis" | "reports"
  | "cost-usage" | "audit-log" | "settings";
```
Add to NAV_GROUPS RESEARCH items array (first):
```tsx
{ id: "trajectory", label: "Trajectory" },
```

**Step 2:** Create `src/components/TrajectoryBrowser.tsx` — a global trajectory browser. It shows a mission selector dropdown at the top (`CVE-001 · CVE-002 · CVE-003 · BENCH-014`) and below it the full TrajectoryPage content for the selected mission. For the mockup, simply render `<TrajectoryPage />` (already exists) below the mission selector. Header: breadcrumb `RESEARCH`, title `TRAJECTORY BROWSER`.

**Step 3:** In `App.tsx`, add to `NAV_COMPONENTS`:
```tsx
trajectory: <TrajectoryBrowser />,
```

---

### A3 — Cost mismatch: CVE-001 shows $1.42 in most places but $0.22 in others

**Canonical value for CVE-001 cost: `$1.42`**

Files to update:
- `src/components/CostDashboard.tsx`: Change `const TOTAL = 0.2230` → `const TOTAL = 1.42`. Adjust the `TIMELINE` entries so costs roughly sum to ~1.42 (scale all values proportionally, e.g. multiply each by ~6.4).
- `src/components/TeamManagerDashboard.tsx` line ~53: Change `value="$0.223"` → `value="$1.42"`.
- `src/components/Shell.tsx` line ~147 (topbar COST): Change `value="$0.223"` → `value="$1.42"`.

---

### A4 — AuditLogPage uses blue `#3B82F6` — palette violation [NEW BUG]

**File:** `src/components/AuditLogPage.tsx` line 30

```tsx
AUTH: { c: "#3B82F6", bg: "#060E1A" },
```

Blue is forbidden. Fix:
```tsx
AUTH: { c: "#A0A0A0", bg: "#111111" },
```

---

### A5 — ReportsPage breadcrumb says "KNOWLEDGE BASE" [NEW BUG]

**File:** `src/components/ReportsPage.tsx` line 28

Reports sits under the RESEARCH nav group. Change:
```tsx
"KNOWLEDGE BASE"  →  "RESEARCH"
```

---

### A6 — Findings count inconsistent across components

| Component | Currently shows | Should show |
|-----------|----------------|-------------|
| MissionWorkspace metrics strip | `"07"` | `"07"` ✓ |
| MissionWorkspace right-panel live state | `"03"` | `"07"` |
| FindingsDashboard DATA array | 7 rows | 7 rows ✓ |

**File:** `src/components/MissionWorkspace.tsx` right-panel live state (line ~407)

Change the FINDINGS value from `"03"` to `"07"`.

---

### A7 — VDG node count: overview shows 4, metric says 42

AttackGraphCanvas has **12** nodes. The overview metric says **42**. The overview renders **4** nodes.

**Fix in `MissionWorkspace.tsx`:**
- Change metrics strip FINDINGS value from `"42"` to `"12"` (line ~183).
- Change right-panel live-state VDG NODES from `"42"` to `"12"` (line ~405).
- Add a subtitle to the overview graph canvas label: change `"ATTACK GRAPH"` to `"ATTACK GRAPH — OVERVIEW (4 OF 12 NODES)"`.
- Change `"8 ELIGIBLE"` sub-label in right-panel to `"3 ELIGIBLE"` (matching AttackGraphCanvas actual eligible nodes: SQLI-001, IDOR-008, IDOR-009).

---

### A8 — Elapsed timer always starts at 6:31

**File:** `src/components/MissionWorkspace.tsx` line ~146

Change:
```tsx
const time = useElapsed(391);
```
to:
```tsx
const time = useElapsed(0);
```


---

## SECTION B — Dead & Partially-Working Buttons

---

### B1 — AttackGraphCanvas "FOCUS HIGHEST-SCORE PATH" does nothing

**File:** `src/components/AttackGraphCanvas.tsx` lines 93–97

The button has no `onClick`. 

**Fix:** Add:
```tsx
onClick={() => {
  // Find eligible node with highest UCB
  const top = [...NODES]
    .filter(n => n.status === "ELIGIBLE")
    .sort((a, b) => b.ucb - a.ucb)[0];
  if (!top) return;
  // Clear filters so the node is visible
  setStatusFilter("ALL");
  setVulnFilter("ALL");
  // Open its drawer
  setDrawerNode(top);
}}
```
(Note: `setDrawerNode` is required by fix C1 below — implement C1 first.)

---

### B2 — MissionWorkspace Overview "FOCUS HIGHEST-SCORE PATH" does nothing

**File:** `src/components/MissionWorkspace.tsx` lines ~299–303

**Fix:** Add `onClick={() => setSubNav("attack-graph")}` to this button. It navigates to the full Attack Graph view where the real focus-path feature works.

---

### B3 — ExecutionConsole TRAJECTORY tab shows a single hardcoded string

**File:** `src/components/ExecutionConsole.tsx`

Read the file. Find the drawer detail panel's TRAJECTORY tab. It renders one hardcoded string regardless of which execution entry is selected.

**Fix:** Replace the static string with a small table:

```tsx
{tab === "TRAJECTORY" && (
  <div style={{ paddingTop: 4 }}>
    <div style={{ fontSize: 8, color: "#444444", letterSpacing: "0.2em", marginBottom: 10 }}>
      TRAJECTORY CONTRIBUTION
    </div>
    {[
      { step: `STEP ${String(entry.id).padStart(3,"0")}`, vdgDelta: entry.node ?? "—", elDelta: "+2 facts", cost: entry.cost ?? "$0.00" },
    ].map((r, i) => (
      <div key={i} style={{ display: "flex", gap: 0, border: "1px solid #1E1E1E", borderRadius: 2, overflow: "hidden" }}>
        {[["STEP", r.step], ["VDG DELTA", r.vdgDelta], ["EL DELTA", r.elDelta], ["COST", r.cost]].map(([k, v], j, a) => (
          <div key={k} style={{ flex: 1, padding: "9px 12px", borderRight: j < a.length - 1 ? "1px solid #1A1A1A" : "none", background: "#0D0D0D" }}>
            <div style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.18em", marginBottom: 4 }}>{k}</div>
            <div style={{ fontSize: 10, color: "#888888", fontWeight: 600 }}>{v}</div>
          </div>
        ))}
      </div>
    ))}
  </div>
)}
```

If the drawer receives the selected entry as a prop, use `entry.id`, `entry.node`, `entry.cost`. If not, use reasonable derived values.

---

### B4 — ValidationCenter STATE MACHINE modal — no current-state highlight

**File:** `src/components/ValidationCenter.tsx`

The STATE MACHINE modal opens but all nodes look identical regardless of which finding is selected.

**Fix:**
1. Add `finding` prop to the `StateMachineModal` component: `StateMachineModal({ onClose, finding }: { onClose: ()=>void; finding: VFinding | null })`.
2. Derive `activeState` from `finding?.status`:
   - `"PENDING"` → active node: `"VALIDATION"`
   - `"RETRY"` → active node: `"RETRY"`
   - `"VALIDATED"` → active node: `"VALIDATED"`
   - `"RULED OUT"` → active node: `"RULED OUT"`
3. In the SVG/HTML flowchart, each node box that matches `activeState` gets: `background: "#E31B23"`, `color: "#F2F2F2"`, `border: "1px solid #FF2A32"`.
4. Pass `selected` finding to the modal when "STATE MACHINE" is clicked: `<Btn onClick={() => setModal(true)} .../>` — the modal already opens, just pass `finding={selected}` (add a `selected` state tracking which row was last clicked).
5. Make finding rows in the table clickable to set `selected`: add `onClick={() => setSelected(f)}` to each `<tr>`.

---

### B5 — HumanEscalation "SEND RESPONSE" not truly disabled when empty

**File:** `src/components/HumanEscalation.tsx` line ~98

**Problem:** Only cursor style changes — no `disabled` attribute.

**Fix:** Add `disabled={!response.trim()}` to the button element. Also add helper text below the textarea:
```tsx
{!response.trim() && (
  <div style={{ fontSize: 8.5, color: "#444444", letterSpacing: "0.1em", marginTop: 4 }}>
    TYPE A RESPONSE TO ENABLE SUBMIT
  </div>
)}
```

