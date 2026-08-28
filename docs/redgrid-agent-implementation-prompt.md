# Prompt: RedGrid Frontend — Architecture-Fidelity Implementation Pass

Paste this whole document to the coding agent as its task brief.

---

## 0. Role, constraints, and definition of done

You are implementing a set of **structural and data-model fixes** to the RedGrid mockup frontend (Next.js App Router, TypeScript, Tailwind, no backend). RedGrid is the UI for a penetration-testing research agent described in `architecture.md` (a 29-paper-derived systems architecture with three research contribution claims, C1/C2/C3, and a formal benchmarking + ablation methodology in §12–13).

This is a **mockup with no business logic and no backend**. Every change you make must stay a mockup: extend fixture data (`data/fixtures/*.ts`), repository stubs (`data/*Repository.ts`), types (`domain-types.ts`, per-feature types), and components — never wire up a real API, database, or LLM call. Where a real system would compute something, hardcode a plausible static value in the fixture, exactly like the existing code already does (e.g. `avgCost: "$0.184"`).

**Hard constraint — visual theme must not change.** Do not introduce new colors, spacing scales, font sizes, border styles, or component patterns. Every new screen, table, tab, or panel must be built by **copying the nearest existing analogous component** and adapting its data, not by inventing new visual language. Concretely:
- Reuse the existing CSS variable palette (`var(--color-hex-...)`), the existing tab-strip pattern (see `MemoryPage.tsx` for the tab-with-tier-badge pattern), the existing table pattern (see `BenchmarkTable.tsx` / `AblationLabTable.tsx`), the existing metrics-grid pattern (see `VDGNodeDrawerSections.tsx`'s 2-column stat grid), and the existing section/divider primitives (`Section.tsx`, `Sep.tsx`, `Divider.tsx`, `SectionHead.tsx`).
- New nav items must match the existing `NAV_GROUPS` / `NAV_ICONS` pattern in `Shell.tsx` exactly (same icon glyph style, same uppercase tracking, same group-label treatment).
- If you need a new icon glyph, pick from the same Unicode geometric-symbol set already in use (▪ ◈ ⊞ ⊟ ⊠ ⤴ ≡ ∿ ∑ ⊗ ⊕ $ ≣ ⚙ ◉ ◆) rather than introducing a new visual family (no emoji, no new icon library).

**Definition of done:** after your changes, every benchmark tier, every ablation condition, every VDG node status, and every UCB hyperparameter named in `architecture.md` has a corresponding, correctly-shaped, correctly-scoped screen or field in the mockup — using only fixture/mock data, in the existing visual language. Nothing from the architecture doc's evaluation, ablation, memory, or scoring surfaces should be left with no UI representation.

Work through the sections below in order. Each section names the exact files to touch, the exact problem (with architecture.md section references), and the exact fix. Do not skip a section because it seems minor — the acceptance criterion at the end covers all of them.

---

## 1. Fix scope-binding on Memory and Cost & Usage (highest priority — this is the one thing already flagged as visibly broken)

**Problem.** `src/features/memory/components/MemoryPage.tsx` and `src/features/cost/components/CostDashboard.tsx` both hardcode the literal string `MISSION / CVE-001` in their header, and neither component accepts a scope prop. They are used in two places each:
- Global nav (`src/app/(app)/memory/page.tsx`, `.../memory/skill-library/page.tsx`, `.../memory/failure-memory/page.tsx`, `.../cost-usage/page.tsx`) — reached from outside any mission context.
- Mission workspace sub-nav (`MissionWorkspaceView.tsx`, `subNav === "memory"` and `subNav === "cost"`) — reached from inside a specific mission.

Result: both screens show identical, mission-CVE-001-labeled content regardless of entry point. This directly undercuts **C2 (Cross-Mission Memory)**, whose entire premise (§10.2) is that memory and skill promotion operate *across* missions — and undercuts §10.3's requirement that cost be reportable per-run and per-surface, not just per-mission.

**Reference pattern — copy this, don't invent a new one.** `src/features/trajectory/components/TrajectoryBrowser.tsx` already solves this correctly: it wraps the mission-scoped `TrajectoryPage` component, adds a `MISSION_OPTIONS` dropdown (`useState`-backed, `["CVE-001", "CVE-002", "CVE-003", "BENCH-014"]`), and swaps the header label to `RESEARCH` instead of `MISSION / <id>`. The in-mission sub-nav tab renders the bare `TrajectoryPage` with no selector, since the mission is already implied by the workspace you're in.

**Fix — Memory:**
1. Add a `missionId?: string` prop to `MemoryPage`. When provided, header reads `MISSION / {missionId}`; when absent, header reads `KNOWLEDGE` (matching the outer nav group label) and shows a cross-mission aggregate instead (see step 3).
2. In `MissionWorkspaceView.tsx`, pass the current mission's id: `<MemoryPage missionId={missionId} />`.
3. Create `src/features/memory/components/MemoryBrowser.tsx`, modeled directly on `TrajectoryBrowser.tsx`: same `MISSION_OPTIONS` array (reuse it — extract it to a shared constant, e.g. `src/features/missions/data/fixtures/missionOptions.ts`, and import it in both Trajectory and Memory, to avoid two independent copies of the same list drifting apart), same dropdown pattern, wraps `<MemoryPage missionId={selectedMission} />`. Wire the three global entry points (`memory/page.tsx`, `memory/skill-library/page.tsx`, `memory/failure-memory/page.tsx`) to render `MemoryBrowser` instead of `MemoryPage` directly, passing `initialTab` through.
4. Additionally, since Skill Library and 3-tier memory are explicitly *cross-mission stores* (not per-mission data) per §10.2 and §10.5, add one more tab-equivalent: when `MemoryBrowser`'s mission selector is set to a new "ALL MISSIONS" option (add this as the first entry, above the four mission IDs), `VulnPatterns`, `SkillLibrary`, and `TechnicalActions` fixture data should present pooled/aggregate rows (extend the mock data arrays in `src/features/memory/data/mockData.ts` with a `missionScope: string[]` field per entry — e.g. a vuln-pattern learned from CVE-001 and reused on CVE-003 has `missionScope: ["CVE-001", "CVE-003"]` — and filter/aggregate by it in the UI). This is the piece of UI that actually demonstrates C2's cross-mission transfer claim; without it, Skill Library is indistinguishable from a single mission's local notes.

**Fix — Cost & Usage:**
1. Same pattern: add `missionId?: string` to `CostDashboard`. In-mission tab passes it; global entry does not.
2. Create `src/features/cost/components/CostBrowser.tsx`, same mission-selector wrapper as `MemoryBrowser`/`TrajectoryBrowser`, header label `SYSTEM` when no mission selected.
3. When no single mission is selected ("ALL MISSIONS"), the cost view must aggregate **per benchmark surface**, not per mission — this is what §12.2 actually asks for ("cost reporting: `cost_per_run / pass@1_rate` reported alongside every pass-rate number, **per surface**"). Add a `surface: "WEB" | "GRAPHQL" | "MULTI-HOST"` field to the cost fixture data (`src/features/cost/data/fixtures/costMockData.ts`) and add a per-surface cost-per-exploit rollup view (new tab in the existing `CostTab` union: `"COST & USAGE" | "MODEL BREAKDOWN" | "CONTEXT STATE" | "PER-SURFACE ROLLUP"`), reusing the existing table pattern from `CostUsage.tsx`.
4. Wire `src/app/(app)/cost-usage/page.tsx` to render `CostBrowser` instead of `CostDashboard` directly.

---

## 2. Rebuild the Benchmarks data model as a discriminated union — one shape per benchmark tier (largest gap; do this section fully)

**Problem.** `src/features/benchmarks/data/fixtures/benchmarksMockData.ts` defines:
```ts
export interface Bench {
    id: string; name: string;
    type: "CVE-BENCH" | "PREDIQL" | "MHBENCH";
    tasks: number; solved: number; partial: number;
    score: number; avgCost: string; avgTime: string;
    date: string; status: BenchmarkStatus;
}
```
This one flat shape is reused for every benchmark, and only 3 of the architecture's 9 tiers (§12.1) exist at all. This is the single biggest fidelity gap in the mockup: PentestEval (which gates your own primary-metric target, "ADM score ≥ 0.50") and BountyBench (your hardest tier) have zero representation, and the two tiers beyond CVE-Bench that *do* exist (PrediQL, MHBench) are using CVE-Bench's shape, which misrepresents what those benchmarks actually report.

**Fix — new type model.** Replace the single `Bench` interface with a discriminated union, one variant per tier, in `src/features/benchmarks/data/fixtures/benchmarksMockData.ts`. Keep every variant's shared fields (`id`, `name`, `date`, `status`, `avgCost`, `avgTime`) so existing list/table components can still render a common summary row; add tier-specific fields as an optional `detail` object matched on `tier`.

```ts
export type BenchTier =
    | "TIER0_SANDBOX"      // Fang et al. 15-vuln suite
    | "TIER0B_HPTSA"       // HPTSA 14-CVE zero-day
    | "TIER1_PENTESTEVAL"  // 12 scenarios / 346 tasks
    | "TIER2_CVEBENCH"     // primary metric
    | "TIER2B_CROSSBENCH"  // MAPTA XBOW / HackWorld / NYU CTF / Cybench
    | "TIER3_PREDIQL"      // GraphQL
    | "TIER4_MHBENCH"      // Incalmo multi-host
    | "TIER5_BOUNTYBENCH"  // production, dollar-value
    | "TIER6_LIVECOMP";    // PentestGPT machines + HTB Season 8

export interface BenchBase {
    id: string; name: string; tier: BenchTier;
    date: string; status: BenchmarkStatus;
    avgCost: string; avgTime: string;
}

export interface Tier0SandboxDetail {
    passAt5FloorPct: number;          // GPT-4's 73.3% floor, from Fang et al.
    failureClassesClosed: string[];   // subset of ["AuthBypass","JS attacks","Hard SQLi","XSS+CSRF"]
    failureClassesOpen: string[];
}
export interface Tier0bHptsaDetail {
    passAt5FloorPct: number;  // 42%
    passAt1FloorPct: number;  // 18%
}
export interface Tier1PentestEvalDetail {
    stages: {
        stage: "IC" | "WG" | "WF" | "ADM" | "EG" | "ER";
        metric: "JACCARD" | "SPEARMAN_RHO" | "SUCCESS_RATE";
        score: number;
    }[];
    admGate: number; // your target: 0.50
    smpBaselineAdm: number; // 0.31
    gtAdmUpperBound: number; // 0.67
}
export interface Tier2CveBenchDetail {
    passAt1ZeroDay: number; passAt5ZeroDay: number;
    passAt1OneDay: number; passAt5OneDay: number;
    attackTypeOracle: { type: string; pass: number; total: number }[]; // 8 entries
    sourceCodeAvailable: { pass: number; total: number };
    sourceCodeUnavailable: { pass: number; total: number };
    detectionRate: number; exploitationRate: number; // reported separately, per Fang et al.
}
export interface Tier2bCrossBenchDetail {
    perBenchmark: { name: "MAPTA XBOW" | "HackWorld" | "NYU CTF Bench" | "Cybench"; solved: number; total: number }[];
    pooled: { solved: number; total: number };
}
export interface Tier3PrediQLDetail {
    apis: number; // 6
    schemaCoveragePct: number;
    vulnCount: number;
    baselineComparison: { name: "ZAP" | "Burp Suite" | "EvoMaster" | "GraphQLer"; schemaCoveragePct: number; vulnCount: number }[];
}
export interface Tier4MHBenchDetail {
    environments: number; // 40
    hostCompromiseSuccess: number;
    credentialTheftSuccess: number;
    incalmoFloor: string; // "37/40"
}
export interface Tier5BountyBenchDetail {
    systems: number; // 25
    detect: { pass: number; total: number };
    exploit: { pass: number; total: number };
    dollarValueCaptured: string; // e.g. "$41,250"
    costPerExploit: string;
}
export interface Tier6LiveCompDetail {
    machines: number; // 18
    pentestGptMachinesSolved: number; // of 13
    htbSeason8Solved: number; // of 5
    humanSolvedGroundTruthMatch: number; // pct
}
```

Add one fixture array per tier (`SANDBOX_RUNS`, `HPTSA_RUNS`, `PENTESTEVAL_RUNS`, `CVEBENCH_RUNS`, `CROSSBENCH_RUNS`, `PREDIQL_RUNS`, `MHBENCH_RUNS`, `BOUNTYBENCH_RUNS`, `LIVECOMP_RUNS`), each with 2–4 realistic mock entries in the existing style (see current `BENCHMARKS` array for tone/formatting — keep `avgCost`/`avgTime` as `"$0.184"` / `"18m"` style strings, keep `date` as `"Today"` / `"2d ago"` style relative strings).

**Fix — UI.** In `BenchmarksHub.tsx` / `BenchmarkList.tsx` / `BenchmarkTable.tsx`:
1. Group the list by tier (use the existing `BenchmarkCategoriesTab.tsx` — it already exists as a categorization concept, extend its categories to the 9 tiers instead of whatever it currently groups by).
2. `BenchmarkDetail.tsx` must branch on `tier` and render tier-appropriate content:
   - **PentestEval detail** → a 6-row stage table (IC/WG/WF/ADM/EG/ER) with metric type and score per row, plus the ADM gate/baseline/upper-bound comparison as a 3-value strip (reuse the `VDGNodeDrawerMetrics` 2-column stat-grid pattern for this).
   - **CVE-Bench detail** → extend the existing task table with pass@1/pass@5 columns split by one-day/zero-day (4 numbers instead of the current single `score`), an 8-row attack-type-oracle breakdown table, and a detection-vs-exploitation two-number strip.
   - **Tier 2b (cross-benchmark)** → a per-benchmark table (4 rows: MAPTA XBOW, HackWorld, NYU CTF Bench, Cybench) plus a "POOLED" summary row visually distinguished (e.g. bold border-top, matching how totals rows are styled elsewhere in the app if such a pattern exists — otherwise use the existing red-accent-stripe convention from `Shell.tsx` to mark it as a rollup).
   - **PrediQL detail** → schema-coverage % and vuln-count for RedGrid plus a 4-row baseline-comparison table (ZAP/Burp Suite/EvoMaster/GraphQLer). Label this screen clearly as **"GraphQL — reported on a separate axis, not pooled with web pass-rate"** (a literal on-screen label, small caps, using the existing `text-[8px] tracking-[0.22em] text-[var(--color-hex-666666)]` header-eyebrow style already used for section labels like "MISSION / CVE-001") — this on-screen disclosure is what enforces §12.2's "never averaged into web pass-rate numbers" rule at the UI level.
   - **MHBench detail** → same separate-axis label treatment, host-compromise and credential-theft rates, floor comparison (37/40).
   - **BountyBench detail** → Detect/Exploit two-column pass rates (Patch excluded — RedGrid doesn't attempt defense, only attack, per §2.1's scoping rule; do not add a Patch column), dollar-value-captured figure, cost-per-exploit figure as a headline stat (reuse `MetricTile` component).
   - **Tier 6 (live competition)** → machines-solved count against the 13+5 split, with a "human-solved ground truth" comparison stat.
3. Add nav entries or filters so all 9 tiers are reachable from `BenchmarksHub` — either as a tier filter chip row (reuse `FilterChip.tsx`, already used elsewhere) above the existing benchmark list, or as 9 rows in the list itself grouped by category tab. Either is fine as long as every tier is one click away from the Benchmarks screen.

---

## 3. Rebuild Ablation Lab around the architecture's actual A1–A8 design (second-highest priority — this validates your primary contribution claim)

**Problem.** `src/features/research/data/fixtures/researchMockData.ts` currently models one flat 4-boolean-flag factorial (`ucb`, `eord`, `compact`, `parallel`) across ~7 named runs. This doesn't match §13's required ablation matrix, and specifically has no way to represent **A1**, which the architecture calls the critical ablation — its four conditions are *nested*, not independent flags, and the (c)-vs-(d) comparison is explicitly the discriminating test for whether your dependency-graph contribution (C1) has any value at all. "Parallel Branching" as a flag doesn't correspond to anything named in `architecture.md` — remove it (or, if there's a reason to keep it, confirm with the requester before keeping; default to removing it since it isn't specified anywhere in the architecture doc).

**Fix — data model.** In `researchMockData.ts`, replace the flat `AblationRun`/`ABLATION_FLAG_KEYS` model with one block per required ablation, each block modeling its own condition set exactly as specified in §13.1/§13.2:

```ts
export interface AblationCondition {
    id: string;              // e.g. "A1-a", "A1-b", "A1-c", "A1-d"
    label: string;           // e.g. "(a) Flat UCB"
    description: string;     // one-line, from the architecture's condition table
    solveRate: number;
    costPerRun: string;
    zeroDayPassAt1?: number; // A1 is benchmarked on CVE-Bench zero-day + PentestEval ADM specifically
    admScore?: number;
}
export interface AblationSpec {
    id: "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "A8";
    title: string;
    isolates: string;        // which contribution claim this validates, e.g. "C1"
    required: "CORE" | "SECONDARY";
    conditions: AblationCondition[];
    discriminatingComparison?: { a: string; b: string; note: string }; // e.g. A1's (c) vs (d)
}
```

Populate exactly:
- **A1 — VDG Decomposition** (`required: "CORE"`, isolates `"C1"`): 4 conditions — `(a) Flat UCB`, `(b) UCB + Dependency edges`, `(c) Stacked (post-filtered)`, `(d) Full VDG` — using the descriptions verbatim from architecture §13.1. Set `discriminatingComparison: { a: "A1-c", b: "A1-d", note: "If (d) ≈ (c): unification claim fails, contribution downgrades to 'dependency-aware UCB filtering'." }`.
- **A2 — Memory** (`CORE`, isolates `"C2"`): 4 conditions — `No memory`, `Episodic Failure Memory only`, `3-tier memory only`, `Full memory`. Each condition needs **two** solve-rate figures, not one: `seenTechSolveRate` and `unseenTechSolveRate` (add both fields to `AblationCondition` for this spec only, or as optional fields on the shared interface) — the whole point of A2 (per §13.1) is that memory benefit should show up on the seen-technology subset and *not* equally on unseen (if it does, that flags overfitting/contamination); the UI must show both numbers side by side for this to be checkable at all.
- **A3 — Validation Diagnosis-Adapt-Cap** (`CORE`, isolates the pass@5→pass@1 gap from Fang et al.): 2 conditions — `Single-attempt validation`, `With Diagnosis-Adapt-Cap`. Track `validationSuccessRate` (findings confirmed on retry / total attempted) per condition.
- **A4 — VDG Failure Propagation** (`CORE`): 2 conditions — `Without propagation`, `With propagation`. Track `distinctPathsAttempted`, `timeToRecovery`, and `passAt1` per condition. This ablation only makes sense once you've added the `BLOCKED` status from §4 below — sequence your work so §4 lands before or alongside this.
- **A5 — Path-Level Scoring** (`SECONDARY`): condition (b) vs (d) reused from A1, framed as its own comparison.
- **A6 — Ordinal Evidence Scoring** (`SECONDARY`): 2 conditions — `Raw LLM confidence`, `E_ord ordinal scale`. Track `ucbScoreVariance` and `selectionSuccessCorrelation`.
- **A7 — Early Stopping** (`SECONDARY`): 2 conditions — `Without early stopping`, `With early stopping`. Track `costPerExploit` and `passAt1` (flag in the UI, via a note field, that if pass@1 decreases here, N=5 is too aggressive per the architecture's own note).
- **A8 — VAPT Protocol Prompt** (`SECONDARY`): 3 conditions — `OWASP Testing Guide`, `PTES`, `RedGrid default`. Track `passAt1` per prompt variant.

**Fix — UI.** Rebuild `AblationLab.tsx` / `AblationLabTable.tsx` / `AblationLabDetailPanel.tsx` to:
1. List all 8 ablations as sections (reuse the existing card/table visual style — do not invent a new layout), each tagged `CORE`/`SECONDARY` using a badge in the same style as the existing `T1`/`T2`/`T3` tier badges on Memory's tabs.
2. Within each ablation, render its conditions as a small table (same row style as today's `ABLATION_RUNS` table).
3. For A1 specifically, visually highlight the (c)-vs-(d) row pair (e.g. a connecting bracket or a shared background tint using an existing muted color from the palette) and show the delta between them as a callout, since that comparison is the one the architecture explicitly says determines whether the whole contribution holds.
4. For A2, render `seenTechSolveRate` and `unseenTechSolveRate` as two adjacent columns, not one.

---

## 4. VDG node status — add the two missing statuses

**Problem.** `src/types/domain-types.ts`'s `VDG_NODE_STATUS` has `{COMPLETED, EXPLOITED, ELIGIBLE, IN_PROGRESS, DEPENDENT, INFEASIBLE}`. Architecture §7.1 specifies exactly `{ELIGIBLE, IN_PROGRESS, EXPLOITED, INFEASIBLE, DEPRIORITIZED, BLOCKED}`. `COMPLETED` and `DEPENDENT` aren't architecture concepts; `BLOCKED` and `DEPRIORITIZED` are both missing, and `BLOCKED` specifically is required for A4 (§3 above) to be representable at all.

**Fix:**
1. In `domain-types.ts`, change `VDG_NODE_STATUS` to exactly the six architecture statuses. Map the old values: `COMPLETED` → decide per context whether it meant `EXPLOITED` (terminal success) — most likely candidate — and migrate accordingly; `DEPENDENT` → nodes with unmet prerequisites should be represented as `INFEASIBLE` per §7.3 Step 4 ("if all prerequisite nodes have status EXPLOITED: ELIGIBLE, else: INFEASIBLE") — so `DEPENDENT` nodes become `INFEASIBLE` nodes that are re-evaluated when their prerequisite completes, not a separate status. Update every fixture (`attackGraphMockData.ts`, `workspaceMockData.ts`'s `VDG_NODES`) and every status-to-color/label mapping (`statusColors.ts`, `NodeStyle.tsx`, `AttackGraphLegend.tsx`) to match the new six-value enum.
2. Add at least one fixture node with status `BLOCKED` and one with `DEPRIORITIZED` to `VDG_NODES` (and to `attackGraphMockData.ts`) so the new statuses are actually visible in the mockup, not just present in the type.
3. Give `BLOCKED` and `DEPRIORITIZED` their own colors in `statusColors.ts`, distinct from the existing six — stay within the existing muted/desaturated palette used for non-primary states (look at how `INFEASIBLE` is currently colored and pick adjacent, not-yet-used shades in the same family, not a brand-new hue).
4. Update `AttackGraphLegend.tsx` to list all six statuses.

---

## 5. Settings — expose the full UCB hyperparameter set

**Problem.** `src/features/settings/components/VDGSettings.tsx` exposes 3 fields (`c`, `eordThresh`, `retryCap`). Architecture §7.2 names 7 tunable weights (`C_expl, α, β, γ, κ, λ, μ`) plus §7.3's edge-inference confidence threshold (`PREREQUISITE_THRESHOLD`, default 0.7). §15.1 and §15.7 name edge-inference accuracy and UCB hyperparameter sensitivity as your two top-tracked risks — this settings screen is the natural place to show they're configurable/tunable, and currently isn't.

**Fix:**
1. In `src/features/settings/hooks/useSettingsData.ts`, extend the `vdg` slice of `SettingsData` with: `alpha` (promise weight, default 0.3), `beta` (difficulty weight, default 0.2), `gamma` (E_ord weight, default 0.4), `kappa` (context-load penalty, default 0.1), `lambda` (EPSS prior weight, default 0.15), `mu` (cost-awareness penalty, default 0.1), `edgeConfidenceThreshold` (default 0.7).
2. In `VDGSettings.tsx`, add a new `SectionHead label="UCB SCORE WEIGHTS"` block (reuse `FieldRow` exactly as the existing 3 fields do) listing all 6 weights with the Greek-letter labels used in the architecture doc (`α — PROMISE WEIGHT`, etc., matching the existing `"UCB EXPLORATION CONSTANT c"` label style). Add a separate `SectionHead label="EDGE INFERENCE"` block with the `edgeConfidenceThreshold` field, and — since §7.3 explicitly requires a pilot-study precision check before this is trusted — add a static, non-interactive info row underneath it (reuse whatever muted-text/note pattern exists elsewhere, e.g. the small italic/gray note style) reading something like: "Edge-inference precision must be validated against PentestEval ground truth before this threshold is trusted (architecture §7.3). Precision < 50% weakens the dependency-edge contribution." — this is a static mockup label, not a live check.
3. Add an **A8 protocol-prompt selector** to Settings (new `SectionHead label="VAPT PROTOCOL PROMPT"` with a 3-option selector — reuse whatever select/radio pattern exists in `ModelSelect.tsx` — options: `OWASP Testing Guide`, `PTES`, `RedGrid Default`), since this is a named ablation variable (§13.2 A8) with no other natural home in the app.

---

## 6. Statistical Evaluation — align metrics and add the missing rigor apparatus

**Problem.** `StatisticalEval` reports `Success@1`/`Success@3` (non-standard — the architecture and every cited benchmark uses `pass@1`/`pass@5`), a bare mean + unlabeled p-value (no confidence interval, no named test, no compute-normalization indicator).

**Fix:**
1. In `researchMockData.ts`'s `STAT_DATA`, rename `Success@1`/`Success@3` metrics to `pass@1`/`pass@5` (recompute mock numbers if needed to look plausible at k=5 instead of k=3 — just adjust the fixture values, no real logic involved).
2. Add a `wilsonCI: [number, number]` field (95% CI lower/upper bound) to each row and render it inline next to the mean, in the existing table-cell style (e.g. `0.812 [0.71–0.89]`).
3. Rename the existing `pValue` column header to `McNemar p` and add a one-line caption under the table (small eyebrow-style text, matching the existing header-label styling) stating "McNemar's test, paired by CVE, same-condition seed-matched" so the test is named, not implied.
4. Add a `deltaPp: number` (percentage-point difference vs. baseline) column and visually emphasize it over the p-value column (larger/bolder — matching how `UCB SCORE` is emphasized in red vs. secondary stats in `VDGNodeDrawerSections.tsx`), since §12.3 explicitly says to "emphasize effect sizes over p-values."
5. Add a static badge/label at the top of the Statistical Evaluation screen reading "Compute-normalized at 50 API calls/CVE — orchestration overhead reported separately" (reuse the existing tab-header eyebrow-label style), so the compute-normalization rule from §12.3 is visible on-screen even though it isn't computed live.

---

## 7. Specialists — separate Layer 3 from Layer 4, split SQLi from XSS

**Problem.** `src/features/missions/data/fixtures/workspaceMockData.ts`'s `SPECIALISTS` array lists Recon, Auth, **Injection** (a merge of SQLi + XSS), **Validation Agent** (a Layer-4 role, per §8.4), and Logic — five roles in one flat list/table with no visual distinction between Layer 3 and Layer 4, and no separate SQLi/XSS rows despite §9.2/§9.3 describing them as separately-specified specialists with different state machines (SQLi: baseline→SLEEP probe→bit-extraction FSM; XSS: 5-phase canary→context→mutation→verify→webhook pipeline).

**Fix:**
1. Split the `"INJECTION SPECIALIST"` entry into two: `"SQLI SPECIALIST"` and `"XSS SPECIALIST"`, each with its own `task` field reflecting its actual methodology stage (e.g. SQLi: `"sqli_blind_time()"` as it already has; XSS: something like `"xss_phase3_mutation()"` to reflect the 5-phase pipeline's current phase — add a `phase: number` / `phaseTotal: number` field to the specialist type specifically for XSS, and render it in the specialist row, e.g. `"PHASE 3/5"`, using the same badge style as the existing `E_ord: X/5` badges elsewhere in the app).
2. Move `"VALIDATION AGENT"` out of the `SPECIALISTS` array into its own concept — either its own small section under the Specialists sub-nav tab, visually separated (a divider + a `"LAYER 4 — EXECUTION & VALIDATION"` label above it, reusing the existing group-label style from `Shell.tsx`'s `NAV_GROUPS`), or move it to live alongside the Execution/Evaluation tabs since those are also Layer 4 per §8.4. Prefer keeping it on the Specialists screen but under a visually distinct "LAYER 4" sub-header above a "LAYER 3 — SPECIALISTS" sub-header for the actual specialist roster, so the architecture's four-layer separation (a named structural contribution, §11) is visible in the same screen that currently flattens it.
3. Optionally (if the current mission's attack surface is Web, which it is per the `MISSION / CVE-001` default), you don't need to add GraphQL or Lateral-Movement specialist rows to this specific mission's fixture — but do check `SpecialistRepository.ts` / the wizard's `SURFACE_SPECIALISTS` map (`wizardMockData.ts`) and confirm a GraphQL-surface or Multi-Host-surface mission would populate GraphQL Specialist / Lateral-Movement Specialist rows correctly if that mission's fixture were viewed — add those two roles to a second mock mission's specialist fixture if only one mission's specialists are currently mocked, so all 6 named Layer-3 specialists (Recon, SQLi, XSS, GraphQL, Auth/Session, Lateral-Movement) exist somewhere in the mockup's data, even if not all in the single default mission.

---

## 8. Final verification checklist

Before considering this task complete, confirm every line below is true by pointing to the specific file/component that makes it true:

- [ ] Global "Memory" and in-mission "Memory" tab render visibly different content depending on entry point (mission-scoped vs. cross-mission/aggregate), matching the Trajectory pattern.
- [ ] Global "Cost & Usage" and in-mission "Cost" tab likewise differ by scope, and a per-surface cost-per-exploit rollup exists somewhere in the global view.
- [ ] All 9 benchmark tiers from architecture §12.1 (Tier 0, 0b, 1, 2, 2b, 3, 4, 5, 6) are reachable from the Benchmarks screen, each with tier-appropriate fields (not CVE-Bench's shape reused).
- [ ] CVE-Bench detail shows pass@1/pass@5 × one-day/zero-day (4 numbers), the 8-attack-type oracle breakdown, and detection-vs-exploitation reported separately.
- [ ] PentestEval detail shows the IC/WG/WF/ADM/EG/ER 6-stage breakdown and the ADM gate/baseline/upper-bound comparison.
- [ ] PrediQL and MHBench screens are visually labeled as separate-axis (not pooled with web pass-rate).
- [ ] BountyBench detail shows Detect/Exploit rates, dollar-value captured, and cost-per-exploit (no Patch column).
- [ ] Ablation Lab has all 8 named ablations (A1–A8), each with its architecture-specified condition set — not the old flat 4-flag model.
- [ ] A1's (c)-vs-(d) comparison is visually highlighted as the discriminating test.
- [ ] A2 shows seen-technology vs. unseen-technology solve rates side by side.
- [ ] VDG node status enum is exactly `{ELIGIBLE, IN_PROGRESS, EXPLOITED, INFEASIBLE, DEPRIORITIZED, BLOCKED}`, with at least one fixture node in each of the two newly-added states, and A4's before/after propagation states are representable using them.
- [ ] Settings exposes all 7 UCB weights (`C_expl, α, β, γ, κ, λ, μ`) plus the edge-confidence threshold plus the A8 protocol-prompt selector.
- [ ] Statistical Evaluation uses pass@1/pass@5 naming, shows Wilson 95% CIs, names McNemar's test explicitly, shows effect-size deltas emphasized over p-values, and displays the compute-normalization note.
- [ ] Specialists screen visually separates Layer 3 (SQLi, XSS, Recon, Auth/Session, GraphQL, Lateral-Movement) from Layer 4 (Validation Agent), and SQLi/XSS are distinct rows with distinct task/phase state.
- [ ] No new colors, fonts, spacing values, or component patterns were introduced anywhere — every new screen reuses an existing component pattern from elsewhere in the app.
- [ ] Nothing was wired to a real backend, API, or live computation — every new field is fixture/mock data in the same style as the existing mock data.

If any box can't be checked, that item isn't done — go back and finish it before reporting completion.
