import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { BenchmarkTable } from "@/features/benchmarks/components/BenchmarkTable";
import { BenchmarksRepository } from "@/features/benchmarks/data/BenchmarksRepository";
import {
    ALL_BENCH_RUNS,
    TIER_META,
    type BenchRecord,
    type BenchTier,
} from "@/features/benchmarks/data/fixtures/benchmarksMockData";
import { BENCHMARK_STATUS } from "@/types/domain-types";

const ALL_TIERS: BenchTier[] = [
    "TIER0_SANDBOX",
    "TIER0B_HPTSA",
    "TIER1_PENTESTEVAL",
    "TIER2_CVEBENCH",
    "TIER2B_CROSSBENCH",
    "TIER3_PREDIQL",
    "TIER4_MHBENCH",
    "TIER5_BOUNTYBENCH",
    "TIER6_LIVECOMP",
];

export default function BenchmarkList({ onSelect }: { onSelect: (b: BenchRecord) => void }) {
    const [tierFilter, setTierFilter] = useState<"ALL" | BenchTier>("ALL");
    const [benchmarks, setBenchmarks] = useState<BenchRecord[]>([]);

    useEffect(() => {
        void BenchmarksRepository.getAll().then((data) => setBenchmarks(data));
    }, []);

    const filtered = useMemo(
        () => (tierFilter === "ALL" ? benchmarks : benchmarks.filter((b) => b.tier === tierFilter)),
        [tierFilter, benchmarks],
    );
    const completed = useMemo(
        () => benchmarks.filter((b) => b.status === BENCHMARK_STATUS.COMPLETE),
        [benchmarks],
    );

    if (!benchmarks.length) {
        return null;
    } // Wait for load

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    RESEARCH
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">BENCHMARKS</h1>
                    {/* Tier filter chips */}
                    <div className="flex flex-wrap gap-1">
                        <Button
                            key="ALL"
                            variant="outline"
                            onClick={() => setTierFilter("ALL")}
                            aria-pressed={tierFilter === "ALL"}
                            aria-label="Show all tiers"
                            className={`h-auto rounded-sm border px-2.5 py-0.5 text-sm tracking-wide ${tierFilter === "ALL" ? "bg-primary border-primary text-foreground" : "border-border text-muted-foreground bg-transparent"} cursor-pointer`}
                        >
                            ALL
                        </Button>
                        {ALL_TIERS.map((t) => {
                            const meta = TIER_META[t];
                            const isActive = tierFilter === t;
                            return (
                                <Button
                                    key={t}
                                    variant="outline"
                                    onClick={() => setTierFilter(t)}
                                    aria-pressed={isActive}
                                    aria-label={`Filter by ${meta.label}`}
                                    className={`h-auto rounded-sm border px-2 py-0.5 text-xs tracking-normal ${isActive ? `text-foreground ${meta.color.replace("text-", "bg-")} ${meta.color.replace("text-", "border-")}` : "text-muted-foreground border-border bg-transparent"} cursor-pointer`}
                                >
                                    {meta.label.split(" — ")[0]}
                                </Button>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* KPI strip */}
            <div className="border-border grid flex-shrink-0 grid-cols-1 border-b sm:grid-cols-2 lg:grid-cols-4">
                {(
                    [
                        {
                            k: "BENCHMARK TIERS",
                            v: "9 / 9",
                            sub: "All tiers represented",
                            red: true,
                        },
                        {
                            k: "RUNS COMPLETED",
                            v: String(completed.length),
                        },
                        {
                            k: "TIERS COMPLETE",
                            v: String(new Set(completed.map((b) => b.tier)).size),
                        },
                        {
                            k: "PRIMARY METRIC",
                            v: (() => {
                                const run = ALL_BENCH_RUNS.find(
                                    (b) => b.tier === "TIER2_CVEBENCH" && b.status === "COMPLETE",
                                ) as { detail: { passAt5OneDay: number } } | undefined;
                                const rate = run ? run.detail.passAt5OneDay : 0;
                                return `${(rate * 100).toFixed(1)}%`;
                            })(),
                            sub: "CVE-Bench pass@5 (1-day)",
                        },
                    ] as {
                        k: string;
                        v: string;
                        sub?: string;
                        red?: boolean;
                    }[]
                ).map((m) => (
                    <div key={m.k} className="bg-background border-border border-r px-5 py-3">
                        <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                            {m.k}
                        </div>
                        <div
                            className={`mb-0.5 text-xs font-bold ${m.red ? "text-primary" : "text-foreground"}`}
                        >
                            {m.v}
                        </div>
                        {m.sub && <div className="text-muted-foreground text-xs">{m.sub}</div>}
                    </div>
                ))}
            </div>
            {/* Table */}
            <BenchmarkTable filtered={filtered} onSelect={onSelect} />
        </div>
    );
}
