import React from "react";

import { getStatusColor } from "@/components/ui/StatusBadge";
import { formatCommand } from "@/features/execution/domain/TaskCommand";
import { type ExecEntry } from "@/types/domain-types";

export const EXECUTION_COLUMNS = [
    { h: "#", w: "w-[84px] shrink-0" },
    { h: "TIMESTAMP", w: "w-[80px] shrink-0" },
    { h: "SPECIALIST", w: "flex-[1] min-w-[100px]" },
    { h: "TASK", w: "flex-[2] min-w-[140px]" },
    { h: "TOOL", w: "flex-[1] min-w-[80px]" },
    { h: "DURATION", w: "w-[80px] shrink-0" },
    { h: "STATUS", w: "w-[80px] shrink-0" },
    { h: "OUTPUT", w: "flex-[3] min-w-[150px]" },
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
            className="border-border focus:ring-primary hover:bg-background flex w-full min-w-fit cursor-pointer items-start gap-4 border-b text-left transition-colors focus:ring-1 focus:outline-none"
            onClick={(ev) => {
                ev.stopPropagation();
                onClick();
            }}
        >
            <div
                className={`text-muted-foreground px-3 py-1.5 text-base ${EXECUTION_COLUMNS[0].w}`}
            >
                {e.id}
            </div>
            <div
                className={`text-muted-foreground px-3 py-1.5 text-base tracking-tighter ${EXECUTION_COLUMNS[1].w}`}
            >
                {e.ts}
            </div>
            <div
                className={`text-primary overflow-hidden px-3 py-1.5 text-base font-semibold tracking-tight text-ellipsis whitespace-nowrap ${EXECUTION_COLUMNS[2].w}`}
            >
                {e.specialist}
            </div>
            <div
                className={`text-muted-foreground overflow-hidden px-3 py-1.5 text-base tracking-tighter text-ellipsis whitespace-nowrap ${EXECUTION_COLUMNS[3].w}`}
            >
                {formatCommand(e.command)}
            </div>
            <div
                className={`text-muted-foreground overflow-hidden px-3 py-1.5 text-base text-ellipsis whitespace-nowrap ${EXECUTION_COLUMNS[4].w}`}
            >
                {e.command.tool.id}
            </div>
            <div
                className={`text-muted-foreground px-3 py-1.5 text-right text-base ${EXECUTION_COLUMNS[5].w}`}
            >
                {e.duration}
            </div>
            <div className={`px-3 py-1.5 ${EXECUTION_COLUMNS[6].w}`}>
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
                className={`text-muted-foreground overflow-hidden px-3 py-1.5 text-base leading-tight tracking-tighter text-ellipsis whitespace-nowrap ${EXECUTION_COLUMNS[7].w}`}
            >
                {e.output || <span className="text-muted-foreground">IN PROGRESS…</span>}
            </div>
        </button>
    );
});
