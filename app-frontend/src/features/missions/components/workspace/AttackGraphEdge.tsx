import React from "react";

import { type Edge, type VDGNode } from "@/features/missions/data/fixtures/attackGraphMockData";

export const AttackGraphEdge = React.memo(function AttackGraphEdgeBase({
    edge,
    dst,
    vis,
    x1,
    y1,
    x2,
    y2,
}: {
    edge: Edge;
    dst: VDGNode;
    vis: boolean;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}) {
    const isDim =
        dst.status === "BLOCKED" || dst.status === "INFEASIBLE" || dst.status === "DEPRIORITIZED";
    const isActive = edge.active && dst.status === "IN_PROGRESS";
    const color = (() => {
        if (isActive) {
            return "var(--destructive)";
        }
        if (isDim) {
            return "var(--border)";
        }
        return "var(--primary)";
    })();
    const marker = (() => {
        if (isActive) {
            return "arr-active";
        }
        if (isDim) {
            return "arr-dim";
        }
        return "arr-red";
    })();
    return (
        <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={color}
            strokeWidth={isActive ? 1.5 : 1}
            strokeDasharray={isActive ? "4 3" : "none"}
            opacity={(() => {
                if (!vis) {
                    return 0.1;
                }
                if (isDim) {
                    return 0.4;
                }
                return 0.8;
            })()}
            markerEnd={`url(#${marker})`}
        />
    );
});
