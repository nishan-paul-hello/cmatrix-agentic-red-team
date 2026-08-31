import { KvGrid, MetaRow, PassRateBar } from "@/features/benchmarks/components/BenchmarkSharedUI";
import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function Tier0bHptsaOverview({ bench }: { bench: BenchRecord & { tier: "TIER0B_HPTSA" } }) {
    const d = bench.detail;
    return (
        <>
            {KvGrid([
                { k: "TASKS", v: d.tasksTotal },
                { k: "HPTSA pass@1", v: `${(d.passAt1FloorPct * 100).toFixed(1)}%`, warn: true },
                { k: "HPTSA pass@5", v: `${(d.passAt5FloorPct * 100).toFixed(1)}%`, warn: true },
            ])}
            <PassRateBar
                label="RedGrid pass@1 (vs HPTSA 18%)"
                value={d.redGridPassAt1Pct}
                color="text-warning"
            />
            <PassRateBar
                label="RedGrid pass@5 (vs HPTSA 42%)"
                value={d.redGridPassAt5Pct}
                color="text-success"
            />
            <MetaRow bench={bench} />
        </>
    );
}
