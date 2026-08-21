import { useState } from "react";

type CostTab = "COST & USAGE" | "MODEL BREAKDOWN" | "CONTEXT STATE";

/* ── Data ── */
const SPECIALISTS_COST = [
    {
        id: "S-03",
        role: "INJECT-SPEC",
        model: "claude-sonnet-5",
        calls: 14,
        inputTok: 126800,
        outputTok: 38400,
        cost: 0.0842,
        pct: 38,
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
    },
];
const MODEL_ROWS = [
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
const CTX_ENTRIES = [
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
const TIMELINE = [
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
const TOTAL = 1.42;
const CEILING = 5.0;
export default function CostDashboard() {
    const [tab, setTab] = useState<CostTab>("COST & USAGE");
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-0"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <h1 className="mb-[12px] text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                    COST & USAGE
                </h1>
                <div className="flex">
                    {(["COST & USAGE", "MODEL BREAKDOWN", "CONTEXT STATE"] as CostTab[]).map(
                        (t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className="font-inherit cursor-pointer border-none bg-[transparent] px-[16px] py-[5px] text-[9px] tracking-[0.14em] whitespace-nowrap"
                                style={{
                                    borderBottom:
                                        t === tab
                                            ? "2px solid var(--color-hex-e31b23)"
                                            : "2px solid transparent",
                                    color:
                                        t === tab
                                            ? "var(--color-hex-f2f2f2)"
                                            : "var(--color-hex-444444)",
                                    marginBottom: -1,
                                }}
                            >
                                {t}
                            </button>
                        ),
                    )}
                </div>
            </div>
            {tab === "COST & USAGE" && <CostUsage />}
            {tab === "MODEL BREAKDOWN" && <ModelBreakdown />}
            {tab === "CONTEXT STATE" && <ContextState />}
        </div>
    );
}

/* ── TAB 1: COST & USAGE (screen 33) ── */
function CostUsage() {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* KPI row */}
            <div className="mb-6 grid grid-cols-4 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                {[
                    {
                        k: "TOTAL COST",
                        v: `$${TOTAL.toFixed(4)}`,
                        sub: `${((TOTAL / CEILING) * 100).toFixed(1)}% of ceiling`,
                        red: true,
                    },
                    {
                        k: "COST CEILING",
                        v: `$${CEILING.toFixed(2)}`,
                        sub: "mission limit",
                    },
                    {
                        k: "TOTAL CALLS",
                        v: "56",
                        sub: "LLM calls",
                    },
                    {
                        k: "TOTAL TOKENS",
                        v: "462K",
                        sub: "input + output",
                    },
                ].map((m, i, a) => (
                    <div
                        key={m.k}
                        className="bg-[var(--color-hex-0d0d0d)] px-[18px] py-[14px]"
                        style={{
                            borderRight:
                                i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                        }}
                    >
                        <div className="mb-[6px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {m.k}
                        </div>
                        <div
                            className="mb-[2px] text-[22px] font-bold"
                            style={{
                                color: m.red
                                    ? "var(--color-hex-e31b23)"
                                    : "var(--color-hex-f2f2f2)",
                            }}
                        >
                            {m.v}
                        </div>
                        <div className="text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                            {m.sub}
                        </div>
                    </div>
                ))}
            </div>

            {/* Burn rate bar */}
            <div className="mb-[24px]">
                <div className="mb-2 flex justify-between">
                    <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                        COST CEILING UTILIZATION
                    </span>
                    <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-3fb950)]">
                        {((TOTAL / CEILING) * 100).toFixed(1)}%
                    </span>
                </div>
                <div className="h-[6px] overflow-hidden rounded-[3px] bg-[var(--color-hex-1a1a1a)]">
                    <div
                        className="h-full rounded-[3px] bg-[var(--color-hex-3fb950)]"
                        style={{
                            width: `${(TOTAL / CEILING) * 100}%`,
                        }}
                    />
                </div>
                <div className="mt-1 flex justify-between">
                    <span className="text-[7.5px] text-[var(--color-hex-333333)]">
                        ${TOTAL.toFixed(4)} spent
                    </span>
                    <span className="text-[7.5px] text-[var(--color-hex-333333)]">
                        ${CEILING.toFixed(2)} ceiling
                    </span>
                </div>
            </div>

            {/* Cost by specialist */}
            <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                COST BY SPECIALIST
            </div>
            <div className="mb-[24px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                <div
                    className="flex bg-[var(--color-hex-0f0f0f)]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                    }}
                >
                    {["SPECIALIST", "MODEL", "CALLS", "INPUT", "OUTPUT", "COST", "SHARE"].map(
                        (h) => (
                            <div
                                key={h}
                                className="px-[12px] py-[5px] text-[7.5px] font-semibold tracking-[0.16em] text-[var(--color-hex-444444)]"
                                style={{
                                    flex: h === "SPECIALIST" || h === "MODEL" ? 2 : 1,
                                    textAlign:
                                        h === "COST" || h === "SHARE" || h === "CALLS"
                                            ? "right"
                                            : "left",
                                }}
                            >
                                {h}
                            </div>
                        ),
                    )}
                </div>
                {SPECIALISTS_COST.map((s, i) => (
                    <div
                        key={s.id}
                        className="flex items-center"
                        style={{
                            borderBottom:
                                i < SPECIALISTS_COST.length - 1
                                    ? "1px solid var(--color-hex-111111)"
                                    : "none",
                            background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                        }}
                    >
                        <div
                            className="px-[12px] py-[8px] text-[10px] font-bold tracking-[0.06em] text-[var(--color-hex-e31b23)]"
                            style={{
                                flex: 2,
                            }}
                        >
                            {s.role}
                        </div>
                        <div
                            className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]"
                            style={{
                                flex: 2,
                            }}
                        >
                            {s.model}
                        </div>
                        <div className="flex-1 px-[12px] py-[8px] text-right text-[9px] text-[var(--color-hex-666666)]">
                            {s.calls}
                        </div>
                        <div className="flex-1 px-[12px] py-[8px] text-right text-[9px] text-[var(--color-hex-555555)]">
                            {(s.inputTok / 1000).toFixed(0)}K
                        </div>
                        <div className="flex-1 px-[12px] py-[8px] text-right text-[9px] text-[var(--color-hex-555555)]">
                            {(s.outputTok / 1000).toFixed(0)}K
                        </div>
                        <div className="flex-1 px-[12px] py-[8px] text-right text-[10px] font-bold text-[var(--color-hex-f2f2f2)]">
                            ${s.cost.toFixed(4)}
                        </div>
                        <div className="flex-1 px-[12px] py-[8px] text-right">
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 6,
                                }}
                            >
                                <div className="h-[3px] w-[40px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                    <div
                                        className="h-full bg-[var(--color-hex-e31b23)]"
                                        style={{
                                            width: `${s.pct}%`,
                                        }}
                                    />
                                </div>
                                <span className="text-[8.5px] text-[var(--color-hex-555555)]">
                                    {s.pct}%
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cost timeline */}
            <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                SPEND TIMELINE
            </div>
            <div className="relative mb-[4px] h-[80px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-0a0a0a)]">
                {/* Bar chart */}
                {TIMELINE.map((t, i) => {
                    const maxCost = Math.max(...TIMELINE.map((x) => x.cost));
                    const barH = maxCost > 0 ? Math.round((t.cost / maxCost) * 60) : 0;
                    return (
                        <div
                            key={`timeline-${t.ts}-${t.event}`}
                            title={`${t.ts} · ${t.event} · $${t.cost.toFixed(4)}`}
                            className="absolute bottom-0 cursor-default"
                            style={{
                                left: `${(i / TIMELINE.length) * 100}%`,
                                width: `${(1 / TIMELINE.length) * 100 - 1}%`,
                                height: barH > 0 ? `${barH}px` : "1px",
                                background:
                                    barH > 0
                                        ? "var(--color-hex-e31b23)"
                                        : "var(--color-hex-292929)",
                                borderRadius: "1px 1px 0 0",
                            }}
                        />
                    );
                })}
            </div>
            <div className="flex justify-between text-[7.5px] text-[var(--color-hex-333333)]">
                <span>{TIMELINE[0].ts}</span>
                <span>{TIMELINE[TIMELINE.length - 1].ts}</span>
            </div>
        </div>
    );
}

/* ── TAB 2: MODEL BREAKDOWN (screen 34) ── */
function ModelBreakdown() {
    const MODEL_C: Record<string, string> = {
        "claude-sonnet-5": "var(--color-hex-e31b23)",
        "claude-haiku-4-5": "var(--color-hex-d29922)",
        "claude-opus-5": "var(--color-hex-3fb950)",
    };
    return (
        <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Model cards */}
            <div className="mb-6 flex flex-col gap-4">
                {MODEL_ROWS.map((m) => (
                    <div
                        key={m.model}
                        className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]"
                    >
                        <div
                            className="flex items-center gap-4 bg-[var(--color-hex-0d0d0d)] px-5 py-3"
                            style={{
                                borderBottom: "1px solid var(--color-hex-141414)",
                            }}
                        >
                            <div
                                className="h-[8px] w-[8px] shrink-0"
                                style={{
                                    borderRadius: "50%",
                                    background: MODEL_C[m.model] ?? "var(--color-hex-555555)",
                                }}
                            />
                            <span className="flex-1 text-[12px] font-bold tracking-[0.08em] text-[var(--color-hex-f2f2f2)]">
                                {m.model}
                            </span>
                            <span className="text-[9px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                                {m.provider}
                            </span>
                            <span
                                className="text-[14px] font-bold"
                                style={{
                                    color: MODEL_C[m.model] ?? "var(--color-hex-555555)",
                                }}
                            >
                                ${m.total.toFixed(4)}
                            </span>
                        </div>
                        <div className="px-5 py-4">
                            <div className="mb-[16px] h-[3px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full rounded-[2px]"
                                    style={{
                                        width: `${m.pct}%`,
                                        background: MODEL_C[m.model] ?? "var(--color-hex-555555)",
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-0">
                                {[
                                    {
                                        k: "CALLS",
                                        v: String(m.calls),
                                    },
                                    {
                                        k: "INPUT TOKENS",
                                        v: `${(m.inputTok / 1000).toFixed(0)}K`,
                                    },
                                    {
                                        k: "OUTPUT TOKENS",
                                        v: `${(m.outputTok / 1000).toFixed(0)}K`,
                                    },
                                    {
                                        k: "SHARE",
                                        v: `${m.pct}%`,
                                    },
                                ].map((stat, i, a) => (
                                    <div
                                        key={stat.k}
                                        style={{
                                            paddingRight: i < a.length - 1 ? 24 : 0,
                                        }}
                                    >
                                        <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                            {stat.k}
                                        </div>
                                        <div className="text-[14px] font-bold text-[var(--color-hex-a0a0a0)]">
                                            {stat.v}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                className="mt-4 grid grid-cols-2 gap-4"
                                style={{
                                    borderTop: "1px solid var(--color-hex-141414)",
                                    paddingTop: 12,
                                }}
                            >
                                <div>
                                    <div className="mb-[2px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        INPUT COST
                                    </div>
                                    <div className="text-[12px] font-bold text-[var(--color-hex-555555)]">
                                        ${m.inputCost.toFixed(4)}
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-[2px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        OUTPUT COST
                                    </div>
                                    <div className="text-[12px] font-bold text-[var(--color-hex-555555)]">
                                        ${m.outputCost.toFixed(4)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Summary table */}
            <div className="mb-[10px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                PRICING REFERENCE
            </div>
            <div className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                <div
                    className="flex bg-[var(--color-hex-0f0f0f)]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                    }}
                >
                    {["MODEL", "INPUT $/1M", "OUTPUT $/1M"].map((h) => (
                        <div
                            key={h}
                            className="px-[14px] py-[5px] text-[7.5px] font-semibold tracking-[0.16em] text-[var(--color-hex-444444)]"
                            style={{
                                flex: h === "MODEL" ? 2 : 1,
                            }}
                        >
                            {h}
                        </div>
                    ))}
                </div>
                {[
                    {
                        m: "claude-sonnet-5",
                        i: "$3.00",
                        o: "$15.00",
                    },
                    {
                        m: "claude-haiku-4-5",
                        i: "$0.80",
                        o: "$4.00",
                    },
                    {
                        m: "claude-opus-5",
                        i: "$15.00",
                        o: "$75.00",
                    },
                ].map((r, i, a) => (
                    <div
                        key={r.m}
                        className="flex"
                        style={{
                            borderBottom:
                                i < a.length - 1 ? "1px solid var(--color-hex-111111)" : "none",
                            background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                        }}
                    >
                        <div
                            className="px-[14px] py-[8px] text-[10px] font-semibold text-[var(--color-hex-666666)]"
                            style={{
                                flex: 2,
                            }}
                        >
                            {r.m}
                        </div>
                        <div className="flex-1 px-[14px] py-[8px] text-[10px] text-[var(--color-hex-555555)]">
                            {r.i}
                        </div>
                        <div className="flex-1 px-[14px] py-[8px] text-[10px] text-[var(--color-hex-555555)]">
                            {r.o}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── TAB 3: CONTEXT STATE (screen 35) ── */
function ContextState() {
    const [sel, setSel] = useState(CTX_ENTRIES[2]);
    const stc: Record<string, string> = {
        COMPACTED: "var(--color-hex-d29922)",
        ACTIVE: "var(--color-hex-3fb950)",
        IDLE: "var(--color-hex-444444)",
    };
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* KPIs */}
                <div className="mb-6 grid grid-cols-3 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                    {[
                        {
                            k: "TOTAL CONTEXT",
                            v: "346K",
                            sub: "across specialists",
                        },
                        {
                            k: "COMPACTION EVENTS",
                            v: "3",
                            sub: "context saves",
                        },
                        {
                            k: "TOKENS SAVED",
                            v: "184K",
                            sub: "via compaction",
                        },
                    ].map((m, i, a) => (
                        <div
                            key={m.k}
                            className="bg-[var(--color-hex-0d0d0d)] px-[18px] py-[14px]"
                            style={{
                                borderRight:
                                    i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            }}
                        >
                            <div className="mb-[6px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                {m.k}
                            </div>
                            <div className="mb-[2px] text-[22px] font-bold text-[var(--color-hex-f2f2f2)]">
                                {m.v}
                            </div>
                            <div className="text-[8px] text-[var(--color-hex-333333)]">{m.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Context bars */}
                {CTX_ENTRIES.map((s) => {
                    const pct = Math.round((s.used / s.max) * 100);
                    const bc = (() => {
                        if (pct > 85) {
                            return "var(--color-hex-ff2a32)";
                        }
                        if (pct > 60) {
                            return "var(--color-hex-d29922)";
                        }
                        return "var(--color-hex-3fb950)";
                    })();
                    const isSel = sel.id === s.id;
                    return (
                        <div
                            key={s.id}
                            onClick={() => setSel(s)}
                            onKeyDown={(ev) => {
                                if (ev.key === "Enter" || ev.key === " ") {
                                    setSel(s);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            className="mb-[8px] cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] px-[16px] py-[14px]"
                            style={{
                                background: isSel ? "var(--color-hex-0d0d0d)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = isSel
                                    ? "var(--color-hex-0d0d0d)"
                                    : "transparent")
                            }
                        >
                            <div className="mb-3 flex items-center gap-3">
                                <span className="flex-1 text-[10px] font-bold tracking-[0.08em] text-[var(--color-hex-a0a0a0)]">
                                    {s.role}
                                </span>
                                <span
                                    className="text-[8px] font-semibold tracking-[0.14em]"
                                    style={{
                                        color: stc[s.state],
                                    }}
                                >
                                    {s.state}
                                </span>
                                {s.compacted > 0 && (
                                    <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-d29922)]">
                                        COMPACTED ×{s.compacted}
                                    </span>
                                )}
                                <span
                                    className="text-[9px] font-bold"
                                    style={{
                                        color: bc,
                                    }}
                                >
                                    {pct}%
                                </span>
                            </div>
                            <div className="mb-[6px] h-[5px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full rounded-[2px]"
                                    style={{
                                        width: `${pct}%`,
                                        background: bc,
                                    }}
                                />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[8px] text-[var(--color-hex-333333)]">
                                    {(s.used / 1024).toFixed(0)}K / {s.max / 1024}K tokens
                                </span>
                                <span className="text-[8px] text-[var(--color-hex-333333)]">
                                    ${s.cost.toFixed(4)} this session
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail */}
            <div
                className="flex w-[260px] flex-shrink-0 flex-col overflow-y-auto px-[14px] py-[16px]"
                style={{
                    borderLeft: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[4px] text-[11px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                    {sel.role}
                </div>
                <div
                    className="mb-[16px] text-[8.5px] font-semibold tracking-[0.14em]"
                    style={{
                        color: stc[sel.state],
                    }}
                >
                    {sel.state}
                </div>
                {[
                    {
                        k: "CONTEXT USED",
                        v: `${(sel.used / 1024).toFixed(0)}K tokens`,
                    },
                    {
                        k: "CONTEXT MAX",
                        v: `${sel.max / 1024}K tokens`,
                    },
                    {
                        k: "UTILIZATION",
                        v: `${Math.round((sel.used / sel.max) * 100)}%`,
                    },
                    {
                        k: "COMPACTIONS",
                        v: String(sel.compacted),
                    },
                    {
                        k: "SESSION SPEND",
                        v: `$${sel.cost.toFixed(4)}`,
                    },
                    {
                        k: "SESSION TOKENS",
                        v: `${(sel.sessionTok / 1000).toFixed(1)}K`,
                    },
                ].map((r) => (
                    <div key={r.k} className="mb-[12px]">
                        <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {r.k}
                        </div>
                        <div className="text-[13px] font-bold text-[var(--color-hex-f2f2f2)]">
                            {r.v}
                        </div>
                    </div>
                ))}
                {/* Context state diagram */}
                <div
                    className="mt-[8px]"
                    style={{
                        borderTop: "1px solid var(--color-hex-1a1a1a)",
                        paddingTop: 14,
                    }}
                >
                    <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        CONTEXT LIFECYCLE
                    </div>
                    {[
                        "FULL CONTEXT",
                        "→ COMPACTION TRIGGER",
                        "SUMMARY GENERATED",
                        "→ CONTEXT REPLACED",
                        "ACTIVE TASK PRESERVED",
                    ].map((node, i) => (
                        <div key={`lifecycle-${node}`} className="flex flex-col items-start">
                            {i > 0 && (
                                <div className="ml-[9px] h-[12px] w-[1px] bg-[var(--color-hex-1e1e1e)]" />
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <div
                                    className="h-[6px] w-[6px] shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                        border: "1px solid",
                                        borderColor: (() => {
                                            if (sel.compacted > 0 && i === 4) {
                                                return "var(--color-hex-3fb950)";
                                            }
                                            if (i === 0 && sel.state === "ACTIVE") {
                                                return "var(--color-hex-e31b23)";
                                            }
                                            return "var(--color-hex-333333)";
                                        })(),
                                        background:
                                            i === 4 && sel.compacted > 0
                                                ? "var(--color-hex-3fb950)"
                                                : "transparent",
                                    }}
                                />
                                <span
                                    className="text-[8.5px] tracking-[0.06em]"
                                    style={{
                                        color: (() => {
                                            if (i === 0 && sel.state === "ACTIVE") {
                                                return "var(--color-hex-e31b23)";
                                            }
                                            if (i === 4 && sel.compacted > 0) {
                                                return "var(--color-hex-3fb950)";
                                            }
                                            return "var(--color-hex-333333)";
                                        })(),
                                    }}
                                >
                                    {node}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
