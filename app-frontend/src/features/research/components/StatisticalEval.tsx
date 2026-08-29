import { STAT_DATA } from "@/features/research/data/fixtures/researchMockData";

export default function StatisticalEval() {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* ── Compute-normalization note — §12.3 ── */}
            <div className="border-border bg-muted mb-4 rounded-sm border-[1px] border-solid px-3 py-2">
                <span className="text-warning text-sm tracking-wide">
                    ◈ COMPUTE-NORMALIZED — all results normalized to 50 API calls/CVE. Orchestration
                    overhead excluded. McNemar&apos;s chi-squared test for paired binary outcomes
                    (§12.3).
                </span>
            </div>

            {/* ── KPI strip — updated from WILCOXON → McNemar's ── */}
            <div className="border-border mb-6 grid grid-cols-1 gap-0 overflow-hidden rounded-sm border-[1px] border-solid sm:grid-cols-2 lg:grid-cols-4">
                {[
                    { k: "N BENCHMARKS", v: "7" },
                    { k: "N TASKS", v: "350" },
                    { k: "CONFIDENCE", v: "95%" },
                    { k: "TEST", v: "McNemar's (paired)" },
                ].map((m) => (
                    <div key={m.k} className="bg-background border-border border-r px-4 py-3">
                        <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                            {m.k}
                        </div>
                        <div className="text-foreground text-base font-bold">{m.v}</div>
                    </div>
                ))}
            </div>

            <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                METRIC COMPARISON TABLE
            </div>
            <div className="border-border mb-2 overflow-x-auto rounded-sm border-[1px] border-solid">
                <div className="bg-card border-border flex w-full min-w-fit border-b">
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
                            className={`text-muted-foreground px-2.5 py-1 text-xs font-semibold tracking-widest ${h === "METRIC" ? "flex-[2.5] text-left" : "flex-1 text-right"}`}
                        >
                            {h}
                        </div>
                    ))}
                </div>
                {STAT_DATA.map((row) => (
                    <div
                        key={row.metric}
                        className="border-border flex w-full min-w-fit items-center border-b"
                    >
                        <div className="text-muted-foreground flex-[2.5] px-2.5 py-2 text-base">
                            <div>{row.metric}</div>
                            {/* Wilson CI inline under full-system value */}
                        </div>
                        {/* FULL SYSTEM — shows Wilson CI */}
                        <div className="cell-truncate flex flex-1 flex-col items-end px-2.5 py-1.5">
                            <span className="text-success text-xs font-bold">{row.full}</span>
                            <span className="text-muted-foreground text-xs">
                                [{row.wilsonCI[0].toFixed(3)}, {row.wilsonCI[1].toFixed(3)}]
                            </span>
                        </div>
                        <div className="text-muted-foreground cell-truncate flex-1 px-2.5 py-2 text-right text-xs">
                            {row.noUCB}
                        </div>
                        <div className="text-muted-foreground cell-truncate flex-1 px-2.5 py-2 text-right text-xs">
                            {row.noEord}
                        </div>
                        <div className="text-muted-foreground cell-truncate flex-1 px-2.5 py-2 text-right text-xs">
                            {row.baseline}
                        </div>
                        {/* McNemar p (renamed from p-VALUE) */}
                        <div
                            className={`cell-truncate flex-1 px-2.5 py-2 text-right text-base ${(() => {
                                if (row.mcNemarP < 0.01) {
                                    return "text-success";
                                }
                                if (row.mcNemarP < 0.05) {
                                    return "text-warning";
                                }
                                return "text-muted-foreground";
                            })()}`}
                        >
                            {row.mcNemarP.toFixed(3)}
                        </div>
                        {/* Δ pp column — new */}
                        <div
                            className={`cell-truncate flex-1 px-2.5 py-2 text-right text-base font-bold ${(() => {
                                if (row.deltaPp > 0) {
                                    return "text-success";
                                }
                                if (Math.abs(row.deltaPp) < 20) {
                                    return "text-warning";
                                }
                                return "text-destructive";
                            })()}`}
                        >
                            {row.deltaPp > 0 ? "+" : ""}
                            {row.deltaPp.toFixed(1)}pp
                        </div>
                        {/* SIG stars */}
                        <div className="flex-1 px-2.5 py-2 text-right">
                            <span
                                className={`text-base font-bold ${(() => {
                                    if (row.mcNemarP < 0.01) {
                                        return "text-success";
                                    }
                                    if (row.mcNemarP < 0.05) {
                                        return "text-warning";
                                    }
                                    return "text-muted-foreground";
                                })()}`}
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
            <div className="text-muted-foreground mb-5 text-xs leading-normal tracking-normal">
                McNemar&apos;s χ² test (paired binary outcomes). Wilson score 95% CI shown inline
                with full-system values. *** p &lt; 0.01, ** p &lt; 0.05, ns = not significant. Δ pp
                = percentage-point improvement vs Baseline condition.
            </div>

            {/* Effect sizes */}
            <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                UCB CONTRIBUTION — COHEN&apos;S d
            </div>
            {[
                { metric: "Solve Rate", d: 1.82, interp: "LARGE" },
                { metric: "Cost per Task", d: 1.41, interp: "LARGE" },
                { metric: "Attempts", d: 1.09, interp: "LARGE" },
                { metric: "Fail Rate", d: 2.14, interp: "LARGE" },
            ].map((e) => (
                <div key={e.metric} className="mb-3">
                    <div className="mb-1 flex justify-between">
                        <span className="text-muted-foreground text-base">{e.metric}</span>
                        <div className="flex items-center gap-3">
                            <span className="text-success text-base font-bold">
                                d = {e.d.toFixed(2)}
                            </span>
                            <span className="text-success text-sm tracking-normal">{e.interp}</span>
                        </div>
                    </div>
                    <div className="bg-card h-0.5 overflow-hidden rounded-sm">
                        <div
                            className="bg-success h-full rounded-sm"
                            style={{ width: `${Math.min((e.d / 2.5) * 100, 100)}%` }}
                        />
                    </div>
                </div>
            ))}

            <div className="border-border bg-muted mt-5 rounded-sm border-[1px] border-solid px-4 py-3.5">
                <div className="text-success mb-1.5 text-sm tracking-widest">CONCLUSION</div>
                <div className="text-muted-foreground text-xs leading-loose">
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
