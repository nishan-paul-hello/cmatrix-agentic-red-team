"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import CostDashboard from "@/features/cost/components/CostDashboard";
import { CostRepository } from "@/features/cost/data/CostRepository";
import { PER_SURFACE_ROLLUP, type CostTab } from "@/features/cost/data/fixtures/costMockData";
import { useCostData } from "@/features/cost/hooks/useCostData";
import {
    ALL_MISSIONS_OPTION,
    MISSION_OPTIONS,
} from "@/features/missions/data/fixtures/missionOptions";

/**
 * CostBrowser — global SYSTEM cost view (reached from SYSTEM nav group).
 *
 * Pattern: matches TrajectoryBrowser / MemoryBrowser exactly.
 * - "ALL MISSIONS" selector → aggregate view with per-surface cost-per-exploit rollup tab (§12.2).
 * - Per-mission selector → delegates to CostDashboard with missionId prop.
 *
 * Single source of truth: tab state lives here and is passed down to CostDashboard
 * so clicking the header tabs always reflects in the content panel.
 * PER-SURFACE ROLLUP tab is only shown (and selectable) in the ALL MISSIONS view.
 */
export default function CostBrowser() {
    const [selected, setSelected] = useState<string>(ALL_MISSIONS_OPTION);
    const isAggregate = selected === ALL_MISSIONS_OPTION;

    // Single tab state owned here — passed down to CostDashboard to avoid split-brain.
    const { tab, setTab } = useCostData();
    const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        void CostRepository.getCostData().then(() => setDataLoaded(true));
    }, []);

    // When switching from a specific mission back to ALL MISSIONS, ensure we're not
    // stuck on PER-SURFACE ROLLUP which doesn't exist for per-mission views.
    function handleSelectMission(value: string) {
        setSelected(value);
        if (value !== ALL_MISSIONS_OPTION && tab === "PER-SURFACE ROLLUP") {
            setTab("COST & USAGE");
        }
    }

    if (!dataLoaded) {
        return (
            <div className="flex h-full flex-1 items-center justify-center">
                <EmptyState message="LOADING COST DATA..." />
            </div>
        );
    }

    // Tabs available depend on scope:
    // ALL MISSIONS → 4 tabs (including PER-SURFACE ROLLUP)
    // Specific mission → 3 tabs only
    const aggTabs: CostTab[] = isAggregate
        ? ["COST & USAGE", "MODEL BREAKDOWN", "CONTEXT STATE", "PER-SURFACE ROLLUP"]
        : ["COST & USAGE", "MODEL BREAKDOWN", "CONTEXT STATE"];

    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Page header — always visible, owns SCOPE selector and tab bar */}
            <div
                className="flex-shrink-0 px-6 pt-5 pb-0"
                style={{ borderBottom: "1px solid var(--color-hex-1e1e1e)" }}
            >
                <div className="tracking-widest-2 mb-[3px] text-base text-[var(--color-hex-666666)]">
                    SYSTEM
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="mb-[12px] text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        COST &amp; USAGE
                    </h1>
                    <div className="mb-[12px] flex items-center gap-2">
                        <span className="tracking-wider-3 text-sm text-[var(--color-hex-444444)]">
                            SCOPE
                        </span>
                        <select
                            value={selected}
                            onChange={(e) => handleSelectMission(e.target.value)}
                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[8px] py-[4px] text-lg tracking-tight text-[var(--color-hex-a0a0a0)] outline-none"
                        >
                            {MISSION_OPTIONS.map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex">
                    {aggTabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className="font-inherit tracking-wider-1 cursor-pointer border-none bg-[transparent] px-[16px] py-[5px] text-base whitespace-nowrap"
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

            {/* Per-surface rollup tab — §12.2 required cross-surface cost view (ALL MISSIONS only) */}
            {tab === "PER-SURFACE ROLLUP" && isAggregate && (
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    <div className="mb-[6px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                        PER-SURFACE COST-PER-EXPLOIT ROLLUP
                    </div>
                    {/* §12.2 note */}
                    <div className="mb-[16px] text-sm leading-normal tracking-normal text-[var(--color-hex-555555)]">
                        cost_per_run / pass@1_rate reported per surface, per architecture §12.2.
                        Compute-normalized at 50 API calls/CVE — orchestration overhead excluded.
                    </div>
                    {/* Table */}
                    <div className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                        <div
                            className="flex bg-[var(--color-hex-0f0f0f)]"
                            style={{ borderBottom: "1px solid var(--color-hex-1a1a1a)" }}
                        >
                            {[
                                "SURFACE",
                                "TOTAL COST",
                                "RUNS",
                                "pass@1 RATE",
                                "COST / EXPLOIT",
                                "AVG TIME",
                            ].map((h) => (
                                <div
                                    key={h}
                                    className="text-sm-tight tracking-wider-1 flex-1 px-[12px] py-[5px] font-semibold text-[var(--color-hex-444444)]"
                                    style={{ textAlign: h === "SURFACE" ? "left" : "right" }}
                                >
                                    {h}
                                </div>
                            ))}
                        </div>
                        {PER_SURFACE_ROLLUP.map((row, i) => (
                            <div
                                key={row.surface}
                                className="flex items-center"
                                style={{
                                    borderBottom:
                                        i < PER_SURFACE_ROLLUP.length - 1
                                            ? "1px solid var(--color-hex-111111)"
                                            : "none",
                                    background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                                }}
                            >
                                <div className="flex-1 px-[12px] py-[8px] text-base font-bold text-[var(--color-hex-a0a0a0)]">
                                    {row.surface}
                                </div>
                                <div className="flex-1 px-[12px] py-[8px] text-right text-lg text-[var(--color-fg)]">
                                    {row.totalCost}
                                </div>
                                <div className="flex-1 px-[12px] py-[8px] text-right text-lg text-[var(--color-hex-555555)]">
                                    {row.runs}
                                </div>
                                <div
                                    className="flex-1 px-[12px] py-[8px] text-right text-lg font-bold"
                                    style={{
                                        color: (() => {
                                            if (row.passAt1Rate >= 0.6) {
                                                return "var(--color-success)";
                                            }
                                            if (row.passAt1Rate >= 0.4) {
                                                return "var(--color-warning)";
                                            }
                                            return "var(--color-danger)";
                                        })(),
                                    }}
                                >
                                    {(row.passAt1Rate * 100).toFixed(1)}%
                                </div>
                                <div className="flex-1 px-[12px] py-[8px] text-right text-lg font-bold text-[var(--color-brand)]">
                                    {row.costPerExploit}
                                </div>
                                <div className="flex-1 px-[12px] py-[8px] text-right text-lg text-[var(--color-hex-444444)]">
                                    {row.avgTimeMin}m
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All other tabs — delegate content rendering to CostDashboard.
                hideHeader=true because we already rendered the page header above.
                tab/setTab are passed in so CostDashboard uses our state, not its own. */}
            {tab !== "PER-SURFACE ROLLUP" && (
                <div className="min-h-[0px] flex-1 overflow-hidden">
                    <CostDashboard
                        key={selected}
                        missionId={isAggregate ? undefined : selected}
                        hideHeader
                        tab={tab}
                        setTab={setTab}
                    />
                </div>
            )}
        </div>
    );
}
