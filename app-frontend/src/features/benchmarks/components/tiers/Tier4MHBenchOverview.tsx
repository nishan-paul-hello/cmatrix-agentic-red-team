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
            <div className="mb-3 rounded-[2px] border border-solid border-[var(--color-hex-3fb95022)] bg-[var(--color-hex-0a1a10)] px-[12px] py-[8px]">
                <span className="text-sm tracking-wide text-[var(--color-success)]">
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
                color="var(--color-brand)"
            />
            <PassRateBar
                label="CREDENTIAL THEFT RATE"
                value={d.credentialTheftSuccess / d.environments}
                color="var(--color-warning)"
            />
            <MetaRow bench={bench} />
        </>
    );
}
