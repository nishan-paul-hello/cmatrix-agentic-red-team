import { useEffect, useState } from "react";

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
        <div className="flex h-full min-h-[0px] flex-col">
            {!hideHeader && (
                <div
                    className="flex-shrink-0 px-6 pt-5 pb-0"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div className="tracking-widest-2 mb-[3px] text-base text-[var(--color-hex-666666)]">
                        {missionId ? `MISSION / ${missionId}` : "SYSTEM"}
                    </div>
                    <h1 className="mb-[12px] text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        COST &amp; USAGE
                    </h1>
                    <div className="flex">
                        {(["COST & USAGE", "MODEL BREAKDOWN", "CONTEXT STATE"] as CostTab[]).map(
                            (t) => (
                                <button
                                    key={t}
                                    onClick={() => setTab(t)}
                                    className="font-inherit tracking-wider-1 cursor-pointer border-none bg-[transparent] px-[16px] py-[5px] text-base whitespace-nowrap"
                                    style={{
                                        borderBottom:
                                            t === tab
                                                ? "2px solid var(--color-brand)"
                                                : "2px solid transparent",
                                        color:
                                            t === tab
                                                ? "var(--color-fg)"
                                                : "var(--color-hex-444444)",
                                        marginBottom: -1,
                                    }}
                                >
                                    {t}
                                </button>
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
