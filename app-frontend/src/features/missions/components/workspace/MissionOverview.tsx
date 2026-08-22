import React from "react";

import { type WorkspaceAction } from "@/features/missions/components/workspace/MissionWorkspaceContainer";
import nodeStyle from "@/features/missions/components/workspace/NodeStyle";
import Stat from "@/features/missions/components/workspace/Stat";
import statusBadge from "@/features/missions/components/workspace/StatusBadge";
import { VDG_NODES, type LogEntry } from "@/features/missions/data/workspaceMockData";

export default function MissionOverview({
    log,
    dispatch,
}: {
    log: LogEntry[];
    dispatch: React.Dispatch<WorkspaceAction>;
}) {
    return (
        <>
            {/* CENTER TOP: attack graph canvas */}
            <div
                className="relative flex-shrink-0 overflow-hidden bg-[var(--color-hex-080808)]"
                style={{
                    height: "54%",
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                {/* Grid */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(30,30,30,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,30,30,0.4) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />

                {/* Canvas label */}
                <div className="absolute top-3 left-4 flex items-center gap-2">
                    <span className="text-[8.5px] tracking-[0.2em] text-[var(--color-hex-333333)]">
                        ATTACK GRAPH — OVERVIEW (4 OF 12 NODES)
                    </span>
                    <span className="text-[8px] tracking-[0.12em] text-[var(--color-hex-1e1e1e)]">
                        VDG / CVE-001
                    </span>
                </div>

                {/* Focus path button */}
                <div className="absolute top-3 right-4">
                    <button
                        onClick={() =>
                            dispatch({
                                type: "SET_SUB_NAV",
                                payload: "attack-graph",
                            })
                        }
                        className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[10px] py-[3px] text-[8.5px] tracking-[0.14em] text-[var(--color-hex-666666)]"
                    >
                        FOCUS HIGHEST-SCORE PATH
                    </button>
                </div>

                {/* Node chain — centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="flex flex-col items-center"
                        style={{
                            gap: 0,
                        }}
                    >
                        {VDG_NODES.map((node, i) => {
                            const s = nodeStyle(node.status);
                            const badge = statusBadge(node.status);
                            return (
                                <div key={node.id} className="flex flex-col items-center">
                                    {/* Connector from previous */}
                                    {i > 0 && (
                                        <div
                                            className="h-[20px] w-[1px]"
                                            style={{
                                                background:
                                                    node.status === "DEPENDENT"
                                                        ? "var(--color-hex-222222)"
                                                        : "var(--color-hex-e31b23)",
                                                opacity: node.status === "DEPENDENT" ? 0.4 : 1,
                                            }}
                                        >
                                            {/* arrow tip */}
                                        </div>
                                    )}
                                    {/* Arrow tip */}
                                    {i > 0 && (
                                        <div
                                            className="h-[0px] w-[0px]"
                                            style={{
                                                borderLeft: "4px solid transparent",
                                                borderRight: "4px solid transparent",
                                                borderTop: `5px solid ${node.status === "DEPENDENT" ? "var(--color-hex-222222)" : "var(--color-hex-e31b23)"}`,
                                                marginBottom: -1,
                                                opacity: node.status === "DEPENDENT" ? 0.4 : 1,
                                            }}
                                        />
                                    )}

                                    {/* Node card */}
                                    <div
                                        onClick={() =>
                                            dispatch({
                                                type: "SET_SUB_NAV",
                                                payload: "attack-graph",
                                            })
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                dispatch({
                                                    type: "SET_SUB_NAV",
                                                    payload: "attack-graph",
                                                });
                                            }
                                        }}
                                        role="button"
                                        tabIndex={0}
                                        className="relative w-[224px] cursor-pointer rounded-[2px] px-[12px] py-[10px]"
                                        style={{
                                            background: s.bg,
                                            border: `1px solid ${s.border}`,
                                        }}
                                        title="Click to open Attack Graph"
                                    >
                                        {/* Active pulse ring for ELIGIBLE */}
                                        {node.status === "ELIGIBLE" && (
                                            <div
                                                className="absolute rounded-[3px] border-[1px] border-solid border-[var(--color-hex-e31b2340)]"
                                                style={{
                                                    inset: -3,
                                                    pointerEvents: "none",
                                                    animation: "nodeRing 2s ease infinite",
                                                }}
                                            />
                                        )}

                                        <div className="mb-1.5 flex items-center justify-between">
                                            <span
                                                className="text-[10px] font-bold tracking-[0.12em]"
                                                style={{
                                                    color: s.labelColor,
                                                }}
                                            >
                                                {node.id}
                                            </span>
                                            <span
                                                className="rounded-[2px] px-[5px] py-[1px] text-[8px] font-semibold tracking-[0.14em]"
                                                style={{
                                                    color: badge.color,
                                                    background: badge.bg,
                                                    border: `1px solid ${badge.color}44`,
                                                }}
                                            >
                                                {node.status}
                                            </span>
                                        </div>

                                        <div
                                            className="text-[8.5px] tracking-[0.16em]"
                                            style={{
                                                color: s.typeColor,
                                                marginBottom: node.ucb !== undefined ? 8 : 0,
                                            }}
                                        >
                                            {node.type}
                                        </div>

                                        {node.ucb !== undefined && (
                                            <div
                                                className="flex items-center gap-4"
                                                style={{
                                                    borderTop: `1px solid ${s.border}`,
                                                    paddingTop: 7,
                                                }}
                                            >
                                                <Stat
                                                    label="UCB"
                                                    value={node.ucb.toFixed(3)}
                                                    color={s.labelColor}
                                                />
                                                <Stat
                                                    label="E_ord"
                                                    value={`${node.eord}/${node.eordMax}`}
                                                    color={s.labelColor}
                                                />
                                                <Stat
                                                    label="PATH"
                                                    value="0.612"
                                                    color={s.typeColor}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <style>{`
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes nodeRing { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.1;transform:scale(1.02)} }
`}</style>
            </div>

            {/* CENTER BOTTOM: live log stream */}
            <div className="flex min-h-[0px] flex-1 flex-col overflow-hidden">
                <div
                    className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0d0d0d)] px-4 py-2"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div
                        className="h-[6px] w-[6px] bg-[var(--color-hex-ff2a32)]"
                        style={{
                            borderRadius: "50%",
                            animation: "pulse 1.4s ease infinite",
                        }}
                    />
                    <span className="text-[9.5px] font-semibold tracking-[0.18em] text-[var(--color-hex-666666)]">
                        EXECUTION LOG
                    </span>
                    <span className="ml-auto text-[8.5px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                        LIVE STREAM
                    </span>
                </div>
                <div className="flex-1 overflow-y-auto bg-[var(--color-hex-080808)]">
                    {log.map((entry) => (
                        <div
                            key={entry.id}
                            className="flex items-start gap-3 px-4 py-1.5"
                            style={{
                                borderBottom: "1px solid var(--color-hex-0e0e0e)",
                            }}
                        >
                            <span
                                className="shrink-0 text-[9px] tracking-[0.06em] text-[var(--color-hex-333333)]"
                                style={{
                                    paddingTop: 1,
                                }}
                            >
                                {entry.ts}
                            </span>
                            <span
                                className="min-w-[88px] shrink-0 text-[8.5px] font-semibold tracking-[0.12em] text-[var(--color-hex-e31b23)]"
                                style={{
                                    paddingTop: 1,
                                }}
                            >
                                {entry.agent}
                            </span>
                            <span
                                className="min-w-[108px] shrink-0 text-[8.5px] tracking-[0.1em] text-[var(--color-hex-333333)]"
                                style={{
                                    paddingTop: 1,
                                }}
                            >
                                {entry.action}
                            </span>
                            <span
                                className="text-[9.5px] leading-[1.4] tracking-[0.02em]"
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
        </>
    );
}
