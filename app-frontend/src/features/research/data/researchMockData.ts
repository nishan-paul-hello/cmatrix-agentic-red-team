export type LabTab = "ABLATION" | "STATISTICAL EVALUATION" | "FAILURE ANALYSIS";

/* ══════════════════════════════════════════════════════
   ABLATION LABORATORY (screen 41)
══════════════════════════════════════════════════════ */
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
export type AblationFlagKey = "ucb" | "eord" | "compact" | "parallel";
export const ABLATION_FLAG_KEYS: AblationFlagKey[] = ["ucb", "eord", "compact", "parallel"];
export const ABLATION_RUNS: AblationRun[] = [
    {
        id: "ABL-012",
        name: "Full System",
        ucb: true,
        eord: true,
        compact: true,
        parallel: true,
        score: 0.812,
        cost: "$0.184",
        time: "18m",
        delta: 0,
    },
    {
        id: "ABL-011",
        name: "No UCB (Random)",
        ucb: false,
        eord: true,
        compact: true,
        parallel: true,
        score: 0.641,
        cost: "$0.312",
        time: "28m",
        delta: -0.171,
    },
    {
        id: "ABL-010",
        name: "No E_ord Gating",
        ucb: true,
        eord: false,
        compact: true,
        parallel: true,
        score: 0.724,
        cost: "$0.228",
        time: "22m",
        delta: -0.088,
    },
    {
        id: "ABL-009",
        name: "No Compaction",
        ucb: true,
        eord: true,
        compact: false,
        parallel: true,
        score: 0.798,
        cost: "$0.401",
        time: "19m",
        delta: -0.014,
    },
    {
        id: "ABL-008",
        name: "No Parallel Branching",
        ucb: true,
        eord: true,
        compact: true,
        parallel: false,
        score: 0.781,
        cost: "$0.192",
        time: "31m",
        delta: -0.031,
    },
    {
        id: "ABL-007",
        name: "No UCB + No E_ord",
        ucb: false,
        eord: false,
        compact: true,
        parallel: true,
        score: 0.512,
        cost: "$0.488",
        time: "38m",
        delta: -0.3,
    },
    {
        id: "ABL-006",
        name: "Baseline (All Off)",
        ucb: false,
        eord: false,
        compact: false,
        parallel: false,
        score: 0.401,
        cost: "$0.621",
        time: "54m",
        delta: -0.411,
    },
];
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

/* ══════════════════════════════════════════════════════
   STATISTICAL EVALUATION (screen 42)
══════════════════════════════════════════════════════ */
export const STAT_DATA = [
    {
        metric: "Mean Solve Rate",
        full: 0.812,
        noUCB: 0.641,
        noEord: 0.724,
        baseline: 0.401,
        pValue: 0.003,
    },
    {
        metric: "Median Cost/Task",
        full: 0.184,
        noUCB: 0.312,
        noEord: 0.228,
        baseline: 0.621,
        pValue: 0.008,
    },
    {
        metric: "Mean Attempts",
        full: 1.4,
        noUCB: 2.8,
        noEord: 1.9,
        baseline: 3.4,
        pValue: 0.001,
    },
    {
        metric: "Success@1",
        full: 0.681,
        noUCB: 0.412,
        noEord: 0.598,
        baseline: 0.289,
        pValue: 0.002,
    },
    {
        metric: "Success@3",
        full: 0.894,
        noUCB: 0.744,
        noEord: 0.831,
        baseline: 0.601,
        pValue: 0.011,
    },
    {
        metric: "Partial Rate",
        full: 0.122,
        noUCB: 0.189,
        noEord: 0.144,
        baseline: 0.221,
        pValue: 0.044,
    },
    {
        metric: "Fail Rate",
        full: 0.066,
        noUCB: 0.37,
        noEord: 0.132,
        baseline: 0.49,
        pValue: 0.001,
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
        color: "var(--color-hex-e31b23)",
        desc: "Egress-filtered ports (5432, 6379) block lateral movement. Agent correctly identifies and deprioritizes but wastes 2–4 attempts first.",
        fix: "Add network preflight probe before lateral attack dispatch",
    },
    {
        id: "FC-002",
        label: "PATCHED VULNERABILITY",
        count: 9,
        pct: 22,
        color: "var(--color-hex-d29922)",
        desc: "CVE target already patched in benchmark environment. E_ord reaches 2 (WEAK) but cannot confirm. Agent correctly rules out after 3 attempts.",
        fix: "Add CVE version check to RECON-SPEC pre-flight",
    },
    {
        id: "FC-003",
        label: "WAF BLOCKING",
        count: 7,
        pct: 17,
        color: "var(--color-hex-d29922)",
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
