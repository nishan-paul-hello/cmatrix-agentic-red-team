import { useState } from "react";

import { Button } from "@/components/ui/button";
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
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-0">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-muted-foreground hover:text-muted-foreground mb-2.5 h-auto p-0 text-base tracking-widest hover:bg-transparent"
                >
                    ← BENCHMARKS
                </Button>
                <div className="mb-3 flex items-baseline gap-3">
                    <h1 className="text-foreground text-xs font-bold tracking-normal">
                        {bench.id}
                    </h1>
                    {/* Tier badge replaces old type badge */}
                    <span
                        className="text-sm font-semibold tracking-wide"
                        style={{ color: tierMeta.color }}
                    >
                        {tierMeta.label}
                    </span>
                    <span className="text-muted-foreground text-xs tracking-tight">
                        {bench.avgCost} · {bench.avgTime}
                    </span>
                </div>
                <div className="text-muted-foreground mb-2 text-xs tracking-tighter">
                    {bench.name}
                </div>
                {/* Separate-axis notice */}
                {hasAxisNote && (
                    <div className="border-border bg-muted mb-2.5 rounded-sm border-[1px] border-solid px-2.5 py-1.5">
                        <span className="text-success text-sm tracking-wide">
                            ◈ {tierMeta.axisNote}
                        </span>
                    </div>
                )}
                <div className="flex">
                    {(["OVERVIEW", "TASKS", "CATEGORIES"] as const).map((t) => (
                        <Button
                            key={t}
                            variant="ghost"
                            onClick={() => setTab(t)}
                            className="h-auto rounded-none px-3.5 py-1 text-base tracking-widest hover:bg-transparent"
                            style={{
                                borderBottom:
                                    t === tab
                                        ? "2px solid var(--primary)"
                                        : "2px solid transparent",
                                color: t === tab ? "var(--foreground)" : "var(--muted-foreground)",
                                marginBottom: -1,
                            }}
                        >
                            {t}
                        </Button>
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
