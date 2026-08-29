import React from "react";

import { Button } from "@/components/ui/button";
import { AttackGraphNode } from "@/features/missions/components/workspace/AttackGraphNode";
import getVdgNodeStatusColors from "@/features/missions/components/workspace/getVdgNodeStatusColors";
import { type WorkspaceAction } from "@/features/missions/components/workspace/MissionWorkspaceContainer";
import nodeStyle from "@/features/missions/components/workspace/NodeStyle";
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
            <div className="grid-bg-sm pointer-events-none absolute inset-0 opacity-40" />

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
                        const badge = getVdgNodeStatusColors(node.status);
                        return (
                            <div key={node.id} className="flex flex-col items-center">
                                {/* Connector from previous */}
                                {i > 0 && (
                                    <div
                                        className={`h-5 w-px ${node.status === "INFEASIBLE" || node.status === "BLOCKED" ? "bg-border opacity-40" : "bg-primary opacity-100"}`}
                                    >
                                        {/* arrow tip */}
                                    </div>
                                )}
                                {/* Arrow tip */}
                                {i > 0 && (
                                    <div
                                        className={`mb-[-1px] h-0 w-0 border-t-[5px] border-r-[4px] border-l-[4px] border-r-transparent border-l-transparent ${node.status === "INFEASIBLE" || node.status === "BLOCKED" ? "border-t-border opacity-40" : "border-t-primary opacity-100"}`}
                                    />
                                )}

                                <AttackGraphNode
                                    node={node}
                                    style={{
                                        bg: s.bg,
                                        border: s.border,
                                        labelColor: s.labelColor,
                                        typeColor: s.typeColor,
                                        badgeColor: badge.color,
                                        badgeBg: badge.bg,
                                    }}
                                    variant="overview"
                                    onClick={() =>
                                        dispatch({
                                            type: "SET_SUB_NAV",
                                            payload: "attack-graph",
                                        })
                                    }
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
