# CMatrix Mockup — UI/UX Audit Findings

**Audit Scope:** Every page, route, component, and interactive element in `docs/CMATRIX/src/`  
**Sources of Truth (in priority order):**
1. `docs/paper-research/cmatrix-architecture/architecture.md` (canonical system spec)
2. `docs/paper-research/cmatrix-architecture/image-generation-prompt.md` (design spec / UI manifest)
3. `docs/CMATRIX/src/` (the mockup codebase being audited)

**Auditor note:** This report is "findings only." No code was modified. Each finding includes a precise file path and line number or component/route name.

---

## Table of Contents
1. [Missing Pages / Views](#1-missing-pages--views)
2. [Dead / Non-Functional Buttons and Controls](#2-dead--non-functional-buttons-and-controls)
3. [Placeholder Components](#3-placeholder-components)
4. [Data / State Inconsistencies](#4-data--state-inconsistencies)
5. [Terminology and Label Mismatches vs Architecture Spec](#5-terminology-and-label-mismatches-vs-architecture-spec)
6. [Missing Architecture Concepts Not Surfaced in UI](#6-missing-architecture-concepts-not-surfaced-in-ui)
7. [Component-Level Defects](#7-component-level-defects)
8. [Navigation and Routing Defects](#8-navigation-and-routing-defects)
9. [Accessibility and Interaction Defects](#9-accessibility-and-interaction-defects)
10. [Design Consistency Defects](#10-design-consistency-defects)
11. [Environmental Layer Tab Stubs](#11-environmental-layer-tab-stubs)

---

## 1. Missing Pages / Views

### 1.1 Global Shell — Missing Top-Bar Nav Items (Placeholder Routes)

**File:** `src/components/Shell.tsx`  
**Location:** `NAV_ITEMS` array (approx. lines 30–60) and corresponding `Placeholder` renders

The following navigation items in the global sidebar (`Shell.tsx`) render a generic `<Placeholder>` component. None of these views are implemented:

| Nav Item ID | Label | Expected Content (per image-generation-prompt.md) |
|---|---|---|
| `benchmarks` | Benchmarks | Benchmark suite management — CVE-Bench, PrediQL, MH-Bench results |
| `skills` | Skill Library | Global skill library browser (distinct from per-mission memory) |
| `settings` | Settings | System-level configuration (API keys, model selection, cost limits) |
| `reports` | Reports | Mission report generation and export |

**Impact:** Four complete top-level navigation destinations are entirely unimplemented. Clicking any of these in the running mockup renders an empty placeholder.

---

### 1.2 New Mission Wizard — No "BENCHMARK ENVIRONMENT" Target-Type Branch

**File:** `src/components/NewMissionWizard.tsx`, lines 106–111

Step 1 offers three target types: `URL`, `HOST`, and `BENCHMARK ENVIRONMENT`. However, when `BENCHMARK ENVIRONMENT` is selected, no additional UI appears to let the user select which benchmark suite (`CVE-Bench`, `PrediQL`, `MH-Bench`) or which specific task/CVE ID to target. The architecture spec §4.2 (Benchmark Integration) requires suite and task selection.

**Impact:** The wizard cannot be meaningfully completed for benchmark missions — the most architecturally important mission type.

---

### 1.3 Missing "WAF-Adaptive Workflow" View

**Architecture reference:** `architecture.md` §3.3 (WAF-Adaptive Workflow); `image-generation-prompt.md` screen description for "WAF detection + evasion state" panel  
**No corresponding component exists in `src/components/`.**

The architecture describes a WAF detection and evasion flow (detect → adapt payload → retry) that is a first-class part of the injection workflow. No UI view, panel, or section covers this in any of the mission workspace sub-navigation items. The only tangential mention is in `ResearchLab.tsx` failure cluster FC-003 ("WAF BLOCKING").

---

### 1.4 Missing "Path Scoring" Detail View

**Architecture reference:** `architecture.md` §2.3 (Path Score computation); `image-generation-prompt.md` references a dedicated path-scoring breakdown panel

The `TeamManagerDashboard.tsx` shows the UCB breakdown modal (lines 131–190), but there is no dedicated view showing the full path from root to each node with per-edge weight decomposition. The architecture specifies a product-of-edge-UCB path score. This detail is hardcoded as the constant `"0.612"` (e.g., `MissionWorkspace.tsx` line 342) with no interactive breakdown.

---

### 1.5 Missing "Benchmark Results / Oracle Outcome" Dedicated Page

**Architecture reference:** `architecture.md` §4.2; `image-generation-prompt.md` "Benchmark Integration" screen

`ValidationCenter.tsx` shows a minimal Oracle Panel (lines 191–218) for three oracles. There is no dedicated page showing: benchmark suite scores, per-task pass/fail, aggregate solve rate across a benchmark run, or comparison to baseline. The `ResearchLab.tsx` shows ablation/statistical evaluation but only with hardcoded stub data and no connection to live benchmark results.

---

## 2. Dead / Non-Functional Buttons and Controls

### 2.1 MissionWorkspace — PAUSE Button Does Nothing

**File:** `src/components/MissionWorkspace.tsx`, lines 233–240

```tsx
<button ... >⏸ PAUSE</button>
```

No `onClick` handler. Clicking does not pause the live log stream, change the mission status indicator, or alter any state. The button is purely decorative.

---

### 2.2 MissionWorkspace — TERMINATE Button Does Nothing

**File:** `src/components/MissionWorkspace.tsx`, lines 241–249

```tsx
<button ... >✕ TERMINATE</button>
```

No `onClick` handler. Clicking has no effect. Should at minimum stop the `setInterval` log stream and transition the mission to a TERMINATED state.

---

### 2.3 AttackGraphCanvas — "FOCUS HIGHEST-SCORE PATH" Button Does Nothing

**File:** `src/components/AttackGraphCanvas.tsx`, lines 93–97

```tsx
<button ... >◈ FOCUS HIGHEST-SCORE PATH</button>
```

No `onClick` handler. According to the design spec, clicking this button should highlight the maximum-UCB path from root to the highest-scoring leaf node. Nothing happens.

The same dead button appears in the `MissionWorkspace.tsx` Overview tab (line 287–290) as a static element with no handler.

---

### 2.4 MissionWorkspace Overview — "FOCUS HIGHEST-SCORE PATH" Button (duplicate)

**File:** `src/components/MissionWorkspace.tsx`, lines 286–290

```tsx
<button ...>FOCUS HIGHEST-SCORE PATH</button>
```

Same defect as 2.3. This is a separate instance, also without an `onClick`.

---

### 2.5 FindingsDashboard — "VIEW PATH" Button Does Nothing

**File:** `src/components/FindingsDashboard.tsx`, line 129

```tsx
<button ...>VIEW PATH</button>
```

No `onClick`. The "VIEW EVIDENCE" button (line 127) correctly opens a modal; "VIEW PATH" does nothing and does not navigate to the "ATTACK PATH" tab.

---

### 2.6 HumanEscalation — "AUTHORIZE ALL" Button Does Nothing

**File:** `src/components/HumanEscalation.tsx`, line 100

```tsx
<button ...>AUTHORIZE ALL</button>
```

No `onClick`. Should immediately resume all specialist threads (or at minimum show the `EscalationSubmitted` screen like "SEND RESPONSE" does). Currently dead.

---

### 2.7 HumanEscalation — "HALT MISSION" Button Does Nothing

**File:** `src/components/HumanEscalation.tsx`, line 101

```tsx
<button ...>HALT MISSION</button>
```

No `onClick`. A critical safety action with no handler. Should terminate the mission or navigate back to the Dashboard.

---

### 2.8 NewMissionWizard — "START MISSION →" on Step 5 Does Nothing Meaningful

**File:** `src/components/NewMissionWizard.tsx`, lines 372–384

```tsx
onClick={() => step < 5 && setStep((s) => s + 1)}
```

On step 5, `step < 5` is `false`, so the `onClick` is a no-op. There is no mission launch action — no navigation to a new MissionWorkspace, no state update, no confirmation. The button label changes to "START MISSION →" but the click does nothing.

---

### 2.9 Dashboard — "NEW MISSION" Button Requires `onNewMission` Prop

**File:** `src/components/Dashboard.tsx`, line 59 (function signature)

The `onNewMission` callback prop is typed as optional (`onNewMission?: () => void`). If the parent does not pass this prop (which is possible since it's optional), the "NEW MISSION" button silently fails. The `App.tsx` does pass the prop, but the optional typing creates a silent failure surface.

---

### 2.10 ExecutionConsole Drawer — "TRAJECTORY" Tab Shows Static Stub

**File:** `src/components/ExecutionConsole.tsx`, lines 189–193

```tsx
{tab === "TRAJECTORY" && (
  <div ...>
    STEP 003 · VDG DELTA: RECON-001 → IN_PROGRESS · EL DELTA: +8 facts · COST: $0.00 (deterministic)
  </div>
)}
```

This tab shows a single hardcoded text string regardless of which execution entry is selected. It is not derived from the `entry` prop. Should show the actual trajectory step data for the selected execution.

---

### 2.11 ValidationCenter — "STATE MACHINE" Button Triggers Modal but Modal Has No Interactivity

**File:** `src/components/ValidationCenter.tsx`, `StateMachineModal` function (lines 127–189)

The modal opens correctly. However, the state machine diagram is a purely static SVG — clicking on nodes or edges does nothing. The architecture describes an interactive validation state machine (PENDING → ORACLE TEST → SUCCESS/FAILURE → DIAGNOSIS → CORRECTABLE/FUNDAMENTAL → ADAPT/RULED OUT → RETRY). No node is clickable or highlights the current finding's state.

---

## 3. Placeholder Components

### 3.1 Shell.tsx — Four Sidebar Items Render `<Placeholder>`

**File:** `src/components/Shell.tsx` (nav item definitions)

The following are confirmed stubs:
- `benchmarks` view
- `skills` view
- `settings` view
- `reports` view

These are registered nav items that appear in the sidebar but show no content.

---

### 3.2 FindingsDashboard — VALIDATION and TRAJECTORY Tabs Return Stub Text

**File:** `src/components/FindingsDashboard.tsx`, line 135

```tsx
{tab !== "OVERVIEW" && tab !== "EVIDENCE" && tab !== "ATTACK PATH" && 
  <div ...>{tab} — CONTENT</div>}
```

The "VALIDATION" and "TRAJECTORY" sub-tabs of a finding's detail view render the string `"{tab} — CONTENT"` with no actual content. The architecture specifies that a finding's validation tab should show the E_ord progression and oracle test results, and the trajectory tab should show the attack graph path taken.

---

### 3.3 EnvironmentalLayer — Six Tabs Show "NOT YET IMPLEMENTED"

See **Section 11** (Environmental Layer Tab Stubs) for the detailed breakdown. In summary, 6 of 10 EL tabs (`AUTH STATES`, `PARAMETERS`, `CVE CANDIDATES`, `FINDINGS`, `EVIDENCE`, `FAILURES`) render `"{tab} — NOT YET IMPLEMENTED"`.

---

### 3.4 EvaluationScreen — Fully Static, Not Connected to Any Execution Entry

**File:** `src/components/EvaluationScreen.tsx`, entire file

The entire component is hardcoded to SQLI-001 evaluation data (execution #00483, 4.18s timing, E_ord 3). It cannot display evaluation data for any other execution. There is no prop, no selection, no parameterization. The `VALUE = 3` constant on line 2 is hardcoded. The component is effectively a static mockup screenshot, not an interactive view.

---

## 4. Data / State Inconsistencies

### 4.1 COST Mismatch Between Dashboard and CostDashboard

**File 1:** `src/components/Dashboard.tsx`, line 4  
Mission CVE-001 cost shown: `"$1.42"`

**File 2:** `src/components/MissionWorkspace.tsx`, line 181  
Mission cost in metrics strip: `"$1.42"` ✓ (matches)

**File 3:** `src/components/MissionWorkspace.tsx`, line 392  
Live state panel: `"$1.42"` ✓ (matches)

**File 4:** `src/components/CostDashboard.tsx`, line 37  
`const TOTAL = 0.2230;` → displayed as `$0.2230`

**Finding:** The Dashboard and MissionWorkspace header agree on `$1.42`, but the dedicated CostDashboard reports `$0.2230` — a 6× discrepancy. These are supposed to be the same mission (CVE-001).

---

### 4.2 VDG Node ID Inconsistency: SQLI-007 vs SQLI-001

**File 1:** `src/components/MissionWorkspace.tsx`, lines 41, 55, 59–66  
VDG node is `SQLI-007` throughout the overview panel and log stream.

**File 2:** `src/components/AttackGraphCanvas.tsx`, line 18 → `SQLI-001`

**File 3:** `src/components/TeamManagerDashboard.tsx`, line 10 → `SQLI-001`

**File 4:** `src/components/HumanEscalation.tsx`, line 15 → `SQLI-001`

**File 5:** `src/components/TrajectoryPage.tsx`, lines 10–25 → `SQLI-001`

**Finding:** The mockup uses both `SQLI-001` and `SQLI-007` interchangeably for the same SQL injection node. The live log in `MissionWorkspace.tsx` says `"SQLI-007 selected — UCB 0.824"` while every other component calls it `SQLI-001`.

---

### 4.3 Findings Count Mismatch Across Components

**File 1:** `src/components/Dashboard.tsx`, line 4: CVE-001 `findings: 3`

**File 2:** `src/components/MissionWorkspace.tsx`, line 180: FINDINGS metric `"03"` ✓

**File 3:** `src/components/FindingsDashboard.tsx`, lines 11–18: `DATA` array contains **7** findings.

**File 4:** `src/components/ValidationCenter.tsx`, lines 28–33: Metrics show `PENDING: 08`, `VALIDATED: 21`, `RULED OUT: 13`, `RETRIES: 17` — totals far exceeding 7.

**Finding:** The findings count is 3 in the mission header, 7 in FindingsDashboard, and 59+ implied by ValidationCenter metrics — completely inconsistent.

---

### 4.4 Elapsed Time Hardcoded Starting Value

**File:** `src/components/MissionWorkspace.tsx`, line 144

```tsx
const time = useElapsed(391); // 06:31 in seconds
```

The timer always starts at 391 seconds (6:31) on every page load. It should be initialized to `0` for a fresh mission or synchronized with actual mission data.

---

### 4.5 TeamManagerDashboard — KPI "TOTAL COST" Hardcoded and Inconsistent

**File:** `src/components/TeamManagerDashboard.tsx`, line 53

```tsx
<KPI label="TOTAL COST" value="$0.223" />
```

Hardcoded as `$0.223`. The Dashboard/MissionWorkspace shows `$1.42`. The value is not derived from any shared state.

---

### 4.6 Context Utilization Data Duplicated Between MemoryPage and CostDashboard

**File 1:** `src/components/MemoryPage.tsx`, `CTX_SPECS` array (lines 327–333)
**File 2:** `src/components/CostDashboard.tsx`, `CTX_ENTRIES` array (lines 21–27)

Both components define identical copies of context utilization data independently (not from a shared module). This is a maintainability defect — any future data change must be made in two places. The KPI totals (`"346K"`, `"3"`, `"184K"`) are also duplicated verbatim.

---

### 4.7 Specialist Roster Defined in Three Separate Files with Differing Data

| File | Count | Notes |
|---|---|---|
| `MissionWorkspace.tsx` SPECIALISTS (lines 45–51) | 5 | COMPLETED, COMPLETED, RUNNING, VALIDATING, IDLE |
| `Specialists.tsx` ALL array (lines 10–18) | 8 | Adds QUEUED, BLOCKED, FAILED statuses |
| `TeamManagerDashboard.tsx` SPECIALISTS (lines 21–27) | 5 | Different task strings than MissionWorkspace |

The Specialists page shows 8 agents including `S-06 (XSS SPECIALIST, QUEUED)`, `S-07 (NETWORK SPECIALIST, BLOCKED)`, `S-08 (EVAL AGENT, COMPLETED)` — none of which appear in the MissionWorkspace sidebar or TeamManagerDashboard.

---

### 4.8 VDGNodeDrawer Always Opens for SQLI-001 Regardless of Which Node Is Clicked

**File:** `src/components/AttackGraphCanvas.tsx`, lines 158–161

```tsx
onClick={() => setDrawerOpen(true)}
```

Every node click opens the same `VDGNodeDrawer` regardless of which node was clicked. The drawer hardcodes `SQLI-001` (line 10 in `VDGNodeDrawer.tsx`). Clicking on `AUTH-001`, `RECON-001`, `SSRF-005`, etc., all show the SQLI-001 drawer.

---

### 4.9 MissionWorkspace Overview — VDG Nodes List Only 4 Nodes, Counter Says 42

**File:** `src/components/MissionWorkspace.tsx`, lines 38–43 (VDG_NODES), line 178 (metric "42")

The Overview VDG panel renders exactly 4 nodes: `RECON-001`, `AUTH-001`, `SQLI-007`, `DB-ACCESS-002`. The mission metrics strip shows `VDG NODES: 42`. The `AttackGraphCanvas` has 12 nodes. Neither 4 nor 12 equals 42.

---

## 5. Terminology and Label Mismatches vs Architecture Spec

### 5.1 Oracle Label Conflates CVE-Bench with All Benchmarks

**File:** `src/components/NewMissionWizard.tsx`, line 755

```tsx
{ label: "VALIDATION", value: isOracle ? "ORACLE CONFIRMED (CVE-BENCH)" : "E_ord THRESHOLD (≥ 4)" }
```

When `isOracle` is `true`, the label hardcodes `"CVE-BENCH"` specifically. But the architecture supports three oracle backends: CVE-Bench, PrediQL, and MH-Bench. The label should reflect the selected benchmark but no benchmark selection exists in the wizard (see defect 1.2).

---

### 5.2 "VALIDATION AGENT" vs "VALID-AGENT" — Inconsistent Naming

- `Specialists.tsx` line 14: role `"VALIDATION AGENT"` (display label)
- `TeamManagerDashboard.tsx` line 25: `"VALID-AGENT"` (abbreviated)
- `CostDashboard.tsx` line 10: `"VALID-AGENT"`
- `MemoryPage.tsx` CTX_SPECS line 331: `"VALID-AGENT"`

`id: "S-04"` appears in both `Specialists.tsx` as `"VALIDATION AGENT"` and in `TeamManagerDashboard.tsx` as `"VALID-AGENT"`. Minor inconsistency in displayed labels for the same entity.

---

### 5.3 "TEAM-MGR" / "TEAM MANAGER" / "TEAM-MANAGER" — Three Forms

- `Dashboard.tsx` line 23: `agent: "TEAM-MGR"`
- `MissionWorkspace.tsx` line 54: `agent: "TEAM-MGR"`
- `CostDashboard.tsx` line 12: `role: "TEAM-MANAGER"`
- `TrajectoryPage.tsx` line 10: `agent: "TEAM-MANAGER"`
- `TeamManagerDashboard.tsx`: displays as `"TEAM MANAGER"` (space, no hyphen)

Three different forms of the same agent name with no canonical form enforced.

---

### 5.4 EORD_LABELS Duplicated Across Two Files

**File 1:** `src/components/VDGNodeDrawer.tsx`, line 1: `const EORD_LABELS = ["UNSEEN","NOTHING","WEAK","CLEAR","CONFIRMED","ORACLE"];`  
**File 2:** `src/components/EvaluationScreen.tsx`, line 1: identical definition

Both are consistent with the architecture spec, but the constant should be in a shared module to avoid divergence.

---

## 6. Missing Architecture Concepts Not Surfaced in UI

### 6.1 No Combined "World Model" View (EL → VDG Mapping)

**Architecture reference:** `architecture.md` §2 (Dual-Layer World Model: Environmental Layer + VDG)

While both EL and VDG are separately surfaced, there is no combined "World Model" view showing which EL facts substantiate which VDG node hypotheses. The `VDGNodeDrawer` shows "SOURCE ENVIRONMENT FACTS" for a specific node, but there is no reverse-lookup panel (from EL fact → which VDG nodes it influences).

---

### 6.2 UCB Exploration Constant `c` Not Exposed as Configurable

**Architecture reference:** `architecture.md` §2.2 (UCB Policy: `UCB(s) = Q(s,a) + c × √(ln N / n)`)  
**File:** `src/components/TeamManagerDashboard.tsx`, `UCBModal`, line 137: `const C = 0.4;`

The exploration constant `c = 0.4` is hardcoded. No UI surface allows the operator to adjust `c`. The `image-generation-prompt.md` mentions a settings panel for UCB parameters.

---

### 6.3 Three-Tier Memory — Tier Labels Absent from MemoryPage

**Architecture reference:** `architecture.md` §3 (Three-tier memory: Tier 1 = working context, Tier 2 = compacted episodic, Tier 3 = skill library)

**File:** `src/components/MemoryPage.tsx`

The MemoryPage tabs (`VULNERABILITY PATTERNS`, `STRATEGY BRANCHING`, `TECHNICAL ACTIONS`, `FAILURE MEMORY`, `SKILL LIBRARY`, `CONTEXT UTILIZATION`) map to the three tiers but are not labeled as tiers. The architecture's explicit "Tier 1 / Tier 2 / Tier 3" framing is absent. A user cannot tell which tab corresponds to which memory tier.

---

### 6.4 Skill Promotion Mechanism — Not Shown Anywhere

**Architecture reference:** `architecture.md` §3.3 (Skill Promotion: actions promoted from episodic to skill library after N successful applications)

No UI component shows skill promotion events, promotion thresholds, or promotion history. The `SKILL LIBRARY` tab in `MemoryPage.tsx` shows per-skill call counts but has no column or indicator for "promotion score" or promotion eligibility.

---

### 6.5 EPSS Prior Not Shown in UCB Breakdown Modal

**Architecture reference:** `architecture.md` §2.2 (UCB Prior = EPSS score in ONE-DAY mode)  
**File:** `src/components/VDGNodeDrawer.tsx`, line 33: `{ k: "EPSS PRIOR", v: "0.42" }` ✓ (shown in drawer)

The UCB Breakdown Modal in `TeamManagerDashboard.tsx` (lines 132–135) shows only Exploit + Explore terms. The EPSS prior used to initialize the Exploit term is absent from the modal formula display. The formula shown is incomplete.

---

### 6.6 Retry Cap — Not User-Configurable in Wizard

**Architecture reference:** `architecture.md` §2.4 (Retry cap: max retries per node before deprioritization)

`NewMissionWizard.tsx` Step 2 exposes only `maxRuntime`, `costCeiling`, `toolTimeout`. The retry cap (max retries per VDG node) is a key operational parameter described in the architecture but is absent from the wizard's Rules of Engagement step.

---

### 6.7 Parallel Branching — No Visual Indicator in Overview VDG

**Architecture reference:** `architecture.md` §2.5 (Parallel specialist scheduling for independent VDG nodes)

The Overview VDG panel in `MissionWorkspace.tsx` shows only a single vertical chain of 4 nodes, implying sequential execution. The `TrajectoryPage.tsx` correctly shows a `BRANCH` step (step 8, line 17), but the Overview VDG panel has no parallel structure visualization.

---

## 7. Component-Level Defects

### 7.1 AttackGraphCanvas — Node Positions Hardcoded, Cannot Scale or Reflow

**File:** `src/components/AttackGraphCanvas.tsx`, lines 14–27 (NODES with `cx`, `cy`), lines 55–57 (scaling functions)

Node positions are hardcoded as absolute logical coordinates in a 1000×560 canvas and scaled linearly. There is no force-directed layout, no pan/zoom, and no reflow. For larger VDGs (the spec describes 42 nodes), nodes will overlap or be cut off.

Additionally, the `lx`/`ly` functions scale to container dimensions but node width (`NODE_W = 158`) is not adjusted for the scaling factor, so nodes at the edges of a wide viewport may be partially clipped.

---

### 7.2 AttackGraphCanvas — Edge Drawing Uses Node Center-X, Not Actual Bottom-Center

**File:** `src/components/AttackGraphCanvas.tsx`, lines 140–148

```tsx
x1={lx(src.cx, w)} y1={ly(src.cy, h) + NODE_H / 2}
x2={lx(dst.cx, w)} y2={ly(dst.cy, h) - 4}
```

For horizontally-offset nodes (e.g., `SQLI-001` at `cx=110` vs `RECON-001` at `cx=500`), edges originate from the visual center of the source node but then connect to the center of the destination. Since nodes are not always vertically aligned, this creates visually incorrect diagonal edge routing that does not originate from the node's border.

---

### 7.3 VDGNodeDrawer — Completely Static, Not Parameterized by Node

**File:** `src/components/VDGNodeDrawer.tsx`, entire file

The drawer renders hardcoded data for `SQLI-001 / ELIGIBLE` regardless of which node triggered it. No props are accepted beyond `onClose`. Node ID, status, UCB score, prerequisites, and enables are all hardcoded strings.

---

### 7.4 EvaluationScreen — Hardcoded to Execution #00483 / SQLI-001

**File:** `src/components/EvaluationScreen.tsx`, lines 1–2, 21–31

`const VALUE = 3;` is hardcoded. All three text blocks describe SQLI-001 timing injection specifically. No parameterization by execution ID or node. This component cannot display evaluation data for any other execution.

---

### 7.5 NewMissionWizard — Step 5 Review Hardcodes "CVE-BENCH" in Validation Label

**File:** `src/components/NewMissionWizard.tsx`, line 755

```tsx
{ label: "VALIDATION", value: isOracle ? "ORACLE CONFIRMED (CVE-BENCH)" : "E_ord THRESHOLD (≥ 4)" }
```

Since benchmark suite selection is missing from the wizard (defect 1.2), this always displays `"CVE-BENCH"` even if PrediQL or MH-Bench would be the correct oracle.

---

### 7.6 MemoryPage — SkillLibrary Filter Does Not Search Description or Specialist Fields

**File:** `src/components/MemoryPage.tsx`, line 268

```tsx
const filtered = SKILLS.filter(s => 
  s.name.includes(filter.toLowerCase()) || s.cat.includes(filter.toUpperCase())
);
```

The filter does not search `s.desc`, `s.spec`, or parameter names. A user searching for "blind" or "INJECT-SPEC" would get no results even though matching skills exist.

---

### 7.7 MemoryPage — Strategy Branching Legend Color for "RUNNING" Contradicts Component Rendering

**File:** `src/components/MemoryPage.tsx`, lines 138–141

The legend assigns color `#E31B23` to `"RUNNING"`. However the `BranchTree` component (line 104) maps `"RUNNING"` to `#D29922` (same as `"IN PROGRESS"`):

```tsx
color: b.outcome === "SUCCESS" ? "#3FB950" : 
       b.outcome === "IN PROGRESS" || b.outcome === "RUNNING" ? "#D29922" : "#E31B23"
```

The legend and the card rendering disagree on the color for `"RUNNING"`.

---

### 7.8 ResearchLab — Ablation Impact Bar Logic Uses Incorrect Run-Selection Formula

**File:** `src/components/ResearchLab.tsx`, lines 83–96

```tsx
const withComp = ABLATION_RUNS.find(r => (r as any)[c.key] === true && 
  Object.values(r).filter(v => v === false).length === 0);
const withoutComp = ABLATION_RUNS.find(r => (r as any)[c.key] === false && 
  ABLATION_RUNS[0].score > (r.score + 0.05));
```

`withComp` only finds the "Full System" run (all components true), which is correct. But `withoutComp` uses an arbitrary threshold (`score + 0.05`) to find the ablation run, rather than finding the specific single-component-ablated run. This produces incorrect "impact" percentages — e.g., the `"compact"` component's `withoutComp` should be the "No Compaction" run (ABL-009) but the condition may match a different run depending on score proximity.

---

### 7.9 TrajectoryPage — "ALL" Filter Button Gets Dark Red Background Instead of Neutral

**File:** `src/components/TrajectoryPage.tsx`, line 63

```tsx
background: filter === t ? TYPE_C[t as TrajStep["type"]]?.bg ?? "#120608" : "transparent"
```

When `t === "ALL"`, `TYPE_C["ALL"]` is `undefined`, so the fallback `"#120608"` (dark red) is applied. The "ALL" active button should have a neutral active background, not the red used for DECISION-type steps.

---

### 7.10 CostDashboard — Zero-Cost TIMELINE Bars Render as 4px-Tall (Non-Zero)

**File:** `src/components/CostDashboard.tsx`, lines 125–131

```tsx
const h = maxCost > 0 ? Math.round((t.cost / maxCost) * 60) : 0;
return (
  <div ... style={{ height: `${h + 4}px`, background: t.cost > 0 ? "#E31B23" : "#1A1A1A" }} />
```

Every bar has a minimum height of `h + 4 = 4px`. Four of 10 TIMELINE entries have `cost: 0.0000`. They render as 4px-tall dark bars, creating a misleading bar chart where zero-cost events appear to have nonzero cost.

---

## 8. Navigation and Routing Defects

### 8.1 MissionWorkspace Overview VDG — Clicking Nodes Does Nothing

**File:** `src/components/MissionWorkspace.tsx`, Overview tab (lines 292–350)

The VDG node cards are `<div>` elements with no `onClick`. They appear interactive (animated pulse ring for ELIGIBLE nodes) but clicking does nothing. Clicking should navigate to the `attack-graph` sub-nav and highlight/select the clicked node.

---

### 8.2 Dashboard Mission Rows — missionId Not Passed to MissionWorkspace

**File:** `src/components/MissionWorkspace.tsx`, line 139

```tsx
export default function MissionWorkspace({ missionId = "CVE-001" })
```

When `onOpenMission` is called from the Dashboard and `App.tsx` navigates to the mission-workspace view, the selected `missionId` is not passed as a prop. The default `"CVE-001"` always applies. Clicking CVE-002, CVE-003, etc. opens a workspace that still shows CVE-001 data everywhere.

---

### 8.3 NewMissionWizard Step Indicator — Completed Steps Not Clickable

**File:** `src/components/NewMissionWizard.tsx`, lines 62–86

Step indicator circles are rendered as `<div>` elements, not `<button>`. A user cannot click a completed step (shown with `✓`) to jump back to it. Only the `← BACK` button navigates backward one step at a time.

---

## 9. Accessibility and Interaction Defects

### 9.1 All Inline Mouse Hover Handlers — Keyboard Navigation Has No Visual Feedback

**Files:** Virtually every interactive element in the entire codebase

**Pattern:**
```tsx
onMouseEnter={(e) => e.currentTarget.style.borderColor = "#E31B23"}
onMouseLeave={(e) => e.currentTarget.style.borderColor = "#333333"}
```

These inline style mutations only fire on mouse events. Keyboard-focused elements receive no visual focus indication. There are no `:focus` CSS styles and no `onFocus`/`onBlur` handlers. **All** interactive elements in the codebase share this defect.

---

### 9.2 NewMissionWizard Form Elements Have No `id` Attributes

**File:** `src/components/NewMissionWizard.tsx`

None of the `<input>`, `<textarea>`, or radio group buttons have `id` attributes. Labels are not associated with their form controls via `htmlFor`. This breaks screen-reader usability and browser autofill.

---

### 9.3 Modal Dialogs — No Focus Trap, No `aria-modal`, No ESC Key Handler

**Files:**
- `src/components/ValidationCenter.tsx`: `StateMachineModal` (line 154), finding detail modal (line 106)
- `src/components/FindingsDashboard.tsx`: evidence modal (line 139)
- `src/components/TeamManagerDashboard.tsx`: `UCBModal` (line 141)

All modals:
1. Do not trap focus inside the modal when open
2. Have no `aria-modal="true"` or `role="dialog"`
3. Have no `aria-label` or `aria-labelledby`
4. Do not close on `Escape` key press

---

### 9.4 EnvironmentalLayer — "REVEAL" Shows Cleartext Credentials Without Confirmation

**File:** `src/components/EnvironmentalLayer.tsx`, `CredentialsPanel`, lines 265–272

Clicking "REVEAL" immediately exposes cleartext credentials (e.g., `"password123"`, `"qwerty"`) with no confirmation step or audit log entry. For a security operations tool this is a significant UX/security practice defect.

---

### 9.5 HumanEscalation — "SEND RESPONSE" Not Actually Disabled When Empty

**File:** `src/components/HumanEscalation.tsx`, line 98

```tsx
<button ... disabled={!response.trim()} 
  style={{ cursor: response.trim() ? "pointer" : "not-allowed" }}>
  SEND RESPONSE
</button>
```

The `disabled` attribute is not set — only the `cursor` style changes. The button is still focusable and visually clickable when the textarea is empty; it just does nothing. No helper text explains to the user why the button is inactive.

---

## 10. Design Consistency Defects

### 10.1 "Escalation !" vs Other Sub-Nav Label Conventions

**File:** `src/components/MissionWorkspace.tsx`, line 81

```tsx
{ id: "escalation", label: "Escalation !" }
```

All other sub-nav labels use Title Case: `"Overview"`, `"Attack Graph"`, `"Environment"`, etc. `"Escalation !"` breaks the pattern with a trailing space and exclamation mark. The `findings` nav item (line 220–224) uses a red badge for alert state — this same pattern should be used for escalation.

---

### 10.2 MemoryPage — Component Is Nearly Unformatted / Minified

**File:** `src/components/MemoryPage.tsx`, entire file

The component is written as nearly single-line minified JSX. The formatter was not run on this file. All other components in the codebase are properly formatted.

---

### 10.3 EvaluationScreen E_ord Track — "ORACLE" Label Overflows Right Edge

**File:** `src/components/EvaluationScreen.tsx`, lines 61–63

```tsx
<div style={{ position: "absolute", bottom: 0, ..., 
  left: `${(i/5)*100}%`, transform: "translateX(-50%)" }}>
```

The tick label at index 5 (`"ORACLE"`) is positioned at `left: 100%` with `transform: translateX(-50%)`. This places 50% of the label text outside the container's right edge. The `VDGNodeDrawer.tsx` E_ord indicator uses `flex justify-between` to avoid this issue.

---

### 10.4 ResearchLab "FAILURE ANALYSIS" — Expanded Panel Has No Close Button

**File:** `src/components/ResearchLab.tsx`, `FailureAnalysis` function

Clicking a failure cluster expands its detail panel. The only way to collapse it is to click the cluster again — there is no `✕` close button on the expanded content. This toggle behavior is not discoverable.

---

### 10.5 AttackGraphCanvas — Status Filter Omits "DEPRIORITIZED"

**File:** `src/components/AttackGraphCanvas.tsx`, line 52

```tsx
const STATUS_FILTERS: FilterStatus[] = ["ALL","ELIGIBLE","IN_PROGRESS","EXPLOITED","BLOCKED","INFEASIBLE"];
```

`"DEPRIORITIZED"` is a valid node status (node `SSTI-006`, line 25 of `AttackGraphCanvas.tsx`) but it is absent from the filter array. A user cannot filter to show only deprioritized nodes.

---

## 11. Environmental Layer Tab Stubs

**File:** `src/components/EnvironmentalLayer.tsx`, lines 383–387

```tsx
{!["ENDPOINTS","SERVICES","HOSTS","CREDENTIALS"].includes(tab) && (
  <div ...>{tab} — NOT YET IMPLEMENTED</div>
)}
```

Six of ten tabs render a "NOT YET IMPLEMENTED" stub:

| Tab | Expected Content (per architecture.md) |
|---|---|
| `AUTH STATES` | Active authentication sessions, session tokens, cookie state per endpoint |
| `PARAMETERS` | All discovered request parameters with type, source, and injection eligibility |
| `CVE CANDIDATES` | VDG hypothesis candidates derived from EL facts — CVE class suggestions |
| `FINDINGS` | Cross-reference to confirmed/pending findings linked to EL evidence |
| `EVIDENCE` | Raw evidence artifacts — HTTP responses, timing deltas, oracle outputs |
| `FAILURES` | Failed specialist actions and their EL context at time of failure |

These represent core Environmental Layer data categories defined explicitly in the architecture spec. The 4 implemented tabs (`ENDPOINTS`, `SERVICES`, `HOSTS`, `CREDENTIALS`) are functional; the remaining 6 are stubs.

---

## Summary Statistics

| Category | Count |
|---|---|
| Missing pages / unimplemented views | 5 |
| Dead / non-functional buttons | 11 |
| Placeholder / stub components | 4 |
| Data/state inconsistencies | 9 |
| Terminology mismatches | 4 |
| Missing architecture concepts in UI | 7 |
| Component-level defects | 10 |
| Navigation / routing defects | 3 |
| Accessibility / interaction defects | 5 |
| Design consistency defects | 5 |
| Environmental Layer tab stubs | 6 |
| **Total findings** | **69** |

---

*Audit completed. No code was modified during this audit. All findings are documentation-only.*
