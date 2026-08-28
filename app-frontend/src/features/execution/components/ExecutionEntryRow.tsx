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
        <div
            className="border-border flex cursor-pointer items-start gap-0 border-b"
            onClick={(ev) => {
                ev.stopPropagation();
                onClick();
            }}
            onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                    onClick();
                }
            }}
            role="button"
            tabIndex={0}
            onMouseEnter={(ev) => (ev.currentTarget.style.background = "var(--background)")}
            onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
        >
            <div className="text-muted-foreground w-12 shrink-0 px-3 py-1.5 text-base">{e.id}</div>
            <div className="text-muted-foreground w-[80px] shrink-0 px-3 py-1.5 text-base tracking-tighter">
                {e.ts}
            </div>
            <div className="text-primary w-[108px] shrink-0 px-3 py-1.5 text-base font-semibold tracking-tight">
                {e.specialist}
            </div>
            <div
                className="text-muted-foreground w-[160px] shrink-0 overflow-hidden px-3 py-1.5 text-base tracking-tighter whitespace-nowrap"
                style={{
                    textOverflow: "ellipsis",
                }}
            >
                {formatCommand(e.command)}
            </div>
            <div className="text-muted-foreground w-[72px] shrink-0 px-3 py-1.5 text-base">
                {e.command.tool.id}
            </div>
            <div className="text-muted-foreground w-16 shrink-0 px-3 py-1.5 text-right text-base">
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
            <div
                className="text-muted-foreground flex-1 overflow-hidden px-3 py-1.5 text-base leading-tight tracking-tighter whitespace-nowrap"
                style={{
                    textOverflow: "ellipsis",
                }}
            >
                {e.output || <span className="text-muted-foreground">IN PROGRESS…</span>}
            </div>
        </div>
    );
});
