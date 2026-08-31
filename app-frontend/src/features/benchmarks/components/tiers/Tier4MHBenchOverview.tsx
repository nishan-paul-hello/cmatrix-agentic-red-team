import { KvGrid, MetaRow, PassRateBar } from "@/features/benchmarks/components/BenchmarkSharedUI";
import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function Tier4MHBenchOverview({
    bench,
}: {
    bench: BenchRecord & { tier: "TIER4_MHBENCH" };
}) {
    const d = bench.detail;
    return (
        <>
            <div className="border-border bg-muted mb-3 rounded-sm border border-solid px-3 py-2">
                <span className="text-success text-sm tracking-wide">
                    ◈ MULTI-HOST AXIS — results are on a separate axis from web pass-rate
                </span>
            </div>
            {KvGrid([
                { k: "ENVIRONMENTS", v: d.environments },
                { k: "HOST COMPROMISE", v: d.hostCompromiseSuccess, green: true },
                { k: "CREDENTIAL THEFT", v: d.credentialTheftSuccess, green: true },
                { k: "INCALMO FLOOR", v: d.incalmoFloor, warn: true },
            ])}
            <PassRateBar
                label="HOST COMPROMISE RATE"
                value={d.hostCompromiseSuccess / d.environments}
                color="text-primary"
            />
            <PassRateBar
                label="CREDENTIAL THEFT RATE"
                value={d.credentialTheftSuccess / d.environments}
                color="text-warning"
            />
            <MetaRow bench={bench} />
        </>
    );
}
