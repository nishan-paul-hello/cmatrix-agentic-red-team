import React from "react";
import { type Virtualizer } from "@tanstack/react-virtual";

import { type ExecEntry } from "@/types/domain-types";

import { ExecDrawer } from "./ExecDrawer";
import { ExecutionEntryRow } from "./ExecutionEntryRow";

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
        <div className="flex h-full min-h-[0px]">
            <div className="flex min-h-[0px] flex-1 flex-col overflow-hidden">
                {/* Header */}
                <div
                    className="flex-shrink-0 px-6 pt-5 pb-4"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                        MISSION / CVE-001
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-[18px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                            EXECUTION AGENT
                        </h1>
                        <span className="text-[9px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                            DETERMINISTIC EXECUTION CHANNEL
                        </span>
                    </div>
                </div>

                {/* Architecture note */}
                <div
                    className="flex flex-shrink-0 items-start gap-3 bg-[var(--color-hex-0b0b0b)] px-6 py-2"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div className="mt-[2px] h-[28px] w-[2px] shrink-0 bg-[var(--color-hex-e31b23)]" />
                    <div>
                        <div className="mb-[2px] text-[8.5px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                            REASONING / EXECUTION SEPARATION
                        </div>
                        <div className="text-[9px] leading-[1.6] tracking-[0.06em] text-[var(--color-hex-333333)]">
                            Specialists reason and plan · Execution agent runs tools
                            deterministically · No LLM reasoning occurs during tool execution
                        </div>
                    </div>
                    <div className="ml-auto flex flex-shrink-0 items-center gap-2">
                        <div
                            className="h-[6px] w-[6px] bg-[var(--color-hex-ff2a32)]"
                            style={{
                                borderRadius: "50%",
                                animation: "pulse 1.4s ease infinite",
                            }}
                        />
                        <span className="text-[9px] tracking-[0.14em] text-[var(--color-hex-e31b23)]">
                            1 RUNNING
                        </span>
                    </div>
                </div>

                {/* Console log */}
                <div
                    className="flex-1 overflow-y-auto bg-[var(--color-hex-080808)]"
                    ref={parentRef}
                >
                    {/* Header row */}
                    <div
                        className="sticky top-0 flex gap-0 bg-[var(--color-hex-0d0d0d)]"
                        style={{
                            borderBottom: "1px solid var(--color-hex-1a1a1a)",
                        }}
                    >
                        {[
                            "#",
                            "TIMESTAMP",
                            "SPECIALIST",
                            "TASK",
                            "TOOL",
                            "DURATION",
                            "STATUS",
                            "OUTPUT",
                        ].map((h, i) => (
                            <div
                                key={h}
                                className="shrink-0 px-[12px] py-[5px] text-[7.5px] font-semibold tracking-[0.18em] text-[var(--color-hex-333333)]"
                                style={{
                                    width: [48, 80, 108, 160, 72, 64, 72, undefined][i],
                                    flex: i === 7 ? 1 : undefined,
                                }}
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
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
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
