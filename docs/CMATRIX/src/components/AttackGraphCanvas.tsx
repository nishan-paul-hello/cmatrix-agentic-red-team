import { useState, useRef, useEffect } from "react";
import VDGNodeDrawer from "./VDGNodeDrawer";

type NodeStatus = "EXPLOITED" | "ELIGIBLE" | "IN_PROGRESS" | "BLOCKED" | "INFEASIBLE" | "DEPRIORITIZED";
type FilterStatus = "ALL" | NodeStatus;
type VulnFilter = "ALL" | "SQLi" | "XSS" | "CSRF" | "SSRF" | "SSTI" | "IDOR" | "RCE" | "AUTH" | "GRAPHQL" | "LATERAL";

interface VDGNode {
  id: string; type: string; vulnClass: VulnFilter; status: NodeStatus;
  ucb: number; eord: number; cx: number; cy: number;
}
interface Edge { from: string; to: string; active?: boolean; }

const NODES: VDGNode[] = [
  { id: "RECON-001",     type: "RECONNAISSANCE",   vulnClass: "ALL",  status: "EXPLOITED",    ucb: 0,     eord: 5, cx: 500, cy: 50  },
  { id: "AUTH-001",      type: "AUTHENTICATION",   vulnClass: "AUTH", status: "EXPLOITED",    ucb: 0,     eord: 4, cx: 270, cy: 170 },
  { id: "ENUM-002",      type: "ENUMERATION",      vulnClass: "ALL",  status: "EXPLOITED",    ucb: 0,     eord: 4, cx: 720, cy: 170 },
  { id: "SQLI-001",      type: "SQL INJECTION",    vulnClass: "SQLi", status: "ELIGIBLE",     ucb: 0.824, eord: 3, cx: 110, cy: 320 },
  { id: "XSS-002",       type: "CROSS-SITE SCRIPT",vulnClass: "XSS",  status: "IN_PROGRESS",  ucb: 0.741, eord: 3, cx: 310, cy: 320 },
  { id: "CSRF-003",      type: "CROSS-SITE REQ",   vulnClass: "CSRF", status: "BLOCKED",      ucb: 0.512, eord: 1, cx: 500, cy: 320 },
  { id: "SSRF-005",      type: "SERVER-SIDE REQ",  vulnClass: "SSRF", status: "INFEASIBLE",   ucb: 0,     eord: 2, cx: 690, cy: 320 },
  { id: "IDOR-008",      type: "INSECURE DIR REF", vulnClass: "IDOR", status: "ELIGIBLE",     ucb: 0.631, eord: 2, cx: 890, cy: 320 },
  { id: "DB-ACCESS-002", type: "DATABASE ACCESS",  vulnClass: "SQLi", status: "BLOCKED",      ucb: 0.390, eord: 0, cx: 60,  cy: 480 },
  { id: "RCE-007",       type: "REMOTE CODE EXEC", vulnClass: "RCE",  status: "BLOCKED",      ucb: 0.440, eord: 1, cx: 240, cy: 480 },
  { id: "SSTI-006",      type: "SERVER-SIDE TMPL", vulnClass: "SSTI", status: "DEPRIORITIZED",ucb: 0.210, eord: 1, cx: 690, cy: 480 },
  { id: "IDOR-009",      type: "INSECURE DIR REF", vulnClass: "IDOR", status: "ELIGIBLE",     ucb: 0.588, eord: 2, cx: 890, cy: 480 },
];

const EDGES: Edge[] = [
  { from: "RECON-001", to: "AUTH-001"      },
  { from: "RECON-001", to: "ENUM-002"      },
  { from: "AUTH-001",  to: "SQLI-001"      },
  { from: "AUTH-001",  to: "XSS-002",  active: true },
  { from: "AUTH-001",  to: "CSRF-003"      },
  { from: "ENUM-002",  to: "SSRF-005"      },
  { from: "ENUM-002",  to: "IDOR-008"      },
  { from: "SQLI-001",  to: "DB-ACCESS-002" },
  { from: "SQLI-001",  to: "RCE-007"       },
  { from: "SSRF-005",  to: "SSTI-006"      },
  { from: "IDOR-008",  to: "IDOR-009"      },
];

const NODE_STYLE: Record<NodeStatus, { border: string; bg: string; labelColor: string; typeColor: string; badgeColor: string; badgeBg: string }> = {
  EXPLOITED:    { border: "#9E1118", bg: "#130508",  labelColor: "#E31B23", typeColor: "#6F171B", badgeColor: "#E31B23", badgeBg: "#1A0608"    },
  ELIGIBLE:     { border: "#E31B23", bg: "#120608",  labelColor: "#FF2A32", typeColor: "#9E1118", badgeColor: "#FF2A32", badgeBg: "#1A0608"    },
  IN_PROGRESS:  { border: "#FF2A32", bg: "#180A0B",  labelColor: "#FF2A32", typeColor: "#9E1118", badgeColor: "#FF2A32", badgeBg: "#200A0B"    },
  BLOCKED:      { border: "#2A1010", bg: "#0D0808",  labelColor: "#4A1A1A", typeColor: "#2A1010", badgeColor: "#4A1A1A", badgeBg: "#0D0808"    },
  INFEASIBLE:   { border: "#1E1E1E", bg: "#0A0A0A",  labelColor: "#2A2A2A", typeColor: "#1E1E1E", badgeColor: "#2A2A2A", badgeBg: "transparent"},
  DEPRIORITIZED:{ border: "#252525", bg: "#0C0C0C",  labelColor: "#363636", typeColor: "#252525", badgeColor: "#363636", badgeBg: "transparent"},
};

const STATUS_FILTERS: FilterStatus[] = ["ALL","ELIGIBLE","IN_PROGRESS","EXPLOITED","BLOCKED","INFEASIBLE","DEPRIORITIZED"];
const VULN_FILTERS: VulnFilter[]     = ["ALL","SQLi","XSS","CSRF","SSRF","SSTI","IDOR","RCE","AUTH","GRAPHQL","LATERAL"];

const LOGIC_W = 1000, LOGIC_H = 560, NODE_W = 158, NODE_H = 84;
function lx(x: number, cw: number) { return (x / LOGIC_W) * cw; }
function ly(y: number, ch: number) { return (y / LOGIC_H) * ch; }

export default function AttackGraphCanvas() {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("ALL");
  const [vulnFilter, setVulnFilter]     = useState<VulnFilter>("ALL");
  const [hovered, setHovered]           = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen]     = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 900, h: 560 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setDims({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    setDims({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]));

  function visible(n: VDGNode) {
    return (statusFilter === "ALL" || n.status === statusFilter) &&
           (vulnFilter === "ALL" || n.vulnClass === vulnFilter || n.vulnClass === "ALL");
  }

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Toolbar */}
      <div className="flex-shrink-0 flex flex-col gap-2 px-4 py-3" style={{ background: "#0B0B0B", borderBottom: "1px solid #1E1E1E" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span style={{ fontSize: 9, color: "#444444", letterSpacing: "0.2em" }}>ATTACK GRAPH</span>
            <span style={{ fontSize: 8.5, color: "#292929", letterSpacing: "0.12em" }}>VDG / CVE-001 · {NODES.length} NODES · {EDGES.length} EDGES</span>
          </div>
          <button style={{ fontSize: 9, color: "#A0A0A0", background: "#151515", border: "1px solid #333333", borderRadius: 2, padding: "4px 12px", letterSpacing: "0.14em", cursor: "pointer", fontFamily: "inherit" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#E31B23")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#333333")}>
            ◈ FOCUS HIGHEST-SCORE PATH
          </button>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            {STATUS_FILTERS.map((f) => (
              <FilterChip key={f} label={f === "IN_PROGRESS" ? "IN PROGRESS" : f} active={statusFilter === f} onClick={() => setStatusFilter(f)} red={f !== "ALL"} />
            ))}
          </div>
          <div style={{ width: 1, height: 16, background: "#222222" }} />
          <div className="flex items-center gap-1 flex-wrap">
            {VULN_FILTERS.map((f) => (
              <FilterChip key={f} label={f} active={vulnFilter === f} onClick={() => setVulnFilter(f)} dim />
            ))}
          </div>
        </div>
      </div>

      {/* Canvas row */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Canvas */}
        <div ref={containerRef} className="flex-1 relative overflow-hidden" style={{ background: "#080808" }}>
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "linear-gradient(rgba(28,28,28,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(28,28,28,0.5) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }} />

          {/* SVG edges */}
          <svg className="absolute inset-0 pointer-events-none" width={w} height={h}>
            <defs>
              <marker id="arr-red"    markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#E31B23" opacity="0.7" /></marker>
              <marker id="arr-dim"    markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#252525" /></marker>
              <marker id="arr-active" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#FF2A32" /></marker>
            </defs>
            {EDGES.map((edge) => {
              const src = nodeMap[edge.from], dst = nodeMap[edge.to];
              if (!src || !dst) return null;
              const vis = visible(src) && visible(dst);
              const isDim   = dst.status === "BLOCKED" || dst.status === "INFEASIBLE" || dst.status === "DEPRIORITIZED";
              const isActive = edge.active && dst.status === "IN_PROGRESS";
              const color  = isActive ? "#FF2A32" : isDim ? "#252525" : "#E31B23";
              const marker = isActive ? "arr-active" : isDim ? "arr-dim" : "arr-red";
              return (
                <line key={`${edge.from}-${edge.to}`}
                  x1={lx(src.cx, w)} y1={ly(src.cy, h) + NODE_H / 2}
                  x2={lx(dst.cx, w)} y2={ly(dst.cy, h) - 4}
                  stroke={color} strokeWidth={isActive ? 1.5 : 1}
                  strokeDasharray={isActive ? "4 3" : "none"}
                  opacity={vis ? (isDim ? 0.4 : 0.8) : 0.1}
                  markerEnd={`url(#${marker})`}
                />
              );
            })}
          </svg>

          {/* Node cards */}
          {NODES.map((node) => {
            const s     = NODE_STYLE[node.status];
            const isVis = visible(node);
            const isHov = hovered === node.id;
            return (
              <div key={node.id}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setDrawerOpen(true)}
                style={{
                  position: "absolute",
                  left: lx(node.cx, w) - NODE_W / 2,
                  top: ly(node.cy, h),
                  width: NODE_W,
                  background: s.bg,
                  border: `1px solid ${isHov && isVis ? "#FF2A32" : s.border}`,
                  borderRadius: 2,
                  padding: "8px 10px",
                  opacity: isVis ? 1 : 0.12,
                  cursor: "pointer",
                  zIndex: isHov ? 10 : 1,
                  transition: "opacity 0.15s, border-color 0.1s",
                }}
              >
                {node.status === "ELIGIBLE" && isVis && (
                  <div style={{ position: "absolute", inset: -4, border: "1px solid #E31B2330", borderRadius: 3, pointerEvents: "none", animation: "nodeRing 2.2s ease infinite" }} />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span style={{ fontSize: 9.5, fontWeight: 700, color: s.labelColor, letterSpacing: "0.1em" }}>{node.id}</span>
                  <span style={{ fontSize: 8, color: "#FF2A32", animation: node.status === "IN_PROGRESS" ? "blink 1s ease infinite" : "none" }}>
                    {node.status === "EXPLOITED" ? "✓" : node.status === "BLOCKED" ? "⊗" : node.status === "IN_PROGRESS" ? "▶" : ""}
                  </span>
                </div>
                <div style={{ fontSize: 7.5, color: s.typeColor, letterSpacing: "0.14em", marginBottom: 6, lineHeight: 1.2 }}>{node.type}</div>
                <div className="flex items-center gap-3" style={{ borderTop: `1px solid ${s.border}`, paddingTop: 5 }}>
                  <NodeStat label="UCB"   value={node.status === "EXPLOITED" ? "—" : node.ucb.toFixed(3)} color={s.labelColor} />
                  <NodeStat label="E_ord" value={`${node.eord}/5`} color={s.labelColor} />
                  <div style={{ marginLeft: "auto" }}>
                    <span style={{ fontSize: 7.5, color: s.badgeColor, background: s.badgeBg, border: `1px solid ${s.badgeColor}33`, borderRadius: 2, padding: "1px 4px", letterSpacing: "0.1em", fontWeight: 600 }}>
                      {node.status === "IN_PROGRESS" ? "IN PROG" : node.status === "DEPRIORITIZED" ? "DEPRIO" : node.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1.5" style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 2, padding: "10px 12px" }}>
            <div style={{ fontSize: 7.5, color: "#333333", letterSpacing: "0.18em", marginBottom: 4 }}>LEGEND</div>
            {(["ELIGIBLE","IN_PROGRESS","EXPLOITED","BLOCKED","INFEASIBLE","DEPRIORITIZED"] as NodeStatus[]).map((st) => {
              const s = NODE_STYLE[st];
              return (
                <div key={st} className="flex items-center gap-2">
                  <div style={{ width: 8, height: 8, borderRadius: 1, border: `1px solid ${s.border}`, background: s.bg, flexShrink: 0 }} />
                  <span style={{ fontSize: 7.5, color: s.labelColor, letterSpacing: "0.1em" }}>{st === "IN_PROGRESS" ? "IN PROGRESS" : st}</span>
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
        {drawerOpen && <VDGNodeDrawer onClose={() => setDrawerOpen(false)} />}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick, red, dim }: { label: string; active: boolean; onClick: () => void; red?: boolean; dim?: boolean }) {
  return (
    <button onClick={onClick}
      style={{ fontSize: 8.5, color: active ? (red ? "#FF2A32" : "#F2F2F2") : dim ? "#383838" : "#555555", background: active ? (red ? "#1A0608" : "#191919") : "transparent", border: `1px solid ${active ? (red ? "#6F171B" : "#333333") : "#1E1E1E"}`, borderRadius: 2, padding: "2px 7px", letterSpacing: "0.12em", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" as const }}
      onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#888888"; }}
      onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = dim ? "#383838" : "#555555"; }}
    >{label}</button>
  );
}

function NodeStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span style={{ fontSize: 6.5, color: "#333333", letterSpacing: "0.16em" }}>{label}</span>
      <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: "0.04em" }}>{value}</span>
    </div>
  );
}
