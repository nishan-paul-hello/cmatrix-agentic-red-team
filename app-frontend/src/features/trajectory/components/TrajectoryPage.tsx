import React, { useCallback, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { TrajectoryStepRow, TYPE_C } from "@/features/trajectory/components/TrajectoryStepRow";
import { type TrajStep } from "@/features/trajectory/data/fixtures/trajectoryMockData";
import { useTrajectoryFeed } from "@/features/trajectory/hooks/useTrajectoryFeed";
import { TASK_STATUS } from "@/types/domain-types";
import { getStatusColor } from "@/utils/statusColors";

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
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Header */}
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="tracking-widest-2 mb-[3px] text-base text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        TRAJECTORY
                    </h1>
                    <div className="flex items-center gap-5">
                        <Stat label="TOTAL STEPS" value={String(stepsData.length)} />
                        <Stat
                            label="DECISIONS"
                            value={String(stepsData.filter((s) => s.type === "DECISION").length)}
                            red
                        />
                        <Stat label="TOTAL COST" value={`$${totCost.toFixed(4)}`} />
                    </div>
                </div>
            </div>
            {/* Filter strip */}
            <div
                className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-6 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                }}
            >
                {types.map((t) => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        aria-pressed={filter === t}
                        aria-label={t === "ALL" ? "Show all events" : `Filter by ${t}`}
                        className="font-inherit tracking-wider-1 cursor-pointer rounded-[2px] px-[10px] py-[3px] text-sm"
                        style={{
                            background: (() => {
                                if (filter === t) {
                                    if (t === "ALL") {
                                        return "var(--color-hex-1a1a1a)";
                                    }
                                    return (TYPE_C[t] as { bg: string }).bg;
                                }
                                return "transparent";
                            })(),
                            border: `1px solid ${(() => {
                                if (filter === t) {
                                    if (t === "ALL") {
                                        return "var(--color-hex-444444)";
                                    }
                                    return `${(TYPE_C[t] as { color: string }).color}66`;
                                }
                                return "var(--color-hex-1e1e1e)";
                            })()}`,
                            color: (() => {
                                if (filter === t) {
                                    if (t === "ALL") {
                                        return "var(--color-fg)";
                                    }
                                    return (TYPE_C[t] as { color: string }).color;
                                }
                                return "var(--color-hex-444444)";
                            })(),
                        }}
                    >
                        {t}
                    </button>
                ))}
                <span className="ml-auto text-sm tracking-wide text-[var(--color-hex-333333)]">
                    {visible.length} EVENTS
                </span>
            </div>
            {/* Main */}
            <div className="flex min-h-[0px] flex-1 overflow-hidden">
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
                <div
                    className="flex w-[220px] flex-shrink-0 flex-col overflow-y-auto px-[14px] py-[16px]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div className="mb-[14px] text-sm tracking-widest text-[var(--color-hex-444444)]">
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
                                    className="h-[6px] w-[6px] shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                        background: tc.color,
                                    }}
                                />
                                <span className="tracking-tight-1 flex-1 text-base text-[var(--color-hex-555555)]">
                                    {t}
                                </span>
                                <span
                                    className="text-lg font-bold"
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
                        className="h-[1px] bg-[var(--color-hex-1a1a1a)]"
                        style={{
                            margin: "12px 0",
                        }}
                    />
                    <div className="mb-[14px] text-sm tracking-widest text-[var(--color-hex-444444)]">
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
                                    className="h-[6px] w-[6px] shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                        background: getStatusColor(s).color,
                                    }}
                                />
                                <span className="flex-1 text-base text-[var(--color-hex-555555)]">
                                    {s}
                                </span>
                                <span
                                    className="text-lg font-bold"
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
function Stat({ label, value, red }: { label: string; value: string; red?: boolean }) {
    return (
        <div className="flex flex-col items-end">
            <div className="text-sm-tight tracking-wider-3 mb-[2px] text-[var(--color-hex-444444)]">
                {label}
            </div>
            <div
                className="text-4xl font-bold"
                style={{
                    color: red ? "var(--color-brand)" : "var(--color-fg)",
                }}
            >
                {value}
            </div>
        </div>
    );
}
