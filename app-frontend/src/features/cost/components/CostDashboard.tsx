import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContextState from "@/features/cost/components/ContextState";
import CostUsage from "@/features/cost/components/CostUsage";
import ModelBreakdown from "@/features/cost/components/ModelBreakdown";
import { CostRepository } from "@/features/cost/data/CostRepository";
import { type CostTab } from "@/features/cost/data/fixtures/costMockData";

export default function CostDashboard({
    missionId,
    hideHeader = false,
    value,
    onValueChange,
}: {
    /**
     * When provided, this is a per-mission view (inside a mission workspace).
     * Header reads "MISSION / {missionId}".
     * When absent (global SYSTEM view), header reads "SYSTEM".
     * Use CostBrowser for the global entry point to get per-surface rollup capability.
     */
    missionId?: string;
    /** Set to true when a parent component already renders the page header. */
    hideHeader?: boolean;
    /**
     * Optional controlled tab state. When provided, CostDashboard uses the parent's
     * tab/setTab instead of its own internal state — allows CostBrowser to keep a
     * single shared tab selection across the header tabs and the embedded dashboard.
     */
    value?: string;
    onValueChange?: (t: string) => void;
} = {}) {
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        // Just verify repository connection at dashboard level
        void CostRepository.getCostData().then(() => setDataLoaded(true));
    }, []);

    if (!dataLoaded) {
        return (
            <div className="flex h-full flex-1 items-center justify-center">
                <EmptyState message="LOADING COST DATA..." />
            </div>
        );
    }

    return (
        <Tabs
            value={value}
            onValueChange={onValueChange}
            defaultValue="COST & USAGE"
            className="flex h-full min-h-0 flex-col"
        >
            {!hideHeader && (
                <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-0">
                    <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                        {missionId ? `MISSION / ${missionId}` : "SYSTEM"}
                    </div>
                    <h1 className="text-foreground mb-3 text-xs font-bold tracking-wide">
                        COST &amp; USAGE
                    </h1>
                    <TabsList
                        variant="line"
                        className="flex justify-start overflow-x-auto overflow-y-hidden p-0"
                    >
                        {(["COST & USAGE", "MODEL BREAKDOWN", "CONTEXT STATE"] as CostTab[]).map(
                            (t) => (
                                <TabsTrigger
                                    key={t}
                                    value={t}
                                    className="h-auto rounded-none px-4 py-1 text-base tracking-widest whitespace-nowrap"
                                >
                                    {t}
                                </TabsTrigger>
                            ),
                        )}
                    </TabsList>
                </div>
            )}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <TabsContent value="COST & USAGE" className="m-0 flex min-h-0 flex-1 flex-col">
                    <CostUsage />
                </TabsContent>
                <TabsContent value="MODEL BREAKDOWN" className="m-0 flex min-h-0 flex-1 flex-col">
                    <ModelBreakdown />
                </TabsContent>
                <TabsContent value="CONTEXT STATE" className="m-0 flex min-h-0 flex-1 flex-col">
                    <ContextState />
                </TabsContent>
            </div>
        </Tabs>
    );
}
