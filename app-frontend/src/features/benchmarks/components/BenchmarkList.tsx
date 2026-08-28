import { useEffect, useMemo, useState } from "react";

import { BenchmarksRepository } from "@/features/benchmarks/data/BenchmarksRepository";
import {
    ALL_BENCH_RUNS,
    TIER_META,
    type BenchRecord,
    type BenchTier,
} from "@/features/benchmarks/data/fixtures/benchmarksMockData";
import { BENCHMARK_STATUS } from "@/types/domain-types";

import { BenchmarkTable } from "./BenchmarkTable";

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
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="tracking-widest-2 mb-[3px] text-base text-[var(--color-hex-666666)]">
                    RESEARCH
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        BENCHMARKS
                    </h1>
                    {/* Tier filter chips */}
                    <div className="flex flex-wrap gap-[5px]">
                        <button
                            key="ALL"
                            onClick={() => setTierFilter("ALL")}
                            aria-pressed={tierFilter === "ALL"}
                            aria-label="Show all tiers"
                            className="font-inherit cursor-pointer rounded-[2px] px-[10px] py-[3px] text-sm tracking-wide"
                            style={{
                                background:
                                    tierFilter === "ALL" ? "var(--color-brand)" : "transparent",
                                border: `1px solid ${tierFilter === "ALL" ? "var(--color-brand)" : "var(--color-hex-1e1e1e)"}`,
                                color:
                                    tierFilter === "ALL"
                                        ? "var(--color-fg)"
                                        : "var(--color-hex-444444)",
                            }}
                        >
                            ALL
                        </button>
                        {ALL_TIERS.map((t) => {
                            const meta = TIER_META[t];
                            const isActive = tierFilter === t;
                            return (
                                <button
                                    key={t}
                                    onClick={() => setTierFilter(t)}
                                    aria-pressed={isActive}
                                    aria-label={`Filter by ${meta.label}`}
                                    className="font-inherit text-sm-tight cursor-pointer rounded-[2px] px-[8px] py-[3px] tracking-normal"
                                    style={{
                                        background: isActive ? meta.color : "transparent",
                                        border: `1px solid ${isActive ? meta.color : "var(--color-hex-1e1e1e)"}`,
                                        color: isActive
                                            ? "var(--color-fg)"
                                            : "var(--color-hex-444444)",
                                    }}
                                >
                                    {meta.label.split(" — ")[0]}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
            {/* KPI strip */}
            <div
                className="grid flex-shrink-0 grid-cols-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
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
                ).map((m, i, a) => (
                    <div
                        key={m.k}
                        className="bg-[var(--color-hex-0d0d0d)] px-[20px] py-[12px]"
                        style={{
                            borderRight:
                                i < a.length - 1 ? "1px solid var(--color-hex-1e1e1e)" : "none",
                        }}
                    >
                        <div className="text-sm-tight tracking-wider-3 mb-[5px] text-[var(--color-hex-444444)]">
                            {m.k}
                        </div>
                        <div
                            className="mb-[2px] text-9xl font-bold"
                            style={{
                                color: m.red ? "var(--color-brand)" : "var(--color-fg)",
                            }}
                        >
                            {m.v}
                        </div>
                        {m.sub && (
                            <div className="text-sm-tight text-[var(--color-hex-333333)]">
                                {m.sub}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* Table */}
            <BenchmarkTable filtered={filtered} onSelect={onSelect} />
        </div>
    );
}
