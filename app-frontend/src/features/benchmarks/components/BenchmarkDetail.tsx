import { useState } from "react";

import { TYPE_C, type Bench } from "@/features/benchmarks/data/fixtures/benchmarksMockData";
import { useBenchmarkDetailData } from "@/features/benchmarks/hooks/useBenchmarkDetailData";

import { BenchmarkCategoriesTab } from "./BenchmarkCategoriesTab";
import { BenchmarkOverviewTab } from "./BenchmarkOverviewTab";
import { BenchmarkTasksTab } from "./BenchmarkTasksTab";

export default function BenchmarkDetail({ bench, onBack }: { bench: Bench; onBack: () => void }) {
    const [tab, setTab] = useState<"OVERVIEW" | "TASKS" | "CATEGORIES">("OVERVIEW");
    const { tasks, catStats } = useBenchmarkDetailData();
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-0"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <button
                    onClick={onBack}
                    className="font-inherit mb-[10px] cursor-pointer border-none bg-[transparent] p-[0px] text-[9px] tracking-[0.14em] text-[var(--color-hex-666666)] hover:text-[var(--color-hex-a0a0a0)]"
                >
                    ← BENCHMARKS
                </button>
                <div className="mb-3 flex items-baseline gap-3">
                    <h1 className="text-[18px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                        {bench.id}
                    </h1>
                    <span
                        className="text-[9px] font-semibold tracking-[0.12em]"
                        style={{
                            color: TYPE_C[bench.type],
                        }}
                    >
                        {bench.type}
                    </span>
                    <span className="ml-auto text-[14px] font-bold text-[var(--color-hex-3fb950)]">
                        {(bench.score * 100).toFixed(1)}%
                    </span>
                </div>
                <div className="mb-[12px] text-[11px] tracking-[0.04em] text-[var(--color-hex-555555)]">
                    {bench.name}
                </div>
                <div className="flex">
                    {(["OVERVIEW", "TASKS", "CATEGORIES"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className="font-inherit cursor-pointer border-none bg-[transparent] px-[14px] py-[5px] text-[9px] tracking-[0.14em]"
                            style={{
                                borderBottom:
                                    t === tab
                                        ? "2px solid var(--color-hex-e31b23)"
                                        : "2px solid transparent",
                                color:
                                    t === tab
                                        ? "var(--color-hex-f2f2f2)"
                                        : "var(--color-hex-444444)",
                                marginBottom: -1,
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {tab === "OVERVIEW" && <BenchmarkOverviewTab bench={bench} />}
                {tab === "TASKS" && <BenchmarkTasksTab tasks={tasks} />}
                {tab === "CATEGORIES" && <BenchmarkCategoriesTab catStats={catStats} />}
            </div>
        </div>
    );
}
