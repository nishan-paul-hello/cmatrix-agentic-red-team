import React, { useState } from "react";

import { formatCommand } from "@/features/execution/domain/TaskCommand";
import { type ExecEntry } from "@/types/domain-types";

import { STATUS_C } from "./ExecutionEntryRow";

export function ExecDrawer({
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
