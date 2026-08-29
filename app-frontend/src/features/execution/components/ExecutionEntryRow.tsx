import React from "react";

import { getStatusColor } from "@/components/ui/StatusBadge";
import { formatCommand } from "@/features/execution/domain/TaskCommand";
import { type ExecEntry } from "@/types/domain-types";

import { EXEC_COLUMN_WIDTHS } from "./ExecutionConsoleConstants";

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
                className="text-muted-foreground shrink-0 px-3 py-1.5 text-base"
                style={{ width: EXEC_COLUMN_WIDTHS[0] }}
            >
                {e.id}
            </div>
            <div
                className="text-muted-foreground shrink-0 px-3 py-1.5 text-base tracking-tighter"
                style={{ width: EXEC_COLUMN_WIDTHS[1] }}
            >
                {e.ts}
            </div>
            <div
                className="text-primary shrink-0 px-3 py-1.5 text-base font-semibold tracking-tight"
                style={{ width: EXEC_COLUMN_WIDTHS[2] }}
            >
                {e.specialist}
            </div>
            <div
                className="text-muted-foreground shrink-0 overflow-hidden px-3 py-1.5 text-base tracking-tighter text-ellipsis whitespace-nowrap"
                style={{ width: EXEC_COLUMN_WIDTHS[3] }}
            >
                {formatCommand(e.command)}
            </div>
            <div
                className="text-muted-foreground shrink-0 px-3 py-1.5 text-base"
                style={{ width: EXEC_COLUMN_WIDTHS[4] }}
            >
                {e.command.tool.id}
            </div>
            <div
                className="text-muted-foreground shrink-0 px-3 py-1.5 text-right text-base"
                style={{ width: EXEC_COLUMN_WIDTHS[5] }}
            >
                {e.duration}
            </div>
            <div className="shrink-0 px-3 py-1.5" style={{ width: EXEC_COLUMN_WIDTHS[6] }}>
                <span
                    className="text-sm font-semibold tracking-normal"
                    style={{
                        color: getStatusColor(e.status).color,
                    }}
                >
                    {e.status}
                </span>
            </div>
            <div className="text-muted-foreground flex-1 overflow-hidden px-3 py-1.5 text-base leading-tight tracking-tighter text-ellipsis whitespace-nowrap">
                {e.output || <span className="text-muted-foreground">IN PROGRESS…</span>}
            </div>
        </button>
    );
});
