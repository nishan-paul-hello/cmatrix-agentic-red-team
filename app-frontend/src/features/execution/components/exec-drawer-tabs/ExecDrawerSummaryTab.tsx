import React from "react";

import { formatCommand } from "@/features/execution/domain/TaskCommand";
import { type ExecEntry } from "@/types/domain-types";

export function ExecDrawerSummaryTab({
    entry,
    statusColor,
}: {
    entry: ExecEntry;
    statusColor: string;
}) {
    return (
        <div className="flex flex-col gap-3">
            {(
                [
                    { k: "SPECIALIST", v: entry.specialist },
                    { k: "TASK", v: formatCommand(entry.command) },
                    { k: "TOOL", v: entry.command.tool.id },
                    { k: "START", v: entry.ts },
                    { k: "DURATION", v: entry.duration },
                    { k: "STATUS", v: entry.status, color: statusColor },
                    { k: "OUTPUT SIZE", v: entry.size },
                ] as { k: string; v: string; color?: string }[]
            ).map((r) => (
                <div key={r.k}>
                    <div className="text-muted-foreground mb-px text-xs tracking-widest">{r.k}</div>
                    <div
                        className={`text-xs tracking-tight ${r.color ? "" : "text-muted-foreground"}`}
                        style={r.color ? { color: r.color } : undefined}
                    >
                        {r.v}
                    </div>
                </div>
            ))}
        </div>
    );
}
