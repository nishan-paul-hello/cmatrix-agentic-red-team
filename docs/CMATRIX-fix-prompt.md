# CMatrix Mockup — AI Agent Fix Prompt

## Role

You are an expert React/TypeScript coding agent. Fix the defects listed below in the CMatrix mockup codebase at `CMATRIX/src/`. Do **not** invent new features, do **not** change anything that already works, do **not** modify files for findings marked ✅ FIXED. Fix only what this document specifies.

---

## Source of Truth (read fully before touching code)

1. `architecture.md` — canonical system spec
2. `image-generation-prompt.md` — UI/UX design spec (palette, typography, layout, 49-screen manifest)
3. `CMATRIX/src/` — the codebase to fix

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


---

## SECTION C — Static / Non-Parameterized Components

---

### C1 — VDGNodeDrawer always shows SQLI-001 regardless of clicked node

**Files:** `src/components/VDGNodeDrawer.tsx`, `src/components/AttackGraphCanvas.tsx`

**Problem:** Every node click calls `setDrawerOpen(true)` with no node identity passed. The drawer hardcodes SQLI-001 on line 10.

**Fix — Step 1: Add node data to VDGNodeDrawer**

Change the component signature:
```tsx
interface DrawerNode {
  id: string; type: string; status: string;
  ucb: number; eord: number; vulnClass: string;
}
export default function VDGNodeDrawer({ node, onClose }: { node: DrawerNode; onClose: () => void })
```

Replace all hardcoded values in the drawer header:
- Node ID label → `{node.id}`
- Status badge text → `{node.status}`
- Type label → `{node.type}`
- UCB SCORE value → `{node.ucb > 0 ? node.ucb.toFixed(3) : "—"}`
- E_ord value → `{node.eord} / 5` (for both the grid stat and the EOrdIndicator)
- EOrdIndicator `value` prop → `{node.eord}`

For sections that can't be derived from the node (PREREQUISITES, ENABLES, ATTACK INTENT, SOURCE ENVIRONMENT FACTS, NODE LIFECYCLE timeline), add a lookup map in the file:
```tsx
const NODE_DETAIL: Record<string, {
  intent: string;
  prerequisites: { id: string; done: boolean }[];
  enables: string[];
  facts: { k: string; v: string }[];
}> = {
  "SQLI-001": { intent: "Exploit time-based blind SQL injection in /api/users via id parameter", prerequisites: [{id:"AUTH-001",done:true},{id:"RECON-004",done:true}], enables: ["DB-ACCESS-002","RCE-007"], facts: [{k:"ENDPOINT",v:"GET /api/users"},{k:"PARAMETER",v:"id (integer, unsanitised)"},{k:"AUTH STATE",v:"SESSION admin@targetcorp.com"},{k:"TECH",v:"Flask 2.3 / SQLite 3.39"},{k:"EVIDENCE",v:"HTTP 500 on id=1' observed (E_ord 3)"}] },
  "AUTH-001": { intent: "Exploit authentication bypass on /api/auth/login", prerequisites: [{id:"RECON-001",done:true}], enables: ["SQLI-001","XSS-002","CSRF-003"], facts: [{k:"ENDPOINT",v:"POST /api/auth/login"},{k:"PARAMETER",v:"username, password"},{k:"AUTH STATE",v:"UNAUTHENTICATED"},{k:"EVIDENCE",v:"Default admin credentials accepted (E_ord 4)"}] },
  "RECON-001": { intent: "Enumerate attack surface via spider, port scan, technology fingerprint", prerequisites: [], enables: ["AUTH-001","ENUM-002"], facts: [{k:"TARGET",v:"app.targetcorp.com"},{k:"METHOD",v:"nmap + spider"},{k:"TECH",v:"nginx/1.24, Flask 2.3, PostgreSQL 14"},{k:"EVIDENCE",v:"12 endpoints discovered (E_ord 5)"}] },
};
const DEFAULT_DETAIL = { intent: "Investigate target node for exploitable vulnerabilities.", prerequisites: [], enables: [], facts: [] };
```
Then render: `const detail = NODE_DETAIL[node.id] ?? DEFAULT_DETAIL;`

**Fix — Step 2: Update AttackGraphCanvas**

Replace:
```tsx
const [drawerOpen, setDrawerOpen] = useState(false);
```
with:
```tsx
const [drawerNode, setDrawerNode] = useState<VDGNode | null>(null);
```

In each node card:
```tsx
onClick={() => setDrawerNode(node)}
```

Render:
```tsx
{drawerNode && <VDGNodeDrawer node={drawerNode} onClose={() => setDrawerNode(null)} />}
```

---

### C2 — EvaluationScreen hardcoded to SQLI-001 / Execution #00483

**File:** `src/components/EvaluationScreen.tsx`

**Fix:** Add an optional `entry` prop with a fallback to current hardcoded data:
```tsx
interface EvalEntry {
  execId: string; nodeId: string; nodeType: string; eord: number;
  whatHappened: string; expectedVsActual: string; nextStep: string;
}
const DEFAULT_ENTRY: EvalEntry = {
  execId: "00483", nodeId: "SQLI-001", nodeType: "SQL INJECTION", eord: 3,
  whatHappened: `Time-based blind SQL injection payload was dispatched...`,
  expectedVsActual: `EXPECTED: Server response within baseline 80–120ms...\nACTUAL: 4.18s with time-sec=4 payload...`,
  nextStep: `E_ord raised from 3 (CLEAR) to 4 (CONFIRMED). VDG node SQLI-001 status updated...`,
};
export default function EvaluationScreen({ entry = DEFAULT_ENTRY }: { entry?: EvalEntry })
```

Replace `const VALUE = 3` with `const VALUE = entry.eord`.
Replace the three block content strings with `entry.whatHappened`, `entry.expectedVsActual`, `entry.nextStep`.
Replace the header execution badge from `"EXECUTION #00483"` to `"EXECUTION #${entry.execId}"`.
Replace the breadcrumb from `"EXECUTION / SQLI-001"` to `"EXECUTION / ${entry.nodeId}"`.


---

## SECTION D — Settings Page Overhaul

---

### D1 — SettingsPage tabs don't match design spec

**File:** `src/components/SettingsPage.tsx`

**Spec** (`image-generation-prompt.md` screen 46) requires these left-nav categories:
`GENERAL, MODELS, MISSIONS, TOOLS, MEMORY, VDG, VALIDATION, BENCHMARKS, COST, SECURITY`

**Current tabs:** `GENERAL, ROE DEFAULTS, MODELS, NOTIFICATIONS, MODAL REFERENCE, STATE REFERENCE`

**Fix — rename/add/remove tabs:**

Keep the existing GENERAL and MODELS tab content unchanged.

Remove: `ROE DEFAULTS`, `NOTIFICATIONS`, `STATE REFERENCE`. Move the ROE content (max runtime, cost ceiling, mode, surface) into GENERAL as a "DEFAULT RULES OF ENGAGEMENT" section.

Remove: `MODAL REFERENCE` — move to a small collapsible "DEV REFERENCE" section inside GENERAL only.

Add the following new tabs (each needs a minimal real settings UI — not a stub):

**MISSIONS**
- Default surface: radio chips `WEB APPLICATION · GRAPHQL · MULTI-HOST`
- Default mode: radio chips `ONE-DAY · ZERO-DAY`
- Auto-start validation after exploit: toggle
- Early-stop on CRITICAL finding: toggle

**TOOLS**
- Tool timeout: number input `[30] seconds`
- Max parallel tool calls: number input `[4]`
- Tool allowlist: toggle per tool — `nmap · sqlmap · curl · ffuf · nuclei · gobuster · hydra`

**MEMORY**
- Compaction threshold: slider/input `[85] % context used`
- Max episodic entries: number input `[500]`
- Skill promotion threshold: number input `[3] successful uses`

**VDG**
- UCB exploration constant `c`: number input `[0.40]`
- E_ord dispatch threshold: number input `[3]` (min E_ord to dispatch specialist)
- Retry cap per node: number input `[3]` attempts

**VALIDATION**
- Max oracle retries: number input `[3]`
- Oracle timeout: number input `[60] seconds`
- Require oracle for CRITICAL findings: toggle (default ON)

**BENCHMARKS**
- Default benchmark suite: radio chips `CVE-BENCH · PREDIQL · MHBENCH`
- Runs per condition: number input `[3]`
- Compute budget per run: number input `[$5.00]`

**COST**
- Global cost ceiling: number input `[$10.00]`
- Per-specialist cost cap: number input `[$2.00]`
- Cost alert threshold: number input `[80] % of ceiling`

**SECURITY**
- Require MFA: toggle
- Session timeout: number input `[60] minutes`
- Audit log retention: number input `[90] days`

Use the exact same input/row/section layout pattern as the existing GENERAL tab. All inputs are controlled with `useState` — no form submission needed.

---

## SECTION E — BenchmarksHub Tier Structure

---

### E1 — BenchmarksHub missing Tier 0–6 structure

**File:** `src/components/BenchmarksHub.tsx`

**Spec** (`image-generation-prompt.md` screen 39): "Seven tiles, Tier 0 through Tier 6 — FANG SANDBOX, PENTESTEVAL, CVE-BENCH, PREDIQL, MHBENCH, BOUNTYBENCH, PENTESTGPT/HTB"

**Fix:** In the benchmark list view (not the detail page), add a BENCHMARK SUITES section above the existing runs table. Show 7 small tiles in a horizontal row:

```
TIER 0  FANG SANDBOX         internal — unscored
TIER 1  PENTESTEVAL          basic web pentesting
TIER 2  CVE-BENCH            40 critical CVEs
TIER 3  PREDIQL              IDOR + GraphQL reasoning
TIER 4  MHBENCH              multi-host lateral movement
TIER 5  BOUNTYBENCH          real-world bug bounty
TIER 6  PENTESTGPT / HTB     HackTheBox integration
```

Each tile style:
```tsx
style={{
  flex: 1, background: "#0D0D0D", border: "1px solid #1E1E1E",
  borderRadius: 2, padding: "10px 12px", minWidth: 0
}}
```

Tile content (top to bottom):
- Tier badge: `TIER {n}` — `fontSize: 7.5, color: "#444444", letterSpacing: "0.16em"`
- Suite name: `fontSize: 10, fontWeight: 700, color: "#F2F2F2", letterSpacing: "0.1em", marginTop: 4`
- Description: `fontSize: 8.5, color: "#444444", marginTop: 2`
- PASS@1 score or `—` : `fontSize: 11, fontWeight: 700, color: scoreColor, marginTop: 6`

Score colors: 
- ≥ 0.75 → `#3FB950` (green)
- ≥ 0.50 → `#D29922` (amber)
- 0 / not run → `#333333` (dim)

Use this data:
```tsx
const TIERS = [
  { n: 0, name: "FANG SANDBOX",    desc: "Internal sandbox", score: null },
  { n: 1, name: "PENTESTEVAL",     desc: "Basic web pentesting", score: 0.821 },
  { n: 2, name: "CVE-BENCH",       desc: "40 critical CVEs", score: 0.812 },
  { n: 3, name: "PREDIQL",         desc: "IDOR + GraphQL", score: 0.741 },
  { n: 4, name: "MHBENCH",         desc: "Multi-host lateral", score: 0.634 },
  { n: 5, name: "BOUNTYBENCH",     desc: "Real bug bounty targets", score: 0.488 },
  { n: 6, name: "PENTESTGPT/HTB",  desc: "HackTheBox integration", score: null },
];
```

Wrap in:
```tsx
<div style={{ padding: "16px 24px", borderBottom: "1px solid #1E1E1E" }}>
  <div style={{ fontSize: 8, color: "#444444", letterSpacing: "0.2em", marginBottom: 12 }}>BENCHMARK SUITES</div>
  <div style={{ display: "flex", gap: 8 }}>
    {TIERS.map(...)}
  </div>
</div>
```


---

## SECTION F — Small Targeted Fixes

---

### F1 — TrajectoryPage "ALL" filter chip gets dark-red background

**File:** `src/components/TrajectoryPage.tsx` line ~63

**Problem:** `TYPE_C["ALL"]` is `undefined`, fallback `"#120608"` (dark red) is used for the "ALL" active chip.

**Fix:** In the filter chip active background/color logic, add a guard for `"ALL"`:
```tsx
background: filter === t
  ? (t === "ALL" ? "#1A1A1A" : (TYPE_C[t as TrajStep["type"]]?.bg ?? "#1A1A1A"))
  : "transparent",
color: filter === t
  ? (t === "ALL" ? "#F2F2F2" : (TYPE_C[t as TrajStep["type"]]?.c ?? "#F2F2F2"))
  : "#555555",
border: `1px solid ${filter === t ? (t === "ALL" ? "#444444" : (TYPE_C[t as TrajStep["type"]]?.c ?? "#444444") + "66") : "#1E1E1E"}`,
```

---

### F2 — CostDashboard zero-cost timeline bars render as 4px (non-zero)

**File:** `src/components/CostDashboard.tsx` lines ~125–131

**Fix:**
```tsx
const barH = maxCost > 0 ? Math.round((t.cost / maxCost) * 60) : 0;
// change style height from `${h + 4}px` to:
height: barH > 0 ? `${barH}px` : "1px",
```

---

### F3 — EvaluationScreen E_ord "ORACLE" label overflows right edge

**File:** `src/components/EvaluationScreen.tsx` lines ~61–63

**Fix:** Change the transform for the last tick (index 5):
```tsx
transform: i === 5
  ? "translateX(-90%)"
  : i === 0
    ? "translateX(-10%)"
    : "translateX(-50%)"
```

---

### F4 — ResearchLab Failure Analysis expanded panel has no close button

**File:** `src/components/ResearchLab.tsx` FailureAnalysis function

**Fix:** Make the expanded panel container `position: "relative"` and add a ✕ button:
```tsx
<div style={{ position: "relative", background: "#0D0D0D", border: "1px solid #1E1E1E", ... }}>
  <button
    onClick={() => setSel(null)}
    style={{
      position: "absolute", top: 8, right: 12,
      fontSize: 13, color: "#444444", background: "transparent",
      border: "none", cursor: "pointer", fontFamily: "inherit",
    }}
    onMouseEnter={e => e.currentTarget.style.color = "#A0A0A0"}
    onMouseLeave={e => e.currentTarget.style.color = "#444444"}
  >✕</button>
  {/* existing content */}
</div>
```

---

### F5 — MemoryPage strategy branching legend "RUNNING" color mismatch

**File:** `src/components/MemoryPage.tsx` legend section lines ~138–141

**Problem:** Legend shows `"RUNNING"` → `#E31B23` but `BranchTree` renders `"RUNNING"` as `#D29922`.

**Fix:** In the legend, change the color for `"RUNNING"` from `#E31B23` to `#D29922`.

---

### F6 — MemoryPage SkillLibrary filter ignores description and specialist fields

**File:** `src/components/MemoryPage.tsx` line ~268

**Fix:**
```tsx
const filtered = SKILLS.filter(s =>
  s.name.toLowerCase().includes(filter.toLowerCase()) ||
  s.cat.toUpperCase().includes(filter.toUpperCase()) ||
  (s.desc && s.desc.toLowerCase().includes(filter.toLowerCase())) ||
  (s.spec && s.spec.toLowerCase().includes(filter.toLowerCase()))
);
```

---

### F7 — NewMissionWizard step indicator completed steps not clickable

**File:** `src/components/NewMissionWizard.tsx` lines ~62–86

**Problem:** Step circles are `<div>` elements — clicking a completed step does nothing.

**Fix:** Wrap each completed step indicator in a `<button>`:
```tsx
{done ? (
  <button
    onClick={() => setStep(s.index)}
    title={`Go back to Step ${s.index + 1}`}
    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center" }}
  >
    {/* existing step circle + label */}
  </button>
) : (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    {/* existing step circle + label */}
  </div>
)}
```

---

### F8 — NewMissionWizard BENCHMARK ENVIRONMENT — no suite/task selector

**File:** `src/components/NewMissionWizard.tsx` lines ~104–113 (Step 1 target type)

**Problem:** Selecting `BENCHMARK ENVIRONMENT` as target type shows no additional UI for choosing which suite and task.

**Fix:** After the three target type radio chips, conditionally render a benchmark sub-form when `targetType === "BENCHMARK ENVIRONMENT"`:

```tsx
{targetType === "BENCHMARK ENVIRONMENT" && (
  <div style={{ marginTop: 16, padding: "14px 16px", background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 2 }}>
    <div style={{ fontSize: 8, color: "#444444", letterSpacing: "0.2em", marginBottom: 12 }}>BENCHMARK SUITE</div>
    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
      {["CVE-BENCH", "PREDIQL", "MHBENCH"].map(s => (
        <button key={s} onClick={() => setBenchSuite(s)}
          style={{ fontSize: 9, padding: "4px 12px", background: benchSuite === s ? "#1A0608" : "transparent",
            border: `1px solid ${benchSuite === s ? "#E31B23" : "#292929"}`,
            color: benchSuite === s ? "#FF2A32" : "#555555", borderRadius: 2, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.12em" }}>
          {s}
        </button>
      ))}
    </div>
    <div style={{ fontSize: 8, color: "#444444", letterSpacing: "0.2em", marginBottom: 8 }}>TASK / CVE ID</div>
    <input value={benchTaskId} onChange={e => setBenchTaskId(e.target.value)}
      placeholder="e.g. CVE-2023-44487 or leave blank for full suite"
      style={{ width: "100%", background: "#080808", border: "1px solid #292929", borderRadius: 2,
        color: "#A0A0A0", fontSize: 10, padding: "7px 10px", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />
  </div>
)}
```

Add state: `const [benchSuite, setBenchSuite] = useState("CVE-BENCH")` and `const [benchTaskId, setBenchTaskId] = useState("")`.

Also update the Step 5 Review row:
- Change the hardcoded `"ORACLE CONFIRMED (CVE-BENCH)"` → `isOracle ? \`ORACLE CONFIRMED (${benchSuite})\` : "E_ord THRESHOLD (≥ 4)"`.

---

### F9 — NewMissionWizard Step 2 missing "MAX RETRIES PER NODE" field

**File:** `src/components/NewMissionWizard.tsx` Step 2 RULES OF ENGAGEMENT

**Fix:** Add a fourth field to the OPERATIONAL LIMITS block after TOOL TIMEOUT:

```tsx
<FieldRow label="MAX RETRIES PER NODE" unit="attempts"
  value={maxRetries} onChange={setMaxRetries} />
```

Add state: `const [maxRetries, setMaxRetries] = useState("3")`.

Add to the Step 5 Review summary:
```tsx
{ label: "RETRY CAP", value: `${maxRetries} per node` }
```

---

### F10 — Add ESC key handler to all modals

**Files:** `ValidationCenter.tsx`, `FindingsDashboard.tsx`, `TeamManagerDashboard.tsx`

For every modal component in these files, add this `useEffect` pattern:
```tsx
useEffect(() => {
  function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
}, [onClose]);
```

---

### F11 — Terminology normalization

Apply these rules across **all files**. Do a global search-and-replace:

| Context | Token | Canonical form |
|---------|-------|---------------|
| Log stream timestamps / live feed lines | Team Manager agent | `TEAM-MGR` |
| UI display labels, page headings, cost table rows | Team Manager agent | `TEAM MANAGER` |
| Log stream timestamps / live feed lines | Validation Agent | `VALID-AGENT` |
| UI display labels, role columns, breadcrumbs | Validation Agent | `VALIDATION AGENT` |
| `TrajectoryPage.tsx` agent column | `"TEAM-MANAGER"` | `"TEAM-MGR"` |
| `CostDashboard.tsx` display role | `"TEAM-MANAGER"` | `"TEAM MANAGER"` |

---

### F12 — Create shared constants file to eliminate EORD_LABELS duplication

**Files:** `src/components/VDGNodeDrawer.tsx` line 1, `src/components/EvaluationScreen.tsx` line 1

**Fix:**

Create `src/lib/constants.ts`:
```ts
export const EORD_LABELS = ["UNSEEN", "NOTHING", "WEAK", "CLEAR", "CONFIRMED", "ORACLE"] as const;
export type EordLabel = typeof EORD_LABELS[number];
```

In both `VDGNodeDrawer.tsx` and `EvaluationScreen.tsx`:
- Remove the local `const EORD_LABELS = [...]` definition
- Add: `import { EORD_LABELS } from "../lib/constants";`

---

## SECTION G — Architecture Concepts Missing from UI

These are lower priority than A–F. Implement after all above fixes are complete and verified.

---

### G1 — UCB exploration constant `c` not exposed in Settings

After completing D1 (SettingsPage VDG tab), the `c` value input is already covered there.
Additionally, in `TeamManagerDashboard.tsx` UCBModal, change the hardcoded `const C = 0.4` to read from a local state that defaults to 0.4. Add a note below the formula: `"UCB POLICY c = 0.40 — configurable in Settings → VDG"`.

---

### G2 — Three-tier memory labels absent from MemoryPage

**File:** `src/components/MemoryPage.tsx`

Add a compact legend row directly below the tab bar, above the tab content:

```tsx
<div style={{ padding: "6px 24px", borderBottom: "1px solid #141414", display: "flex", gap: 20, flexShrink: 0 }}>
  {[
    { n: 1, label: "WORKING CONTEXT", color: "#D29922" },
    { n: 2, label: "EPISODIC MEMORY",  color: "#666666" },
    { n: 3, label: "SKILL LIBRARY",    color: "#E31B23" },
  ].map(t => (
    <div key={t.n} style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ width: 6, height: 6, borderRadius: 1, background: t.color }} />
      <span style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.16em" }}>TIER {t.n} — {t.label}</span>
    </div>
  ))}
</div>
```

Also add a small `Tx` badge beside each tab label:
- VULNERABILITY PATTERNS, STRATEGY BRANCHING, TECHNICAL ACTIONS, FAILURE MEMORY → `T2`
- SKILL LIBRARY → `T3`
- CONTEXT UTILIZATION → `T1`

Badge style: `fontSize: 7.5, color: "#444444", background: "#1A1A1A", borderRadius: 2, padding: "0px 4px", marginLeft: 4`

---

### G3 — EPSS prior absent from UCB breakdown modal

**File:** `src/components/TeamManagerDashboard.tsx` UCBModal section

In the UCB score breakdown display, after EXPLOITATION and before EXPLORATION, add an EPSS PRIOR row:

```tsx
{ label: "EPSS PRIOR",  value: 0.042, color: "#A0A0A0" },
```

Update the FINAL UCB sum to include it. Add a footnote: `"ONE-DAY mode: Q(s,a) seeded from EPSS prior"` — style: `fontSize: 8, color: "#333333", letterSpacing: "0.1em", marginTop: 6`.

---

## Verification Checklist

Run `pnpm dev` and confirm manually:

- [ ] Clicking "Missions" in sidebar shows a **different page** from "Dashboard" — a missions-only list
- [ ] "Trajectory" appears in the outer sidebar under RESEARCH and opens a global trajectory browser
- [ ] CVE-001 cost shows `$1.42` everywhere: Dashboard table, MissionWorkspace header, TeamManagerDashboard KPI, Shell topbar, CostDashboard total
- [ ] AuditLogPage AUTH event badges are gray, not blue
- [ ] ReportsPage breadcrumb reads `"RESEARCH"`
- [ ] SettingsPage has 10 category tabs: GENERAL, MODELS, MISSIONS, TOOLS, MEMORY, VDG, VALIDATION, BENCHMARKS, COST, SECURITY
- [ ] BenchmarksHub shows 7 tier tiles above the runs table
- [ ] Clicking any Attack Graph node opens drawer showing **that node's** id/type/status — not always SQLI-001
- [ ] AttackGraphCanvas "FOCUS HIGHEST-SCORE PATH" highlights the top-UCB ELIGIBLE node
- [ ] HumanEscalation "SEND RESPONSE" has `disabled` attribute and shows helper text when textarea is empty
- [ ] ValidationCenter row click → STATE MACHINE modal highlights the current finding's active state node
- [ ] Wizard completed step circles are clickable buttons that jump back to that step
- [ ] Wizard shows suite/task sub-form when BENCHMARK ENVIRONMENT is selected
- [ ] Wizard Step 5 review shows selected benchmark suite name in oracle label
- [ ] Wizard Step 2 has MAX RETRIES PER NODE field
- [ ] TrajectoryPage "ALL" filter chip has neutral gray active background, not dark red
- [ ] CostDashboard zero-cost TIMELINE bars render as hairline (1px), not 4px blocks
- [ ] EvaluationScreen "ORACLE" tick label does not overflow right edge
- [ ] ResearchLab Failure Analysis expanded panel has a visible ✕ close button
- [ ] MemoryPage Skill Library search finds results when filtering by description text
- [ ] MemoryPage shows tier legend row (T1/T2/T3) below tab bar
- [ ] Pressing Escape closes all open modals
- [ ] MissionWorkspace metrics strip and right-panel both say FINDINGS: 07
- [ ] MissionWorkspace metrics strip and right-panel both say VDG NODES: 12
- [ ] MissionWorkspace overview canvas label reads "ATTACK GRAPH — OVERVIEW (4 OF 12 NODES)"
- [ ] MissionWorkspace elapsed timer starts at 00:00 on page load
- [ ] `pnpm build` exits with code 0 — no TypeScript errors

---

## Constraints (Do Not Violate)

- Do **not** change anything marked ✅ FIXED in `ui-audit-findings.md`
- Do **not** add pages or components beyond what this document describes
- Keep **all inline styles** — do not convert to Tailwind classes (layout utilities like `flex`, `gap-2` are fine; all color/size/spacing tokens must remain inline)
- Preserve **all existing comments and docstrings** unrelated to your changes
- Verify `pnpm build` after completing each Section (A through G) before moving to the next
