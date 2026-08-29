import React from "react";

import { getStatusColor } from "@/components/ui/StatusBadge";
import { formatCommand } from "@/features/execution/domain/TaskCommand";
import { type ExecEntry } from "@/types/domain-types";

export const gridTemplateColumns =
    "84px 80px minmax(180px, 1.5fr) minmax(280px, 2.5fr) minmax(120px, 1fr) 80px 80px minmax(400px, 3fr)";

export const EXECUTION_COLUMNS = [
    { h: "#" },
    { h: "TIMESTAMP" },
    { h: "SPECIALIST" },
    { h: "TASK" },
    { h: "TOOL" },
    { h: "DURATION" },
    { h: "STATUS" },
    { h: "OUTPUT" },
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
            className="border-border focus:ring-primary hover:bg-background grid w-full cursor-pointer items-start gap-4 border-b text-left transition-colors focus:ring-1 focus:outline-none"
            style={{ gridTemplateColumns }}
            onClick={(ev) => {
                ev.stopPropagation();
                onClick();
            }}
        >
            <div className="text-muted-foreground truncate px-3 py-1.5 text-base">
                {e.id}
            </div>
            <div className="text-muted-foreground truncate px-3 py-1.5 text-base tracking-tighter">
                {e.ts}
            </div>
            <div className="text-primary truncate px-3 py-1.5 text-base font-semibold tracking-tight">
                {e.specialist}
            </div>
            <div className="text-muted-foreground truncate px-3 py-1.5 text-base tracking-tighter">
                {formatCommand(e.command)}
            </div>
            <div className="text-muted-foreground truncate px-3 py-1.5 text-base">
                {e.command.tool.id}
            </div>
            <div className="text-muted-foreground truncate px-3 py-1.5 text-right text-base">
                {e.duration}
            </div>
            <div className="truncate px-3 py-1.5">
                <span
                    className="text-sm font-semibold tracking-normal"
                    style={{
                        color: getStatusColor(e.status).color,
                    }}
                >
                    {e.status}
                </span>
            </div>
            <div className="text-muted-foreground truncate px-3 py-1.5 text-base leading-tight tracking-tighter">
                {e.output || <span className="text-muted-foreground">IN PROGRESS…</span>}
            </div>
        </button>
    );
});
