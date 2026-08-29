import React from "react";

import { getStatusColor } from "@/components/ui/StatusBadge";
import { type TrajStep } from "@/features/trajectory/data/fixtures/trajectoryMockData";
import { TASK_STATUS } from "@/types/domain-types";

export const TYPE_C: Record<
    TrajStep["type"] | "ALL",
    { text: string; bg: string; bgSolid: string; border: string; borderAlpha: string }
> = {
    ALL: {
        text: "text-foreground",
        bg: "bg-border",
        bgSolid: "bg-foreground",
        border: "border-foreground",
        borderAlpha: "border-foreground/30",
    },
    DECISION: {
        text: "text-primary",
        bg: "bg-border",
        bgSolid: "bg-primary",
        border: "border-primary",
        borderAlpha: "border-primary/30",
    },
    EXECUTION: {
        text: "text-muted-foreground",
        bg: "bg-background",
        bgSolid: "bg-muted-foreground",
        border: "border-muted-foreground",
        borderAlpha: "border-muted-foreground/30",
    },
    EVALUATION: {
        text: "text-muted-foreground",
        bg: "bg-border",
        bgSolid: "bg-muted-foreground",
        border: "border-muted-foreground",
        borderAlpha: "border-muted-foreground/30",
    },
    BRANCH: {
        text: "text-warning",
        bg: "bg-border",
        bgSolid: "bg-warning",
        border: "border-warning",
        borderAlpha: "border-warning/30",
    },
    COMPACTION: {
        text: "text-border",
        bg: "bg-border",
        bgSolid: "bg-border",
        border: "border-border",
        borderAlpha: "border-border/30",
    },
    VALIDATION: {
        text: "text-success",
        bg: "bg-border",
        bgSolid: "bg-success",
        border: "border-success",
        borderAlpha: "border-success/30",
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
                    className={`z-header h-2.5 w-2.5 shrink-0 rounded-full border border-solid ${tc.border} ${(() => {
                        if (isSel) {
                            return tc.bgSolid;
                        }
                        if (step.status === TASK_STATUS.RUNNING) {
                            return tc.bgSolid;
                        }
                        return "bg-transparent";
                    })()}`}
                />
                {!isLast && <div className="bg-card min-h-7 w-px flex-1" />}
            </div>
            {/* Card */}
            <button
                type="button"
                onClick={() => onClick(step)}
                className={`focus:ring-primary block w-full flex-1 cursor-pointer text-left focus:ring-1 focus:outline-none ${!isLast ? "pb-3" : "pb-0"} mb-0`}
            >
                <div
                    className={`border-border hover:bg-background overflow-hidden rounded-sm border-[1px] border-solid transition-colors ${isSel ? "bg-background" : "bg-transparent"}`}
                >
                    <div className="border-border flex items-center gap-3 border-b px-4 py-2">
                        <span className="text-muted-foreground min-w-5 text-sm tracking-wide">
                            #{String(step.step).padStart(2, "0")}
                        </span>
                        <span
                            className={`rounded-sm border border-solid px-1.5 py-px text-sm font-bold tracking-widest ${tc.text} ${tc.borderAlpha}`}
                        >
                            {step.type}
                        </span>
                        <span className="text-primary text-base font-semibold tracking-tight">
                            {step.agent}
                        </span>
                        <span className="text-muted-foreground ml-auto text-sm">{step.ts}</span>
                        <span
                            className={`text-sm font-semibold tracking-wide ${getStatusColor(step.status).color}`}
                        >
                            {step.status}
                        </span>
                    </div>
                    <div className="px-4 py-3">
                        <p
                            className={`text-muted-foreground m-0 text-xs leading-relaxed ${isSel ? "mb-2.5" : "mb-0"}`}
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
                                            className={`text-xs ${(() => {
                                                if (r.k === "COST" || r.k === "TOKENS") {
                                                    return "text-muted-foreground";
                                                }
                                                if (r.k === "E_ORD DELTA" && r.v !== "—") {
                                                    return "text-success";
                                                }
                                                return "text-muted-foreground";
                                            })()}`}
                                        >
                                            {r.v}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </button>
        </div>
    );
});
