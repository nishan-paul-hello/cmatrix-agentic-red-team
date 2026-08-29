import { KvGrid, MetaRow } from "@/features/benchmarks/components/BenchmarkSharedUI";
import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";
import { cn } from "@/lib/utils";

export function Tier3PrediQLOverview({
    bench,
}: {
    bench: BenchRecord & { tier: "TIER3_PREDIQL" };
}) {
    const d = bench.detail;
    return (
        <>
            <div className="border-border bg-muted mb-3 rounded-sm border border-solid px-3 py-2">
                <span className="text-success text-sm tracking-wide">
                    ◈ GRAPHQL AXIS — results are on a separate axis from web pass-rate
                </span>
            </div>
            {KvGrid([
                { k: "APIs TESTED", v: d.apis },
                {
                    k: "SCHEMA COVERAGE",
                    v: `${(d.schemaCoveragePct * 100).toFixed(1)}%`,
                    green: true,
                },
                { k: "VULNS FOUND", v: d.vulnCount, green: true },
            ])}
            <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                4-BASELINE COMPARISON
            </div>
            {[
                ...d.baselineComparison,
                { name: "RedGrid", schemaCoveragePct: d.schemaCoveragePct, vulnCount: d.vulnCount },
            ].map((row) => {
                const isUs = row.name === "RedGrid";
                return (
                    <div key={row.name} className="mb-3">
                        <div className="mb-1 flex justify-between">
                            <span
                                className={cn(
                                    "text-base",
                                    isUs ? "text-primary font-bold" : "text-muted-foreground",
                                )}
                            >
                                {row.name}
                            </span>
                            <span className="text-muted-foreground text-base">
                                cov: {(row.schemaCoveragePct * 100).toFixed(1)}% · vulns:{" "}
                                {row.vulnCount}
                            </span>
                        </div>
                        <div className="bg-card h-0.5 overflow-hidden rounded-sm">
                            <div
                                className={cn(
                                    "h-full rounded-sm",
                                    isUs ? "bg-primary" : "bg-border",
                                )}
                                style={{
                                    width: `${row.schemaCoveragePct * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                );
            })}
            <MetaRow bench={bench} />
        </>
    );
}
