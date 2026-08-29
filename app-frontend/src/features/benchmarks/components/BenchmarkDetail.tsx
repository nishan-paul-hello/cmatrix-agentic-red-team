import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "OVERVIEW" | "TASKS" | "CATEGORIES")}
            className="flex h-full min-h-0 flex-col"
        >
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
                <TabsList variant="line" className="flex justify-start p-0">
                    {(["OVERVIEW", "TASKS", "CATEGORIES"] as const).map((t) => (
                        <TabsTrigger
                            key={t}
                            value={t}
                            className="h-auto rounded-none px-3.5 py-1 text-base tracking-widest"
                        >
                            {t}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <TabsContent value="OVERVIEW" className="m-0 h-full">
                    <BenchmarkOverviewTab bench={bench} />
                </TabsContent>
                <TabsContent value="TASKS" className="m-0 h-full">
                    <BenchmarkTasksTab tasks={tasks} />
                </TabsContent>
                <TabsContent value="CATEGORIES" className="m-0 h-full">
                    <BenchmarkCategoriesTab catStats={catStats} />
                </TabsContent>
            </div>
        </Tabs>
    );
}
