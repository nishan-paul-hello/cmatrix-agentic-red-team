import React from "react";

import { getStatusColor } from "@/components/ui/StatusBadge";
import { type TrajStep } from "@/features/trajectory/data/fixtures/trajectoryMockData";
import { TASK_STATUS } from "@/types/domain-types";

export const TYPE_C: Record<
    TrajStep["type"],
    {
        color: string;
        bg: string;
    }
> = {
    DECISION: {
        color: "var(--primary)",
        bg: "var(--border)",
    },
    EXECUTION: {
        color: "var(--muted-foreground)",
        bg: "var(--background)",
    },
    EVALUATION: {
        color: "var(--muted-foreground)",
        bg: "var(--border)",
    },
    BRANCH: {
        color: "var(--warning)",
        bg: "var(--border)",
    },
    COMPACTION: {
        color: "var(--border)",
        bg: "var(--border)",
    },
    VALIDATION: {
        color: "var(--success)",
        bg: "var(--border)",
    },
};

export const TrajectoryStepRow = React.memo(function TrajectoryStepRowInner({
    step,
    isSel,
    isLast,
    onClick,
}: {
    step: TrajStep;
    isSel: boolean;
    isLast: boolean;
    onClick: (step: TrajStep) => void;
}) {
    const tc = TYPE_C[step.type];
    return (
        <div className="flex items-start gap-0">
            {/* Spine */}
            <div className="mt-0.5 flex w-8 flex-shrink-0 flex-col items-center">
                <div
                    className="h-2.5 w-2.5 shrink-0"
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
                {!isLast && <div className="bg-card min-h-7 w-px flex-1" />}
            </div>
            {/* Card */}
            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onClick(step);
                    }
                }}
                onClick={() => onClick(step)}
                className="flex-1 cursor-pointer"
                style={{
                    marginBottom: !isLast ? 0 : 0,
                    paddingBottom: !isLast ? 12 : 0,
                }}
            >
                <div
                    className="border-border overflow-hidden rounded-sm border-[1px] border-solid"
                    style={{
                        background: isSel ? "var(--background)" : "transparent",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--background)")}
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.background = isSel
                            ? "var(--background)"
                            : "transparent")
                    }
                >
                    <div className="border-border flex items-center gap-3 border-b px-4 py-2">
                        <span className="text-muted-foreground min-w-5 text-sm tracking-wide">
                            #{String(step.step).padStart(2, "0")}
                        </span>
                        <span
                            className="rounded-sm px-1.5 py-px text-sm font-bold tracking-widest"
                            style={{
                                color: tc.color,
                                border: `1px solid ${tc.color}44`,
                            }}
                        >
                            {step.type}
                        </span>
                        <span className="text-primary text-base font-semibold tracking-tight">
                            {step.agent}
                        </span>
                        <span className="text-muted-foreground ml-auto text-sm">{step.ts}</span>
                        <span
                            className="text-sm font-semibold tracking-wide"
                            style={{
                                color: getStatusColor(step.status).color,
                            }}
                        >
                            {step.status}
                        </span>
                    </div>
                    <div className="px-4 py-3">
                        <p
                            className="text-muted-foreground text-xs leading-relaxed"
                            style={{
                                margin: 0,
                                marginBottom: isSel ? 10 : 0,
                            }}
                        >
                            {step.summary}
                        </p>
                        {isSel && (
                            <div className="border-border mt-3 grid grid-cols-1 gap-x-8 gap-y-3 border-t sm:grid-cols-2">
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
                                        <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                                            {r.k}
                                        </div>
                                        <div
                                            className="text-xs"
                                            style={{
                                                color: (() => {
                                                    if (r.k === "COST" || r.k === "TOKENS") {
                                                        return "var(--muted-foreground)";
                                                    }
                                                    if (r.k === "E_ORD DELTA" && r.v !== "—") {
                                                        return "var(--success)";
                                                    }
                                                    return "var(--muted-foreground)";
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
