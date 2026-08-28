import { KvGrid, MetaRow } from "@/features/benchmarks/components/BenchmarkSharedUI";
import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function Tier3PrediQLOverview({
    bench,
}: {
    bench: BenchRecord & { tier: "TIER3_PREDIQL" };
}) {
    const d = bench.detail;
    return (
        <>
            <div className="mb-3 rounded-[2px] border border-solid border-[var(--color-hex-3fb95022)] bg-[var(--color-hex-0a1a10)] px-[12px] py-[8px]">
                <span className="text-sm tracking-wide text-[var(--color-success)]">
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
            <div className="mb-3 text-sm tracking-widest text-[var(--color-hex-444444)]">
                4-BASELINE COMPARISON
            </div>
            {[
                ...d.baselineComparison,
                { name: "RedGrid", schemaCoveragePct: d.schemaCoveragePct, vulnCount: d.vulnCount },
            ].map((row) => {
                const isUs = row.name === "RedGrid";
                return (
                    <div key={row.name} className="mb-[12px]">
                        <div className="mb-1 flex justify-between">
                            <span
                                className="text-base"
                                style={{
                                    color: isUs ? "var(--color-brand)" : "var(--color-hex-555555)",
                                    fontWeight: isUs ? "bold" : undefined,
                                }}
                            >
                                {row.name}
                            </span>
                            <span className="text-base text-[var(--color-hex-a0a0a0)]">
                                cov: {(row.schemaCoveragePct * 100).toFixed(1)}% · vulns:{" "}
                                {row.vulnCount}
                            </span>
                        </div>
                        <div className="h-[3px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                            <div
                                className="h-full rounded-[2px]"
                                style={{
                                    width: `${row.schemaCoveragePct * 100}%`,
                                    background: isUs
                                        ? "var(--color-brand)"
                                        : "var(--color-hex-2a2a2a)",
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
