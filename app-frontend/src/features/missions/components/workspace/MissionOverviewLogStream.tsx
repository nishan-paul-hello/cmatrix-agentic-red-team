import React from "react";

import { type LogEntry } from "@/features/missions/data/fixtures/workspaceMockData";

export function MissionOverviewLogStream({ log }: { log: LogEntry[] }) {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2">
                <div className="bg-destructive pulse-dot h-1.5 w-1.5 rounded-full" />
                <span className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                    EXECUTION LOG
                </span>
                <span className="text-muted-foreground ml-auto text-[10px] tracking-widest uppercase">
                    LIVE STREAM
                </span>
            </div>
            <div className="bg-background flex-1 overflow-y-auto">
                {log.map((entry) => (
                    <div
                        key={entry.id}
                        className="border-border flex items-start gap-3 border-b px-4 py-1.5"
                    >
                        <span className="text-muted-foreground shrink-0 pt-px text-[10px] tracking-widest uppercase">
                            {entry.ts}
                        </span>
                        <span className="text-primary min-w-[88px] shrink-0 pt-px text-[10px] font-semibold tracking-widest uppercase">
                            {entry.agent}
                        </span>
                        <span className="text-muted-foreground min-w-[108px] shrink-0 pt-px text-[10px] tracking-widest uppercase">
                            {entry.action}
                        </span>
                        <span
                            className="text-xs leading-tight tracking-tight"
                            style={{
                                color: entry.color,
                            }}
                        >
                            {entry.desc}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
