import React from "react";

import { formatCommand } from "@/features/execution/domain/TaskCommand";
import { TASK_STATUS, type ExecEntry } from "@/types/domain-types";

export const STATUS_C: Record<ExecEntry["status"], string> = {
    [TASK_STATUS.SUCCESS]: "var(--color-hex-3fb950)",
    [TASK_STATUS.FAILED]: "var(--color-hex-ff2a32)",
    [TASK_STATUS.TIMEOUT]: "var(--color-hex-d29922)",
    [TASK_STATUS.RUNNING]: "var(--color-hex-e31b23)",
    [TASK_STATUS.PENDING]: "var(--color-hex-666666)",
};

export const ExecutionEntryRow = React.memo(function ExecutionEntryRowInner({
    e,
    onClick,
}: {
    e: ExecEntry;
    onClick: () => void;
}) {
    return (
        <div
            className="flex cursor-pointer items-start gap-0"
            style={{
                borderBottom: "1px solid var(--color-hex-0e0e0e)",
            }}
            onClick={onClick}
            onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                    onClick();
                }
            }}
            role="button"
            tabIndex={0}
            onMouseEnter={(ev) => (ev.currentTarget.style.background = "var(--color-hex-0d0d0d)")}
            onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
        >
            <div className="w-[48px] shrink-0 px-[12px] py-[7px] text-[9px] text-[var(--color-hex-333333)]">
                {e.id}
            </div>
            <div className="w-[80px] shrink-0 px-[12px] py-[7px] text-[9px] tracking-[0.04em] text-[var(--color-hex-333333)]">
                {e.ts}
            </div>
            <div className="w-[108px] shrink-0 px-[12px] py-[7px] text-[9px] font-semibold tracking-[0.08em] text-[var(--color-hex-e31b23)]">
                {e.specialist}
            </div>
            <div
                className="w-[160px] shrink-0 overflow-hidden px-[12px] py-[7px] text-[9px] tracking-[0.04em] whitespace-nowrap text-[var(--color-hex-666666)]"
                style={{
                    textOverflow: "ellipsis",
                }}
            >
                {formatCommand(e.command)}
            </div>
            <div className="w-[72px] shrink-0 px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                {e.command.tool.id}
            </div>
            <div className="w-[64px] shrink-0 px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-444444)]">
                {e.duration}
            </div>
            <div className="w-[72px] shrink-0 px-[12px] py-[7px]">
                <span
                    className="text-[8.5px] font-semibold tracking-[0.1em]"
                    style={{
                        color: STATUS_C[e.status],
                    }}
                >
                    {e.status}
                </span>
            </div>
            <div
                className="flex-1 overflow-hidden px-[12px] py-[7px] text-[9px] leading-[1.4] tracking-[0.03em] whitespace-nowrap text-[var(--color-hex-555555)]"
                style={{
                    textOverflow: "ellipsis",
                }}
            >
                {e.output || <span className="text-[var(--color-hex-2a2a2a)]">IN PROGRESS…</span>}
            </div>
        </div>
    );
});
