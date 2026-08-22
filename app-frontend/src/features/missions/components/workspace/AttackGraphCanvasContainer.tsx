import { useEffect, useRef, useState } from "react";

import AttackGraphCanvasView from "@/features/missions/components/workspace/AttackGraphCanvasView";

type NodeStatus =
    "EXPLOITED" | "ELIGIBLE" | "IN_PROGRESS" | "BLOCKED" | "INFEASIBLE" | "DEPRIORITIZED";
type FilterStatus = "ALL" | NodeStatus;
type VulnFilter =
    | "ALL"
    | "SQLi"
    | "XSS"
    | "CSRF"
    | "SSRF"
    | "SSTI"
    | "IDOR"
    | "RCE"
    | "AUTH"
    | "GRAPHQL"
    | "LATERAL";
interface VDGNode {
    id: string;
    type: string;
    vulnClass: VulnFilter;
    status: NodeStatus;
    ucb: number;
    eord: number;
    cx: number;
    cy: number;
}

export default function AttackGraphCanvasContainer() {
    const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
    const [vulnFilter, setVulnFilter] = useState<VulnFilter>("ALL");
    const [hovered, setHovered] = useState<string | null>(null);
    const [drawerNode, setDrawerNode] = useState<VDGNode | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dims, setDims] = useState({
        w: 900,
        h: 560,
    });
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
}
