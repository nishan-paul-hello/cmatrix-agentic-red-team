import React from "react";

import { getStatusColor } from "@/components/ui/StatusBadge";
import { formatCommand } from "@/features/execution/domain/TaskCommand";
import { type ExecEntry } from "@/types/domain-types";

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
            <div className="text-muted-foreground w-[48px] shrink-0 px-3 py-1.5 text-base">
                {e.id}
            </div>
            <div className="text-muted-foreground w-[80px] shrink-0 px-3 py-1.5 text-base tracking-tighter">
                {e.ts}
            </div>
            <div className="text-primary w-[108px] shrink-0 px-3 py-1.5 text-base font-semibold tracking-tight">
                {e.specialist}
            </div>
            <div className="text-muted-foreground w-[160px] shrink-0 overflow-hidden px-3 py-1.5 text-base tracking-tighter text-ellipsis whitespace-nowrap">
                {formatCommand(e.command)}
            </div>
            <div className="text-muted-foreground w-[72px] shrink-0 px-3 py-1.5 text-base">
                {e.command.tool.id}
            </div>
            <div className="text-muted-foreground w-[64px] shrink-0 px-3 py-1.5 text-right text-base">
                {e.duration}
            </div>
            <div className="w-[72px] shrink-0 px-3 py-1.5">
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
