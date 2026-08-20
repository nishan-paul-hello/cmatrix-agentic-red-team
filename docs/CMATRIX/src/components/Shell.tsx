import type { ReactNode } from "react";

export type NavItem =
  | "dashboard" | "missions"
  | "memory" | "skill-library" | "failure-memory"
  | "benchmarks" | "ablations" | "statistics" | "failure-analysis" | "reports"
  | "cost-usage" | "audit-log" | "settings";

const NAV_GROUPS = [
  {
    label: "OPERATIONS",
    items: [
      { id: "dashboard", label: "Dashboard" },
      { id: "missions",  label: "Missions"  },
    ],
  },
  {
    label: "KNOWLEDGE",
    items: [
      { id: "memory",         label: "Memory"         },
      { id: "skill-library",  label: "Skill Library"  },
      { id: "failure-memory", label: "Failure Memory" },
    ],
  },
  {
    label: "RESEARCH",
    items: [
      { id: "benchmarks",       label: "Benchmarks"       },
      { id: "ablations",        label: "Ablations"        },
      { id: "statistics",       label: "Statistics"       },
      { id: "failure-analysis", label: "Failure Analysis" },
      { id: "reports",          label: "Reports"          },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { id: "cost-usage", label: "Cost & Usage" },
      { id: "audit-log",  label: "Audit Log"    },
      { id: "settings",   label: "Settings"     },
    ],
  },
] as const;

function GeometricMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
      <rect x="0.5" y="0.5" width="11" height="11" stroke="#E31B23" strokeWidth="1" fill="none" />
      <rect x="8.5" y="8.5" width="11" height="11" stroke="#9E1118" strokeWidth="1" fill="none" />
      <rect x="16.5" y="16.5" width="11" height="11" stroke="#6F171B" strokeWidth="1" fill="none" />
      <line x1="6" y1="6" x2="22" y2="22" stroke="#E31B23" strokeWidth="0.75" />
    </svg>
  );
}

function NavIcon({ id }: { id: string }) {
  const icons: Record<string, string> = {
    dashboard: "▪", missions: "◈",
    memory: "⊞", "skill-library": "⊟", "failure-memory": "⊠",
    benchmarks: "≡", ablations: "∿", statistics: "∑",
    "failure-analysis": "⊗", reports: "⊕",
    "cost-usage": "$", "audit-log": "≣", settings: "⚙",
  };
  return <span style={{ fontSize: 10, width: 14, display: "inline-block" }}>{icons[id] ?? "·"}</span>;
}

interface ShellProps {
  activeNav: NavItem;
  onNavChange: (id: NavItem) => void;
  children: ReactNode;
  missionId?: string;
}

export default function Shell({ activeNav, onNavChange, children, missionId = "CVE-001" }: ShellProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#080808", color: "#F2F2F2" }}>
      {/* Sidebar */}
      <aside className="flex flex-col flex-shrink-0 overflow-y-auto" style={{ width: 200, background: "#0B0B0B", borderRight: "1px solid #1E1E1E", position:"relative" }}>
        {/* Red accent stripe */}
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:2, background:"#E31B23" }} />
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4" style={{ borderBottom: "1px solid #1E1E1E", paddingLeft:16 }}>
          <GeometricMark />
          <div className="flex flex-col">
            <span className="font-bold" style={{ fontSize: 12, color: "#F2F2F2", letterSpacing: "0.2em" }}>CMATRIX</span>
            <span style={{ fontSize: 7, color: "#666666", letterSpacing: "0.2em" }}>AUTONOMOUS VAPT</span>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex flex-col flex-1 py-2">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && <div className="mx-4 my-2" style={{ height: 1, background: "#1E1E1E" }} />}
              <div className="px-4 pt-2 pb-1" style={{ fontSize: 8, color: "#444444", letterSpacing: "0.22em", fontWeight: 600 }}>
                {group.label}
              </div>
              {group.items.map((item) => {
                const active = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavChange(item.id as NavItem)}
                    className="w-full flex items-center gap-2 px-4 py-1.5 text-left"
                    style={{
                      background: active ? "#1A0A0B" : "transparent",
                      borderLeft: active ? "2px solid #E31B23" : "2px solid transparent",
                      color: active ? "#F2F2F2" : "#666666",
                      fontSize: 10.5,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      letterSpacing: "0.02em",
                    }}
                    onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#A0A0A0"; }}
                    onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#666666"; }}
                  >
                    <NavIcon id={item.id} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Ctrl+K hint */}
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderTop:"1px solid #1E1E1E" }}>
          <kbd style={{ fontSize:8, color:"#333333", background:"#111111", border:"1px solid #1E1E1E", borderRadius:2, padding:"1px 5px", fontFamily:"inherit" }}>⌘K</kbd>
          <span style={{ fontSize:8, color:"#333333", letterSpacing:"0.1em" }}>COMMAND PALETTE</span>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between flex-shrink-0 px-4" style={{ height: 36, background: "#0D0D0D", borderBottom: "1px solid #1E1E1E" }}>
          <span style={{ fontSize: 10, color: "#A0A0A0", letterSpacing: "0.14em" }}>
            MISSION / <span style={{ color: "#E31B23", fontWeight:700 }}>{missionId}</span>
          </span>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5">
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3FB950", flexShrink: 0 }} />
              <span style={{ fontSize: 9.5, color: "#3FB950", letterSpacing: "0.14em" }}>SYSTEM ONLINE</span>
            </div>
            <Topbar label="STATUS" value="RUNNING" valueColor="#3FB950" />
            <Topbar label="MODEL" value="SONNET-5" />
            <Topbar label="COST" value="$0.223" />
            <Topbar label="TIME" value="00:19:04" />
            <div className="flex items-center gap-2 ml-2" style={{ borderLeft: "1px solid #1E1E1E", paddingLeft: 12 }}>
              <div style={{ width: 22, height: 22, borderRadius: 2, background: "#191919", border: "1px solid #292929", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#666666", cursor: "pointer" }}>⚙</div>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#1E1E1E", border: "1px solid #292929", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#A0A0A0", cursor: "pointer" }}>R</div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-hidden" style={{ background: "#0D0D0D" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

function Topbar({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ fontSize: 8.5, color: "#444444", letterSpacing: "0.14em" }}>{label}</span>
      <span style={{ fontSize: 9.5, color: valueColor ?? "#A0A0A0", letterSpacing: "0.08em" }}>{value}</span>
    </div>
  );
}
