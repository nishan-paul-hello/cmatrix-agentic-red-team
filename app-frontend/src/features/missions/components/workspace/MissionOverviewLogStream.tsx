import React from "react";

import { type LogEntry } from "@/features/missions/data/fixtures/workspaceMockData";

export function MissionOverviewLogStream({ log }: { log: LogEntry[] }) {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2">
                <div
                    className="bg-destructive h-1.5 w-1.5"
                    style={{
                        borderRadius: "50%",
                        animation: "pulse 1.4s ease infinite",
                    }}
                />
                <span className="text-muted-foreground text-base font-semibold tracking-widest">
                    EXECUTION LOG
                </span>
                <span className="text-muted-foreground ml-auto text-sm tracking-normal">
                    LIVE STREAM
                </span>
            </div>
            <div className="bg-background flex-1 overflow-y-auto">
                {log.map((entry) => (
                    <div
                        key={entry.id}
                        className="border-border flex items-start gap-3 border-b px-4 py-1.5"
                    >
                        <span
                            className="text-muted-foreground shrink-0 text-base tracking-tight"
                            style={{
                                paddingTop: 1,
                            }}
                        >
                            {entry.ts}
                        </span>
                        <span
                            className="text-primary min-w-[88px] shrink-0 text-sm font-semibold tracking-wide"
                            style={{
                                paddingTop: 1,
                            }}
                        >
                            {entry.agent}
                        </span>
                        <span
                            className="text-muted-foreground min-w-[108px] shrink-0 text-sm tracking-normal"
                            style={{
                                paddingTop: 1,
                            }}
                        >
                            {entry.action}
                        </span>
                        <span
                            className="text-base leading-tight tracking-tighter"
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
