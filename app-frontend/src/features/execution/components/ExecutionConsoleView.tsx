import React from "react";
import { type Virtualizer } from "@tanstack/react-virtual";

import { ExecDrawer } from "@/features/execution/components/ExecDrawer";
import {
    EXECUTION_COLUMNS,
    ExecutionEntryRow,
    gridTemplateColumns,
} from "@/features/execution/components/ExecutionEntryRow";
import { type ExecEntry } from "@/types/domain-types";

export default function ExecutionConsoleView({
    entries,
    parsedRows,
    drawer,
    setDrawer,
    parentRef,
    rowVirtualizer,
    handleRowClick,
}: {
    entries: ExecEntry[];
    parsedRows: Record<string, string | number | boolean>[];
    drawer: ExecEntry | null;
    setDrawer: (v: ExecEntry | null) => void;
    parentRef: React.RefObject<HTMLDivElement | null>;
    rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
    handleRowClick: (e: ExecEntry) => void;
}) {
    return (
        <div className="flex h-full min-h-0 flex-col lg:flex-row">
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {/* Header */}
                <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                    <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                        MISSION / CVE-001
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-foreground text-xs font-bold tracking-wide">
                            EXECUTION AGENT
                        </h1>
                        <span className="text-muted-foreground text-base tracking-widest">
                            DETERMINISTIC EXECUTION CHANNEL
                        </span>
                    </div>
                </div>

                {/* Architecture note */}
                <div className="bg-background border-border flex flex-shrink-0 items-stretch gap-4 border-b px-6 py-3">
                    <div className="bg-primary w-0.5 shrink-0 rounded-full" />
                    <div className="flex flex-col justify-center py-0.5">
                        <div className="text-foreground/80 mb-1.5 text-xs font-bold tracking-widest">
                            REASONING / EXECUTION SEPARATION
                        </div>
                        <div className="text-muted-foreground text-sm leading-relaxed tracking-wide">
                            Specialists reason and plan &nbsp;·&nbsp; Execution agent runs tools
                            deterministically &nbsp;·&nbsp; No LLM reasoning occurs during tool execution
                        </div>
                    </div>
                    <div className="ml-auto flex flex-shrink-0 items-center gap-2">
                        <div className="bg-destructive pulse-dot h-1.5 w-1.5 rounded-full" />
                        <span className="text-primary text-sm font-bold tracking-widest">1 RUNNING</span>
                    </div>
                </div>

                {/* Console log */}
                <div
                    className="bg-background flex-1 overflow-x-auto overflow-y-auto"
                    ref={parentRef}
                >
                    <div className="min-w-[1480px] w-full flex flex-col">
                        {/* Header row */}
                        <div
                            className="bg-muted/30 border-border sticky top-0 z-10 grid gap-4 border-b py-1 shadow-sm"
                            style={{ gridTemplateColumns }}
                        >
                            {EXECUTION_COLUMNS.map(({ h }) => (
                                <div
                                    key={h}
                                    className="text-muted-foreground truncate px-3 py-1 text-xs font-bold uppercase tracking-widest"
                                >
                                    {h}
                                </div>
                            ))}
                        </div>

                        {rowVirtualizer.getVirtualItems().length > 0 && (
                            <div style={{ height: `${rowVirtualizer.getVirtualItems()[0].start}px` }} />
                        )}
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const e = entries[virtualRow.index];
                            return (
                                <ExecutionEntryRow key={e.id} e={e} onClick={() => handleRowClick(e)} />
                            );
                        })}
                        {rowVirtualizer.getVirtualItems().length > 0 && (
                            <div
                                style={{
                                    height: `${
                                        rowVirtualizer.getTotalSize() -
                                        rowVirtualizer.getVirtualItems()[
                                            rowVirtualizer.getVirtualItems().length - 1
                                        ].end
                                    }px`,
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Drawer */}
            {drawer && (
                <ExecDrawer
                    entry={drawer}
                    parsedRows={parsedRows}
                    onClose={() => setDrawer(null)}
                />
            )}
        </div>
    );
}
