import { STAT_DATA } from "@/features/research/data/fixtures/researchMockData";

export default function StatisticalEval() {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* ── Compute-normalization note — §12.3 ── */}
            <div className="mb-4 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-d2992233)] bg-[var(--color-hex-1a1200)] px-[12px] py-[8px]">
                <span className="text-sm tracking-wide text-[var(--color-warning)]">
                    ◈ COMPUTE-NORMALIZED — all results normalized to 50 API calls/CVE. Orchestration
                    overhead excluded. McNemar&apos;s chi-squared test for paired binary outcomes
                    (§12.3).
                </span>
            </div>

            {/* ── KPI strip — updated from WILCOXON → McNemar's ── */}
            <div className="mb-6 grid grid-cols-4 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                {[
                    { k: "N BENCHMARKS", v: "7" },
                    { k: "N TASKS", v: "350" },
                    { k: "CONFIDENCE", v: "95%" },
                    { k: "TEST", v: "McNemar's (paired)" },
                ].map((m, i, a) => (
                    <div
                        key={m.k}
                        className="bg-[var(--color-hex-0d0d0d)] px-[16px] py-[12px]"
                        style={{
                            borderRight:
                                i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                        }}
                    >
                        <div className="text-sm-tight tracking-wider-3 mb-[4px] text-[var(--color-hex-444444)]">
                            {m.k}
                        </div>
                        <div className="text-6xl font-bold text-[var(--color-fg)]">{m.v}</div>
                    </div>
                ))}
            </div>

            <div className="mb-[12px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                METRIC COMPARISON TABLE
            </div>
            <div className="mb-[8px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                <div
                    className="flex bg-[var(--color-hex-0f0f0f)]"
                    style={{ borderBottom: "1px solid var(--color-hex-1a1a1a)" }}
                >
                    {[
                        "METRIC",
                        "FULL SYSTEM",
                        "NO UCB",
                        "NO E_ORD",
                        "BASELINE",
                        "McNemar p",
                        "Δ pp",
                        "SIG",
                    ].map((h) => (
                        <div
                            key={h}
                            className="text-sm-tight tracking-wider-1 px-[10px] py-[5px] font-semibold text-[var(--color-hex-444444)]"
                            style={{
                                flex: h === "METRIC" ? 2.5 : 1,
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
                            className="text-lg-tight px-[10px] py-[8px] text-[var(--color-hex-888888)]"
                            style={{ flex: 2.5 }}
                        >
                            <div>{row.metric}</div>
                            {/* Wilson CI inline under full-system value */}
                        </div>
                        {/* FULL SYSTEM — shows Wilson CI */}
                        <div className="flex flex-1 flex-col items-end px-[10px] py-[6px]">
                            <span className="text-lg font-bold text-[var(--color-success)]">
                                {row.full}
                            </span>
                            <span className="text-xs text-[var(--color-hex-333333)]">
                                [{row.wilsonCI[0].toFixed(3)}, {row.wilsonCI[1].toFixed(3)}]
                            </span>
                        </div>
                        <div className="flex-1 px-[10px] py-[8px] text-right text-lg text-[var(--color-hex-555555)]">
                            {row.noUCB}
                        </div>
                        <div className="flex-1 px-[10px] py-[8px] text-right text-lg text-[var(--color-hex-555555)]">
                            {row.noEord}
                        </div>
                        <div className="flex-1 px-[10px] py-[8px] text-right text-lg text-[var(--color-hex-333333)]">
                            {row.baseline}
                        </div>
                        {/* McNemar p (renamed from p-VALUE) */}
                        <div
                            className="flex-1 px-[10px] py-[8px] text-right text-base"
                            style={{
                                color: (() => {
                                    if (row.mcNemarP < 0.01) {
                                        return "var(--color-success)";
                                    }
                                    if (row.mcNemarP < 0.05) {
                                        return "var(--color-warning)";
                                    }
                                    return "var(--color-hex-555555)";
                                })(),
                            }}
                        >
                            {row.mcNemarP.toFixed(3)}
                        </div>
                        {/* Δ pp column — new */}
                        <div
                            className="flex-1 px-[10px] py-[8px] text-right text-base font-bold"
                            style={{
                                color: (() => {
                                    if (row.deltaPp > 0) {
                                        return "var(--color-success)";
                                    }
                                    if (Math.abs(row.deltaPp) < 20) {
                                        return "var(--color-warning)";
                                    }
                                    return "var(--color-danger)";
                                })(),
                            }}
                        >
                            {row.deltaPp > 0 ? "+" : ""}
                            {row.deltaPp.toFixed(1)}pp
                        </div>
                        {/* SIG stars */}
                        <div className="flex-1 px-[10px] py-[8px] text-right">
                            <span
                                className="text-base font-bold"
                                style={{
                                    color: (() => {
                                        if (row.mcNemarP < 0.01) {
                                            return "var(--color-success)";
                                        }
                                        if (row.mcNemarP < 0.05) {
                                            return "var(--color-warning)";
                                        }
                                        return "var(--color-hex-444444)";
                                    })(),
                                }}
                            >
                                {(() => {
                                    if (row.mcNemarP < 0.01) {
                                        return "***";
                                    }
                                    if (row.mcNemarP < 0.05) {
                                        return "**";
                                    }
                                    return "ns";
                                })()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* McNemar test caption */}
            <div className="text-sm-tight mb-[20px] leading-normal tracking-normal text-[var(--color-hex-333333)]">
                McNemar&apos;s χ² test (paired binary outcomes). Wilson score 95% CI shown inline
                with full-system values. *** p &lt; 0.01, ** p &lt; 0.05, ns = not significant. Δ pp
                = percentage-point improvement vs Baseline condition.
            </div>

            {/* Effect sizes */}
            <div className="mb-[12px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                UCB CONTRIBUTION — COHEN&apos;S d
            </div>
            {[
                { metric: "Solve Rate", d: 1.82, interp: "LARGE" },
                { metric: "Cost per Task", d: 1.41, interp: "LARGE" },
                { metric: "Attempts", d: 1.09, interp: "LARGE" },
                { metric: "Fail Rate", d: 2.14, interp: "LARGE" },
            ].map((e) => (
                <div key={e.metric} className="mb-[12px]">
                    <div className="mb-1 flex justify-between">
                        <span className="text-base text-[var(--color-hex-666666)]">{e.metric}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-base font-bold text-[var(--color-success)]">
                                d = {e.d.toFixed(2)}
                            </span>
                            <span className="text-sm tracking-normal text-[var(--color-success)]">
                                {e.interp}
                            </span>
                        </div>
                    </div>
                    <div className="h-[3px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                        <div
                            className="h-full rounded-[2px] bg-[var(--color-success)]"
                            style={{ width: `${Math.min((e.d / 2.5) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            ))}

            <div className="mt-[20px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-3fb95044)] bg-[var(--color-hex-061a0c)] px-[16px] py-[14px]">
                <div className="tracking-wider-3 mb-[6px] text-sm text-[var(--color-success)]">
                    CONCLUSION
                </div>
                <div className="text-lg leading-loose text-[var(--color-hex-555555)]">
                    All core components (UCB selection, E_ord gating) show statistically significant
                    positive contribution (McNemar&apos;s p &lt; 0.01, large effect size d &gt;
                    1.0). Full system outperforms Baseline by +41.1pp on Mean Solve Rate (pass@5,
                    1-day). Wilson 95% CI [0.771, 0.850] for full-system solve rate. Results support
                    paper contribution claims C1 and C2.
                </div>
            </div>
        </div>
    );
}
