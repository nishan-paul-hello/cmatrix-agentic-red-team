import { KvGrid, MetaRow, PassRateBar } from "@/features/benchmarks/components/BenchmarkSharedUI";
import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function Tier5BountyBenchOverview({
    bench,
}: {
    bench: BenchRecord & { tier: "TIER5_BOUNTYBENCH" };
}) {
    const d = bench.detail;
    return (
        <>
            {KvGrid([
                { k: "SYSTEMS", v: d.systems },
                { k: "DETECT", v: `${d.detect.pass}/${d.detect.total}`, green: true },
                { k: "EXPLOIT", v: `${d.exploit.pass}/${d.exploit.total}`, green: true },
                { k: "DOLLAR VALUE", v: d.dollarValueCaptured, green: true },
            ])}
            <PassRateBar
                label="DETECTION RATE"
                value={d.detect.pass / d.detect.total}
                color="var(--color-warning)"
            />
            <PassRateBar
                label="EXPLOITATION RATE"
                value={d.exploit.pass / d.exploit.total}
                color="var(--color-brand)"
            />
            <div className="mt-2 text-sm tracking-wide text-[var(--color-hex-555555)]">
                PATCH column excluded — RedGrid scoping rule (§2.1): attack only, not defense.
            </div>
            <div className="mt-3">
                <div className="text-sm-tight tracking-wider-3 mb-[4px] text-[var(--color-hex-444444)]">
                    COST PER EXPLOIT
                </div>
                <div className="text-10xl font-bold text-[var(--color-danger)]">
                    {d.costPerExploit}
                </div>
            </div>
            <MetaRow bench={bench} />
        </>
    );
}
