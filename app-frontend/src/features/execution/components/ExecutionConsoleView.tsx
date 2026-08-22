import React, { useState } from "react";
import { type Virtualizer } from "@tanstack/react-virtual";

import { formatCommand } from "@/features/execution/domain/TaskCommand";
import { TASK_STATUS, type ExecEntry } from "@/types/domain-types";

const STATUS_C: Record<ExecEntry["status"], string> = {
    [TASK_STATUS.SUCCESS]: "var(--color-hex-3fb950)",
    [TASK_STATUS.FAILED]: "var(--color-hex-ff2a32)",
    [TASK_STATUS.TIMEOUT]: "var(--color-hex-d29922)",
    [TASK_STATUS.RUNNING]: "var(--color-hex-e31b23)",
    [TASK_STATUS.PENDING]: "var(--color-hex-666666)",
};

const ExecutionEntryRow = React.memo(function ExecutionEntryRowInner({
    e,
    onClick,
}: {
    e: ExecEntry;
    onClick: () => void;
}) {
    return (
        <div
            className="flex cursor-pointer items-start gap-0"
            style={{
                borderBottom: "1px solid var(--color-hex-0e0e0e)",
            }}
            onClick={onClick}
            onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                    onClick();
                }
            }}
            role="button"
            tabIndex={0}
            onMouseEnter={(ev) => (ev.currentTarget.style.background = "var(--color-hex-0d0d0d)")}
            onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
        >
            <div className="w-[48px] shrink-0 px-[12px] py-[7px] text-[9px] text-[var(--color-hex-333333)]">
                {e.id}
            </div>
            <div className="w-[80px] shrink-0 px-[12px] py-[7px] text-[9px] tracking-[0.04em] text-[var(--color-hex-333333)]">
                {e.ts}
            </div>
            <div className="w-[108px] shrink-0 px-[12px] py-[7px] text-[9px] font-semibold tracking-[0.08em] text-[var(--color-hex-e31b23)]">
                {e.specialist}
            </div>
            <div
                className="w-[160px] shrink-0 overflow-hidden px-[12px] py-[7px] text-[9px] tracking-[0.04em] whitespace-nowrap text-[var(--color-hex-666666)]"
                style={{
                    textOverflow: "ellipsis",
                }}
            >
                {formatCommand(e.command)}
            </div>
            <div className="w-[72px] shrink-0 px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                {e.command.tool.id}
            </div>
            <div className="w-[64px] shrink-0 px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-444444)]">
                {e.duration}
            </div>
            <div className="w-[72px] shrink-0 px-[12px] py-[7px]">
                <span
                    className="text-[8.5px] font-semibold tracking-[0.1em]"
                    style={{
                        color: STATUS_C[e.status],
                    }}
                >
                    {e.status}
                </span>
            </div>
            <div
                className="flex-1 overflow-hidden px-[12px] py-[7px] text-[9px] leading-[1.4] tracking-[0.03em] whitespace-nowrap text-[var(--color-hex-555555)]"
                style={{
                    textOverflow: "ellipsis",
                }}
            >
                {e.output || <span className="text-[var(--color-hex-2a2a2a)]">IN PROGRESS…</span>}
            </div>
        </div>
    );
});

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
function ExecDrawer({
    entry,
    parsedRows,
    onClose,
}: {
    entry: ExecEntry;
    parsedRows: Record<string, string | number | boolean>[];
    onClose: () => void;
}) {
    const [tab, setTab] = useState<
        "SUMMARY" | "RAW OUTPUT" | "PARSED OUTPUT" | "EL CHANGES" | "TRAJECTORY"
    >("SUMMARY");
    const sc = STATUS_C[entry.status];
    return (
        <div
            className="flex w-[340px] flex-shrink-0 flex-col overflow-hidden bg-[var(--color-hex-0d0d0d)]"
            style={{
                borderLeft: "1px solid var(--color-hex-292929)",
            }}
        >
            <div
                className="flex items-center justify-between px-4 pt-4 pb-3"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div>
                    <div className="text-[12px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        EXECUTION #{entry.id}
                    </div>
                    <div className="mt-[2px] text-[8.5px] tracking-[0.12em] text-[var(--color-hex-444444)]">
                        {entry.specialist} · {entry.command.tool.id}
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="font-inherit cursor-pointer border-none bg-[transparent] text-[14px] text-[var(--color-hex-444444)]"
                >
                    ✕
                </button>
            </div>

            {/* Tabs */}
            <div
                className="flex flex-shrink-0"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                {(
                    ["SUMMARY", "RAW OUTPUT", "PARSED OUTPUT", "EL CHANGES", "TRAJECTORY"] as const
                ).map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className="font-inherit cursor-pointer border-none bg-[transparent] px-[8px] py-[5px] text-[8px] tracking-[0.1em] whitespace-nowrap"
                        style={{
                            borderBottom:
                                t === tab
                                    ? "2px solid var(--color-hex-e31b23)"
                                    : "2px solid transparent",
                            color:
                                t === tab ? "var(--color-hex-f2f2f2)" : "var(--color-hex-444444)",
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
                {tab === "SUMMARY" && (
                    <div className="flex flex-col gap-3">
                        {(
                            [
                                {
                                    k: "SPECIALIST",
                                    v: entry.specialist,
                                },
                                {
                                    k: "TASK",
                                    v: formatCommand(entry.command),
                                },
                                {
                                    k: "TOOL",
                                    v: entry.command.tool.id,
                                },
                                {
                                    k: "START",
                                    v: entry.ts,
                                },
                                {
                                    k: "DURATION",
                                    v: entry.duration,
                                },
                                {
                                    k: "STATUS",
                                    v: entry.status,
                                    color: sc,
                                },
                                {
                                    k: "OUTPUT SIZE",
                                    v: entry.size,
                                },
                            ] as {
                                k: string;
                                v: string;
                                color?: string;
                            }[]
                        ).map((r) => (
                            <div key={r.k}>
                                <div className="mb-[1px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                    {r.k}
                                </div>
                                <div
                                    className="text-[10px] tracking-[0.06em]"
                                    style={{
                                        color: r.color ?? "var(--color-hex-888888)",
                                    }}
                                >
                                    {r.v}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {tab === "PARSED OUTPUT" && (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-hex-111111)]">
                                {(entry.command.tool.outputShape
                                    ? Object.keys(entry.command.tool.outputShape)
                                    : ["PORT", "STATE", "SERVICE", "VERSION"]
                                ).map((h) => (
                                    <th
                                        key={h}
                                        className="px-[8px] py-[5px] text-left text-[7.5px] tracking-[0.14em] text-[var(--color-hex-444444)] uppercase"
                                        style={{
                                            borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {parsedRows.map((r, i) => {
                                const keys = entry.command.tool.outputShape
                                    ? Object.keys(entry.command.tool.outputShape)
                                    : ["port", "state", "service", "version"];
                                return (
                                    <tr
                                        key={r.id ? String(r.id) : i}
                                        style={{
                                            borderBottom: "1px solid var(--color-hex-111111)",
                                        }}
                                    >
                                        {keys.map((k) => (
                                            <td
                                                key={k}
                                                className="px-[8px] py-[5px] text-[9px] text-[var(--color-hex-a0a0a0)]"
                                            >
                                                {String(r[k] ?? "")}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                {tab === "RAW OUTPUT" && (
                    <pre
                        className="font-inherit text-[9px] leading-[1.7] text-[var(--color-hex-555555)]"
                        style={{
                            whiteSpace: "pre-wrap",
                            margin: 0,
                        }}
                    >
                        {`$ nmap -sV -p 22,80,443,5432,6379 app.targetcorp.com
Starting Nmap 7.94 at 2026-08-19 06:28:47
Nmap scan report for app.targetcorp.com (104.21.3.212)
PORT     STATE    SERVICE    VERSION
22/tcp   open     ssh        OpenSSH 8.9p1
80/tcp   open     http       nginx 1.24.0
443/tcp  open     https      nginx 1.24.0
5432/tcp filtered postgresql
6379/tcp filtered redis
Nmap done: 1 IP address scanned in 12.3 seconds`}
                    </pre>
                )}

                {tab === "EL CHANGES" && (
                    <div className="flex flex-col gap-2">
                        {[
                            "SERVICE ssh:22 ADDED",
                            "SERVICE http:80 ADDED",
                            "SERVICE https:443 ADDED",
                            "HOST app.targetcorp.com CONFIRMED",
                        ].map((c) => (
                            <div key={c} className="flex items-center gap-2">
                                <span className="text-[9px] text-[var(--color-hex-3fb950)]">+</span>
                                <span className="text-[9px] tracking-[0.06em] text-[var(--color-hex-555555)]">
                                    {c}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {tab === "TRAJECTORY" && (
                    <div
                        style={{
                            paddingTop: 4,
                        }}
                    >
                        <div className="mb-[10px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                            TRAJECTORY CONTRIBUTION
                        </div>
                        {[
                            {
                                step: `STEP ${String(entry.id).padStart(3, "0")}`,
                                vdgDelta: entry.command.name.toUpperCase(),
                                elDelta: "+2 facts",
                                cost:
                                    entry.duration !== "—" ? `~$0.0${entry.id.slice(-2)}` : "$0.00",
                            },
                        ].map((r) => (
                            <div
                                key={r.step}
                                className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]"
                                style={{
                                    display: "flex",
                                    gap: 0,
                                }}
                            >
                                {[
                                    ["STEP", r.step],
                                    ["VDG DELTA", r.vdgDelta],
                                    ["EL DELTA", r.elDelta],
                                    ["COST", r.cost],
                                ].map(([k, v], j, a) => (
                                    <div
                                        key={k}
                                        className="flex-1 bg-[var(--color-hex-0d0d0d)] px-[12px] py-[9px]"
                                        style={{
                                            borderRight:
                                                j < a.length - 1
                                                    ? "1px solid var(--color-hex-1a1a1a)"
                                                    : "none",
                                        }}
                                    >
                                        <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                            {k}
                                        </div>
                                        <div className="text-[10px] font-semibold text-[var(--color-hex-888888)]">
                                            {v}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
