import React from "react";

import { getStatusColor } from "@/components/ui/StatusBadge";
import { formatCommand } from "@/features/execution/domain/TaskCommand";
import { type ExecEntry } from "@/types/domain-types";

export const EXECUTION_COLUMNS = [
    { h: "#", w: "w-[48px]" },
    { h: "TIMESTAMP", w: "w-[80px]" },
    { h: "SPECIALIST", w: "w-[108px]" },
    { h: "TASK", w: "w-[160px]" },
    { h: "TOOL", w: "w-[72px]" },
    { h: "DURATION", w: "w-[64px]" },
    { h: "STATUS", w: "w-[72px]" },
    { h: "OUTPUT", w: "flex-1" },
] as const;

export const ExecutionEntryRow = React.memo(function ExecutionEntryRowInner({
    e,
    onClick,
}: {
    e: ExecEntry;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            className="border-border focus:ring-primary hover:bg-background flex w-full min-w-fit cursor-pointer items-start gap-0 border-b text-left transition-colors focus:ring-1 focus:outline-none"
            onClick={(ev) => {
                ev.stopPropagation();
                onClick();
            }}
        >
            <div
                className={`text-muted-foreground shrink-0 px-3 py-1.5 text-base ${EXECUTION_COLUMNS[0].w}`}
            >
                {e.id}
            </div>
            <div
                className={`text-muted-foreground shrink-0 px-3 py-1.5 text-base tracking-tighter ${EXECUTION_COLUMNS[1].w}`}
            >
                {e.ts}
            </div>
            <div
                className={`text-primary shrink-0 px-3 py-1.5 text-base font-semibold tracking-tight ${EXECUTION_COLUMNS[2].w}`}
            >
                {e.specialist}
            </div>
            <div
                className={`text-muted-foreground shrink-0 overflow-hidden px-3 py-1.5 text-base tracking-tighter text-ellipsis whitespace-nowrap ${EXECUTION_COLUMNS[3].w}`}
            >
                {formatCommand(e.command)}
            </div>
            <div
                className={`text-muted-foreground shrink-0 px-3 py-1.5 text-base ${EXECUTION_COLUMNS[4].w}`}
            >
                {e.command.tool.id}
            </div>
            <div
                className={`text-muted-foreground shrink-0 px-3 py-1.5 text-right text-base ${EXECUTION_COLUMNS[5].w}`}
            >
                {e.duration}
            </div>
            <div className={`shrink-0 px-3 py-1.5 ${EXECUTION_COLUMNS[6].w}`}>
                <span
                    className="text-sm font-semibold tracking-normal"
                    style={{
                        color: getStatusColor(e.status).color,
                    }}
                >
                    {e.status}
                </span>
            </div>
            <div
                className={`text-muted-foreground flex-1 overflow-hidden px-3 py-1.5 text-base leading-tight tracking-tighter text-ellipsis whitespace-nowrap ${EXECUTION_COLUMNS[7].w}`}
            >
                {e.output || <span className="text-muted-foreground">IN PROGRESS…</span>}
            </div>
        </button>
    );
});
