import { STAT_DATA } from "@/features/research/data/fixtures/researchMockData";

export default function StatisticalEval() {
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
                                color: (() => {
                                    if (row.pValue < 0.01) {
                                        return "var(--color-hex-3fb950)";
                                    }
                                    if (row.pValue < 0.05) {
                                        return "var(--color-hex-d29922)";
                                    }
                                    return "var(--color-hex-555555)";
                                })(),
                            }}
                        >
                            {row.pValue.toFixed(3)}
                        </div>
                        <div className="flex-1 px-[12px] py-[8px] text-right">
                            <span
                                className="text-[9px] font-bold"
                                style={{
                                    color: (() => {
                                        if (row.pValue < 0.01) {
                                            return "var(--color-hex-3fb950)";
                                        }
                                        if (row.pValue < 0.05) {
                                            return "var(--color-hex-d29922)";
                                        }
                                        return "var(--color-hex-444444)";
                                    })(),
                                }}
                            >
                                {(() => {
                                    if (row.pValue < 0.01) {
                                        return "***";
                                    }
                                    if (row.pValue < 0.05) {
                                        return "**";
                                    }
                                    return "ns";
                                })()}
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
