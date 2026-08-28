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
                <div className="flex items-baseline justify-between">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">TRAJECTORY</h1>
                    <KPIStrip
                        variant="inline"
                        items={[
                            { k: "TOTAL STEPS", v: String(stepsData.length) },
                            {
                                k: "DECISIONS",
                                v: String(stepsData.filter((s) => s.type === "DECISION").length),
                                c: "var(--primary)",
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
                        className="h-auto rounded-sm px-2.5 py-0.5 text-sm tracking-widest hover:bg-transparent"
                        style={{
                            background: (() => {
                                if (filter === t) {
                                    if (t === "ALL") {
                                        return "var(--border)";
                                    }
                                    return (TYPE_C[t] as { bg: string }).bg;
                                }
                                return "transparent";
                            })(),
                            border: `1px solid ${(() => {
                                if (filter === t) {
                                    if (t === "ALL") {
                                        return "var(--muted-foreground)";
                                    }
                                    return `${(TYPE_C[t] as { color: string }).color}66`;
                                }
                                return "var(--border)";
                            })()}`,
                            color: (() => {
                                if (filter === t) {
                                    if (t === "ALL") {
                                        return "var(--foreground)";
                                    }
                                    return (TYPE_C[t] as { color: string }).color;
                                }
                                return "var(--muted-foreground)";
                            })(),
                        }}
                    >
                        {t}
                    </Button>
                ))}
                <span className="text-muted-foreground ml-auto text-sm tracking-wide">
                    {visible.length} EVENTS
                </span>
            </div>
            {/* Main */}
            <div className="flex min-h-0 flex-1 overflow-hidden">
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
                <div className="border-border flex w-[220px] flex-shrink-0 flex-col overflow-y-auto border-l px-3.5 py-4">
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
                                    className="h-1.5 w-1.5 shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                        background: tc.color,
                                    }}
                                />
                                <span className="text-muted-foreground flex-1 text-base tracking-tight">
                                    {t}
                                </span>
                                <span
                                    className="text-xs font-bold"
                                    style={{
                                        color: tc.color,
                                    }}
                                >
                                    {count}
                                </span>
                            </div>
                        );
                    })}
                    <div
                        className="bg-card h-px"
                        style={{
                            margin: "12px 0",
                        }}
                    />
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
                                    className="h-1.5 w-1.5 shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                        background: getStatusColor(s).color,
                                    }}
                                />
                                <span className="text-muted-foreground flex-1 text-base">{s}</span>
                                <span
                                    className="text-xs font-bold"
                                    style={{
                                        color: getStatusColor(s).color,
                                    }}
                                >
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
