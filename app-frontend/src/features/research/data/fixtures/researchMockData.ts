export type LabTab = "ABLATION" | "STATISTICAL EVALUATION" | "FAILURE ANALYSIS";

/* ══════════════════════════════════════════════════════
   ABLATION LABORATORY — A1-A8 per architecture §13
   New data model: AblationCondition + AblationSpec discriminated by id
══════════════════════════════════════════════════════ */

export type AblationCategory = "CORE" | "SECONDARY";

export interface AblationCondition {
    /** Condition label, e.g. "(a) FULL SYSTEM", "(b) No UCB — Random" */
    label: string;
    /** Score for the primary metric (CVE-Bench pass@5, 1-day) */
    score: number;
    /** Delta vs full-system condition (negative = degradation) */
    delta: number;
    /** Avg cost per task */
    avgCost: string;
    /** Avg runtime */
    avgTime: string;
    /** Whether this is the full-system baseline condition for this ablation */
    isBaseline?: boolean;
}

export interface AblationSpec {
    /** A1 through A8 */
    id: string;
    /** Short display name */
    name: string;
    /** CORE = directly validates a paper contribution; SECONDARY = supporting analysis */
    category: AblationCategory;
    /** Full description of what this ablation isolates */
    description: string;
    /** The specific architecture contribution being validated */
    contribution: string;
    /** The discriminating comparison between conditions — e.g. "delta between (c) and (d)" */
    discriminatingNote?: string;
    conditions: AblationCondition[];
}

export const ABLATIONS: AblationSpec[] = [
    {
        id: "A1",
        name: "UCB EXPLORATION POLICY",
        category: "CORE",
        description:
            "Ablates the UCB-1 node-selection policy (§5.1). Compares: (a) Full system, (b) Random selection, (c) Greedy ε-score only, (d) Greedy with E_ord weighting but no UCB exploration bonus.",
        contribution:
            "C1 — UCB-guided VDG traversal. Validates that the exploration bonus drives higher coverage and final solve rate vs purely exploitative policies.",
        discriminatingNote:
            "Critical comparison: (c) vs (d). Delta between greedy+E_ord and pure-greedy isolates the contribution of the E_ord-weighted UCB prior independently of the exploration bonus.",
        conditions: [
            {
                label: "(a) FULL SYSTEM",
                score: 0.812,
                delta: 0,
                avgCost: "$0.184",
                avgTime: "18m",
                isBaseline: true,
            },
            {
                label: "(b) RANDOM SELECTION",
                score: 0.641,
                delta: -0.171,
                avgCost: "$0.312",
                avgTime: "28m",
            },
            {
                label: "(c) GREEDY ε-SCORE ONLY",
                score: 0.712,
                delta: -0.1,
                avgCost: "$0.241",
                avgTime: "21m",
            },
            {
                label: "(d) GREEDY + E_ORD (no UCB bonus)",
                score: 0.758,
                delta: -0.054,
                avgCost: "$0.211",
                avgTime: "20m",
            },
        ],
    },
    {
        id: "A2",
        name: "E_ORD EVIDENCE GATING",
        category: "CORE",
        description:
            "Ablates the E_ord dispatch threshold (§5.3). Compares: (a) Full system, (b) No gating — dispatch immediately on eligible status, (c) Fixed threshold = 2 (below architecture default of 3), (d) Fixed threshold = 5 (above architecture default). Split by tech seen vs unseen.",
        contribution:
            "C1 — E_ord gating. Validates that evidence-gated dispatch reduces false-positive dispatch rate and cuts unnecessary LLM calls on low-signal nodes.",
        discriminatingNote:
            "Separate columns for seen-tech solve rate vs unseen-tech solve rate. The E_ord gate disproportionately benefits unseen-tech scenarios where low-evidence signals are misleading.",
        conditions: [
            {
                label: "(a) E_ORD THRESH = 3 (default)",
                score: 0.812,
                delta: 0,
                avgCost: "$0.184",
                avgTime: "18m",
                isBaseline: true,
            },
            {
                label: "(b) NO GATING (dispatch immediately)",
                score: 0.724,
                delta: -0.088,
                avgCost: "$0.291",
                avgTime: "23m",
            },
            {
                label: "(c) THRESH = 2 (too low)",
                score: 0.769,
                delta: -0.043,
                avgCost: "$0.214",
                avgTime: "20m",
            },
            {
                label: "(d) THRESH = 5 (too conservative)",
                score: 0.742,
                delta: -0.07,
                avgCost: "$0.172",
                avgTime: "24m",
            },
        ],
    },
    {
        id: "A3",
        name: "CONTEXT COMPACTION",
        category: "CORE",
        description:
            "Ablates the 3-tier compaction pipeline (§10.3). Compares: (a) Full system with T1→T2 compaction, (b) No compaction — raw context accumulation, (c) Compaction at 70% utilization (earlier than default 85%), (d) Compaction at 95% utilization (too late).",
        contribution:
            "C2 — Memory architecture. Validates that tiered compaction keeps specialist contexts within window limits without losing strategic state.",
        conditions: [
            {
                label: "(a) FULL SYSTEM (compact at 85%)",
                score: 0.812,
                delta: 0,
                avgCost: "$0.184",
                avgTime: "18m",
                isBaseline: true,
            },
            {
                label: "(b) NO COMPACTION",
                score: 0.798,
                delta: -0.014,
                avgCost: "$0.401",
                avgTime: "19m",
            },
            {
                label: "(c) COMPACT AT 70% (aggressive)",
                score: 0.791,
                delta: -0.021,
                avgCost: "$0.202",
                avgTime: "19m",
            },
            {
                label: "(d) COMPACT AT 95% (too late)",
                score: 0.784,
                delta: -0.028,
                avgCost: "$0.394",
                avgTime: "20m",
            },
        ],
    },
    {
        id: "A4",
        name: "VDG PATH-SCORE PROPAGATION",
        category: "CORE",
        description:
            "Ablates path-score propagation on the VDG (§5.4). Compares: (a) Full system with path scoring, (b) Node-level score only — no path context, (c) Path scoring with BLOCKED propagation disabled, (d) Path scoring with DEPRIORITIZED propagation disabled.",
        contribution:
            "C1 — VDG traversal quality. Validates that path-score updates correctly redirect UCB attention away from blocked/pruned subtrees.",
        conditions: [
            {
                label: "(a) FULL PATH SCORING",
                score: 0.812,
                delta: 0,
                avgCost: "$0.184",
                avgTime: "18m",
                isBaseline: true,
            },
            {
                label: "(b) NODE-LEVEL ONLY (no path ctx)",
                score: 0.711,
                delta: -0.101,
                avgCost: "$0.251",
                avgTime: "24m",
            },
            {
                label: "(c) NO BLOCKED PROPAGATION",
                score: 0.774,
                delta: -0.038,
                avgCost: "$0.201",
                avgTime: "21m",
            },
            {
                label: "(d) NO DEPRIORITIZED PROPAGATION",
                score: 0.791,
                delta: -0.021,
                avgCost: "$0.188",
                avgTime: "19m",
            },
        ],
    },
    {
        id: "A5",
        name: "SKILL LIBRARY PROMOTION",
        category: "CORE",
        description:
            "Ablates the T3 Skill Library (§10.5). Compares: (a) Full system with skill promotion (score ≥ 3), (b) No skill library — cold start each mission, (c) Promotion threshold = 5 (more selective), (d) Cross-mission skill transfer disabled (library persists but only within same mission).",
        contribution:
            "C2 — Cross-mission memory. Validates that Tier-3 skill promotion accelerates subsequent missions and reduces exploration cost.",
        conditions: [
            {
                label: "(a) FULL SYSTEM (promote at score ≥ 3)",
                score: 0.812,
                delta: 0,
                avgCost: "$0.184",
                avgTime: "18m",
                isBaseline: true,
            },
            {
                label: "(b) NO SKILL LIBRARY",
                score: 0.741,
                delta: -0.071,
                avgCost: "$0.224",
                avgTime: "23m",
            },
            {
                label: "(c) PROMOTE AT SCORE ≥ 5 (strict)",
                score: 0.784,
                delta: -0.028,
                avgCost: "$0.199",
                avgTime: "20m",
            },
            {
                label: "(d) WITHIN-MISSION ONLY (no X-transfer)",
                score: 0.771,
                delta: -0.041,
                avgCost: "$0.191",
                avgTime: "19m",
            },
        ],
    },
    {
        id: "A6",
        name: "PARALLEL SPECIALIST BRANCHING",
        category: "SECONDARY",
        description:
            "Ablates parallel dispatch of multiple Layer-3 specialists (§8.3). Compares: (a) Full system with parallel branching, (b) Sequential-only dispatch, (c) Parallel dispatch without fork-cost guard, (d) 2-specialist max concurrency (vs default 4).",
        contribution:
            "Architecture §8.3 — parallel branching. Validates that concurrent multi-specialist execution reduces wall-clock time without increasing cost past the ceiling.",
        conditions: [
            {
                label: "(a) FULL PARALLEL (max 4 concurrent)",
                score: 0.812,
                delta: 0,
                avgCost: "$0.184",
                avgTime: "18m",
                isBaseline: true,
            },
            {
                label: "(b) SEQUENTIAL ONLY",
                score: 0.781,
                delta: -0.031,
                avgCost: "$0.192",
                avgTime: "31m",
            },
            {
                label: "(c) PARALLEL WITHOUT FORK-COST GUARD",
                score: 0.801,
                delta: -0.011,
                avgCost: "$0.342",
                avgTime: "16m",
            },
            {
                label: "(d) MAX 2 CONCURRENT",
                score: 0.798,
                delta: -0.014,
                avgCost: "$0.201",
                avgTime: "22m",
            },
        ],
    },
    {
        id: "A7",
        name: "ORACLE VALIDATION RETRIES",
        category: "SECONDARY",
        description:
            "Ablates the Diagnosis-Adapt-Cap retry loop in the Layer-4 Validation Agent (§11.3). Compares: (a) Full system (cap = 3), (b) Cap = 1 (no retry), (c) Cap = 5 (more retries), (d) No diagnosis step — blind retry.",
        contribution:
            "Architecture §11.3 — oracle validation. Validates that the Diagnosis-Adapt-Cap retry strategy improves oracle pass rate without excessive cost escalation.",
        conditions: [
            {
                label: "(a) FULL SYSTEM (cap = 3)",
                score: 0.812,
                delta: 0,
                avgCost: "$0.184",
                avgTime: "18m",
                isBaseline: true,
            },
            {
                label: "(b) CAP = 1 (no retry)",
                score: 0.768,
                delta: -0.044,
                avgCost: "$0.161",
                avgTime: "16m",
            },
            {
                label: "(c) CAP = 5 (more retries)",
                score: 0.814,
                delta: 0.002,
                avgCost: "$0.221",
                avgTime: "21m",
            },
            {
                label: "(d) BLIND RETRY (no diagnosis)",
                score: 0.771,
                delta: -0.041,
                avgCost: "$0.199",
                avgTime: "19m",
            },
        ],
    },
    {
        id: "A8",
        name: "ENVIRONMENTAL LAYER RICHNESS",
        category: "SECONDARY",
        description:
            "Ablates the Environmental Layer (§6) depth. Compares: (a) Full system with EL construction, (b) No EL — specialists work from raw conversation context only, (c) EL limited to 50 facts (vs default 200), (d) EL with no specialist annotation — system-level facts only.",
        contribution:
            "Architecture §6 — Environmental Layer. Validates that structured EL facts improve specialist task grounding and reduce redundant reconnaissance calls.",
        conditions: [
            {
                label: "(a) FULL EL (200 facts max)",
                score: 0.812,
                delta: 0,
                avgCost: "$0.184",
                avgTime: "18m",
                isBaseline: true,
            },
            {
                label: "(b) NO ENVIRONMENTAL LAYER",
                score: 0.718,
                delta: -0.094,
                avgCost: "$0.281",
                avgTime: "27m",
            },
            {
                label: "(c) EL LIMITED TO 50 FACTS",
                score: 0.764,
                delta: -0.048,
                avgCost: "$0.204",
                avgTime: "21m",
            },
            {
                label: "(d) NO SPECIALIST ANNOTATION",
                score: 0.789,
                delta: -0.023,
                avgCost: "$0.191",
                avgTime: "19m",
            },
        ],
    },
];

/* ══════════════════════════════════════════════════════
   STATISTICAL EVALUATION (screen 42)
   Terminology aligned with architecture §12.3:
   - pass@1 (not Success@1), pass@5 (not Success@3)
   - McNemar's chi-squared test for paired binary outcomes
   - Wilson score interval for binomial proportions
   - Δ pp = percentage-point delta vs baseline
══════════════════════════════════════════════════════ */
export const STAT_DATA = [
    {
        metric: "Mean Solve Rate",
        full: 0.812,
        noUCB: 0.641,
        noEord: 0.724,
        baseline: 0.401,
        /** McNemar's chi-squared p-value (paired binary outcomes, §12.3) */
        mcNemarP: 0.003,
        /** Wilson score 95% CI for full-system condition */
        wilsonCI: [0.771, 0.85] as [number, number],
        /** Δ percentage-point vs baseline condition */
        deltaPp: 41.1,
    },
    {
        metric: "Median Cost/Task ($)",
        full: 0.184,
        noUCB: 0.312,
        noEord: 0.228,
        baseline: 0.621,
        mcNemarP: 0.008,
        wilsonCI: [0.162, 0.206] as [number, number],
        deltaPp: -43.7,
    },
    {
        metric: "Mean Attempts",
        full: 1.4,
        noUCB: 2.8,
        noEord: 1.9,
        baseline: 3.4,
        mcNemarP: 0.001,
        wilsonCI: [1.28, 1.52] as [number, number],
        deltaPp: -58.8,
    },
    {
        metric: "pass@1",
        full: 0.681,
        noUCB: 0.412,
        noEord: 0.598,
        baseline: 0.289,
        mcNemarP: 0.002,
        wilsonCI: [0.634, 0.725] as [number, number],
        deltaPp: 39.2,
    },
    {
        metric: "pass@5",
        full: 0.894,
        noUCB: 0.744,
        noEord: 0.831,
        baseline: 0.601,
        mcNemarP: 0.011,
        wilsonCI: [0.862, 0.921] as [number, number],
        deltaPp: 29.3,
    },
    {
        metric: "Partial Rate",
        full: 0.122,
        noUCB: 0.189,
        noEord: 0.144,
        baseline: 0.221,
        mcNemarP: 0.044,
        wilsonCI: [0.098, 0.148] as [number, number],
        deltaPp: -9.9,
    },
    {
        metric: "Fail Rate",
        full: 0.066,
        noUCB: 0.37,
        noEord: 0.132,
        baseline: 0.49,
        mcNemarP: 0.001,
        wilsonCI: [0.049, 0.086] as [number, number],
        deltaPp: -42.4,
    },
];

/* ══════════════════════════════════════════════════════
   FAILURE ANALYSIS (screen 43)
══════════════════════════════════════════════════════ */
export const FAILURE_CLUSTERS = [
    {
        id: "FC-001",
        label: "NETWORK FILTERING",
        count: 14,
        pct: 34,
        color: "var(--color-brand)",
        desc: "Egress-filtered ports (5432, 6379) block lateral movement. Agent correctly identifies and deprioritizes but wastes 2–4 attempts first.",
        fix: "Add network preflight probe before lateral attack dispatch",
    },
    {
        id: "FC-002",
        label: "PATCHED VULNERABILITY",
        count: 9,
        pct: 22,
        color: "var(--color-warning)",
        desc: "CVE target already patched in benchmark environment. E_ord reaches 2 (WEAK) but cannot confirm. Agent correctly rules out after 3 attempts.",
        fix: "Add CVE version check to RECON-SPEC pre-flight",
    },
    {
        id: "FC-003",
        label: "WAF BLOCKING",
        count: 7,
        pct: 17,
        color: "var(--color-warning)",
        desc: "Web application firewall blocks payload delivery. Agent detects 403/429 pattern but retry logic escalates cost unnecessarily.",
        fix: "WAF detection heuristic in INJECT-SPEC — halt early on consistent 403",
    },
    {
        id: "FC-004",
        label: "CONTEXT OVERFLOW",
        count: 5,
        pct: 12,
        color: "var(--color-hex-555555)",
        desc: "Specialist context exceeded threshold before task completion. Compaction triggered mid-task, losing active state in 2 cases.",
        fix: "Implement pre-task context budget estimation",
    },
    {
        id: "FC-005",
        label: "ORACLE MISMATCH",
        count: 4,
        pct: 10,
        color: "var(--color-hex-555555)",
        desc: "Exploit successful but oracle objective differs from exploitation path. File read oracle passed, SSRF vector not counted.",
        fix: "Align oracle objectives with exploit chain granularity",
    },
    {
        id: "FC-006",
        label: "RATE LIMITING",
        count: 2,
        pct: 5,
        color: "var(--color-hex-333333)",
        desc: "Target rate-limits after 10 requests/min. Scan tools exceeded threshold, triggering lockout.",
        fix: "Add adaptive rate control to execution agent",
    },
];
export const FAILURE_TIMELINE = [
    {
        ts: "06:29:03",
        type: "NETWORK FILTERING",
        run: "B-041",
        task: "T-019",
        cost: "$0.000",
        attempts: 1,
        resolved: false,
    },
    {
        ts: "06:29:44",
        type: "WAF BLOCKING",
        run: "B-041",
        task: "T-031",
        cost: "$0.148",
        attempts: 3,
        resolved: false,
    },
    {
        ts: "Yesterday 14:22",
        type: "PATCHED VULNERABILITY",
        run: "B-038",
        task: "T-008",
        cost: "$0.091",
        attempts: 3,
        resolved: false,
    },
    {
        ts: "Yesterday 11:04",
        type: "CONTEXT OVERFLOW",
        run: "B-038",
        task: "T-022",
        cost: "$0.312",
        attempts: 2,
        resolved: true,
    },
    {
        ts: "2d ago 09:17",
        type: "ORACLE MISMATCH",
        run: "B-035",
        task: "T-041",
        cost: "$0.044",
        attempts: 2,
        resolved: false,
    },
];

/** Legacy compat — some components may still import ABLATION_RUNS. Kept as alias. */
export const ABLATION_RUNS = ABLATIONS;

/** Legacy compat — old COMPONENTS shape used by AblationLabDetailPanel */
export type AblationFlagKey = "ucb" | "eord" | "compact" | "parallel";
export interface AblationRun {
    id: string;
    name: string;
    ucb: boolean;
    eord: boolean;
    compact: boolean;
    parallel: boolean;
    score: number;
    cost: string;
    time: string;
    delta: number;
}
export const ABLATION_FLAG_KEYS: AblationFlagKey[] = ["ucb", "eord", "compact", "parallel"];
export const COMPONENTS: {
    key: AblationFlagKey;
    label: string;
    desc: string;
}[] = [
    {
        key: "ucb",
        label: "UCB SCORING",
        desc: "Upper confidence bound node selection policy",
    },
    {
        key: "eord",
        label: "E_ORD GATING",
        desc: "Evidence-level threshold for dispatch",
    },
    {
        key: "compact",
        label: "CONTEXT COMPACTION",
        desc: "Automatic specialist context refresh",
    },
    {
        key: "parallel",
        label: "PARALLEL BRANCHING",
        desc: "Concurrent multi-specialist scheduling",
    },
];
