# RedGrid Mockup UI/UX — Structural Audit Against `architecture.md`

**Scope of this review:** feature completeness, information architecture, and navigation structure only. Aesthetics (color, spacing, type) are explicitly out of scope, per your request.

**Method:** I read the full `architecture.md` (29-paper-derived spec), then walked the actual Next.js source (`Shell.tsx`, `MissionSubNavPanel.tsx`, every `page.tsx`, and the fixture/mock data behind each feature module), and cross-checked the benchmark suite in §12.1 against the current published papers for CVE-Bench, PentestEval, PrediQL, and BountyBench.

---

## Bottom line

- **Your duplication fear is correct, but only in two specific places — not generally.** The two-sidebar structure itself is sound; the problem is two *specific* screens that are wired identically into both sidebars with no scope differentiation.
- **The UI cannot currently represent all the benchmarks you've committed to.** 6 of the 9 benchmark tiers in §12.1 have no screen, no data model, and no navigation entry at all. Only 3 of 9 exist, and even those 3 don't carry the fields the papers actually require you to report.
- **The parts of the architecture that are structural/mechanistic (VDG node lifecycle, mission wizard, four-layer pipeline) are mocked up well.** The parts that are *evaluation/statistical-methodology* (§12, §13) are the weakest link — which is the part that actually matters for a paper.

---

## 1. The duplication question — where it's real, where it isn't

You have two sidebars:
- **Outer/global sidebar** (`Shell.tsx`): OPERATIONS (Dashboard, Missions) · KNOWLEDGE (Memory, Skill Library, Failure Memory) · RESEARCH (Trajectory, Benchmarks, Ablations, Statistics, Failure Analysis, Reports) · SYSTEM (Cost & Usage, Audit Log, Settings)
- **Inner sidebar** (`MissionSubNavPanel.tsx`, shown only inside a mission workspace): Overview, Attack Graph, Environment, Specialists, Execution, Evaluation, Findings, Validation, Memory, Trajectory, Cost, Team Manager, Escalation

Three labels appear in both: **Memory**, **Trajectory**, **Cost**. I checked what each actually renders.

### ✅ Trajectory — not a duplication, this is the right pattern
- Global `Trajectory` → `TrajectoryBrowser`, which wraps the same step-list component but adds a **mission selector dropdown** and a "RESEARCH" context label — i.e., cross-mission trajectory browsing.
- In-mission `trajectory` tab → the bare `TrajectoryPage`, scoped implicitly to the current mission, no selector needed.
- Same underlying component, two different wrappers, each correct for its scope. This is exactly how "global browse" vs. "in-context view" should be differentiated. **Use this as the template for fixing the other two.**

### ❌ Memory — genuine duplication
`src/app/(app)/memory/page.tsx`, `.../memory/skill-library/page.tsx`, and `.../memory/failure-memory/page.tsx` all render the **same** `<MemoryPage />` component (just with a different `initialTab`). The mission workspace's `memory` sub-nav tab (`MissionWorkspaceView.tsx` line 74) renders the **exact same component, with no props at all**.

The problem isn't reuse — it's that `MemoryPage` hardcodes:
```tsx
<div>MISSION / CVE-001</div>
```
regardless of which entry point you came from. So:
- Reached from the global **KNOWLEDGE** group (outside any mission context) → still says "MISSION / CVE-001."
- Reached from inside mission **CVE-002**'s workspace → still says "MISSION / CVE-001."
- There is no `missionId` prop, no mission selector (unlike Trajectory), and no aggregate/cross-mission view at all.

This directly undercuts **C2 — Cross-Mission Memory with Verified Skill Promotion**, your second contribution claim. The architecture (§10.2) is explicit that the 3-tier memory and Skill Library are *cross-mission* stores — that's the entire point of the ablation in §13.1 (A2), which splits CVE-Bench into "seen technology" vs. "unseen technology" *across missions* to show memory transfer. A UI that can only ever show mission CVE-001's memory state has no way to visualize the thing the paper is trying to prove.

**Fix:** give the global Memory/Skill Library/Failure Memory entries the same treatment Trajectory got — a cross-mission aggregate view (or at minimum a mission selector) — and make the in-mission tab actually take a `missionId` and scope the FAISS tier contents to that mission's retrieved items.

### ❌ Cost & Usage — same problem, same fix needed
`CostDashboard` (used by both the global **SYSTEM → Cost & Usage** entry and the in-mission `cost` tab) also hardcodes `MISSION / CVE-001` and takes no scope parameter. Architecturally this is a bigger miss than Memory, because §10.3 explicitly elevates the Usage Tracker to "first-class" specifically *because* `cost_per_run / pass@1_rate` is a **cross-run, cross-benchmark comparative metric** (per BountyBench), and §12.2 requires cost to be reported "alongside every pass-rate number, per surface." The global Cost & Usage screen is the natural home for that per-surface, per-benchmark cost rollup — right now it's just the same single hardcoded mission screen as the in-mission tab.

### Not a duplication (for contrast)
- **Dashboard vs. Missions:** Dashboard is a KPI/activity summary; Missions is the full CRUD list. Standard, fine.
- **Memory / Skill Library / Failure Memory as three separate outer-nav entries:** these are three tabs of one component, entered at different `initialTab` values — that's a legitimate deep-linking pattern (same as Statistics/Ablations/Failure Analysis all being tabs of one `ResearchLab`). Not duplication, just worth knowing it's 3 nav rows for 1 screen if you were budgeting build effort per "page."

**Verdict on your fear:** you were right to be suspicious, but the issue isn't "we built the same feature twice" — it's "two components ignore which mission (or which cross-mission scope) they're being viewed from," which reads as duplication because the two entry points currently render identical, non-differentiated output.

---

## 2. VDG (Attack Layer) — the algorithmic core is well represented, with two gaps

The `VDGNodeDrawer` (the node detail panel) is genuinely good: it surfaces UCB score, path score, φ (promise), δ (difficulty), E_ord, EPSS prior, retry count, estimated cost, prerequisites (with satisfied/pending state), enables, attack intent, and source EL facts — that's essentially the full `VDGNode` schema from §7.1. This is the strongest part of the mockup.

Two real gaps:

**a) Node status enum doesn't match the paper.** Architecture §7.1 defines exactly six statuses: `ELIGIBLE, IN_PROGRESS, EXPLOITED, INFEASIBLE, DEPRIORITIZED, BLOCKED`. The UI's `VDG_NODE_STATUS` (`domain-types.ts`) has: `COMPLETED, EXPLOITED, ELIGIBLE, IN_PROGRESS, DEPENDENT, INFEASIBLE`.
- `COMPLETED` and `DEPENDENT` aren't paper concepts — they read as UI-invented synonyms (`DEPENDENT` ≈ "not yet eligible," `COMPLETED` overlaps with `EXPLOITED`).
- **`BLOCKED` is missing entirely**, and `DEPRIORITIZED` is missing entirely. `BLOCKED` isn't cosmetic — it's the exact mechanism **Ablation A4 (§13.1)** is built to test ("BLOCKED status propagated; frontier recomputed" vs. "INFEASIBLE nodes marked but dependents remain ELIGIBLE"). If the UI has no `BLOCKED` state, there's no way to visually distinguish the two A4 conditions on the attack graph — the ablation this screen exists to support can't be shown on it.

**b) The metrics panel's non-headline numbers are static, not data-bound.** In `VDGNodeDrawerSections.tsx`, `PATH SCORE`, `PROMISE φ`, `DIFFICULTY δ`, `EPSS PRIOR`, and `RETRY` are all literal hardcoded strings (`"0.612"`, `"0.81"`, `"0.32"`, `"0.42"`, `"1 / 3"`) — they show the same values no matter which node you click. Only UCB and E_ord actually read from the node object. I know this is expected for a no-backend mockup — flagging it not as a defect, but so it's not mistaken for "the schema is wired" during any stakeholder walkthrough; right now clicking through different nodes will visibly *not* change most of the numbers, which can look like a bug rather than a known mock limitation.

---

## 3. Specialists vs. the paper's Layer 3 / Layer 4 split

Architecture §8, §9 name six Layer-3 Specialists (Recon, SQLi, XSS, GraphQL, Auth/Session, Lateral-Movement) with distinct methodologies (e.g., XSS's 5-phase AWE pipeline, SQLi's baseline→SLEEP→bit-extraction FSM), and keeps the **Validation Agent in Layer 4**, structurally separate from Specialists — that separation is a named point in the "prior work gap table" (§11) and part of why the dual-layer/four-layer design is a contribution at all.

The mission workspace's `specialists` fixture (`workspaceMockData.ts`) lists: Recon, Auth, **Injection**, **Validation Agent**, **Logic**. Two issues:
- **SQLi and XSS are collapsed into one generic "Injection Specialist,"** and GraphQL and Lateral-Movement Specialists don't appear in the roster at all. If the mission being demoed is a web mission, that's arguably fine to omit GraphQL/Lateral — but SQLi and XSS are both explicitly-scoped, separately-described specialists in §9.2/§9.3, and merging them loses the ability to show, e.g., that XSS is mid-pipeline-phase 3 of 5 while SQLi is doing bit-extraction — different state machines, same tile.
- **The Validation Agent is listed as a "Specialist"** alongside Layer-3 roles, in the same table, with the same fields (`context`, `evidence`, `skills`). That flattens the Layer 3/Layer 4 boundary the architecture treats as load-bearing. It doesn't need its own screen, but it probably shouldn't sit in the same list/table as the Layer-3 roster without a visual break — right now nothing in the UI distinguishes "this row is Layer 3" from "this row is Layer 4."

The **`team-manager`** sub-nav tab does exist separately, which is good — Layer 2 has its own home. Worth applying the same separation logic to Layer 4.

---

## 4. Settings — UCB hyperparameters are under-exposed relative to a named risk

`VDGSettings.tsx` exposes exactly three knobs: UCB exploration constant `C_expl`, E_ord dispatch threshold, retry cap.

The actual UCB formula (§7.2) has **seven** tunable weights beyond `C_expl`: `α` (promise), `β` (difficulty), `γ` (E_ord), `κ` (context-load penalty), `λ` (EPSS prior weight), `μ` (cost-awareness penalty) — plus the edge-inference confidence threshold from §7.3 (`PREREQUISITE_THRESHOLD`, default 0.7), which gates whether an LLM-inferred dependency edge is accepted at all.

This matters because **§15.1 names edge-inference accuracy as the single highest pre-evaluation risk** ("if precision < 50%, the dependency-edge contribution weakens significantly"), and **§15.7 explicitly lists "UCB has 7 tunable hyperparameters needing sensitivity reporting" as a tracked threat to validity**. A settings surface that exposes 3 of ~10 relevant knobs (and none of the ones tied to your two most-cited named risks) doesn't give you anywhere to demonstrate — even in mockup form — how a sensitivity sweep or the edge-precision pilot study would be configured or reported. If a reviewer or advisor asks "where would I tune α vs. γ," today's answer is "you can't, in this UI."

There's also no visible surface anywhere for **A8 (VAPT Protocol Prompt selection: OWASP Testing Guide vs. PTES vs. RedGrid default)** — a named secondary ablation in §13.2 — which would naturally live in Settings alongside the other methodology knobs.

---

## 5. Ablation Lab vs. the required ablation design (§13)

`AblationLab` currently models **one flat factorial**: four boolean flags (`UCB`, `E_ord gating`, `Context Compaction`, `Parallel Branching`) toggled on/off across ~7 named runs, each producing a single score/cost/time.

Compared against §13.1's **required** ablations:

| Required ablation | What §13 specifies | What the UI has |
|---|---|---|
| **A1 — VDG Decomposition** (the *critical* one — "isolates C1") | 4 **nested** conditions: (a) Flat UCB, (b) UCB + dependency edges, (c) Stacked/post-filtered, (d) Full VDG. (c) vs (d) is explicitly called out as *the* discriminating comparison for whether the whole contribution holds. | A single "No UCB (Random)" toggle. No dependency-edge flag, no distinction between pre-filtering eligibility (b) and post-filtering (c), no way to run the one comparison the paper calls load-bearing. |
| **A2 — Memory** | 4 conditions (none / episodic-only / 3-tier-only / full), measured on a **seen-technology vs. unseen-technology** CVE-Bench split | Not present. No memory-ablation flag anywhere in Ablation Lab; the "Memory" nav item is a browsing screen, not an ablation condition. |
| **A3 — Validation Diagnosis-Adapt-Cap** | Single-attempt vs. full diagnose/adapt/retry-≤3 loop | Not present. |
| **A4 — VDG Failure Propagation** | With/without BLOCKED-status propagation | Not present (and can't be, since `BLOCKED` isn't a node status — see §2 above). |
| A5–A8 (secondary) | Path scoring isolation, E_ord vs. raw confidence, early stopping, protocol-prompt variant | Not present. |

What *is* on screen — Compaction and a UCB on/off toggle — maps loosely to A1(a-ish) and A6-ish concepts, but "Parallel Branching" as a flag doesn't correspond to anything named in the architecture at all (it may be a leftover from an earlier design, or a hallucinated feature — worth confirming with whoever built the mockup).

**Net effect:** if a reviewer opened Ablation Lab expecting to see the ablation matrix your own methodology section (§13) commits to, they'd find a different, smaller, and only loosely-related set of toggles. This is the biggest fidelity gap in the mockup relative to the architecture doc — bigger than the missing benchmarks, because it's the part that validates your primary contribution claim (C1).

---

## 6. Statistical Evaluation vs. §12.3's methodology

`StatisticalEval`'s table reports: mean solve rate, median cost/task, mean attempts, Success@1, Success@3, partial rate, fail rate, and a p-value column, across 4 named conditions (Full / No UCB / No E_ord / Baseline).

Architecture §12.3 requires:
- **95% Wilson score confidence intervals** on all binary outcomes — not present (only a bare mean and p-value; no CI at all).
- **McNemar's test**, specifically because it's the correct test for **paired** binary outcomes (same CVE under different conditions) — the current p-value column doesn't state which test produced it, and there's no visual pairing of same-CVE outcomes across conditions.
- **pass@1 / pass@5** as the named metric pair — the UI has **Success@1 / Success@3**, a different (non-standard, and not what any of your source papers report) k.
- **Compute normalization at 50 API calls per CVE**, with orchestration overhead reported separately — no such annotation or toggle anywhere.
- **Effect sizes emphasized over p-values** — the table shows raw scores and p-values, no explicit "Δ percentage points" column.

This is a smaller gap than the Ablation Lab one, but the same category of problem: the screen exists and looks the part, but the specific statistical apparatus §12.3 commits you to (Wilson CI, McNemar's, compute-normalized reporting) isn't represented, so it can't yet be used to demonstrate the paper will actually meet its own stated rigor bar.

---

## 7. Benchmarks Hub vs. §12.1's tiered suite — the largest gap

I checked each benchmark's actual reporting requirements against the current UI schema.

**Current state:** `BenchmarksHub`'s data model (`Bench` interface, `benchmarksMockData.ts`) has a `type` field typed as a closed union: `"CVE-BENCH" | "PREDIQL" | "MHBENCH"` — only three benchmark families can exist in this schema at all, each represented by the same flat shape: `tasks / solved / partial / score / avgCost / avgTime`.

**Your committed suite (§12.1) has 9 tiers.** Coverage:

| Tier | Benchmark | In UI? | What's actually required (verified against the papers) |
|---|---|---|---|
| 0 | Fang et al. 15-vuln sandbox | ❌ absent | Fast CI-regression floor (GPT-4's 73.3% pass@5); needs to track the 4 named GPT-4 failure classes (AuthBypass, JS attacks, Hard SQLi, XSS+CSRF) specifically, not just an aggregate score |
| 0b | HPTSA 14-CVE zero-day | ❌ absent | Floor comparison at 42% pass@5 / 18% pass@1 (confirmed via HPTSA paper) |
| 1 | PentestEval (12 scenarios / 346 tasks) | ❌ absent | **Six-stage breakdown is the entire point of this benchmark**: IC, WG, WF, ADM, EG, ER, each with its own metric (Jaccard, Spearman's ρ, success rate — confirmed via the PentestEval paper). Your primary-metric gate in §12.1 is "PentestEval ADM score ≥ 0.50" — a single stage's score, not a benchmark-level scalar. The current `Bench` shape has no field that could hold a 6-stage breakdown. |
| 2 | **CVE-Bench (primary metric)** | ✅ present | Present and reasonably shaped (task list with per-CVE solved/partial/cost/time), but missing: pass@1 **vs.** pass@5 as separate columns, one-day **vs.** zero-day split, and the **8-attack-type oracle** breakdown (§12.2) — task categories currently shown (SQLi, AuthBypass, RCE, IDOR, XSS, SSRF, XXE, PathTrv) look like a reasonable stand-in but aren't labeled as "the 8-attack-type oracle," and there's no one-day/zero-day toggle anywhere in Benchmarks Hub (it exists only in the mission wizard, disconnected from benchmark reporting). |
| 2b | MAPTA XBOW (104) / HackWorld (36) / NYU CTF Bench / Cybench (40) | ❌ absent | §12.1 explicitly requires these "reported per-benchmark **and pooled**" — 4 more benchmark identities and a pooling view, none present |
| 3 | PrediQL 6-API suite (GraphQL) | ❌ absent (mock data label exists, wrong shape) | The fixture has entries *labeled* "PrediQL Reasoning" / "PrediQL v2 Beta," but `type` is `"PREDIQL"` using the same `tasks/solved/score` shape as CVE-Bench. Real PrediQL reporting is schema-coverage % and vulnerability count **against three named baselines (ZAP / Burp Suite / EvoMaster / GraphQLer)** — a comparative, not solo, metric. §12.2 also mandates this is reported on a **separate axis, never averaged into web pass-rate** — nothing in the UI enforces or even visually signals that separation; it sits in the same table, same columns, as CVE-Bench. |
| 4 | Incalmo MHBench (40 environments) | ❌ absent (same issue as PrediQL) | Labeled "MH-Bench Multi-Host" but same generic shape. Real metric is host-compromise / credential-theft success rate against a floor of 37/40 (Incalmo's own number) — not "tasks solved." Also needs the same separate-axis treatment as GraphQL. |
| 5 | BountyBench (25 production systems) | ❌ absent | Confirmed via the BountyBench paper: this benchmark's task shape is fundamentally different — **Detect / Exploit / Patch** as three distinct scored task types, plus a **dollar-value axis** and cost-per-exploit. RedGrid only claims the Exploit side (per your scoping in §2), but even so, "dollar value" as a first-class metric has no field anywhere in the current schema — `avgCost` shows model spend, not bounty dollar-value, which are two different numbers. |
| 6 | PentestGPT 13-machine + HTB Season 8 (5 machines) | ❌ absent | Live-competition, human-solved-ground-truth validation — no equivalent screen or task type exists. |

**So: 3 of 9 tiers exist, and of those 3, only CVE-Bench is close to correctly shaped — PrediQL and MHBench are present in name only, using CVE-Bench's schema, which actively misrepresents what those two benchmarks report** (a schema-coverage percentage and a host-compromise rate are not "tasks solved out of N" in the same sense a CVE-Bench pass/fail is).

**Direct answer to "are you sure our UI/UX can perform all the benchmarks we've decided to use":** No. As built, the Benchmarks Hub's data model can only represent one benchmark family (CVE-Bench's shape) and is currently reusing that shape for two benchmarks whose real reporting requirements are structurally different (GraphQL schema-coverage, multi-host compromise-rate), while six of nine committed tiers — including Tier 1 (PentestEval, which gates your own primary-metric threshold) and Tier 5 (BountyBench, your hardest tier) — have no representation at all.

---

## 8. What I'd prioritize, in order

1. **Fix Memory and Cost & Usage scope-binding** (§1) — smallest fix, biggest trust cost if left as-is, since it's the exact thing you already suspected.
2. **Redesign the `Bench` data model to a discriminated union, one variant per benchmark family**, so PentestEval's 6-stage breakdown, PrediQL's schema-coverage-vs-baseline, MHBench's compromise-rate, and BountyBench's Detect/Exploit/Patch/dollar-value can each have their own correctly-shaped screen instead of being forced into CVE-Bench's shape (or simply absent).
3. **Rebuild Ablation Lab around the actual A1–A4 (and ideally A5–A8) conditions** from §13 — this is the screen most directly tied to whether your primary contribution claim (C1) can be demonstrated at all.
4. **Add `BLOCKED` and `DEPRIORITIZED` to the VDG node status enum** — cheap fix, unlocks A4 visualization.
5. **Add the missing UCB weight fields to Settings** (α, β, γ, κ, λ, μ, edge-confidence threshold) — cheap, directly answers your two named top risks (§15.1, §15.7).
6. **Add Wilson CI / McNemar's labeling and a compute-normalization indicator to Statistical Evaluation.**

---

*Sources consulted for benchmark verification: CVE-Bench (arXiv 2503.17332, ICML 2025), PentestEval (arXiv 2512.14233), BountyBench (arXiv 2505.15216), HPTSA zero-day results (via xOffense survey, arXiv 2509.13021).*
