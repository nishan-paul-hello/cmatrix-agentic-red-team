import React from "react";

import { Button } from "@/components/ui/button";
import { FilterChip } from "@/features/missions/components/workspace/FilterChip";

export function AttackGraphToolbar({
    nodeCount,
    edgeCount,
    statusFilter,
    setStatusFilter,
    vulnFilter,
    setVulnFilter,
    onFocusHighestScore,
    statusFilters,
    vulnFilters,
}: {
    nodeCount: number;
    edgeCount: number;
    statusFilter: string;
    setStatusFilter: (v: string) => void;
    vulnFilter: string;
    setVulnFilter: (v: string) => void;
    onFocusHighestScore: () => void;
    statusFilters: string[];
    vulnFilters: string[];
}) {
    return (
        <div className="bg-background border-border flex flex-shrink-0 flex-col gap-2 border-b px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-base tracking-widest">
                        ATTACK GRAPH
                    </span>
                    <span className="text-muted-foreground text-sm tracking-wide">
                        VDG / CVE-001 · {nodeCount} NODES · {edgeCount} EDGES
                    </span>
                </div>
                <Button
                    variant="outline"
                    className="border-border bg-muted text-muted-foreground hover:border-primary hover:bg-muted hover:text-muted-foreground h-auto rounded-sm px-3 py-1 text-base tracking-widest transition-colors duration-100"
                    onClick={onFocusHighestScore}
                >
                    ◈ FOCUS HIGHEST-SCORE PATH
                </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1">
                    {statusFilters.map((f) => (
                        <FilterChip
                            key={f}
                            label={f === "IN_PROGRESS" ? "IN PROGRESS" : f}
                            active={statusFilter === f}
                            onClick={() => setStatusFilter(f)}
                            red={f !== "ALL"}
                        />
                    ))}
                </div>
                <div className="bg-muted h-4 w-px" />
                <div className="flex flex-wrap items-center gap-1">
                    {vulnFilters.map((f) => (
                        <FilterChip
                            key={f}
                            label={f}
                            active={vulnFilter === f}
                            onClick={() => setVulnFilter(f)}
                            dim
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
