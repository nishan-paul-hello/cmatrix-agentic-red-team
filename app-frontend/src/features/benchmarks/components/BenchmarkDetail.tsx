import { useState } from "react";

import {
    TIER_META,
    type BenchRecord,
} from "@/features/benchmarks/data/fixtures/benchmarksMockData";
import { useBenchmarkDetailData } from "@/features/benchmarks/hooks/useBenchmarkDetailData";

import { BenchmarkCategoriesTab } from "./BenchmarkCategoriesTab";
import { BenchmarkOverviewTab } from "./BenchmarkOverviewTab";
import { BenchmarkTasksTab } from "./BenchmarkTasksTab";

export default function BenchmarkDetail({
    bench,
    onBack,
}: {
    bench: BenchRecord;
    onBack: () => void;
}) {
    const [tab, setTab] = useState<"OVERVIEW" | "TASKS" | "CATEGORIES">("OVERVIEW");
    const { tasks, catStats } = useBenchmarkDetailData();
    const tierMeta = TIER_META[bench.tier];

    // Separate-axis notice — shown for Tier 3 (GraphQL) and Tier 4 (Multi-Host)
    const hasAxisNote = !!tierMeta.axisNote;

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
                    className="font-inherit tracking-wider-1 mb-[10px] cursor-pointer border-none bg-[transparent] p-[0px] text-base text-[var(--color-hex-666666)] hover:text-[var(--color-hex-a0a0a0)]"
                >
                    ← BENCHMARKS
                </button>
                <div className="mb-3 flex items-baseline gap-3">
                    <h1 className="text-8xl font-bold tracking-normal text-[var(--color-fg)]">
                        {bench.id}
                    </h1>
                    {/* Tier badge replaces old type badge */}
                    <span
                        className="text-base-tight font-semibold tracking-wide"
                        style={{ color: tierMeta.color }}
                    >
                        {tierMeta.label}
                    </span>
                    <span className="text-lg tracking-tight text-[var(--color-hex-555555)]">
                        {bench.avgCost} · {bench.avgTime}
                    </span>
                </div>
                <div className="mb-[8px] text-xl tracking-tighter text-[var(--color-hex-555555)]">
                    {bench.name}
                </div>
                {/* Separate-axis notice */}
                {hasAxisNote && (
                    <div className="mb-[10px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-3fb95022)] bg-[var(--color-hex-0a1a10)] px-[10px] py-[6px]">
                        <span className="text-sm tracking-wide text-[var(--color-success)]">
                            ◈ {tierMeta.axisNote}
                        </span>
                    </div>
                )}
                <div className="flex">
                    {(["OVERVIEW", "TASKS", "CATEGORIES"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className="font-inherit tracking-wider-1 cursor-pointer border-none bg-[transparent] px-[14px] py-[5px] text-base"
                            style={{
                                borderBottom:
                                    t === tab
                                        ? "2px solid var(--color-brand)"
                                        : "2px solid transparent",
                                color: t === tab ? "var(--color-fg)" : "var(--color-hex-444444)",
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
