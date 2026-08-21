import { useState } from "react";

interface TrajStep {
    step: number;
    ts: string;
    type: "DECISION" | "EXECUTION" | "EVALUATION" | "BRANCH" | "COMPACTION" | "VALIDATION";
    agent: string;
    summary: string;
    vdgDelta?: string;
    elDelta?: string;
    eordDelta?: string;
    cost: string;
    tokens: string;
    status: "SUCCESS" | "FAILED" | "RUNNING" | "TIMEOUT";
}
const STEPS: TrajStep[] = [
    {
        step: 1,
        ts: "06:12:00",
        type: "DECISION",
        agent: "TEAM-MGR",
        summary:
            "Mission initialized. UCB scoring computed for 12 VDG candidates. RECON-001 selected (UCB=0.94).",
        vdgDelta: "12 CANDIDATE",
        elDelta: "+0 facts",
        eordDelta: "—",
        cost: "$0.0021",
        tokens: "2,100",
        status: "SUCCESS",
    },
    {
        step: 2,
        ts: "06:13:45",
        type: "EXECUTION",
        agent: "RECON-SPEC",
        summary:
            "Service scan dispatched via execution agent (nmap -sV). 8 services discovered, 3 open.",
        vdgDelta: "RECON-001 IN_PROGRESS",
        elDelta: "+8 facts",
        eordDelta: "—",
        cost: "$0.0000",
        tokens: "0",
        status: "SUCCESS",
    },
    {
        step: 3,
        ts: "06:15:20",
        type: "EVALUATION",
        agent: "RECON-SPEC",
        summary: "Scan output evaluated. 3 services confirmed open. Endpoints spider queued.",
        vdgDelta: "—",
        elDelta: "+3 services",
        eordDelta: "—",
        cost: "$0.0018",
        tokens: "1,800",
        status: "SUCCESS",
    },
    {
        step: 4,
        ts: "06:18:31",
        type: "EXECUTION",
        agent: "RECON-SPEC",
        summary: "Endpoint spider complete. 12 endpoints, 3 require authentication.",
        vdgDelta: "AUTH-001 ELIGIBLE",
        elDelta: "+12 endpoints",
        eordDelta: "—",
        cost: "$0.0000",
        tokens: "0",
        status: "SUCCESS",
    },
    {
        step: 5,
        ts: "06:20:00",
        type: "DECISION",
        agent: "TEAM-MGR",
        summary: "UCB rescore. AUTH-001 UCB=0.91 — auth bypass queued. RECON-001 → COMPLETED.",
        vdgDelta: "RECON-001 COMPLETED AUTH-001 IN_PROGRESS",
        elDelta: "—",
        eordDelta: "—",
        cost: "$0.0019",
        tokens: "1,900",
        status: "SUCCESS",
    },
    {
        step: 6,
        ts: "06:22:14",
        type: "EXECUTION",
        agent: "AUTH-SPEC",
        summary:
            "JWT brute-force (hashcat). Secret cracked in 48s: password123. Admin token forged.",
        vdgDelta: "AUTH-001 EXPLOITED",
        elDelta: "+2 credentials",
        eordDelta: "2→4",
        cost: "$0.0000",
        tokens: "0",
        status: "SUCCESS",
    },
    {
        step: 7,
        ts: "06:24:00",
        type: "EVALUATION",
        agent: "AUTH-SPEC",
        summary:
            "Auth bypass confirmed. E_ord raised to 4. SQLI-001, IDOR-008 now eligible for scheduling.",
        vdgDelta: "SQLI-001 ELIGIBLE IDOR-008 ELIGIBLE",
        elDelta: "+1 session",
        eordDelta: "2→4",
        cost: "$0.0022",
        tokens: "2,200",
        status: "SUCCESS",
    },
    {
        step: 8,
        ts: "06:25:00",
        type: "BRANCH",
        agent: "TEAM-MGR",
        summary:
            "PARALLEL BRANCH: INJECT-SPEC (SQLI-001, UCB=0.824) and RECON-SPEC (IDOR-008, UCB=0.762) spawned concurrently.",
        vdgDelta: "SQLI-001 IN_PROGRESS IDOR-008 IN_PROGRESS",
        elDelta: "—",
        eordDelta: "—",
        cost: "$0.0031",
        tokens: "3,100",
        status: "SUCCESS",
    },
    {
        step: 9,
        ts: "06:25:33",
        type: "EXECUTION",
        agent: "RECON-SPEC",
        summary:
            "IDOR enumeration on /api/users/:id. Cross-account access confirmed (id=2 with id=1 token).",
        vdgDelta: "IDOR-008 EXPLOITED",
        elDelta: "+1 finding",
        eordDelta: "1→3",
        cost: "$0.0000",
        tokens: "0",
        status: "SUCCESS",
    },
    {
        step: 10,
        ts: "06:28:47",
        type: "EXECUTION",
        agent: "INJECT-SPEC",
        summary: "SQL error probe: id=1' → HTTP 500 with SQL syntax error in body.",
        vdgDelta: "—",
        elDelta: "+1 fact",
        eordDelta: "2→3",
        cost: "$0.0000",
        tokens: "0",
        status: "SUCCESS",
    },
    {
        step: 11,
        ts: "06:29:03",
        type: "EXECUTION",
        agent: "NETWORK-SPEC",
        summary:
            "Lateral pivot attempt on port 5432. Port filtered — timeout. Technique ruled out.",
        vdgDelta: "—",
        elDelta: "—",
        eordDelta: "—",
        cost: "$0.0000",
        tokens: "0",
        status: "TIMEOUT",
    },
    {
        step: 12,
        ts: "06:29:44",
        type: "EXECUTION",
        agent: "INJECT-SPEC",
        summary:
            "Union-based probe failed (column count mismatch). Pivoting to time-based technique.",
        vdgDelta: "—",
        elDelta: "+1 fact",
        eordDelta: "—",
        cost: "$0.0000",
        tokens: "0",
        status: "FAILED",
    },
    {
        step: 13,
        ts: "06:29:58",
        type: "COMPACTION",
        agent: "INJECT-SPEC",
        summary:
            "Context compacted. 94K → 48K tokens. Historical probe outputs summarized. Active task state preserved.",
        vdgDelta: "—",
        elDelta: "—",
        eordDelta: "—",
        cost: "$0.0000",
        tokens: "-46K",
        status: "SUCCESS",
    },
    {
        step: 14,
        ts: "06:30:51",
        type: "EXECUTION",
        agent: "INJECT-SPEC",
        summary:
            "Time-based SQLi confirmed: 4.18s RTT on SLEEP(4) payload. 2× confirmed. E_ord 3→4.",
        vdgDelta: "SQLI-001 IN_PROGRESS",
        elDelta: "+2 facts",
        eordDelta: "3→4",
        cost: "$0.0000",
        tokens: "0",
        status: "SUCCESS",
    },
    {
        step: 15,
        ts: "06:30:58",
        type: "EVALUATION",
        agent: "INJECT-SPEC",
        summary:
            "Timing confirmed statistically (>3σ). Raising E_ord. DB-ACCESS-002 and RCE-007 dependency edges now eligible.",
        vdgDelta: "DB-ACCESS-002 ELIGIBLE",
        elDelta: "+2 facts",
        eordDelta: "3→4",
        cost: "$0.0024",
        tokens: "2,400",
        status: "SUCCESS",
    },
    {
        step: 16,
        ts: "06:31:04",
        type: "VALIDATION",
        agent: "VALID-AGENT",
        summary: "Oracle test dispatched: CVE-BENCH FILE ACCESS. Awaiting oracle response.",
        vdgDelta: "SQLI-001 IN_PROGRESS",
        elDelta: "—",
        eordDelta: "—",
        cost: "$0.0000",
        tokens: "0",
        status: "RUNNING",
    },
];
const TYPE_C: Record<
    TrajStep["type"],
    {
        color: string;
        bg: string;
    }
> = {
    DECISION: {
        color: "var(--color-hex-e31b23)",
        bg: "var(--color-hex-120608)",
    },
    EXECUTION: {
        color: "var(--color-hex-444444)",
        bg: "var(--color-hex-0d0d0d)",
    },
    EVALUATION: {
        color: "var(--color-hex-a0a0a0)",
        bg: "var(--color-hex-0f0f0f)",
    },
    BRANCH: {
        color: "var(--color-hex-d29922)",
        bg: "var(--color-hex-110e00)",
    },
    COMPACTION: {
        color: "var(--color-hex-3b82f6)",
        bg: "var(--color-hex-060e1a)",
    },
    VALIDATION: {
        color: "var(--color-hex-3fb950)",
        bg: "var(--color-hex-061a0c)",
    },
};
const STATUS_C: Record<TrajStep["status"], string> = {
    SUCCESS: "var(--color-hex-3fb950)",
    FAILED: "var(--color-hex-ff2a32)",
    RUNNING: "var(--color-hex-d29922)",
    TIMEOUT: "var(--color-hex-555555)",
};
export default function TrajectoryPage() {
    const [sel, setSel] = useState<TrajStep | null>(null);
    const [filter, setFilter] = useState<TrajStep["type"] | "ALL">("ALL");
    const types: (TrajStep["type"] | "ALL")[] = [
        "ALL",
        "DECISION",
        "EXECUTION",
        "EVALUATION",
        "BRANCH",
        "COMPACTION",
        "VALIDATION",
    ];
    const visible = filter === "ALL" ? STEPS : STEPS.filter((s) => s.type === filter);
    const totCost = STEPS.reduce((s, x) => s + parseFloat(x.cost.replace("$", "")), 0);
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Header */}
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        TRAJECTORY
                    </h1>
                    <div className="flex items-center gap-5">
                        <Stat label="TOTAL STEPS" value={String(STEPS.length)} />
                        <Stat
                            label="DECISIONS"
                            value={String(STEPS.filter((s) => s.type === "DECISION").length)}
                            red
                        />
                        <Stat label="TOTAL COST" value={`$${totCost.toFixed(4)}`} />
                    </div>
                </div>
            </div>
            {/* Filter strip */}
            <div
                className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-6 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                }}
            >
                {types.map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className="font-inherit cursor-pointer rounded-[2px] px-[10px] py-[3px] text-[8px] tracking-[0.14em]"
                        style={{
                            background:
                                filter === t
                                    ? t === "ALL"
                                        ? "var(--color-hex-1a1a1a)"
                                        : (TYPE_C[t]?.bg ?? "var(--color-hex-111111)")
                                    : "transparent",
                            border: `1px solid ${filter === t ? (t === "ALL" ? "var(--color-hex-444444)" : `${TYPE_C[t]?.color ?? "var(--color-hex-444444)"}66`) : "var(--color-hex-1e1e1e)"}`,
                            color:
                                filter === t
                                    ? t === "ALL"
                                        ? "var(--color-hex-f2f2f2)"
                                        : (TYPE_C[t]?.color ?? "var(--color-hex-f2f2f2)")
                                    : "var(--color-hex-444444)",
                        }}
                    >
                        {t}
                    </button>
                ))}
                <span className="ml-auto text-[8px] tracking-[0.12em] text-[var(--color-hex-333333)]">
                    {visible.length} EVENTS
                </span>
            </div>
            {/* Main */}
            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* Timeline */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {visible.map((step, i) => {
                        const tc = TYPE_C[step.type];
                        const isSel = sel?.step === step.step;
                        return (
                            <div key={step.step} className="flex items-start gap-0">
                                {/* Spine */}
                                <div className="mt-[2px] flex w-[32px] flex-shrink-0 flex-col items-center">
                                    <div
                                        className="h-[10px] w-[10px] shrink-0"
                                        style={{
                                            borderRadius: "50%",
                                            border: `1px solid ${tc.color}`,
                                            background: isSel
                                                ? tc.color
                                                : step.status === "RUNNING"
                                                  ? tc.color
                                                  : "transparent",
                                            zIndex: 1,
                                        }}
                                    />
                                    {i < visible.length - 1 && (
                                        <div className="min-h-[28px] w-[1px] flex-1 bg-[var(--color-hex-1a1a1a)]" />
                                    )}
                                </div>
                                {/* Card */}
                                <div
                                    onClick={() => setSel(isSel ? null : step)}
                                    className="flex-1 cursor-pointer"
                                    style={{
                                        marginBottom: i < visible.length - 1 ? 0 : 0,
                                        paddingBottom: i < visible.length - 1 ? 12 : 0,
                                    }}
                                >
                                    <div
                                        className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)]"
                                        style={{
                                            background: isSel
                                                ? "var(--color-hex-0d0d0d)"
                                                : "transparent",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                "var(--color-hex-0a0a0a)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = isSel
                                                ? "var(--color-hex-0d0d0d)"
                                                : "transparent")
                                        }
                                    >
                                        <div
                                            className="flex items-center gap-3 px-4 py-2"
                                            style={{
                                                borderBottom: "1px solid var(--color-hex-141414)",
                                                background: tc.bg,
                                            }}
                                        >
                                            <span className="min-w-[20px] text-[8px] tracking-[0.12em] text-[var(--color-hex-333333)]">
                                                #{String(step.step).padStart(2, "0")}
                                            </span>
                                            <span
                                                className="rounded-[2px] px-[6px] py-[1px] text-[8px] font-bold tracking-[0.14em]"
                                                style={{
                                                    color: tc.color,
                                                    border: `1px solid ${tc.color}44`,
                                                }}
                                            >
                                                {step.type}
                                            </span>
                                            <span className="text-[9px] font-semibold tracking-[0.06em] text-[var(--color-hex-e31b23)]">
                                                {step.agent}
                                            </span>
                                            <span className="ml-auto text-[8px] text-[var(--color-hex-333333)]">
                                                {step.ts}
                                            </span>
                                            <span
                                                className="text-[8px] font-semibold tracking-[0.12em]"
                                                style={{
                                                    color: STATUS_C[step.status],
                                                }}
                                            >
                                                {step.status}
                                            </span>
                                        </div>
                                        <div className="px-4 py-3">
                                            <p
                                                className="text-[10px] leading-[1.7] text-[var(--color-hex-666666)]"
                                                style={{
                                                    margin: 0,
                                                    marginBottom: isSel ? 10 : 0,
                                                }}
                                            >
                                                {step.summary}
                                            </p>
                                            {isSel && (
                                                <div
                                                    className="mt-3 grid grid-cols-2 gap-x-8 gap-y-3"
                                                    style={{
                                                        borderTop:
                                                            "1px solid var(--color-hex-141414)",
                                                        paddingTop: 12,
                                                    }}
                                                >
                                                    {[
                                                        {
                                                            k: "VDG DELTA",
                                                            v: step.vdgDelta ?? "—",
                                                        },
                                                        {
                                                            k: "EL DELTA",
                                                            v: step.elDelta ?? "—",
                                                        },
                                                        {
                                                            k: "E_ORD DELTA",
                                                            v: step.eordDelta ?? "—",
                                                        },
                                                        {
                                                            k: "COST",
                                                            v: step.cost,
                                                        },
                                                        {
                                                            k: "TOKENS",
                                                            v: step.tokens,
                                                        },
                                                    ].map((r) => (
                                                        <div key={r.k}>
                                                            <div className="mb-[2px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                                                {r.k}
                                                            </div>
                                                            <div
                                                                className="text-[10px]"
                                                                style={{
                                                                    color:
                                                                        r.k === "COST" ||
                                                                        r.k === "TOKENS"
                                                                            ? "var(--color-hex-555555)"
                                                                            : r.k ===
                                                                                    "E_ORD DELTA" &&
                                                                                r.v !== "—"
                                                                              ? "var(--color-hex-3fb950)"
                                                                              : "var(--color-hex-888888)",
                                                                }}
                                                            >
                                                                {r.v}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Right summary panel */}
                <div
                    className="flex w-[220px] flex-shrink-0 flex-col overflow-y-auto px-[14px] py-[16px]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div className="mb-[14px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        STEP TYPES
                    </div>
                    {(
                        [
                            "DECISION",
                            "EXECUTION",
                            "EVALUATION",
                            "BRANCH",
                            "COMPACTION",
                            "VALIDATION",
                        ] as TrajStep["type"][]
                    ).map((t) => {
                        const count = STEPS.filter((s) => s.type === t).length;
                        const tc = TYPE_C[t];
                        return (
                            <div key={t} className="mb-3 flex items-center gap-2">
                                <div
                                    className="h-[6px] w-[6px] shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                        background: tc.color,
                                    }}
                                />
                                <span className="flex-1 text-[9px] tracking-[0.06em] text-[var(--color-hex-555555)]">
                                    {t}
                                </span>
                                <span
                                    className="text-[10px] font-bold"
                                    style={{
                                        color: tc.color,
                                    }}
                                >
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                    <div
                        className="h-[1px] bg-[var(--color-hex-1a1a1a)]"
                        style={{
                            margin: "12px 0",
                        }}
                    />
                    <div className="mb-[14px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        OUTCOMES
                    </div>
                    {(["SUCCESS", "FAILED", "TIMEOUT", "RUNNING"] as TrajStep["status"][]).map(
                        (s) => {
                            const count = STEPS.filter((x) => x.status === s).length;
                            return count > 0 ? (
                                <div key={s} className="mb-3 flex items-center gap-2">
                                    <div
                                        className="h-[6px] w-[6px] shrink-0"
                                        style={{
                                            borderRadius: "50%",
                                            background: STATUS_C[s],
                                        }}
                                    />
                                    <span className="flex-1 text-[9px] text-[var(--color-hex-555555)]">
                                        {s}
                                    </span>
                                    <span
                                        className="text-[10px] font-bold"
                                        style={{
                                            color: STATUS_C[s],
                                        }}
                                    >
                                        {count}
                                    </span>
                                </div>
                            ) : null;
                        },
                    )}
                </div>
            </div>
        </div>
    );
}
function Stat({ label, value, red }: { label: string; value: string; red?: boolean }) {
    return (
        <div className="flex flex-col items-end">
            <div className="mb-[2px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                {label}
            </div>
            <div
                className="text-[14px] font-bold"
                style={{
                    color: red ? "var(--color-hex-e31b23)" : "var(--color-hex-f2f2f2)",
                }}
            >
                {value}
            </div>
        </div>
    );
}
