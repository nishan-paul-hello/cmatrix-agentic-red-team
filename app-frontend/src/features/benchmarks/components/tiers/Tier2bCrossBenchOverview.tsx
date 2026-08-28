import { KvGrid, MetaRow } from "@/features/benchmarks/components/BenchmarkSharedUI";
import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function Tier2bCrossBenchOverview({
    bench,
}: {
    bench: BenchRecord & { tier: "TIER2B_CROSSBENCH" };
}) {
    const d = bench.detail;
    const pooledRate = d.pooled.total > 0 ? d.pooled.solved / d.pooled.total : 0;
    return (
        <>
            {KvGrid([
                { k: "BENCHMARKS", v: d.perBenchmark.length },
                { k: "POOLED SOLVED", v: d.pooled.solved, green: true },
                { k: "POOLED TOTAL", v: d.pooled.total },
                {
                    k: "POOLED RATE",
                    v: `${(pooledRate * 100).toFixed(1)}%`,
                    green: pooledRate > 0.6,
                    warn: pooledRate <= 0.6,
                },
            ])}
            <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                PER-BENCHMARK BREAKDOWN
            </div>
            {d.perBenchmark.map((row) => {
                const rate = row.total > 0 ? row.solved / row.total : 0;
                return (
                    <div key={row.name} className="mb-3">
                        <div className="mb-1 flex justify-between">
                            <span className="text-muted-foreground text-base">{row.name}</span>
                            <span className="text-foreground text-xs font-bold">
                                {row.solved}/{row.total} &nbsp;
                                <span
                                    style={{
                                        color: rate >= 0.6 ? "var(--success)" : "var(--warning)",
                                    }}
                                >
                                    ({(rate * 100).toFixed(1)}%)
                                </span>
                            </span>
                        </div>
                        <div className="bg-card h-1 overflow-hidden rounded-sm">
                            <div
                                className="h-full rounded-sm"
                                style={{
                                    width: `${rate * 100}%`,
                                    background: rate >= 0.6 ? "var(--success)" : "var(--warning)",
                                }}
                            />
                        </div>
                    </div>
                );
            })}
            <div className="border-border bg-muted mt-2 rounded-sm border border-solid px-3 py-2">
                <div className="text-primary mb-0.5 text-xs tracking-widest">POOLED RESULT</div>
                <div className="text-foreground text-xs font-bold">
                    {d.pooled.solved}/{d.pooled.total}&nbsp;
                    <span
                        className="text-xs"
                        style={{
                            color: pooledRate > 0.6 ? "var(--success)" : "var(--warning)",
                        }}
                    >
                        ({(pooledRate * 100).toFixed(1)}%)
                    </span>
                </div>
            </div>
            <MetaRow bench={bench} />
        </>
    );
}
