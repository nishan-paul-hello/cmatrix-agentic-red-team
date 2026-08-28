import React from "react";

import { type TrajStep } from "@/features/trajectory/data/fixtures/trajectoryMockData";
import { TASK_STATUS } from "@/types/domain-types";
import { getStatusColor } from "@/utils/statusColors";

export const TYPE_C: Record<
    TrajStep["type"],
    {
        color: string;
        bg: string;
    }
> = {
    DECISION: {
        color: "var(--color-brand)",
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
        color: "var(--color-warning)",
        bg: "var(--color-hex-110e00)",
    },
    COMPACTION: {
        color: "var(--color-hex-3b82f6)",
        bg: "var(--color-hex-060e1a)",
    },
    VALIDATION: {
        color: "var(--color-success)",
        bg: "var(--color-hex-061a0c)",
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
                        <span className="min-w-[20px] text-sm tracking-wide text-[var(--color-hex-333333)]">
                            #{String(step.step).padStart(2, "0")}
                        </span>
                        <span
                            className="tracking-wider-1 rounded-[2px] px-[6px] py-[1px] text-sm font-bold"
                            style={{
                                color: tc.color,
                                border: `1px solid ${tc.color}44`,
                            }}
                        >
                            {step.type}
                        </span>
                        <span className="tracking-tight-1 text-base font-semibold text-[var(--color-brand)]">
                            {step.agent}
                        </span>
                        <span className="ml-auto text-sm text-[var(--color-hex-333333)]">
                            {step.ts}
                        </span>
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
                            className="text-lg leading-relaxed text-[var(--color-hex-666666)]"
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
                                        <div className="text-sm-tight tracking-wider-3 mb-[2px] text-[var(--color-hex-444444)]">
                                            {r.k}
                                        </div>
                                        <div
                                            className="text-lg"
                                            style={{
                                                color: (() => {
                                                    if (r.k === "COST" || r.k === "TOKENS") {
                                                        return "var(--color-hex-555555)";
                                                    }
                                                    if (r.k === "E_ORD DELTA" && r.v !== "—") {
                                                        return "var(--color-success)";
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
