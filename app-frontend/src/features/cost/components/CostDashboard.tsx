import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import ContextState from "@/features/cost/components/ContextState";
import CostUsage from "@/features/cost/components/CostUsage";
import ModelBreakdown from "@/features/cost/components/ModelBreakdown";
import { CostRepository } from "@/features/cost/data/CostRepository";
import { type CostTab } from "@/features/cost/data/fixtures/costMockData";
import { useCostData } from "@/features/cost/hooks/useCostData";

export default function CostDashboard({
    missionId,
    hideHeader = false,
    tab: tabProp,
    setTab: setTabProp,
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
    tab?: CostTab;
    setTab?: (t: CostTab) => void;
} = {}) {
    // Fallback to own state when no controlled props are provided (standalone use).
    const ownState = useCostData();
    const tab = tabProp ?? ownState.tab;
    const setTab = setTabProp ?? ownState.setTab;

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
        <div className="flex h-full min-h-0 flex-col">
            {!hideHeader && (
                <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-0">
                    <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                        {missionId ? `MISSION / ${missionId}` : "SYSTEM"}
                    </div>
                    <h1 className="text-foreground mb-3 text-xs font-bold tracking-wide">
                        COST &amp; USAGE
                    </h1>
                    <div className="flex">
                        {(["COST & USAGE", "MODEL BREAKDOWN", "CONTEXT STATE"] as CostTab[]).map(
                            (t) => (
                                <Button
                                    key={t}
                                    variant="ghost"
                                    onClick={() => setTab(t)}
                                    className={`-mb-px h-auto rounded-none border-b-2 border-solid px-4 py-1 text-base tracking-widest whitespace-nowrap hover:bg-transparent ${t === tab ? "border-primary text-foreground" : "text-muted-foreground border-transparent"}`}
                                >
                                    {t}
                                </Button>
                            ),
                        )}
                    </div>
                </div>
            )}
            {tab === "COST & USAGE" && <CostUsage />}
            {tab === "MODEL BREAKDOWN" && <ModelBreakdown />}
            {tab === "CONTEXT STATE" && <ContextState />}
        </div>
    );
}
