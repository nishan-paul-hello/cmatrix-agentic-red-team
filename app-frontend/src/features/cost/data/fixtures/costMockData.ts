export interface SpecialistCost {
    id: string;
    role: string;
    model: string;
    calls: number;
    inputTok: number;
    outputTok: number;
    cost: number;
    pct: number;
    /** Attack surface this specialist operated on — used for per-surface cost rollup (§12.2) */
    surface: "WEB" | "GRAPHQL" | "MULTI-HOST";
    /** Mission this cost entry belongs to */
    missionId: string;
}
export interface CostTimeline {
    ts: string;
    event: string;
    cost: number;
}

export type CostTab = "COST & USAGE" | "MODEL BREAKDOWN" | "CONTEXT STATE" | "PER-SURFACE ROLLUP";

/** Per-surface cost-per-exploit rollup — required by §12.2:
 *  "cost reporting: cost_per_run / pass@1_rate reported alongside every pass-rate number, per surface" */
export interface SurfaceRollupRow {
    surface: "WEB" | "GRAPHQL" | "MULTI-HOST";
    totalCost: string;
    runs: number;
    passAt1Rate: number;
    costPerExploit: string;
    avgTimeMin: number;
}
export const PER_SURFACE_ROLLUP: SurfaceRollupRow[] = [
    {
        surface: "WEB",
        totalCost: "$4.21",
        runs: 18,
        passAt1Rate: 0.681,
        costPerExploit: "$0.343",
        avgTimeMin: 18,
    },
    {
        surface: "GRAPHQL",
        totalCost: "$1.84",
        runs: 6,
        passAt1Rate: 0.612,
        costPerExploit: "$0.501",
        avgTimeMin: 28,
    },
    {
        surface: "MULTI-HOST",
        totalCost: "$3.12",
        runs: 4,
        passAt1Rate: 0.422,
        costPerExploit: "$1.849",
        avgTimeMin: 47,
    },
];

/* ── Data ── */
export const SPECIALISTS_COST: SpecialistCost[] = [
    {
        id: "S-03",
        role: "INJECT-SPEC",
        model: "claude-sonnet-5",
        calls: 14,
        inputTok: 126800,
        outputTok: 38400,
        cost: 0.0842,
        pct: 38,
        surface: "WEB",
        missionId: "CVE-001",
    },
    {
        id: "S-02",
        role: "AUTH-SPEC",
        model: "claude-sonnet-5",
        calls: 9,
        inputTok: 84200,
        outputTok: 21000,
        cost: 0.0541,
        pct: 24,
        surface: "WEB",
        missionId: "CVE-001",
    },
    {
        id: "S-01",
        role: "RECON-SPEC",
        model: "claude-sonnet-5",
        calls: 8,
        inputTok: 72400,
        outputTok: 18200,
        cost: 0.0449,
        pct: 20,
        surface: "WEB",
        missionId: "CVE-001",
    },
    {
        id: "S-04",
        role: "VALID-AGENT",
        model: "claude-haiku-4-5",
        calls: 6,
        inputTok: 28600,
        outputTok: 9400,
        cost: 0.0112,
        pct: 5,
        surface: "WEB",
        missionId: "CVE-001",
    },
    {
        id: "S-05",
        role: "NETWORK-SPEC",
        model: "claude-haiku-4-5",
        calls: 3,
        inputTok: 14200,
        outputTok: 4100,
        cost: 0.0052,
        pct: 2,
        surface: "WEB",
        missionId: "CVE-001",
    },
    {
        id: "SYS",
        role: "TEAM-MANAGER",
        model: "claude-opus-5",
        calls: 16,
        inputTok: 44200,
        outputTok: 22800,
        cost: 0.0234,
        pct: 11,
        surface: "WEB",
        missionId: "CVE-001",
    },
];

export type ModelRow = (typeof MODEL_ROWS)[0];
export const MODEL_ROWS = [
    {
        model: "claude-sonnet-5",
        provider: "Anthropic",
        calls: 31,
        inputTok: 283400,
        outputTok: 77600,
        inputCost: 0.0851,
        outputCost: 0.1163,
        total: 0.2014,
        pct: 90,
    },
    {
        model: "claude-haiku-4-5",
        provider: "Anthropic",
        calls: 9,
        inputTok: 42800,
        outputTok: 13500,
        inputCost: 0.0043,
        outputCost: 0.0054,
        total: 0.0097,
        pct: 4,
    },
    {
        model: "claude-opus-5",
        provider: "Anthropic",
        calls: 16,
        inputTok: 44200,
        outputTok: 22800,
        inputCost: 0.0133,
        outputCost: 0.0091,
        total: 0.0224,
        pct: 10,
    },
];
export type ContextEntry = (typeof CTX_ENTRIES)[0];
export const CTX_ENTRIES = [
    {
        id: "S-01",
        role: "RECON-SPEC",
        state: "COMPACTED",
        used: 94208,
        max: 128000,
        compacted: 2,
        sessionTok: 3900,
        cost: 0.0039,
    },
    {
        id: "S-02",
        role: "AUTH-SPEC",
        state: "COMPACTED",
        used: 81920,
        max: 128000,
        compacted: 1,
        sessionTok: 2100,
        cost: 0.0021,
    },
    {
        id: "S-03",
        role: "INJECT-SPEC",
        state: "ACTIVE",
        used: 112640,
        max: 128000,
        compacted: 0,
        sessionTok: 14400,
        cost: 0.0144,
    },
    {
        id: "S-04",
        role: "VALID-AGENT",
        state: "ACTIVE",
        used: 36864,
        max: 128000,
        compacted: 0,
        sessionTok: 4800,
        cost: 0.0048,
    },
    {
        id: "S-05",
        role: "NETWORK-SPEC",
        state: "IDLE",
        used: 20480,
        max: 128000,
        compacted: 0,
        sessionTok: 1200,
        cost: 0.0012,
    },
];
export const TIMELINE: CostTimeline[] = [
    {
        ts: "06:12:00",
        event: "Mission start",
        cost: 0.0021,
    },
    {
        ts: "06:15:20",
        event: "Recon evaluation",
        cost: 0.0018,
    },
    {
        ts: "06:20:00",
        event: "UCB rescore ×2",
        cost: 0.0038,
    },
    {
        ts: "06:22:14",
        event: "Auth bypass",
        cost: 0.0,
    },
    {
        ts: "06:24:00",
        event: "Auth eval + branch",
        cost: 0.0053,
    },
    {
        ts: "06:25:33",
        event: "IDOR confirmed",
        cost: 0.0019,
    },
    {
        ts: "06:28:47",
        event: "SQLI probe ×3",
        cost: 0.0,
    },
    {
        ts: "06:29:58",
        event: "Compaction",
        cost: 0.0,
    },
    {
        ts: "06:30:51",
        event: "Time-based confirm",
        cost: 0.0,
    },
    {
        ts: "06:30:58",
        event: "Evaluation",
        cost: 0.0024,
    },
];
export const TOTAL = 1.42;
export const CEILING = 5.0;

/* ── TAB 1: COST & USAGE (screen 33) ── */

/* ── TAB 2: MODEL BREAKDOWN (screen 34) ── */

/* ── TAB 3: CONTEXT STATE (screen 35) ── */

export async function getCostData() {
    return new Promise<{
        SPECIALISTS_COST: typeof SPECIALISTS_COST;
        MODEL_ROWS: typeof MODEL_ROWS;
        CTX_ENTRIES: typeof CTX_ENTRIES;
        TIMELINE: typeof TIMELINE;
        TOTAL: typeof TOTAL;
        CEILING: typeof CEILING;
    }>((resolve) => {
        setTimeout(() => {
            resolve({
                SPECIALISTS_COST,
                MODEL_ROWS,
                CTX_ENTRIES,
                TIMELINE,
                TOTAL,
                CEILING,
            });
        }, 100);
    });
}
