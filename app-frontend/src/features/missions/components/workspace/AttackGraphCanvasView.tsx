import React from "react";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import {
    NODE_STYLE,
    STATUS_FILTERS,
    VULN_FILTERS,
} from "@/features/missions/components/workspace/AttackGraphCanvasConstants";
import { AttackGraphEdge } from "@/features/missions/components/workspace/AttackGraphEdge";
import { AttackGraphLegend } from "@/features/missions/components/workspace/AttackGraphLegend";
import { AttackGraphNode } from "@/features/missions/components/workspace/AttackGraphNode";
import { AttackGraphToolbar } from "@/features/missions/components/workspace/AttackGraphToolbar";
import VDGNodeDrawer from "@/features/missions/components/workspace/VDGNodeDrawer";
import {
    type Edge,
    type FilterStatus,
    type VDGNode,
    type VulnFilter,
} from "@/features/missions/data/fixtures/attackGraphMockData";

const LOGIC_W = 1000,
    LOGIC_H = 560,
    NODE_W = 158,
    NODE_H = 84;

function lx(x: number, cw: number) {
    return (x / LOGIC_W) * cw;
}
function ly(y: number, ch: number) {
    return (y / LOGIC_H) * ch;
}

export default function AttackGraphCanvasView(props: {
    nodes: VDGNode[];
    edges: Edge[];
    statusFilter: FilterStatus;
    setStatusFilter: (v: FilterStatus) => void;
    vulnFilter: VulnFilter;
    setVulnFilter: (v: VulnFilter) => void;
    hovered: string | null;
    setHovered: (v: string | null) => void;
    drawerNode: VDGNode | null;
    setDrawerNode: (v: VDGNode | null) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    dims: { w: number; h: number };
}) {
    return (
        <PanelErrorBoundary>
            <AttackGraphCanvasViewInner {...props} />
        </PanelErrorBoundary>
    );
}

const AttackGraphCanvasViewInner = React.memo(function ({
    nodes,
    edges,
    statusFilter,
    setStatusFilter,
    vulnFilter,
    setVulnFilter,
    hovered,
    setHovered,
    drawerNode,
    setDrawerNode,
    containerRef,
    dims,
}: {
    nodes: VDGNode[];
    edges: Edge[];
    statusFilter: FilterStatus;
    setStatusFilter: (v: FilterStatus) => void;
    vulnFilter: VulnFilter;
    setVulnFilter: (v: VulnFilter) => void;
    hovered: string | null;
    setHovered: (v: string | null) => void;
    drawerNode: VDGNode | null;
    setDrawerNode: (v: VDGNode | null) => void;
    containerRef: React.RefObject<HTMLDivElement | null>;
    dims: { w: number; h: number };
}) {
    const { w, h } = dims;
    const nodeMap: Record<string, VDGNode | undefined> = Object.fromEntries(
        nodes.map((n) => [n.id, n]),
    );

    function visible(n: VDGNode) {
        return (
            (statusFilter === "ALL" || n.status === statusFilter) &&
            (vulnFilter === "ALL" || n.vulnClass === vulnFilter || n.vulnClass === "ALL")
        );
    }

    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Toolbar */}
            <AttackGraphToolbar
                nodeCount={nodes.length}
                edgeCount={edges.length}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter as (v: string) => void}
                vulnFilter={vulnFilter}
                setVulnFilter={setVulnFilter as (v: string) => void}
                statusFilters={STATUS_FILTERS}
                vulnFilters={VULN_FILTERS}
                onFocusHighestScore={() => {
                    const top = [...nodes]
                        .filter((n) => n.status === "ELIGIBLE")
                        .sort((a, b) => b.ucb - a.ucb)[0] as VDGNode | undefined;
                    setStatusFilter("ALL");
                    setVulnFilter("ALL");
                    setDrawerNode(top ?? null);
                }}
            />

            {/* Canvas row */}
            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* Canvas */}
                <div
                    ref={containerRef}
                    className="relative flex-1 overflow-hidden bg-[var(--color-hex-080808)]"
                >
                    {/* Grid */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(28,28,28,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(28,28,28,0.5) 1px,transparent 1px)",
                            backgroundSize: "40px 40px",
                        }}
                    />

                    {/* SVG edges */}
                    <svg className="pointer-events-none absolute inset-0" width={w} height={h}>
                        <defs>
                            <marker
                                id="arr-red"
                                markerWidth="6"
                                markerHeight="6"
                                refX="5"
                                refY="3"
                                orient="auto"
                            >
                                <path
                                    d="M0,0 L0,6 L6,3 z"
                                    fill="var(--color-hex-e31b23)"
                                    opacity="0.7"
                                />
                            </marker>
                            <marker
                                id="arr-dim"
                                markerWidth="6"
                                markerHeight="6"
                                refX="5"
                                refY="3"
                                orient="auto"
                            >
                                <path d="M0,0 L0,6 L6,3 z" fill="var(--color-hex-252525)" />
                            </marker>
                            <marker
                                id="arr-active"
                                markerWidth="6"
                                markerHeight="6"
                                refX="5"
                                refY="3"
                                orient="auto"
                            >
                                <path d="M0,0 L0,6 L6,3 z" fill="var(--color-hex-ff2a32)" />
                            </marker>
                        </defs>
                        {edges.map((edge) => {
                            const src = nodeMap[edge.from];
                            const dst = nodeMap[edge.to];
                            if (!src || !dst) {
                                return null;
                            }
                            const vis = visible(src) && visible(dst);
                            return (
                                <AttackGraphEdge
                                    key={`${edge.from}-${edge.to}`}
                                    edge={edge}
                                    dst={dst}
                                    vis={vis}
                                    x1={lx(src.cx, w)}
                                    y1={ly(src.cy, h) + NODE_H / 2}
                                    x2={lx(dst.cx, w)}
                                    y2={ly(dst.cy, h) - 4}
                                />
                            );
                        })}
                    </svg>

                    {/* Node cards */}
                    {nodes.map((node) => {
                        const style = NODE_STYLE[node.status];
                        const isVis = visible(node);
                        const isHov = hovered === node.id;
                        return (
                            <AttackGraphNode
                                key={node.id}
                                node={node}
                                style={style}
                                isVis={isVis}
                                isHov={isHov}
                                x={lx(node.cx, w) - NODE_W / 2}
                                y={ly(node.cy, h)}
                                width={NODE_W}
                                onMouseEnter={() => setHovered(node.id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => setDrawerNode(node)}
                            />
                        );
                    })}

                    {/* Legend */}
                    <AttackGraphLegend
                        nodeStatuses={[
                            "ELIGIBLE",
                            "IN_PROGRESS",
                            "EXPLOITED",
                            "BLOCKED",
                            "INFEASIBLE",
                            "DEPRIORITIZED",
                        ]}
                        nodeStyles={NODE_STYLE}
                    />

                    <style>{`
            @keyframes nodeRing { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.1;transform:scale(1.03)} }
            @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:.3} }
          `}</style>
                </div>

                {/* Node detail drawer */}
                {drawerNode && (
                    <VDGNodeDrawer node={drawerNode} onClose={() => setDrawerNode(null)} />
                )}
            </div>
        </div>
    );
});
AttackGraphCanvasViewInner.displayName = "AttackGraphCanvasViewInner";
