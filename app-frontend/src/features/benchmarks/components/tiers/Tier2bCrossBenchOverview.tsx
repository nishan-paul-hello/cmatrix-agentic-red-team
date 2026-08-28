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
            <div className="mb-3 text-sm tracking-widest text-[var(--color-hex-444444)]">
                PER-BENCHMARK BREAKDOWN
            </div>
            {d.perBenchmark.map((row) => {
                const rate = row.total > 0 ? row.solved / row.total : 0;
                return (
                    <div key={row.name} className="mb-[12px]">
                        <div className="mb-1 flex justify-between">
                            <span className="text-base text-[var(--color-hex-666666)]">
                                {row.name}
                            </span>
                            <span className="text-lg font-bold text-[var(--color-fg)]">
                                {row.solved}/{row.total} &nbsp;
                                <span
                                    style={{
                                        color:
                                            rate >= 0.6
                                                ? "var(--color-success)"
                                                : "var(--color-warning)",
                                    }}
                                >
                                    ({(rate * 100).toFixed(1)}%)
                                </span>
                            </span>
                        </div>
                        <div className="h-[4px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                            <div
                                className="h-full rounded-[2px]"
                                style={{
                                    width: `${rate * 100}%`,
                                    background:
                                        rate >= 0.6
                                            ? "var(--color-success)"
                                            : "var(--color-warning)",
                                }}
                            />
                        </div>
                    </div>
                );
            })}
            <div className="mt-2 rounded-[2px] border border-solid border-[var(--color-hex-e31b2322)] bg-[var(--color-hex-120608)] px-[12px] py-[8px]">
                <div className="text-sm-tight mb-[2px] tracking-widest text-[var(--color-brand)]">
                    POOLED RESULT
                </div>
                <div className="text-8xl font-bold text-[var(--color-fg)]">
                    {d.pooled.solved}/{d.pooled.total}&nbsp;
                    <span
                        className="text-2xl"
                        style={{
                            color:
                                pooledRate > 0.6 ? "var(--color-success)" : "var(--color-warning)",
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
