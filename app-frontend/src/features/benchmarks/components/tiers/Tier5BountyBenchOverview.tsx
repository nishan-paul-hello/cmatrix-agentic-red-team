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
                color="text-warning"
            />
            <PassRateBar
                label="EXPLOITATION RATE"
                value={d.exploit.pass / d.exploit.total}
                color="text-primary"
            />
            <div className="text-muted-foreground mt-2 text-sm tracking-wide">
                PATCH column excluded — RedGrid scoping rule (§2.1): attack only, not defense.
            </div>
            <div className="mt-3">
                <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                    COST PER EXPLOIT
                </div>
                <div className="text-destructive text-xs font-bold">{d.costPerExploit}</div>
            </div>
            <MetaRow bench={bench} />
        </>
    );
}
