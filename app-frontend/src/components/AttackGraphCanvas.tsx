import { useEffect, useRef, useState } from "react";

import VDGNodeDrawer from "./VDGNodeDrawer";

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
interface Edge {
    from: string;
    to: string;
    active?: boolean;
}
const NODES: VDGNode[] = [
    {
        id: "RECON-001",
        type: "RECONNAISSANCE",
        vulnClass: "ALL",
        status: "EXPLOITED",
        ucb: 0,
        eord: 5,
        cx: 500,
        cy: 50,
    },
    {
        id: "AUTH-001",
        type: "AUTHENTICATION",
        vulnClass: "AUTH",
        status: "EXPLOITED",
        ucb: 0,
        eord: 4,
        cx: 270,
        cy: 170,
    },
    {
        id: "ENUM-002",
        type: "ENUMERATION",
        vulnClass: "ALL",
        status: "EXPLOITED",
        ucb: 0,
        eord: 4,
        cx: 720,
        cy: 170,
    },
    {
        id: "SQLI-001",
        type: "SQL INJECTION",
        vulnClass: "SQLi",
        status: "ELIGIBLE",
        ucb: 0.824,
        eord: 3,
        cx: 110,
        cy: 320,
    },
    {
        id: "XSS-002",
        type: "CROSS-SITE SCRIPT",
        vulnClass: "XSS",
        status: "IN_PROGRESS",
        ucb: 0.741,
        eord: 3,
        cx: 310,
        cy: 320,
    },
    {
        id: "CSRF-003",
        type: "CROSS-SITE REQ",
        vulnClass: "CSRF",
        status: "BLOCKED",
        ucb: 0.512,
        eord: 1,
        cx: 500,
        cy: 320,
    },
    {
        id: "SSRF-005",
        type: "SERVER-SIDE REQ",
        vulnClass: "SSRF",
        status: "INFEASIBLE",
        ucb: 0,
        eord: 2,
        cx: 690,
        cy: 320,
    },
    {
        id: "IDOR-008",
        type: "INSECURE DIR REF",
        vulnClass: "IDOR",
        status: "ELIGIBLE",
        ucb: 0.631,
        eord: 2,
        cx: 890,
        cy: 320,
    },
    {
        id: "DB-ACCESS-002",
        type: "DATABASE ACCESS",
        vulnClass: "SQLi",
        status: "BLOCKED",
        ucb: 0.39,
        eord: 0,
        cx: 60,
        cy: 480,
    },
    {
        id: "RCE-007",
        type: "REMOTE CODE EXEC",
        vulnClass: "RCE",
        status: "BLOCKED",
        ucb: 0.44,
        eord: 1,
        cx: 240,
        cy: 480,
    },
    {
        id: "SSTI-006",
        type: "SERVER-SIDE TMPL",
        vulnClass: "SSTI",
        status: "DEPRIORITIZED",
        ucb: 0.21,
        eord: 1,
        cx: 690,
        cy: 480,
    },
    {
        id: "IDOR-009",
        type: "INSECURE DIR REF",
        vulnClass: "IDOR",
        status: "ELIGIBLE",
        ucb: 0.588,
        eord: 2,
        cx: 890,
        cy: 480,
    },
];
const EDGES: Edge[] = [
    {
        from: "RECON-001",
        to: "AUTH-001",
    },
    {
        from: "RECON-001",
        to: "ENUM-002",
    },
    {
        from: "AUTH-001",
        to: "SQLI-001",
    },
    {
        from: "AUTH-001",
        to: "XSS-002",
        active: true,
    },
    {
        from: "AUTH-001",
        to: "CSRF-003",
    },
    {
        from: "ENUM-002",
        to: "SSRF-005",
    },
    {
        from: "ENUM-002",
        to: "IDOR-008",
    },
    {
        from: "SQLI-001",
        to: "DB-ACCESS-002",
    },
    {
        from: "SQLI-001",
        to: "RCE-007",
    },
    {
        from: "SSRF-005",
        to: "SSTI-006",
    },
    {
        from: "IDOR-008",
        to: "IDOR-009",
    },
];
const NODE_STYLE: Record<
    NodeStatus,
    {
        border: string;
        bg: string;
        labelColor: string;
        typeColor: string;
        badgeColor: string;
        badgeBg: string;
    }
> = {
    EXPLOITED: {
        border: "var(--color-hex-9e1118)",
        bg: "var(--color-hex-130508)",
        labelColor: "var(--color-hex-e31b23)",
        typeColor: "var(--color-hex-6f171b)",
        badgeColor: "var(--color-hex-e31b23)",
        badgeBg: "var(--color-hex-1a0608)",
    },
    ELIGIBLE: {
        border: "var(--color-hex-e31b23)",
        bg: "var(--color-hex-120608)",
        labelColor: "var(--color-hex-ff2a32)",
        typeColor: "var(--color-hex-9e1118)",
        badgeColor: "var(--color-hex-ff2a32)",
        badgeBg: "var(--color-hex-1a0608)",
    },
    IN_PROGRESS: {
        border: "var(--color-hex-ff2a32)",
        bg: "var(--color-hex-180a0b)",
        labelColor: "var(--color-hex-ff2a32)",
        typeColor: "var(--color-hex-9e1118)",
        badgeColor: "var(--color-hex-ff2a32)",
        badgeBg: "var(--color-hex-200a0b)",
    },
    BLOCKED: {
        border: "var(--color-hex-2a1010)",
        bg: "var(--color-hex-0d0808)",
        labelColor: "var(--color-hex-4a1a1a)",
        typeColor: "var(--color-hex-2a1010)",
        badgeColor: "var(--color-hex-4a1a1a)",
        badgeBg: "var(--color-hex-0d0808)",
    },
    INFEASIBLE: {
        border: "var(--color-hex-1e1e1e)",
        bg: "var(--color-hex-0a0a0a)",
        labelColor: "var(--color-hex-2a2a2a)",
        typeColor: "var(--color-hex-1e1e1e)",
        badgeColor: "var(--color-hex-2a2a2a)",
        badgeBg: "transparent",
    },
    DEPRIORITIZED: {
        border: "var(--color-hex-252525)",
        bg: "var(--color-hex-0c0c0c)",
        labelColor: "var(--color-hex-363636)",
        typeColor: "var(--color-hex-252525)",
        badgeColor: "var(--color-hex-363636)",
        badgeBg: "transparent",
    },
};
const STATUS_FILTERS: FilterStatus[] = [
    "ALL",
    "ELIGIBLE",
    "IN_PROGRESS",
    "EXPLOITED",
    "BLOCKED",
    "INFEASIBLE",
    "DEPRIORITIZED",
];
const VULN_FILTERS: VulnFilter[] = [
    "ALL",
    "SQLi",
    "XSS",
    "CSRF",
    "SSRF",
    "SSTI",
    "IDOR",
    "RCE",
    "AUTH",
    "GRAPHQL",
    "LATERAL",
];
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
export default function AttackGraphCanvas() {
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
        if (!el) return;
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
    const { w, h } = dims;
    const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));
    function visible(n: VDGNode) {
        return (
            (statusFilter === "ALL" || n.status === statusFilter) &&
            (vulnFilter === "ALL" || n.vulnClass === vulnFilter || n.vulnClass === "ALL")
        );
    }
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Toolbar */}
            <div
                className="flex flex-shrink-0 flex-col gap-2 bg-[var(--color-hex-0b0b0b)] px-4 py-3"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                            ATTACK GRAPH
                        </span>
                        <span className="text-[8.5px] tracking-[0.12em] text-[var(--color-hex-292929)]">
                            VDG / CVE-001 · {NODES.length} NODES · {EDGES.length} EDGES
                        </span>
                    </div>
                    <button
                        className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-151515)] px-[12px] py-[4px] text-[9px] tracking-[0.14em] text-[var(--color-hex-a0a0a0)]"
                        onClick={() => {
                            const top = [...NODES]
                                .filter((n) => n.status === "ELIGIBLE")
                                .sort((a, b) => b.ucb - a.ucb)[0];
                            if (!top) return;
                            setStatusFilter("ALL");
                            setVulnFilter("ALL");
                            setDrawerNode(top);
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.borderColor = "var(--color-hex-e31b23)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.borderColor = "var(--color-hex-333333)")
                        }
                    >
                        ◈ FOCUS HIGHEST-SCORE PATH
                    </button>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-1">
                        {STATUS_FILTERS.map((f) => (
                            <FilterChip
                                key={f}
                                label={f === "IN_PROGRESS" ? "IN PROGRESS" : f}
                                active={statusFilter === f}
                                onClick={() => setStatusFilter(f)}
                                red={f !== "ALL"}
                            />
                        ))}
                    </div>
                    <div className="h-[16px] w-[1px] bg-[var(--color-hex-222222)]" />
                    <div className="flex flex-wrap items-center gap-1">
                        {VULN_FILTERS.map((f) => (
                            <FilterChip
                                key={f}
                                label={f}
                                active={vulnFilter === f}
                                onClick={() => setVulnFilter(f)}
                                dim
                            />
                        ))}
                    </div>
                </div>
            </div>

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
                        {EDGES.map((edge) => {
                            const src = nodeMap[edge.from],
                                dst = nodeMap[edge.to];
                            if (!src || !dst) return null;
                            const vis = visible(src) && visible(dst);
                            const isDim =
                                dst.status === "BLOCKED" ||
                                dst.status === "INFEASIBLE" ||
                                dst.status === "DEPRIORITIZED";
                            const isActive = edge.active && dst.status === "IN_PROGRESS";
                            const color = isActive
                                ? "var(--color-hex-ff2a32)"
                                : isDim
                                  ? "var(--color-hex-252525)"
                                  : "var(--color-hex-e31b23)";
                            const marker = isActive ? "arr-active" : isDim ? "arr-dim" : "arr-red";
                            return (
                                <line
                                    key={`${edge.from}-${edge.to}`}
                                    x1={lx(src.cx, w)}
                                    y1={ly(src.cy, h) + NODE_H / 2}
                                    x2={lx(dst.cx, w)}
                                    y2={ly(dst.cy, h) - 4}
                                    stroke={color}
                                    strokeWidth={isActive ? 1.5 : 1}
                                    strokeDasharray={isActive ? "4 3" : "none"}
                                    opacity={vis ? (isDim ? 0.4 : 0.8) : 0.1}
                                    markerEnd={`url(#${marker})`}
                                />
                            );
                        })}
                    </svg>

                    {/* Node cards */}
                    {NODES.map((node) => {
                        const s = NODE_STYLE[node.status];
                        const isVis = visible(node);
                        const isHov = hovered === node.id;
                        return (
                            <div
                                key={node.id}
                                onMouseEnter={() => setHovered(node.id)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => setDrawerNode(node)}
                                className="absolute cursor-pointer rounded-[2px] px-[10px] py-[8px]"
                                style={{
                                    left: lx(node.cx, w) - NODE_W / 2,
                                    top: ly(node.cy, h),
                                    width: NODE_W,
                                    background: s.bg,
                                    border: `1px solid ${isHov && isVis ? "var(--color-hex-ff2a32)" : s.border}`,
                                    opacity: isVis ? 1 : 0.12,
                                    zIndex: isHov ? 10 : 1,
                                    transition: "opacity 0.15s, border-color 0.1s",
                                }}
                            >
                                {node.status === "ELIGIBLE" && isVis && (
                                    <div
                                        className="absolute rounded-[3px] border-[1px] border-solid border-[var(--color-hex-e31b2330)]"
                                        style={{
                                            inset: -4,
                                            pointerEvents: "none",
                                            animation: "nodeRing 2.2s ease infinite",
                                        }}
                                    />
                                )}
                                <div className="mb-1 flex items-center justify-between">
                                    <span
                                        className="text-[9.5px] font-bold tracking-[0.1em]"
                                        style={{
                                            color: s.labelColor,
                                        }}
                                    >
                                        {node.id}
                                    </span>
                                    <span
                                        className="text-[8px] text-[var(--color-hex-ff2a32)]"
                                        style={{
                                            animation:
                                                node.status === "IN_PROGRESS"
                                                    ? "blink 1s ease infinite"
                                                    : "none",
                                        }}
                                    >
                                        {node.status === "EXPLOITED"
                                            ? "✓"
                                            : node.status === "BLOCKED"
                                              ? "⊗"
                                              : node.status === "IN_PROGRESS"
                                                ? "▶"
                                                : ""}
                                    </span>
                                </div>
                                <div
                                    className="mb-[6px] text-[7.5px] leading-[1.2] tracking-[0.14em]"
                                    style={{
                                        color: s.typeColor,
                                    }}
                                >
                                    {node.type}
                                </div>
                                <div
                                    className="flex items-center gap-3"
                                    style={{
                                        borderTop: `1px solid ${s.border}`,
                                        paddingTop: 5,
                                    }}
                                >
                                    <NodeStat
                                        label="UCB"
                                        value={
                                            node.status === "EXPLOITED" ? "—" : node.ucb.toFixed(3)
                                        }
                                        color={s.labelColor}
                                    />
                                    <NodeStat
                                        label="E_ord"
                                        value={`${node.eord}/5`}
                                        color={s.labelColor}
                                    />
                                    <div className="ml-auto">
                                        <span
                                            className="rounded-[2px] px-[4px] py-[1px] text-[7.5px] font-semibold tracking-[0.1em]"
                                            style={{
                                                color: s.badgeColor,
                                                background: s.badgeBg,
                                                border: `1px solid ${s.badgeColor}33`,
                                            }}
                                        >
                                            {node.status === "IN_PROGRESS"
                                                ? "IN PROG"
                                                : node.status === "DEPRIORITIZED"
                                                  ? "DEPRIO"
                                                  : node.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Legend */}
                    <div className="absolute right-4 bottom-4 flex flex-col gap-1.5 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[12px] py-[10px]">
                        <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-333333)]">
                            LEGEND
                        </div>
                        {(
                            [
                                "ELIGIBLE",
                                "IN_PROGRESS",
                                "EXPLOITED",
                                "BLOCKED",
                                "INFEASIBLE",
                                "DEPRIORITIZED",
                            ] as NodeStatus[]
                        ).map((st) => {
                            const s = NODE_STYLE[st];
                            return (
                                <div key={st} className="flex items-center gap-2">
                                    <div
                                        className="h-[8px] w-[8px] shrink-0 rounded-[1px]"
                                        style={{
                                            border: `1px solid ${s.border}`,
                                            background: s.bg,
                                        }}
                                    />
                                    <span
                                        className="text-[7.5px] tracking-[0.1em]"
                                        style={{
                                            color: s.labelColor,
                                        }}
                                    >
                                        {st === "IN_PROGRESS" ? "IN PROGRESS" : st}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

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
}
function FilterChip({
    label,
    active,
    onClick,
    red,
    dim,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
    red?: boolean;
    dim?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            className="font-inherit cursor-pointer rounded-[2px] px-[7px] py-[2px] text-[8.5px] tracking-[0.12em]"
            style={{
                color: active
                    ? red
                        ? "var(--color-hex-ff2a32)"
                        : "var(--color-hex-f2f2f2)"
                    : dim
                      ? "var(--color-hex-383838)"
                      : "var(--color-hex-555555)",
                background: active
                    ? red
                        ? "var(--color-hex-1a0608)"
                        : "var(--color-hex-191919)"
                    : "transparent",
                border: `1px solid ${active ? (red ? "var(--color-hex-6f171b)" : "var(--color-hex-333333)") : "var(--color-hex-1e1e1e)"}`,
                whiteSpace: "nowrap" as const,
            }}
            onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.color = "var(--color-hex-888888)";
            }}
            onMouseLeave={(e) => {
                if (!active)
                    e.currentTarget.style.color = dim
                        ? "var(--color-hex-383838)"
                        : "var(--color-hex-555555)";
            }}
        >
            {label}
        </button>
    );
}
function NodeStat({ label, value, color }: { label: string; value: string; color: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[6.5px] tracking-[0.16em] text-[var(--color-hex-333333)]">
                {label}
            </span>
            <span
                className="text-[9px] font-bold tracking-[0.04em]"
                style={{
                    color,
                }}
            >
                {value}
            </span>
        </div>
    );
}
