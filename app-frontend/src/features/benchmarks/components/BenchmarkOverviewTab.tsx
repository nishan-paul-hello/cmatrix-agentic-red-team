import {
    Tier0bHptsaOverview,
    Tier0SandboxOverview,
    Tier1PentestEvalOverview,
    Tier2bCrossBenchOverview,
    Tier2CveBenchOverview,
    Tier3PrediQLOverview,
    Tier4MHBenchOverview,
    Tier5BountyBenchOverview,
    Tier6LiveCompOverview,
} from "@/features/benchmarks/components/BenchmarkTierViews";
import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

/* ── Main dispatcher ── */

export function BenchmarkOverviewTab({ bench }: { bench: BenchRecord }) {
    switch (bench.tier) {
        case "TIER0_SANDBOX":
            return <Tier0SandboxOverview bench={bench} />;
        case "TIER0B_HPTSA":
            return <Tier0bHptsaOverview bench={bench} />;
        case "TIER1_PENTESTEVAL":
            return <Tier1PentestEvalOverview bench={bench} />;
        case "TIER2_CVEBENCH":
            return <Tier2CveBenchOverview bench={bench} />;
        case "TIER2B_CROSSBENCH":
            return <Tier2bCrossBenchOverview bench={bench} />;
        case "TIER3_PREDIQL":
            return <Tier3PrediQLOverview bench={bench} />;
        case "TIER4_MHBENCH":
            return <Tier4MHBenchOverview bench={bench} />;
        case "TIER5_BOUNTYBENCH":
            return <Tier5BountyBenchOverview bench={bench} />;
        case "TIER6_LIVECOMP":
            return <Tier6LiveCompOverview bench={bench} />;
        default:
            return null;
    }
}
