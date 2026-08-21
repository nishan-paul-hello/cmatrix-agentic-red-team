import React, { useCallback, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import { type TrajStep } from "@/features/trajectory/data/fixtures/trajectoryMockData";
import { useTrajectoryFeed } from "@/features/trajectory/hooks/useTrajectoryFeed";
import { TASK_STATUS } from "@/types/domain-types";

const TYPE_C: Record<
    TrajStep["type"],
    {
        color: string;
        bg: string;
    }
> = {
    DECISION: {
        color: "var(--color-hex-e31b23)",
        bg: "var(--color-hex-120608)",
    },
    EXECUTION: {
        color: "var(--color-hex-444444)",
        bg: "var(--color-hex-0d0d0d)",
    },
    EVALUATION: {
        color: "var(--color-hex-a0a0a0)",
        bg: "var(--color-hex-0f0f0f)",
    },
    BRANCH: {
        color: "var(--color-hex-d29922)",
        bg: "var(--color-hex-110e00)",
    },
    COMPACTION: {
        color: "var(--color-hex-3b82f6)",
        bg: "var(--color-hex-060e1a)",
    },
    VALIDATION: {
        color: "var(--color-hex-3fb950)",
        bg: "var(--color-hex-061a0c)",
    },
};
const STATUS_C: Record<TrajStep["status"], string> = {
    [TASK_STATUS.SUCCESS]: "var(--color-hex-3fb950)",
    [TASK_STATUS.FAILED]: "var(--color-hex-ff2a32)",
    [TASK_STATUS.RUNNING]: "var(--color-hex-d29922)",
    [TASK_STATUS.TIMEOUT]: "var(--color-hex-555555)",
    [TASK_STATUS.PENDING]: "var(--color-hex-666666)",
};

const TrajectoryStepRow = React.memo(function TrajectoryStepRowInner({
    step,
    isSel,
    isLast,
    onClick,
}: {
    step: TrajStep;
    isSel: boolean;
    isLast: boolean;
    onClick: () => void;
}) {
    const tc = TYPE_C[step.type];
    return (
        <div className="flex items-start gap-0">
            {/* Spine */}
            <div className="mt-[2px] flex w-[32px] flex-shrink-0 flex-col items-center">
                <div
                    className="h-[10px] w-[10px] shrink-0"
                    style={{
                        borderRadius: "50%",
                        border: `1px solid ${tc.color}`,
                        background: (() => {
                            if (isSel) {
                                return tc.color;
                            }
                            if (step.status === TASK_STATUS.RUNNING) {
                                return tc.color;
                            }
                            return "transparent";
                        })(),
                        zIndex: 1,
                    }}
                />
                {!isLast && (
                    <div className="min-h-[28px] w-[1px] flex-1 bg-[var(--color-hex-1a1a1a)]" />
                )}
            </div>
            {/* Card */}
            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onClick();
                    }
                }}
                onClick={onClick}
                className="flex-1 cursor-pointer"
                style={{
                    marginBottom: !isLast ? 0 : 0,
                    paddingBottom: !isLast ? 12 : 0,
                }}
            >
                <div
                    className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)]"
                    style={{
                        background: isSel ? "var(--color-hex-0d0d0d)" : "transparent",
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.background = isSel
                            ? "var(--color-hex-0d0d0d)"
                            : "transparent")
                    }
                >
                    <div
                        className="flex items-center gap-3 px-4 py-2"
                        style={{
                            borderBottom: "1px solid var(--color-hex-141414)",
                            background: tc.bg,
                        }}
                    >
                        <span className="min-w-[20px] text-[8px] tracking-[0.12em] text-[var(--color-hex-333333)]">
                            #{String(step.step).padStart(2, "0")}
                        </span>
                        <span
                            className="rounded-[2px] px-[6px] py-[1px] text-[8px] font-bold tracking-[0.14em]"
                            style={{
                                color: tc.color,
                                border: `1px solid ${tc.color}44`,
                            }}
                        >
                            {step.type}
                        </span>
                        <span className="text-[9px] font-semibold tracking-[0.06em] text-[var(--color-hex-e31b23)]">
                            {step.agent}
                        </span>
                        <span className="ml-auto text-[8px] text-[var(--color-hex-333333)]">
                            {step.ts}
                        </span>
                        <span
                            className="text-[8px] font-semibold tracking-[0.12em]"
                            style={{
                                color: STATUS_C[step.status],
                            }}
                        >
                            {step.status}
                        </span>
                    </div>
                    <div className="px-4 py-3">
                        <p
                            className="text-[10px] leading-[1.7] text-[var(--color-hex-666666)]"
                            style={{
                                margin: 0,
                                marginBottom: isSel ? 10 : 0,
                            }}
                        >
                            {step.summary}
                        </p>
                        {isSel && (
                            <div
                                className="mt-3 grid grid-cols-2 gap-x-8 gap-y-3"
                                style={{
                                    borderTop: "1px solid var(--color-hex-141414)",
                                    paddingTop: 12,
                                }}
                            >
                                {[
                                    {
                                        k: "VDG DELTA",
                                        v: step.vdgDelta ?? "—",
                                    },
                                    {
                                        k: "EL DELTA",
                                        v: step.elDelta ?? "—",
                                    },
                                    {
                                        k: "E_ORD DELTA",
                                        v: step.eordDelta ?? "—",
                                    },
                                    {
                                        k: "COST",
                                        v: step.cost,
                                    },
                                    {
                                        k: "TOKENS",
                                        v: step.tokens,
                                    },
                                ].map((r) => (
                                    <div key={r.k}>
                                        <div className="mb-[2px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                            {r.k}
                                        </div>
                                        <div
                                            className="text-[10px]"
                                            style={{
                                                color: (() => {
                                                    if (r.k === "COST" || r.k === "TOKENS") {
                                                        return "var(--color-hex-555555)";
                                                    }
                                                    if (r.k === "E_ORD DELTA" && r.v !== "—") {
                                                        return "var(--color-hex-3fb950)";
                                                    }
                                                    return "var(--color-hex-888888)";
                                                })(),
                                            }}
                                        >
                                            {r.v}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

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
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
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
                        className="font-inherit cursor-pointer rounded-[2px] px-[10px] py-[3px] text-[8px] tracking-[0.14em]"
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
                                        return "var(--color-hex-f2f2f2)";
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
                <span className="ml-auto text-[8px] tracking-[0.12em] text-[var(--color-hex-333333)]">
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
                                onClick={() => handleRowClick(step)}
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
                    <div className="mb-[14px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
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
                                <span className="flex-1 text-[9px] tracking-[0.06em] text-[var(--color-hex-555555)]">
                                    {t}
                                </span>
                                <span
                                    className="text-[10px] font-bold"
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
                    <div className="mb-[14px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
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
                                        background: STATUS_C[s],
                                    }}
                                />
                                <span className="flex-1 text-[9px] text-[var(--color-hex-555555)]">
                                    {s}
                                </span>
                                <span
                                    className="text-[10px] font-bold"
                                    style={{
                                        color: STATUS_C[s],
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
            <div className="mb-[2px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                {label}
            </div>
            <div
                className="text-[14px] font-bold"
                style={{
                    color: red ? "var(--color-hex-e31b23)" : "var(--color-hex-f2f2f2)",
                }}
            >
                {value}
            </div>
        </div>
    );
}
