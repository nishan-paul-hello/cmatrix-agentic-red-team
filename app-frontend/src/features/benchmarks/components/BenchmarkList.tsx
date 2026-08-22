import { useEffect, useMemo, useState } from "react";

import { BenchmarksRepository } from "@/features/benchmarks/data/BenchmarksRepository";
import { TYPE_C, type Bench } from "@/features/benchmarks/data/fixtures/benchmarksMockData";
import { BENCHMARK_STATUS } from "@/types/domain-types";

import { BenchmarkSuites } from "./BenchmarkSuites";
import { BenchmarkTable } from "./BenchmarkTable";

export default function BenchmarkList({ onSelect }: { onSelect: (b: Bench) => void }) {
    const [filter, setFilter] = useState<string>("ALL");
    const [benchmarks, setBenchmarks] = useState<Bench[]>([]);

    useEffect(() => {
        void BenchmarksRepository.getAll().then(setBenchmarks);
    }, []);

    const types = ["ALL", "CVE-BENCH", "PREDIQL", "MHBENCH"];
    const filtered = useMemo(
        () => (filter === "ALL" ? benchmarks : benchmarks.filter((b) => b.type === filter)),
        [filter, benchmarks],
    );
    const completed = useMemo(
        () => benchmarks.filter((b) => b.status === BENCHMARK_STATUS.COMPLETE),
        [benchmarks],
    );
    const best = useMemo(
        () =>
            completed.reduce((a, b) => (b.score > a.score ? b : a), completed[0] || benchmarks[0]),
        [completed, benchmarks],
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
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    RESEARCH
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        BENCHMARKS
                    </h1>
                    <div className="flex gap-2">
                        {types.map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className="font-inherit cursor-pointer rounded-[2px] px-[10px] py-[3px] text-[8px] tracking-[0.12em]"
                                style={{
                                    background:
                                        filter === t
                                            ? ((TYPE_C as Partial<Record<string, string>>)[
                                                  t as Bench["type"]
                                              ] ?? "var(--color-hex-120608)")
                                            : "transparent",
                                    border: `1px solid ${filter === t ? ((TYPE_C as Partial<Record<string, string>>)[t as Bench["type"]] ?? "var(--color-hex-e31b23)") : "var(--color-hex-1e1e1e)"}`,
                                    color:
                                        filter === t
                                            ? ((TYPE_C as Partial<Record<string, string>>)[
                                                  t as Bench["type"]
                                              ] ?? "var(--color-hex-f2f2f2)")
                                            : "var(--color-hex-444444)",
                                }}
                            >
                                {t}
                            </button>
                        ))}
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
                            k: "BEST SCORE",
                            v: `${(best.score * 100).toFixed(1)}%`,
                            sub: best.id,
                            red: true,
                        },
                        {
                            k: "BENCHMARKS RUN",
                            v: String(completed.length),
                        },
                        {
                            k: "TOTAL TASKS",
                            v: String(completed.reduce((s, b) => s + b.tasks, 0)),
                        },
                        {
                            k: "AVG SOLVE RATE",
                            v: `${completed.length > 0 ? Math.round((completed.reduce((s, b) => s + b.solved / b.tasks, 0) / completed.length) * 100) : 0}%`,
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
                        <div className="mb-[5px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {m.k}
                        </div>
                        <div
                            className="mb-[2px] text-[20px] font-bold"
                            style={{
                                color: m.red
                                    ? "var(--color-hex-e31b23)"
                                    : "var(--color-hex-f2f2f2)",
                            }}
                        >
                            {m.v}
                        </div>
                        {m.sub && (
                            <div className="text-[7.5px] text-[var(--color-hex-333333)]">
                                {m.sub}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* E1: BENCHMARK SUITES — 7 tier tiles */}
            <BenchmarkSuites />
            {/* Table */}
            <BenchmarkTable filtered={filtered} onSelect={onSelect} />
        </div>
    );
}
