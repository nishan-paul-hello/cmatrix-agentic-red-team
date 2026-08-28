import { KvGrid, MetaRow, PassRateBar } from "@/features/benchmarks/components/BenchmarkSharedUI";
import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function Tier6LiveCompOverview({
    bench,
}: {
    bench: BenchRecord & { tier: "TIER6_LIVECOMP" };
}) {
    const d = bench.detail;
    return (
        <>
            {KvGrid([
                { k: "TOTAL MACHINES", v: d.machinesTotal },
                { k: "PENTESTGPT SOLVED", v: `${d.pentestGptMachinesSolved}/13`, green: true },
                { k: "HTB SEASON 8", v: `${d.htbSeason8Solved}/5`, green: true },
                { k: "GT MATCH", v: `${d.humanSolvedGroundTruthMatchPct}%`, warn: true },
            ])}
            <PassRateBar
                label="PentestGPT machines solved (of 13)"
                value={d.pentestGptMachinesSolved / 13}
                color="var(--color-brand)"
            />
            <PassRateBar
                label="HTB Season 8 machines solved (of 5)"
                value={d.htbSeason8Solved / 5}
                color="var(--color-warning)"
            />
            <MetaRow bench={bench} />
        </>
    );
}
