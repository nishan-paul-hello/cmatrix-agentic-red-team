import React, { useCallback, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { Button } from "@/components/ui/button";
import { KPIStrip } from "@/components/ui/KPIStrip";
import { getStatusColor } from "@/components/ui/StatusBadge";
import { TrajectoryStepRow, TYPE_C } from "@/features/trajectory/components/TrajectoryStepRow";
import { type TrajStep } from "@/features/trajectory/data/fixtures/trajectoryMockData";
import { useTrajectoryFeed } from "@/features/trajectory/hooks/useTrajectoryFeed";
import { TASK_STATUS } from "@/types/domain-types";

export default function TrajectoryPage() {
    const stepsData = useTrajectoryFeed();
    const [sel, setSel] = useState<TrajStep | null>(null);
    const [filter, setFilter] = useState<TrajStep["type"] | "ALL">("ALL");
    const types: (TrajStep["type"] | "ALL")[] = [
        "ALL",
        "DECISION",
        "EXECUTION",
        "EVALUATION",
        "BRANCH",
        "COMPACTION",
        "VALIDATION",
    ];

    const visible = useMemo(() => {
        return filter === "ALL" ? stepsData : stepsData.filter((s) => s.type === filter);
    }, [filter, stepsData]);

    const totCost = useMemo(() => {
        return stepsData.reduce((s, x) => s + parseFloat(x.cost.replace("$", "")), 0);
    }, [stepsData]);

    const parentRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line react-hooks/incompatible-library
    const rowVirtualizer = useVirtualizer({
        count: visible.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 80, // Approximate row height
        overscan: 10,
    });

    const handleRowClick = useCallback((step: TrajStep) => {
        setSel((prev) => (prev?.step === step.step ? null : step));
    }, []);
    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Header */}
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    MISSION / CVE-001
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">TRAJECTORY</h1>
                    <KPIStrip
                        variant="inline"
                        items={[
                            { k: "TOTAL STEPS", v: String(stepsData.length) },
                            {
                                k: "DECISIONS",
                                v: String(stepsData.filter((s) => s.type === "DECISION").length),
                                c: "text-primary",
                            },
                            { k: "TOTAL COST", v: `$${totCost.toFixed(4)}` },
                        ]}
                    />
                </div>
            </div>
            {/* Filter strip */}
            <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-6 py-2">
                {types.map((t) => (
                    <Button
                        key={t}
                        variant="outline"
                        onClick={() => setFilter(t)}
                        aria-pressed={filter === t}
                        aria-label={t === "ALL" ? "Show all events" : `Filter by ${t}`}
                        className={`h-auto rounded-sm border border-solid px-2.5 py-0.5 text-sm tracking-widest hover:bg-transparent ${(() => {
                            if (filter === t) {
                                return `${TYPE_C[t].bg} ${TYPE_C[t].borderAlpha} ${TYPE_C[t].text}`;
                            }
                            return "border-border text-muted-foreground bg-transparent";
                        })()}`}
                    >
                        {t}
                    </Button>
                ))}
                <span className="text-muted-foreground ml-auto text-sm tracking-wide">
                    {visible.length} EVENTS
                </span>
            </div>
            {/* Main */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
                {/* Timeline */}
                <div className="flex-1 overflow-y-auto px-6 py-5" ref={parentRef}>
                    {rowVirtualizer.getVirtualItems().length > 0 && (
                        <div style={{ height: `${rowVirtualizer.getVirtualItems()[0].start}px` }} />
                    )}
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const step = visible[virtualRow.index];
                        return (
                            <TrajectoryStepRow
                                key={step.step}
                                step={step}
                                isSel={sel?.step === step.step}
                                isLast={virtualRow.index === visible.length - 1}
                                onClick={handleRowClick}
                            />
                        );
                    })}
                    {rowVirtualizer.getVirtualItems().length > 0 && (
                        <div
                            style={{
                                height: `${
                                    rowVirtualizer.getTotalSize() -
                                    rowVirtualizer.getVirtualItems()[
                                        rowVirtualizer.getVirtualItems().length - 1
                                    ].end
                                }px`,
                            }}
                        />
                    )}
                </div>
                {/* Right summary panel */}
                <div className="border-border lg:w-panel-sm-narrow flex w-full flex-shrink-0 flex-col overflow-y-auto border-t px-3.5 py-4 lg:border-t-0 lg:border-l">
                    <div className="text-muted-foreground mb-3.5 text-sm tracking-widest">
                        STEP TYPES
                    </div>
                    {(
                        [
                            "DECISION",
                            "EXECUTION",
                            "EVALUATION",
                            "BRANCH",
                            "COMPACTION",
                            "VALIDATION",
                        ] as TrajStep["type"][]
                    ).map((t) => {
                        const count = stepsData.filter((s) => s.type === t).length;
                        const tc = TYPE_C[t];
                        return (
                            <div key={t} className="mb-3 flex items-center gap-2">
                                <div
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${tc.bgSolid}`}
                                />
                                <span className="text-muted-foreground flex-1 text-base tracking-tight">
                                    {t}
                                </span>
                                <span className={`text-xs font-bold ${tc.text}`}>{count}</span>
                            </div>
                        );
                    })}
                    <div className="bg-card my-3 h-px" />
                    <div className="text-muted-foreground mb-3.5 text-sm tracking-widest">
                        OUTCOMES
                    </div>
                    {(
                        [
                            TASK_STATUS.SUCCESS,
                            TASK_STATUS.FAILED,
                            TASK_STATUS.TIMEOUT,
                            TASK_STATUS.RUNNING,
                        ] as TrajStep["status"][]
                    ).map((s) => {
                        const count = stepsData.filter((x) => x.status === s).length;
                        return count > 0 ? (
                            <div key={s} className="mb-3 flex items-center gap-2">
                                <div
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${getStatusColor(s).color.replace("text-", "bg-")}`}
                                />
                                <span className="text-muted-foreground flex-1 text-base">{s}</span>
                                <span className={`text-xs font-bold ${getStatusColor(s).color}`}>
                                    {count}
                                </span>
                            </div>
                        ) : null;
                    })}
                </div>
            </div>
        </div>
    );
}
