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
    NODE_W = 200,
    NODE_H = 92;

function lx(x: number, cw: number) {
    return (x / LOGIC_W) * cw;
}
function ly(y: number, ch: number) {
    return (y / LOGIC_H) * ch;
}

export default React.memo(function AttackGraphCanvasView(props: {
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
});

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
    const graphW = Math.max(w, 1000);
    const graphH = Math.max(h, 560);
    const canvasW = graphW + 1000;
    const canvasH = graphH + 1000;
    const offsetX = 500;
    const offsetY = 500;

    const nodeMap: Record<string, VDGNode | undefined> = Object.fromEntries(
        nodes.map((n) => [n.id, n]),
    );

    const isDragging = React.useRef(false);
    const startPos = React.useRef({ x: 0, y: 0 });
    const scrollPos = React.useRef({ left: 0, top: 0 });
    const hasManuallyScrolled = React.useRef(false);

    React.useEffect(() => {
        const container = containerRef.current;
        // w > 100 ensures we don't center during a tiny transient mounting state
        if (container && !hasManuallyScrolled.current && canvasW > 0 && w > 100) {
            const minCx = nodes.length > 0 ? Math.min(...nodes.map((n) => n.cx)) : 500;
            const maxCx = nodes.length > 0 ? Math.max(...nodes.map((n) => n.cx)) : 500;
            const centerCx = (minCx + maxCx) / 2;
            const centerPx = lx(centerCx, graphW);

            const minCy = nodes.length > 0 ? Math.min(...nodes.map((n) => n.cy)) : 50;
            const topPx = ly(minCy, graphH);

            // Exactly center the visual mass of the tree horizontally
            container.scrollLeft = offsetX + centerPx - w / 2;
            // Exactly place the topmost node 40px from the top
            container.scrollTop = offsetY + topPx - 40;
        }
    }, [canvasW, canvasH, w, h, offsetX, offsetY, graphW, graphH, nodes, containerRef]);

    const handleMouseDown = (e: React.MouseEvent) => {
        hasManuallyScrolled.current = true;
        isDragging.current = true;
        startPos.current = { x: e.clientX, y: e.clientY };
        const container = containerRef.current;
        if (container) {
            scrollPos.current = {
                left: container.scrollLeft,
                top: container.scrollTop,
            };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) {
            return;
        }
        const dx = e.clientX - startPos.current.x;
        const dy = e.clientY - startPos.current.y;
        const container = containerRef.current;
        if (container) {
            container.scrollLeft = scrollPos.current.left - dx;
            container.scrollTop = scrollPos.current.top - dy;
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    function visible(n: VDGNode) {
        return (
            (statusFilter === "ALL" || n.status === statusFilter) &&
            (vulnFilter === "ALL" || n.vulnClass === vulnFilter || n.vulnClass === "ALL")
        );
    }

    return (
        <div className="flex h-full min-h-0 flex-col">
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
                    if (drawerNode !== null) {
                        setDrawerNode(null);
                        return;
                    }
                    const top = [...nodes]
                        .filter((n) => n.status === "ELIGIBLE")
                        .sort((a, b) => b.ucb - a.ucb)[0] as VDGNode | undefined;
                    setStatusFilter("ALL");
                    setVulnFilter("ALL");
                    setDrawerNode(top ?? null);
                }}
            />

            {/* Canvas row */}
            <div className="flex min-h-0 flex-1 overflow-hidden">
                {/* Canvas Wrapper */}
                <div className="bg-background relative flex-1 overflow-hidden">
                    {/* Canvas Viewport */}
                    {}
                    <div
                        ref={containerRef}
                        role="presentation"
                        className="relative h-full w-full cursor-grab [scrollbar-width:none] overflow-auto [-ms-overflow-style:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={() => {
                            hasManuallyScrolled.current = true;
                        }}
                        onTouchMove={() => {
                            hasManuallyScrolled.current = true;
                        }}
                    >
                        <div style={{ width: canvasW, height: canvasH, position: "relative" }}>
                            {/* Grid */}
                            <div className="grid-bg pointer-events-none absolute inset-0 opacity-50" />

                            {/* SVG edges */}
                            <svg
                                className="pointer-events-none absolute inset-0"
                                width={canvasW}
                                height={canvasH}
                            >
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
                                            fill="var(--primary)"
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
                                        <path d="M0,0 L0,6 L6,3 z" fill="var(--border)" />
                                    </marker>
                                    <marker
                                        id="arr-active"
                                        markerWidth="6"
                                        markerHeight="6"
                                        refX="5"
                                        refY="3"
                                        orient="auto"
                                    >
                                        <path d="M0,0 L0,6 L6,3 z" fill="var(--destructive)" />
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
                                            x1={lx(src.cx, graphW) + offsetX}
                                            y1={ly(src.cy, graphH) + offsetY + NODE_H}
                                            x2={lx(dst.cx, graphW) + offsetX}
                                            y2={ly(dst.cy, graphH) + offsetY - 4}
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
                                        x={lx(node.cx, graphW) + offsetX - NODE_W / 2}
                                        y={ly(node.cy, graphH) + offsetY}
                                        width={NODE_W}
                                        onMouseEnter={setHovered}
                                        onMouseLeave={setHovered}
                                        onClick={setDrawerNode}
                                    />
                                );
                            })}
                        </div>
                    </div>{" "}
                    {/* Closes viewport */}
                    {/* Legend (Positioned relative to wrapper) */}
                    <div className="pointer-events-none absolute inset-0">
                        <div className="pointer-events-auto">
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
                        </div>
                    </div>
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
