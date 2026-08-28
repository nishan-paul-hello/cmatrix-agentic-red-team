import React from "react";

import { Button } from "@/components/ui/button";
import { KPIStrip } from "@/components/ui/KPIStrip";
import { type WorkspaceAction } from "@/features/missions/components/workspace/MissionWorkspaceContainer";
import nodeStyle from "@/features/missions/components/workspace/NodeStyle";
import statusBadge from "@/features/missions/components/workspace/StatusBadge";
import { useWorkspaceData } from "@/features/missions/hooks/useWorkspaceData";

export function MissionOverviewAttackGraph({
    dispatch,
}: {
    dispatch: React.Dispatch<WorkspaceAction>;
}) {
    const { nodes } = useWorkspaceData();

    return (
        <div className="bg-background border-border relative flex-shrink-0 overflow-hidden border-b">
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
                <span className="text-muted-foreground text-sm tracking-widest">
                    ATTACK GRAPH — OVERVIEW (4 OF 12 NODES)
                </span>
                <span className="text-muted-foreground text-sm tracking-wide">VDG / CVE-001</span>
            </div>

            {/* Focus path button */}
            <div className="absolute top-3 right-4">
                <Button
                    variant="secondary"
                    onClick={() =>
                        dispatch({
                            type: "SET_SUB_NAV",
                            payload: "attack-graph",
                        })
                    }
                    className="bg-card text-muted-foreground hover:bg-muted border-border h-auto cursor-pointer rounded-sm border-[1px] px-2.5 py-0.5 text-sm tracking-widest"
                >
                    FOCUS HIGHEST-SCORE PATH
                </Button>
            </div>

            {/* Node chain — centered */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className="flex flex-col items-center"
                    style={{
                        gap: 0,
                    }}
                >
                    {nodes.map((node, i) => {
                        const s = nodeStyle(node.status);
                        const badge = statusBadge(node.status);
                        return (
                            <div key={node.id} className="flex flex-col items-center">
                                {/* Connector from previous */}
                                {i > 0 && (
                                    <div
                                        className="h-5 w-px"
                                        style={{
                                            background:
                                                node.status === "INFEASIBLE" ||
                                                node.status === "BLOCKED"
                                                    ? "var(--border)"
                                                    : "var(--primary)",
                                            opacity:
                                                node.status === "INFEASIBLE" ||
                                                node.status === "BLOCKED"
                                                    ? 0.4
                                                    : 1,
                                        }}
                                    >
                                        {/* arrow tip */}
                                    </div>
                                )}
                                {/* Arrow tip */}
                                {i > 0 && (
                                    <div
                                        className="h-0 w-0"
                                        style={{
                                            borderLeft: "4px solid transparent",
                                            borderRight: "4px solid transparent",
                                            borderTop: `5px solid ${node.status === "INFEASIBLE" || node.status === "BLOCKED" ? "var(--border)" : "var(--primary)"}`,
                                            marginBottom: -1,
                                            opacity:
                                                node.status === "INFEASIBLE" ||
                                                node.status === "BLOCKED"
                                                    ? 0.4
                                                    : 1,
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
                                    className="relative w-[224px] cursor-pointer rounded-sm px-3 py-2.5"
                                    style={{
                                        background: s.bg,
                                        border: `1px solid ${s.border}`,
                                    }}
                                    title="Click to open Attack Graph"
                                >
                                    {/* Active pulse ring for ELIGIBLE */}
                                    {node.status === "ELIGIBLE" && (
                                        <div
                                            className="border-border absolute rounded-[3px] border-[1px] border-solid"
                                            style={{
                                                inset: -3,
                                                pointerEvents: "none",
                                                animation: "nodeRing 2s ease infinite",
                                            }}
                                        />
                                    )}

                                    <div className="mb-1.5 flex items-center justify-between">
                                        <span
                                            className="text-xs font-bold tracking-wide"
                                            style={{
                                                color: s.labelColor,
                                            }}
                                        >
                                            {node.id}
                                        </span>
                                        <span
                                            className="rounded-sm px-1 py-px text-sm font-semibold tracking-widest"
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
                                        className="text-sm tracking-widest"
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
                                            <KPIStrip
                                                variant="inline"
                                                items={[
                                                    {
                                                        k: "UCB",
                                                        v: node.ucb.toFixed(3),
                                                        c: s.labelColor,
                                                    },
                                                    {
                                                        k: "E_ord",
                                                        v: `${node.eord}/${node.eordMax}`,
                                                        c: s.labelColor,
                                                    },
                                                    { k: "PATH", v: "0.612", c: s.typeColor },
                                                ]}
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
    );
}
