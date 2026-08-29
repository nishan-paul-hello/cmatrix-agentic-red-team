"use client";

import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as CostTab)}
            className="flex h-full min-h-0 flex-col"
        >
            {/* Page header — always visible, owns SCOPE selector and tab bar */}
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-0">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">SYSTEM</div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-foreground mb-3 text-xs font-bold tracking-wide">
                        COST &amp; USAGE
                    </h1>
                    <div className="mb-3 flex items-center gap-2">
                        <span className="text-muted-foreground text-sm tracking-widest">SCOPE</span>
                        <Select
                            value={selected}
                            onValueChange={(val) => val && handleSelectMission(val)}
                        >
                            <SelectTrigger className="bg-card text-muted-foreground w-panel-2xs h-auto rounded-sm px-2 py-1 text-xs tracking-tight focus:ring-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {MISSION_OPTIONS.map((m) => (
                                    <SelectItem key={m} value={m}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <TabsList variant="line" className="flex justify-start overflow-x-auto p-0">
                    {aggTabs.map((t) => (
                        <TabsTrigger
                            key={t}
                            value={t}
                            className="h-auto rounded-none px-4 py-1 text-base tracking-widest whitespace-nowrap"
                        >
                            {t}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            {/* Per-surface rollup tab — §12.2 required cross-surface cost view (ALL MISSIONS only) */}
            <TabsContent value="PER-SURFACE ROLLUP" className="m-0 flex min-h-0 flex-1 flex-col">
                {isAggregate && (
                    <div className="flex-1 overflow-y-auto px-6 py-5">
                        <div className="text-muted-foreground mb-1.5 text-sm tracking-widest">
                            PER-SURFACE COST-PER-EXPLOIT ROLLUP
                        </div>
                        {/* §12.2 note */}
                        <div className="text-muted-foreground mb-4 text-sm leading-normal tracking-normal">
                            cost_per_run / pass@1_rate reported per surface, per architecture §12.2.
                            Compute-normalized at 50 API calls/CVE — orchestration overhead
                            excluded.
                        </div>
                        {/* Table */}
                        <div className="border-border overflow-hidden rounded-sm border-[1px] border-solid">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {[
                                            "SURFACE",
                                            "TOTAL COST",
                                            "RUNS",
                                            "pass@1 RATE",
                                            "COST / EXPLOIT",
                                            "AVG TIME",
                                        ].map((h) => (
                                            <TableHead
                                                key={h}
                                                className={`px-3 py-1 text-xs tracking-widest ${h === "SURFACE" ? "text-left" : "text-right"}`}
                                            >
                                                {h}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {PER_SURFACE_ROLLUP.map((row) => {
                                        let rateColor = "text-destructive";
                                        if (row.passAt1Rate >= 0.6) {
                                            rateColor = "text-success";
                                        } else if (row.passAt1Rate >= 0.4) {
                                            rateColor = "text-warning";
                                        }

                                        return (
                                            <TableRow key={row.surface}>
                                                <TableCell className="text-muted-foreground px-3 py-2 font-bold">
                                                    {row.surface}
                                                </TableCell>
                                                <TableCell className="cell-truncate text-foreground px-3 py-2 text-right">
                                                    {row.totalCost}
                                                </TableCell>
                                                <TableCell className="cell-truncate text-muted-foreground px-3 py-2 text-right">
                                                    {row.runs}
                                                </TableCell>
                                                <TableCell
                                                    className={`cell-truncate px-3 py-2 text-right font-bold ${rateColor}`}
                                                >
                                                    {(row.passAt1Rate * 100).toFixed(1)}%
                                                </TableCell>
                                                <TableCell className="cell-truncate text-primary px-3 py-2 text-right font-bold">
                                                    {row.costPerExploit}
                                                </TableCell>
                                                <TableCell className="cell-truncate text-muted-foreground px-3 py-2 text-right">
                                                    {row.avgTimeMin}m
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                )}
            </TabsContent>

            {/* All other tabs — delegate content rendering to CostDashboard.
                hideHeader=true because we already rendered the page header above. */}
            {tab !== "PER-SURFACE ROLLUP" && (
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <CostDashboard
                        key={selected}
                        missionId={isAggregate ? undefined : selected}
                        hideHeader
                        value={tab}
                        onValueChange={(v) => setTab(v as CostTab)}
                    />
                </div>
            )}
        </Tabs>
    );
}
