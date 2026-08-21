import { useState } from "react";
type LabTab = "ABLATION" | "STATISTICAL EVALUATION" | "FAILURE ANALYSIS";
export default function ResearchLab({ initialTab }: { initialTab?: LabTab }) {
    const [tab, setTab] = useState<LabTab>(initialTab ?? "ABLATION");
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-0"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    RESEARCH
                </div>
                <h1 className="mb-[12px] text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                    RESEARCH LAB
                </h1>
                <div className="flex">
                    {(["ABLATION", "STATISTICAL EVALUATION", "FAILURE ANALYSIS"] as LabTab[]).map(
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
            {tab === "ABLATION" && <AblationLab />}
            {tab === "STATISTICAL EVALUATION" && <StatisticalEval />}
            {tab === "FAILURE ANALYSIS" && <FailureAnalysis />}
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   ABLATION LABORATORY (screen 41)
══════════════════════════════════════════════════════ */
interface AblationRun {
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
type AblationFlagKey = "ucb" | "eord" | "compact" | "parallel";
const ABLATION_FLAG_KEYS: AblationFlagKey[] = ["ucb", "eord", "compact", "parallel"];
const ABLATION_RUNS: AblationRun[] = [
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
const COMPONENTS: {
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
function AblationLab() {
    const [sel, setSel] = useState(ABLATION_RUNS[0]);
    const baseline = ABLATION_RUNS[ABLATION_RUNS.length - 1];
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            {/* Left: config + results */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-[14px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    ABLATION RUNS — SELECT TO COMPARE
                </div>
                <table className="mb-[24px] w-full border-collapse">
                    <thead>
                        <tr className="bg-[var(--color-hex-0f0f0f)]">
                            {[
                                "RUN",
                                "NAME",
                                "UCB",
                                "E_ORD",
                                "COMPACT",
                                "PARALLEL",
                                "SCORE",
                                "Δ SCORE",
                                "COST",
                                "TIME",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-[12px] py-[5px] text-left text-[7.5px] font-semibold tracking-[0.14em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ABLATION_RUNS.map((r) => (
                            <tr
                                key={r.id}
                                onClick={() => setSel(r)}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                    background:
                                        sel.id === r.id ? "var(--color-hex-0d0d0d)" : "transparent",
                                    borderLeft:
                                        sel.id === r.id
                                            ? "2px solid var(--color-hex-e31b23)"
                                            : "2px solid transparent",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        sel.id === r.id ? "var(--color-hex-0d0d0d)" : "transparent")
                                }
                            >
                                <td className="px-[12px] py-[8px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                    {r.id}
                                </td>
                                <td className="px-[12px] py-[8px] text-[9.5px] text-[var(--color-hex-888888)]">
                                    {r.name}
                                </td>
                                {ABLATION_FLAG_KEYS.map((k) => (
                                    <td key={k} className="px-[12px] py-[8px] text-center">
                                        <span
                                            className="text-[10px] font-bold"
                                            style={{
                                                color: r[k]
                                                    ? "var(--color-hex-3fb950)"
                                                    : "var(--color-hex-333333)",
                                            }}
                                        >
                                            {r[k] ? "✓" : "✗"}
                                        </span>
                                    </td>
                                ))}
                                <td
                                    className="px-[12px] py-[8px] text-[10px] font-bold"
                                    style={{
                                        color:
                                            r.score > 0.75
                                                ? "var(--color-hex-3fb950)"
                                                : r.score > 0.55
                                                  ? "var(--color-hex-d29922)"
                                                  : "var(--color-hex-ff2a32)",
                                    }}
                                >
                                    {(r.score * 100).toFixed(1)}%
                                </td>
                                <td
                                    className="px-[12px] py-[8px] text-[9px] font-bold"
                                    style={{
                                        color:
                                            r.delta === 0
                                                ? "var(--color-hex-555555)"
                                                : r.delta > -0.05
                                                  ? "var(--color-hex-d29922)"
                                                  : "var(--color-hex-ff2a32)",
                                    }}
                                >
                                    {r.delta === 0 ? "—" : `${(r.delta * 100).toFixed(1)}%`}
                                </td>
                                <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                                    {r.cost}
                                </td>
                                <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                                    {r.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Component impact summary */}
                <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    COMPONENT IMPACT (vs baseline)
                </div>
                {COMPONENTS.map((c) => {
                    const withComp = ABLATION_RUNS.find(
                        (r) =>
                            r[c.key] === true &&
                            Object.values(r).filter((v) => v === false).length === 0,
                    );
                    const withoutComp = ABLATION_RUNS.find(
                        (r) => r[c.key] === false && ABLATION_RUNS[0].score > r.score + 0.05,
                    );
                    const impact = withComp && withoutComp ? withComp.score - withoutComp.score : 0;
                    return (
                        <div key={c.key} className="mb-[14px]">
                            <div className="mb-1 flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] font-semibold tracking-[0.1em] text-[var(--color-hex-a0a0a0)]">
                                        {c.label}
                                    </span>
                                    <span className="ml-[8px] text-[8px] text-[var(--color-hex-333333)]">
                                        {c.desc}
                                    </span>
                                </div>
                                <span
                                    className="text-[10px] font-bold"
                                    style={{
                                        color:
                                            impact > 0.1
                                                ? "var(--color-hex-e31b23)"
                                                : impact > 0.05
                                                  ? "var(--color-hex-d29922)"
                                                  : "var(--color-hex-555555)",
                                    }}
                                >
                                    -{(impact * 100).toFixed(1)}% if removed
                                </span>
                            </div>
                            <div className="h-[4px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full rounded-[2px]"
                                    style={{
                                        width: `${Math.min(impact * 200, 100)}%`,
                                        background:
                                            impact > 0.1
                                                ? "var(--color-hex-e31b23)"
                                                : impact > 0.05
                                                  ? "var(--color-hex-d29922)"
                                                  : "var(--color-hex-555555)",
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Right: detail */}
            <div
                className="flex w-[260px] flex-shrink-0 flex-col overflow-y-auto px-[14px] py-[16px]"
                style={{
                    borderLeft: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[4px] text-[11px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                    {sel.id}
                </div>
                <div className="mb-[16px] text-[9px] leading-[1.5] text-[var(--color-hex-555555)]">
                    {sel.name}
                </div>
                <div className="mb-[16px]">
                    <div className="mb-[8px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        COMPONENTS
                    </div>
                    {COMPONENTS.map((c) => (
                        <div key={c.key} className="mb-2 flex items-center gap-2">
                            <span
                                className="min-w-[12px] text-[9px] font-bold"
                                style={{
                                    color: sel[c.key]
                                        ? "var(--color-hex-3fb950)"
                                        : "var(--color-hex-333333)",
                                }}
                            >
                                {sel[c.key] ? "✓" : "✗"}
                            </span>
                            <span
                                className="text-[9px]"
                                style={{
                                    color: sel[c.key]
                                        ? "var(--color-hex-666666)"
                                        : "var(--color-hex-333333)",
                                }}
                            >
                                {c.label}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mb-[16px] h-[1px] bg-[var(--color-hex-1a1a1a)]" />
                {[
                    {
                        k: "SCORE",
                        v: `${(sel.score * 100).toFixed(1)}%`,
                        c:
                            sel.score > 0.75
                                ? "var(--color-hex-3fb950)"
                                : sel.score > 0.55
                                  ? "var(--color-hex-d29922)"
                                  : "var(--color-hex-ff2a32)",
                    },
                    {
                        k: "vs FULL SYSTEM",
                        v: sel.delta === 0 ? "baseline" : `${(sel.delta * 100).toFixed(1)}%`,
                        c:
                            sel.delta < -0.1
                                ? "var(--color-hex-ff2a32)"
                                : sel.delta < -0.05
                                  ? "var(--color-hex-d29922)"
                                  : "var(--color-hex-555555)",
                    },
                    {
                        k: "COST",
                        v: sel.cost,
                    },
                    {
                        k: "RUNTIME",
                        v: sel.time,
                    },
                ].map((r) => (
                    <div key={r.k} className="mb-[12px]">
                        <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {r.k}
                        </div>
                        <div
                            className="text-[14px] font-bold"
                            style={{
                                color: r.c ?? "var(--color-hex-f2f2f2)",
                            }}
                        >
                            {r.v}
                        </div>
                    </div>
                ))}
                <div className="mt-[8px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-e31b2333)] bg-[var(--color-hex-120608)] px-[12px] py-[10px]">
                    <div className="mb-[4px] text-[8px] tracking-[0.16em] text-[var(--color-hex-e31b23)]">
                        SCORE DELTA vs BASELINE
                    </div>
                    <div
                        className="text-[16px] font-bold"
                        style={{
                            color:
                                sel.delta > -0.05
                                    ? "var(--color-hex-d29922)"
                                    : "var(--color-hex-ff2a32)",
                        }}
                    >
                        {sel.delta === 0
                            ? "baseline"
                            : `${((sel.score - baseline.score) * 100).toFixed(1)}pp`}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   STATISTICAL EVALUATION (screen 42)
══════════════════════════════════════════════════════ */
const STAT_DATA = [
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
function StatisticalEval() {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-6 grid grid-cols-4 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                {[
                    {
                        k: "N BENCHMARKS",
                        v: "7",
                    },
                    {
                        k: "N TASKS",
                        v: "350",
                    },
                    {
                        k: "CONFIDENCE",
                        v: "95%",
                    },
                    {
                        k: "TEST",
                        v: "WILCOXON",
                    },
                ].map((m, i, a) => (
                    <div
                        key={m.k}
                        className="bg-[var(--color-hex-0d0d0d)] px-[16px] py-[12px]"
                        style={{
                            borderRight:
                                i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                        }}
                    >
                        <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {m.k}
                        </div>
                        <div className="text-[18px] font-bold text-[var(--color-hex-f2f2f2)]">
                            {m.v}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                METRIC COMPARISON TABLE
            </div>
            <div className="mb-[24px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                <div
                    className="flex bg-[var(--color-hex-0f0f0f)]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                    }}
                >
                    {[
                        "METRIC",
                        "FULL SYSTEM",
                        "NO UCB",
                        "NO E_ORD",
                        "BASELINE",
                        "p-VALUE",
                        "SIG",
                    ].map((h) => (
                        <div
                            key={h}
                            className="px-[12px] py-[5px] text-[7.5px] font-semibold tracking-[0.14em] text-[var(--color-hex-444444)]"
                            style={{
                                flex: h === "METRIC" ? 2 : 1,
                                textAlign: h === "METRIC" ? "left" : "right",
                            }}
                        >
                            {h}
                        </div>
                    ))}
                </div>
                {STAT_DATA.map((row, i) => (
                    <div
                        key={row.metric}
                        className="flex items-center"
                        style={{
                            borderBottom:
                                i < STAT_DATA.length - 1
                                    ? "1px solid var(--color-hex-111111)"
                                    : "none",
                            background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                        }}
                    >
                        <div
                            className="px-[12px] py-[8px] text-[10px] text-[var(--color-hex-888888)]"
                            style={{
                                flex: 2,
                            }}
                        >
                            {row.metric}
                        </div>
                        <div className="flex-1 px-[12px] py-[8px] text-right text-[10px] font-bold text-[var(--color-hex-3fb950)]">
                            {row.full}
                        </div>
                        <div className="flex-1 px-[12px] py-[8px] text-right text-[10px] text-[var(--color-hex-555555)]">
                            {row.noUCB}
                        </div>
                        <div className="flex-1 px-[12px] py-[8px] text-right text-[10px] text-[var(--color-hex-555555)]">
                            {row.noEord}
                        </div>
                        <div className="flex-1 px-[12px] py-[8px] text-right text-[10px] text-[var(--color-hex-333333)]">
                            {row.baseline}
                        </div>
                        <div
                            className="flex-1 px-[12px] py-[8px] text-right text-[9px]"
                            style={{
                                color:
                                    row.pValue < 0.01
                                        ? "var(--color-hex-3fb950)"
                                        : row.pValue < 0.05
                                          ? "var(--color-hex-d29922)"
                                          : "var(--color-hex-555555)",
                            }}
                        >
                            {row.pValue.toFixed(3)}
                        </div>
                        <div className="flex-1 px-[12px] py-[8px] text-right">
                            <span
                                className="text-[9px] font-bold"
                                style={{
                                    color:
                                        row.pValue < 0.01
                                            ? "var(--color-hex-3fb950)"
                                            : row.pValue < 0.05
                                              ? "var(--color-hex-d29922)"
                                              : "var(--color-hex-444444)",
                                }}
                            >
                                {row.pValue < 0.01 ? "***" : row.pValue < 0.05 ? "**" : "ns"}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            {/* Effect sizes */}
            <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                UCB CONTRIBUTION — COHEN&apos;S d
            </div>
            {[
                {
                    metric: "Solve Rate",
                    d: 1.82,
                    interp: "LARGE",
                },
                {
                    metric: "Cost per Task",
                    d: 1.41,
                    interp: "LARGE",
                },
                {
                    metric: "Attempts",
                    d: 1.09,
                    interp: "LARGE",
                },
                {
                    metric: "Fail Rate",
                    d: 2.14,
                    interp: "LARGE",
                },
            ].map((e) => (
                <div key={e.metric} className="mb-[12px]">
                    <div className="mb-1 flex justify-between">
                        <span className="text-[9px] text-[var(--color-hex-666666)]">
                            {e.metric}
                        </span>
                        <div className="flex items-center gap-3">
                            <span className="text-[9px] font-bold text-[var(--color-hex-3fb950)]">
                                d = {e.d.toFixed(2)}
                            </span>
                            <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-3fb950)]">
                                {e.interp}
                            </span>
                        </div>
                    </div>
                    <div className="h-[3px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                        <div
                            className="h-full rounded-[2px] bg-[var(--color-hex-3fb950)]"
                            style={{
                                width: `${Math.min((e.d / 2.5) * 100, 100)}%`,
                            }}
                        />
                    </div>
                </div>
            ))}
            <div className="mt-[20px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-3fb95044)] bg-[var(--color-hex-061a0c)] px-[16px] py-[14px]">
                <div className="mb-[6px] text-[8px] tracking-[0.18em] text-[var(--color-hex-3fb950)]">
                    CONCLUSION
                </div>
                <div className="text-[10px] leading-[1.8] text-[var(--color-hex-555555)]">
                    All core system components (UCB selection, E_ord gating) show statistically
                    significant positive contribution (p &lt; 0.01, large effect size d &gt; 1.0).
                    The full system outperforms the no-UCB baseline by 17.1 percentage points and
                    the no-E_ord ablation by 8.8pp. Results support the design hypothesis.
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   FAILURE ANALYSIS (screen 43)
══════════════════════════════════════════════════════ */
const FAILURE_CLUSTERS = [
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
const FAILURE_TIMELINE = [
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
function FailureAnalysis() {
    const [sel, setSel] = useState<(typeof FAILURE_CLUSTERS)[0] | null>(null);
    const total = FAILURE_CLUSTERS.reduce((s, c) => s + c.count, 0);
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* KPIs */}
                <div className="mb-5 grid grid-cols-3 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                    {[
                        {
                            k: "TOTAL FAILURES",
                            v: String(total),
                        },
                        {
                            k: "UNIQUE CLUSTERS",
                            v: String(FAILURE_CLUSTERS.length),
                        },
                        {
                            k: "FIXABLE",
                            v: String(
                                FAILURE_CLUSTERS.slice(0, 4).reduce((s, c) => s + c.count, 0),
                            ),
                        },
                    ].map((m, i, a) => (
                        <div
                            key={m.k}
                            className="bg-[var(--color-hex-0d0d0d)] px-[18px] py-[12px]"
                            style={{
                                borderRight:
                                    i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            }}
                        >
                            <div className="mb-[5px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                {m.k}
                            </div>
                            <div className="text-[20px] font-bold text-[var(--color-hex-f2f2f2)]">
                                {m.v}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Failure clusters */}
                <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    FAILURE CLUSTERS
                </div>
                {FAILURE_CLUSTERS.map((c) => (
                    <div
                        key={c.id}
                        onClick={() => setSel(sel?.id === c.id ? null : c)}
                        className="mb-[8px] cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]"
                        style={{
                            background:
                                sel?.id === c.id ? "var(--color-hex-0d0d0d)" : "transparent",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                sel?.id === c.id ? "var(--color-hex-0d0d0d)" : "transparent")
                        }
                    >
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div
                                className="h-[10px] w-[10px] shrink-0 rounded-[2px]"
                                style={{
                                    background: c.color,
                                }}
                            />
                            <span className="flex-1 text-[10px] font-bold tracking-[0.08em] text-[var(--color-hex-a0a0a0)]">
                                {c.label}
                            </span>
                            <span
                                className="text-[14px] font-bold"
                                style={{
                                    color: c.color,
                                }}
                            >
                                {c.count}
                            </span>
                            <span className="min-w-[32px] text-right text-[9px] text-[var(--color-hex-444444)]">
                                {c.pct}%
                            </span>
                        </div>
                        <div
                            className="h-[3px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]"
                            style={{
                                margin: "0 16px 0",
                                marginBottom: sel?.id === c.id ? 0 : 10,
                            }}
                        >
                            <div
                                className="h-full"
                                style={{
                                    width: `${c.pct}%`,
                                    background: c.color,
                                }}
                            />
                        </div>
                        {sel?.id === c.id && (
                            <div
                                className="mt-[8px] px-[16px] py-[12px]"
                                style={{
                                    borderTop: "1px solid var(--color-hex-141414)",
                                }}
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-[8px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                        {c.id} DETAIL
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSel(null);
                                        }}
                                        className="cursor-pointer border-none bg-[transparent] text-[13px] leading-[1] text-[var(--color-hex-444444)]"
                                        style={{
                                            padding: "0 2px",
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="mb-[10px] text-[9.5px] leading-[1.8] text-[var(--color-hex-555555)]">
                                    {c.desc}
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="shrink-0 text-[8px] font-bold tracking-[0.14em] text-[var(--color-hex-3fb950)]">
                                        FIX →
                                    </span>
                                    <span className="text-[9.5px] leading-[1.7] text-[var(--color-hex-3fb950)]">
                                        {c.fix}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {/* Failure timeline */}
                <div className="mt-[20px] mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    RECENT FAILURES
                </div>
                <div className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                    <div
                        className="flex bg-[var(--color-hex-0f0f0f)]"
                        style={{
                            borderBottom: "1px solid var(--color-hex-1a1a1a)",
                        }}
                    >
                        {["TIME", "TYPE", "RUN", "TASK", "COST", "ATTEMPTS", "RESOLVED"].map(
                            (h) => (
                                <div
                                    key={h}
                                    className="px-[12px] py-[5px] text-[7.5px] font-semibold tracking-[0.14em] text-[var(--color-hex-444444)]"
                                    style={{
                                        flex: h === "TYPE" ? 2 : 1,
                                    }}
                                >
                                    {h}
                                </div>
                            ),
                        )}
                    </div>
                    {FAILURE_TIMELINE.map((f, i) => (
                        <div
                            key={i}
                            className="flex items-center"
                            style={{
                                borderBottom:
                                    i < FAILURE_TIMELINE.length - 1
                                        ? "1px solid var(--color-hex-111111)"
                                        : "none",
                                background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                            }}
                        >
                            <div className="flex-1 px-[12px] py-[7px] text-[8.5px] text-[var(--color-hex-333333)]">
                                {f.ts}
                            </div>
                            <div
                                className="px-[12px] py-[7px] text-[9px] font-semibold tracking-[0.06em] text-[var(--color-hex-a0a0a0)]"
                                style={{
                                    flex: 2,
                                }}
                            >
                                {f.type}
                            </div>
                            <div className="flex-1 px-[12px] py-[7px] text-[9px] text-[var(--color-hex-e31b23)]">
                                {f.run}
                            </div>
                            <div className="flex-1 px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                {f.task}
                            </div>
                            <div className="flex-1 px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                {f.cost}
                            </div>
                            <div
                                className="flex-1 px-[12px] py-[7px] text-[9px]"
                                style={{
                                    color:
                                        f.attempts > 2
                                            ? "var(--color-hex-d29922)"
                                            : "var(--color-hex-444444)",
                                }}
                            >
                                {f.attempts}
                            </div>
                            <div className="flex-1 px-[12px] py-[7px]">
                                <span
                                    className="text-[8.5px] font-bold"
                                    style={{
                                        color: f.resolved
                                            ? "var(--color-hex-3fb950)"
                                            : "var(--color-hex-333333)",
                                    }}
                                >
                                    {f.resolved ? "YES" : "—"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
