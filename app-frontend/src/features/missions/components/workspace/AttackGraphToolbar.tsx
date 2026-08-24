import React from "react";

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
        <div
            className="flex flex-shrink-0 flex-col gap-2 bg-[var(--color-hex-0b0b0b)] px-4 py-3"
            style={{
                borderBottom: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        ATTACK GRAPH
                    </span>
                    <span className="text-[8.5px] tracking-[0.12em] text-[var(--color-hex-292929)]">
                        VDG / CVE-001 · {nodeCount} NODES · {edgeCount} EDGES
                    </span>
                </div>
                <button
                    className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-151515)] px-[12px] py-[4px] text-[9px] tracking-[0.14em] text-[var(--color-hex-a0a0a0)]"
                    onClick={onFocusHighestScore}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = "var(--color-hex-e31b23)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = "var(--color-hex-333333)")
                    }
                >
                    ◈ FOCUS HIGHEST-SCORE PATH
                </button>
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
                <div className="h-[16px] w-[1px] bg-[var(--color-hex-222222)]" />
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
