import React, { useEffect, useRef, useState } from "react";

import AttackGraphCanvasView from "@/features/missions/components/workspace/AttackGraphCanvasView";
import { AttackGraphRepository } from "@/features/missions/data/AttackGraphRepository";
import {
    type Edge,
    type FilterStatus,
    type VDGNode,
    type VulnFilter,
} from "@/features/missions/data/fixtures/attackGraphMockData";

export default React.memo(function AttackGraphCanvasContainer() {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
    const [vulnFilter, setVulnFilter] = useState<VulnFilter>("ALL");
    const [hovered, setHovered] = useState<string | null>(null);
    const [drawerNode, setDrawerNode] = useState<VDGNode | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({
        w: 900,
        h: 560,
    });
    const [nodes, setNodes] = useState<VDGNode[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);

    useEffect(() => {
        let mounted = true;
        Promise.all([AttackGraphRepository.getNodes(), AttackGraphRepository.getEdges()])
            .then(([fetchedNodes, fetchedEdges]) => {
                if (mounted) {
                    setNodes(fetchedNodes);
                    setEdges(fetchedEdges);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch attack graph data", err);
            });
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) {
            return;
        }
        const ro = new ResizeObserver(([e]) =>
            setDims({
                w: e.contentRect.width,
                h: e.contentRect.height,
            }),
        );
        ro.observe(el);
        setDims({
            w: el.clientWidth,
            h: el.clientHeight,
        });
        return () => ro.disconnect();
    }, []);

    return (
        <AttackGraphCanvasView
            nodes={nodes}
            edges={edges}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            vulnFilter={vulnFilter}
            setVulnFilter={setVulnFilter}
            hovered={hovered}
            setHovered={setHovered}
            drawerNode={drawerNode}
            setDrawerNode={setDrawerNode}
            containerRef={containerRef}
            dims={dims}
        />
    );
});
