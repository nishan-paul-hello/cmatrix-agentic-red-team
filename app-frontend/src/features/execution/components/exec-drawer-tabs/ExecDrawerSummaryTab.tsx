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
                    <div className="text-sm-tight tracking-wider-3 mb-[1px] text-[var(--color-hex-444444)]">
                        {r.k}
                    </div>
                    <div
                        className="tracking-tight-1 text-lg"
                        style={{ color: r.color ?? "var(--color-hex-888888)" }}
                    >
                        {r.v}
                    </div>
                </div>
            ))}
        </div>
    );
}
