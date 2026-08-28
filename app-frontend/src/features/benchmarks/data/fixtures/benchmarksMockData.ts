import { BENCHMARK_STATUS, type BenchmarkStatus } from "@/types/domain-types";

/* ══════════════════════════════════════════════════════
   BENCHMARK TIER TYPE SYSTEM (architecture §12.1)
   Discriminated union — one variant per tier.
   Replaces the old flat Bench interface.
══════════════════════════════════════════════════════ */

export type BenchTier =
    | "TIER0_SANDBOX" // Fang et al. 15-vuln suite — CI-regression floor
    | "TIER0B_HPTSA" // HPTSA 14-CVE zero-day — floor comparison
    | "TIER1_PENTESTEVAL" // 12 scenarios / 346 tasks — gates primary metric
    | "TIER2_CVEBENCH" // primary metric
    | "TIER2B_CROSSBENCH" // MAPTA XBOW / HackWorld / NYU CTF Bench / Cybench
    | "TIER3_PREDIQL" // GraphQL — reported on separate axis, never pooled with web pass-rate
    | "TIER4_MHBENCH" // Incalmo multi-host compromise
    | "TIER5_BOUNTYBENCH" // 25 production systems, dollar-value axis
    | "TIER6_LIVECOMP"; // PentestGPT machines + HTB Season 8

/** Fields shared by every benchmark tier — used for summary list rows */
export interface BenchBase {
    id: string;
    name: string;
    tier: BenchTier;
    date: string;
    status: BenchmarkStatus;
    avgCost: string;
    avgTime: string;
}

/* ── Tier-specific detail shapes ── */

/** TIER0_SANDBOX: Fang et al. 15-vulnerability sandbox (§12.1 Tier 0) */
export interface Tier0SandboxDetail {
    tasksTotal: 15;
    passAt5FloorPct: number; // GPT-4's 73.3% floor from Fang et al.
    redGridPassAt5Pct: number;
    /** GPT-4 failure classes not yet closed by RedGrid */
    failureClassesClosed: Array<"AuthBypass" | "JS attacks" | "Hard SQLi" | "XSS+CSRF">;
    failureClassesOpen: Array<"AuthBypass" | "JS attacks" | "Hard SQLi" | "XSS+CSRF">;
}

/** TIER0B_HPTSA: HPTSA 14-CVE zero-day floor comparison (§12.1 Tier 0b) */
export interface Tier0bHptsaDetail {
    tasksTotal: 14;
    passAt5FloorPct: number; // HPTSA: 42%
    passAt1FloorPct: number; // HPTSA: 18%
    redGridPassAt5Pct: number;
    redGridPassAt1Pct: number;
}

/** TIER1_PENTESTEVAL: 12 scenarios / 346 tasks (§12.1 Tier 1)
 *  6-stage breakdown IS the metric — not a single aggregate score.
 *  Primary-metric gate: ADM score ≥ 0.50 */
export interface Tier1PentestEvalDetail {
    tasksTotal: 346;
    scenarios: 12;
    stages: {
        stage: "IC" | "WG" | "WF" | "ADM" | "EG" | "ER";
        metric: "JACCARD" | "SPEARMAN_RHO" | "SUCCESS_RATE";
        score: number;
    }[];
    admGate: number; // Architecture target: ≥ 0.50
    smpBaselineAdm: number; // SMP baseline: 0.31
    gtAdmUpperBound: number; // Ground-truth upper bound: 0.67
}

/** TIER2_CVEBENCH: Primary metric (§12.1 Tier 2) */
export interface Tier2CveBenchDetail {
    tasksTotal: number;
    passAt1ZeroDay: number;
    passAt5ZeroDay: number;
    passAt1OneDay: number;
    passAt5OneDay: number;
    /** 8-attack-type oracle breakdown per §12.2 */
    attackTypeOracle: {
        type:
            | "SQL Injection"
            | "Auth Bypass"
            | "RCE"
            | "IDOR"
            | "XSS"
            | "SSRF"
            | "XXE"
            | "Path Traversal";
        pass: number;
        total: number;
    }[];
    /** Source-code availability split */
    sourceCodeAvailable: { pass: number; total: number };
    sourceCodeUnavailable: { pass: number; total: number };
    /** Reported separately per Fang et al. — not averaged into pass rate */
    detectionRate: number;
    exploitationRate: number;
}

/** TIER2B_CROSSBENCH: MAPTA XBOW / HackWorld / NYU CTF Bench / Cybench (§12.1 Tier 2b) */
export interface Tier2bCrossBenchDetail {
    perBenchmark: {
        name: "MAPTA XBOW" | "HackWorld" | "NYU CTF Bench" | "Cybench";
        solved: number;
        total: number;
    }[];
    pooled: { solved: number; total: number };
}

/** TIER3_PREDIQL: GraphQL — SEPARATE AXIS, never pooled with web pass-rate (§12.1 Tier 3, §12.2) */
export interface Tier3PrediQLDetail {
    apis: 6;
    schemaCoveragePct: number;
    vulnCount: number;
    /** 4-baseline comparison (the entire point of this benchmark) */
    baselineComparison: {
        name: "ZAP" | "Burp Suite" | "EvoMaster" | "GraphQLer";
        schemaCoveragePct: number;
        vulnCount: number;
    }[];
}

/** TIER4_MHBENCH: Incalmo 40-environment multi-host (§12.1 Tier 4) — SEPARATE AXIS */
export interface Tier4MHBenchDetail {
    environments: 40;
    hostCompromiseSuccess: number;
    credentialTheftSuccess: number;
    incalmoFloor: "37/40"; // Incalmo's own published number
}

/** TIER5_BOUNTYBENCH: 25 production systems, dollar-value axis (§12.1 Tier 5)
 *  Note: Patch excluded — RedGrid only claims Attack side per §2.1 scoping */
export interface Tier5BountyBenchDetail {
    systems: 25;
    detect: { pass: number; total: number };
    exploit: { pass: number; total: number };
    // No patch column — RedGrid scoping rule (§2.1): attack only, not defense
    dollarValueCaptured: string; // e.g. "$41,250"
    costPerExploit: string;
}

/** TIER6_LIVECOMP: PentestGPT 13-machine + HTB Season 8 5-machine (§12.1 Tier 6) */
export interface Tier6LiveCompDetail {
    machinesTotal: 18;
    pentestGptMachinesSolved: number; // of 13
    htbSeason8Solved: number; // of 5
    humanSolvedGroundTruthMatchPct: number;
}

/* ── Full bench record variants ── */

export type BenchRecord =
    | (BenchBase & { tier: "TIER0_SANDBOX"; detail: Tier0SandboxDetail })
    | (BenchBase & { tier: "TIER0B_HPTSA"; detail: Tier0bHptsaDetail })
    | (BenchBase & { tier: "TIER1_PENTESTEVAL"; detail: Tier1PentestEvalDetail })
    | (BenchBase & { tier: "TIER2_CVEBENCH"; detail: Tier2CveBenchDetail })
    | (BenchBase & { tier: "TIER2B_CROSSBENCH"; detail: Tier2bCrossBenchDetail })
    | (BenchBase & { tier: "TIER3_PREDIQL"; detail: Tier3PrediQLDetail })
    | (BenchBase & { tier: "TIER4_MHBENCH"; detail: Tier4MHBenchDetail })
    | (BenchBase & { tier: "TIER5_BOUNTYBENCH"; detail: Tier5BountyBenchDetail })
    | (BenchBase & { tier: "TIER6_LIVECOMP"; detail: Tier6LiveCompDetail });

/**
 * Legacy alias — maintained for components still typing to Bench.
 * New code should use BenchRecord.
 */
export type Bench = BenchRecord;

/* ══════════════════════════════════════════════════════
   TIER 0 — Fang et al. 15-vuln sandbox (CI regression floor)
══════════════════════════════════════════════════════ */
export const SANDBOX_RUNS: BenchRecord[] = [
    {
        id: "T0-003",
        name: "Fang Sandbox v1 Full",
        tier: "TIER0_SANDBOX",
        date: "Today",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.041",
        avgTime: "8m",
        detail: {
            tasksTotal: 15,
            passAt5FloorPct: 0.733,
            redGridPassAt5Pct: 0.867,
            failureClassesClosed: ["AuthBypass", "Hard SQLi"],
            failureClassesOpen: ["JS attacks", "XSS+CSRF"],
        },
    },
    {
        id: "T0-002",
        name: "Fang Sandbox v1 Nightly",
        tier: "TIER0_SANDBOX",
        date: "2d ago",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.038",
        avgTime: "7m",
        detail: {
            tasksTotal: 15,
            passAt5FloorPct: 0.733,
            redGridPassAt5Pct: 0.8,
            failureClassesClosed: ["AuthBypass"],
            failureClassesOpen: ["JS attacks", "Hard SQLi", "XSS+CSRF"],
        },
    },
];

/* ══════════════════════════════════════════════════════
   TIER 0b — HPTSA 14-CVE zero-day floor
══════════════════════════════════════════════════════ */
export const HPTSA_RUNS: BenchRecord[] = [
    {
        id: "T0B-002",
        name: "HPTSA 14-CVE Zero-Day",
        tier: "TIER0B_HPTSA",
        date: "Yesterday",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.224",
        avgTime: "31m",
        detail: {
            tasksTotal: 14,
            passAt5FloorPct: 0.42,
            passAt1FloorPct: 0.18,
            redGridPassAt5Pct: 0.571,
            redGridPassAt1Pct: 0.357,
        },
    },
    {
        id: "T0B-001",
        name: "HPTSA 14-CVE Baseline",
        tier: "TIER0B_HPTSA",
        date: "3d ago",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.198",
        avgTime: "28m",
        detail: {
            tasksTotal: 14,
            passAt5FloorPct: 0.42,
            passAt1FloorPct: 0.18,
            redGridPassAt5Pct: 0.5,
            redGridPassAt1Pct: 0.286,
        },
    },
];

/* ══════════════════════════════════════════════════════
   TIER 1 — PentestEval (12 scenarios / 346 tasks)
   Gates primary-metric threshold: ADM ≥ 0.50
══════════════════════════════════════════════════════ */
export const PENTESTEVAL_RUNS: BenchRecord[] = [
    {
        id: "T1-004",
        name: "PentestEval Full Suite",
        tier: "TIER1_PENTESTEVAL",
        date: "Today",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.312",
        avgTime: "42m",
        detail: {
            tasksTotal: 346,
            scenarios: 12,
            stages: [
                { stage: "IC", metric: "JACCARD", score: 0.71 },
                { stage: "WG", metric: "JACCARD", score: 0.64 },
                { stage: "WF", metric: "SUCCESS_RATE", score: 0.58 },
                { stage: "ADM", metric: "JACCARD", score: 0.54 }, // gate: ≥ 0.50 ✓
                { stage: "EG", metric: "SUCCESS_RATE", score: 0.61 },
                { stage: "ER", metric: "SPEARMAN_RHO", score: 0.48 },
            ],
            admGate: 0.5,
            smpBaselineAdm: 0.31,
            gtAdmUpperBound: 0.67,
        },
    },
    {
        id: "T1-003",
        name: "PentestEval v2 Quick",
        tier: "TIER1_PENTESTEVAL",
        date: "2d ago",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.284",
        avgTime: "38m",
        detail: {
            tasksTotal: 346,
            scenarios: 12,
            stages: [
                { stage: "IC", metric: "JACCARD", score: 0.68 },
                { stage: "WG", metric: "JACCARD", score: 0.61 },
                { stage: "WF", metric: "SUCCESS_RATE", score: 0.54 },
                { stage: "ADM", metric: "JACCARD", score: 0.51 },
                { stage: "EG", metric: "SUCCESS_RATE", score: 0.57 },
                { stage: "ER", metric: "SPEARMAN_RHO", score: 0.44 },
            ],
            admGate: 0.5,
            smpBaselineAdm: 0.31,
            gtAdmUpperBound: 0.67,
        },
    },
];

/* ══════════════════════════════════════════════════════
   TIER 2 — CVE-Bench (primary metric)
══════════════════════════════════════════════════════ */
export const CVEBENCH_RUNS: BenchRecord[] = [
    {
        id: "B-041",
        name: "CVE-BENCH v2 Full",
        tier: "TIER2_CVEBENCH",
        date: "Today",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.184",
        avgTime: "18m",
        detail: {
            tasksTotal: 50,
            passAt1ZeroDay: 0.52,
            passAt5ZeroDay: 0.72,
            passAt1OneDay: 0.681,
            passAt5OneDay: 0.812,
            attackTypeOracle: [
                { type: "SQL Injection", pass: 9, total: 10 },
                { type: "Auth Bypass", pass: 8, total: 9 },
                { type: "RCE", pass: 4, total: 7 },
                { type: "IDOR", pass: 6, total: 7 },
                { type: "XSS", pass: 5, total: 6 },
                { type: "SSRF", pass: 2, total: 5 },
                { type: "XXE", pass: 3, total: 3 },
                { type: "Path Traversal", pass: 1, total: 3 },
            ],
            sourceCodeAvailable: { pass: 28, total: 32 },
            sourceCodeUnavailable: { pass: 10, total: 18 },
            detectionRate: 0.88,
            exploitationRate: 0.812,
        },
    },
    {
        id: "B-038",
        name: "CVE-BENCH v2 Fast",
        tier: "TIER2_CVEBENCH",
        date: "3d ago",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.072",
        avgTime: "11m",
        detail: {
            tasksTotal: 20,
            passAt1ZeroDay: 0.45,
            passAt5ZeroDay: 0.65,
            passAt1OneDay: 0.65,
            passAt5OneDay: 0.848,
            attackTypeOracle: [
                { type: "SQL Injection", pass: 4, total: 4 },
                { type: "Auth Bypass", pass: 3, total: 4 },
                { type: "RCE", pass: 2, total: 3 },
                { type: "IDOR", pass: 2, total: 3 },
                { type: "XSS", pass: 2, total: 2 },
                { type: "SSRF", pass: 1, total: 2 },
                { type: "XXE", pass: 1, total: 1 },
                { type: "Path Traversal", pass: 1, total: 1 },
            ],
            sourceCodeAvailable: { pass: 12, total: 13 },
            sourceCodeUnavailable: { pass: 4, total: 7 },
            detectionRate: 0.91,
            exploitationRate: 0.848,
        },
    },
    {
        id: "B-042",
        name: "CVE-BENCH v2 Nightly",
        tier: "TIER2_CVEBENCH",
        date: "Running",
        status: BENCHMARK_STATUS.RUNNING,
        avgCost: "—",
        avgTime: "—",
        detail: {
            tasksTotal: 50,
            passAt1ZeroDay: 0,
            passAt5ZeroDay: 0,
            passAt1OneDay: 0,
            passAt5OneDay: 0,
            attackTypeOracle: [],
            sourceCodeAvailable: { pass: 0, total: 0 },
            sourceCodeUnavailable: { pass: 0, total: 0 },
            detectionRate: 0,
            exploitationRate: 0,
        },
    },
];

/* ══════════════════════════════════════════════════════
   TIER 2b — Cross-benchmark (MAPTA XBOW / HackWorld / NYU CTF / Cybench)
   §12.1: reported per-benchmark AND pooled
══════════════════════════════════════════════════════ */
export const CROSSBENCH_RUNS: BenchRecord[] = [
    {
        id: "T2B-003",
        name: "Cross-Benchmark Suite Full",
        tier: "TIER2B_CROSSBENCH",
        date: "Yesterday",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.211",
        avgTime: "24m",
        detail: {
            perBenchmark: [
                { name: "MAPTA XBOW", solved: 71, total: 104 },
                { name: "HackWorld", solved: 22, total: 36 },
                { name: "NYU CTF Bench", solved: 14, total: 40 }, // harder — no CVE hint
                { name: "Cybench", solved: 28, total: 40 },
            ],
            pooled: { solved: 135, total: 220 },
        },
    },
    {
        id: "T2B-002",
        name: "Cross-Benchmark Quick",
        tier: "TIER2B_CROSSBENCH",
        date: "4d ago",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.194",
        avgTime: "21m",
        detail: {
            perBenchmark: [
                { name: "MAPTA XBOW", solved: 64, total: 104 },
                { name: "HackWorld", solved: 19, total: 36 },
                { name: "NYU CTF Bench", solved: 11, total: 40 },
                { name: "Cybench", solved: 24, total: 40 },
            ],
            pooled: { solved: 118, total: 220 },
        },
    },
];

/* ══════════════════════════════════════════════════════
   TIER 3 — PrediQL 6-API GraphQL suite
   SEPARATE AXIS — never pooled with web pass-rate (§12.2)
══════════════════════════════════════════════════════ */
export const PREDIQL_RUNS: BenchRecord[] = [
    {
        id: "T3-004",
        name: "PrediQL v2 Full Suite",
        tier: "TIER3_PREDIQL",
        date: "Yesterday",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.091",
        avgTime: "9m",
        detail: {
            apis: 6,
            schemaCoveragePct: 0.741,
            vulnCount: 18,
            baselineComparison: [
                { name: "ZAP", schemaCoveragePct: 0.48, vulnCount: 7 },
                { name: "Burp Suite", schemaCoveragePct: 0.61, vulnCount: 11 },
                { name: "EvoMaster", schemaCoveragePct: 0.54, vulnCount: 9 },
                { name: "GraphQLer", schemaCoveragePct: 0.69, vulnCount: 14 },
            ],
        },
    },
    {
        id: "T3-003",
        name: "PrediQL v2 Beta",
        tier: "TIER3_PREDIQL",
        date: "Queued",
        status: BENCHMARK_STATUS.QUEUED,
        avgCost: "—",
        avgTime: "—",
        detail: {
            apis: 6,
            schemaCoveragePct: 0,
            vulnCount: 0,
            baselineComparison: [
                { name: "ZAP", schemaCoveragePct: 0.48, vulnCount: 7 },
                { name: "Burp Suite", schemaCoveragePct: 0.61, vulnCount: 11 },
                { name: "EvoMaster", schemaCoveragePct: 0.54, vulnCount: 9 },
                { name: "GraphQLer", schemaCoveragePct: 0.69, vulnCount: 14 },
            ],
        },
    },
];

/* ══════════════════════════════════════════════════════
   TIER 4 — MHBench 40-environment multi-host
   SEPARATE AXIS — never pooled with web pass-rate (§12.2)
══════════════════════════════════════════════════════ */
export const MHBENCH_RUNS: BenchRecord[] = [
    {
        id: "T4-003",
        name: "MH-Bench Multi-Host Full",
        tier: "TIER4_MHBENCH",
        date: "2d ago",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.321",
        avgTime: "34m",
        detail: {
            environments: 40,
            hostCompromiseSuccess: 28,
            credentialTheftSuccess: 22,
            incalmoFloor: "37/40",
        },
    },
    {
        id: "T4-002",
        name: "MH-Bench Quick Scan",
        tier: "TIER4_MHBENCH",
        date: "5d ago",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.291",
        avgTime: "29m",
        detail: {
            environments: 40,
            hostCompromiseSuccess: 24,
            credentialTheftSuccess: 18,
            incalmoFloor: "37/40",
        },
    },
];

/* ══════════════════════════════════════════════════════
   TIER 5 — BountyBench 25 production systems
   Dollar-value axis + Detect / Exploit (no Patch per §2.1 scoping)
══════════════════════════════════════════════════════ */
export const BOUNTYBENCH_RUNS: BenchRecord[] = [
    {
        id: "T5-002",
        name: "BountyBench Production Full",
        tier: "TIER5_BOUNTYBENCH",
        date: "3d ago",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.841",
        avgTime: "61m",
        detail: {
            systems: 25,
            detect: { pass: 21, total: 25 },
            exploit: { pass: 14, total: 25 },
            dollarValueCaptured: "$41,250",
            costPerExploit: "$1.50",
        },
    },
    {
        id: "T5-001",
        name: "BountyBench Pilot",
        tier: "TIER5_BOUNTYBENCH",
        date: "7d ago",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$0.792",
        avgTime: "58m",
        detail: {
            systems: 25,
            detect: { pass: 19, total: 25 },
            exploit: { pass: 11, total: 25 },
            dollarValueCaptured: "$28,500",
            costPerExploit: "$1.81",
        },
    },
];

/* ══════════════════════════════════════════════════════
   TIER 6 — Live competition (PentestGPT 13 + HTB Season 8 5 machines)
══════════════════════════════════════════════════════ */
export const LIVECOMP_RUNS: BenchRecord[] = [
    {
        id: "T6-001",
        name: "PentestGPT + HTB Season 8",
        tier: "TIER6_LIVECOMP",
        date: "5d ago",
        status: BENCHMARK_STATUS.COMPLETE,
        avgCost: "$1.244",
        avgTime: "88m",
        detail: {
            machinesTotal: 18,
            pentestGptMachinesSolved: 9,
            htbSeason8Solved: 3,
            humanSolvedGroundTruthMatchPct: 72,
        },
    },
];

/* ══════════════════════════════════════════════════════
   COMBINED: all benchmark runs across all 9 tiers
══════════════════════════════════════════════════════ */
export const ALL_BENCH_RUNS: BenchRecord[] = [
    ...SANDBOX_RUNS,
    ...HPTSA_RUNS,
    ...PENTESTEVAL_RUNS,
    ...CVEBENCH_RUNS,
    ...CROSSBENCH_RUNS,
    ...PREDIQL_RUNS,
    ...MHBENCH_RUNS,
    ...BOUNTYBENCH_RUNS,
    ...LIVECOMP_RUNS,
];

/* ── Tier display metadata ── */
export const TIER_META: Record<BenchTier, { label: string; color: string; axisNote?: string }> = {
    TIER0_SANDBOX: { label: "TIER 0 — SANDBOX", color: "var(--color-hex-555555)" },
    TIER0B_HPTSA: { label: "TIER 0b — HPTSA", color: "var(--color-hex-444444)" },
    TIER1_PENTESTEVAL: { label: "TIER 1 — PENTESTEVAL", color: "var(--color-warning)" },
    TIER2_CVEBENCH: { label: "TIER 2 — CVE-BENCH", color: "var(--color-brand)" },
    TIER2B_CROSSBENCH: { label: "TIER 2b — CROSS-BENCH", color: "var(--color-hex-9e1118)" },
    TIER3_PREDIQL: {
        label: "TIER 3 — PREDIQL",
        color: "var(--color-success)",
        axisNote: "GraphQL — reported on a separate axis, not pooled with web pass-rate",
    },
    TIER4_MHBENCH: {
        label: "TIER 4 — MHBENCH",
        color: "var(--color-success)",
        axisNote: "Multi-Host — reported on a separate axis, not pooled with web pass-rate",
    },
    TIER5_BOUNTYBENCH: { label: "TIER 5 — BOUNTYBENCH", color: "var(--color-danger)" },
    TIER6_LIVECOMP: { label: "TIER 6 — LIVE COMP", color: "var(--color-hex-6f171b)" },
};

/* ── Legacy compat: TASK_DATA (used by BenchmarkTasksTab — CVE-Bench specific) ── */
export type Task = (typeof TASK_DATA)[0];
export const TASK_DATA = [
    {
        id: "T-001",
        name: "CVE-2024-1234 SQLi",
        category: "SQL INJECTION",
        solved: true,
        partial: false,
        cost: "$0.082",
        time: "14m",
        eord: 5,
        attempts: 2,
    },
    {
        id: "T-002",
        name: "CVE-2024-5678 AuthBypass",
        category: "AUTH",
        solved: true,
        partial: false,
        cost: "$0.054",
        time: "9m",
        eord: 5,
        attempts: 1,
    },
    {
        id: "T-003",
        name: "CVE-2024-9012 RCE",
        category: "RCE",
        solved: false,
        partial: true,
        cost: "$0.211",
        time: "22m",
        eord: 3,
        attempts: 3,
    },
    {
        id: "T-004",
        name: "CVE-2024-3456 IDOR",
        category: "ACCESS CTRL",
        solved: true,
        partial: false,
        cost: "$0.021",
        time: "5m",
        eord: 4,
        attempts: 1,
    },
    {
        id: "T-005",
        name: "CVE-2024-7890 XSS",
        category: "XSS",
        solved: true,
        partial: false,
        cost: "$0.031",
        time: "6m",
        eord: 5,
        attempts: 1,
    },
    {
        id: "T-006",
        name: "CVE-2024-2468 SSRF",
        category: "SSRF",
        solved: false,
        partial: false,
        cost: "$0.148",
        time: "18m",
        eord: 1,
        attempts: 3,
    },
    {
        id: "T-007",
        name: "CVE-2024-1357 XXE",
        category: "XXE",
        solved: true,
        partial: false,
        cost: "$0.061",
        time: "11m",
        eord: 4,
        attempts: 2,
    },
    {
        id: "T-008",
        name: "CVE-2024-8024 PathTrv",
        category: "PATH TRAVERSAL",
        solved: true,
        partial: false,
        cost: "$0.018",
        time: "4m",
        eord: 5,
        attempts: 1,
    },
];

/* screen 40: BENCHMARK DETAIL — see BenchmarkDetail.tsx */
