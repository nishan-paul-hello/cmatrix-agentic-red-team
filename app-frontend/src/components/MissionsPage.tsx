import { useState } from "react";
import { MISSIONS } from "../lib/data";

type MissionFilter = "ALL" | "RUNNING" | "PAUSED" | "VALIDATING" | "QUEUED" | "COMPLETED";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    RUNNING:    { bg: "#0D2010", color: "#3FB950" },
    PAUSED:     { bg: "#1A1A00", color: "#D29922" },
    VALIDATING: { bg: "#1A0A0B", color: "#FF2A32" },
    QUEUED:     { bg: "#111111", color: "#666666" },
    COMPLETED:  { bg: "#0A1A10", color: "#3FB950" },
    FAILED:     { bg: "#1A0808", color: "#FF2A32" },
  };
  const style = map[status] ?? { bg: "#111111", color: "#666666" };
  return (
    <span style={{ background: style.bg, color: style.color, border: `1px solid ${style.color}22`, borderRadius: 2, padding: "1px 6px", fontSize: 9.5, letterSpacing: "0.14em", fontWeight: 600 }}>
      {status}
    </span>
  );
}

const FILTERS: MissionFilter[] = ["ALL", "RUNNING", "PAUSED", "VALIDATING", "QUEUED", "COMPLETED"];

export default function MissionsPage({ onNewMission, onOpenMission }: { onNewMission?: () => void; onOpenMission?: (id: string) => void }) {
  const [filter, setFilter] = useState<MissionFilter>("ALL");

  const filtered = filter === "ALL" ? MISSIONS : MISSIONS.filter(m => m.status === filter);

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Page header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #1E1E1E" }}>
        <div style={{ fontSize: 9, color: "#666666", letterSpacing: "0.22em", marginBottom: 3 }}>OPERATIONS</div>
        <div className="flex items-baseline justify-between">
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F2F2F2", letterSpacing: "0.12em" }}>MISSIONS</h1>
          <button
            onClick={onNewMission}
            style={{ fontSize: 9, color: "#E31B23", background: "transparent", border: "1px solid #6F171B", borderRadius: 2, padding: "4px 12px", letterSpacing: "0.14em", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}
            onMouseEnter={e => { e.currentTarget.style.background = "#1A0608"; e.currentTarget.style.borderColor = "#E31B23"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#6F171B"; }}
          >NEW MISSION →</button>
        </div>
      </div>

      {/* Filter strip */}
      <div className="flex-shrink-0 flex items-center gap-1 px-6 py-3" style={{ borderBottom: "1px solid #1E1E1E", background: "#0B0B0B" }}>
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontSize: 8.5, letterSpacing: "0.12em", padding: "3px 10px",
              background: filter === f ? "#120608" : "transparent",
              border: `1px solid ${filter === f ? "#E31B23" : "#1E1E1E"}`,
              borderRadius: 2,
              color: filter === f ? "#FF2A32" : "#555555",
              cursor: "pointer", fontFamily: "inherit",
            }}
            onMouseEnter={e => { if (filter !== f) e.currentTarget.style.color = "#A0A0A0"; }}
            onMouseLeave={e => { if (filter !== f) e.currentTarget.style.color = "#555555"; }}
          >{f}</button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: 8.5, color: "#444444", letterSpacing: "0.12em" }}>{filtered.length} MISSIONS</span>
      </div>

      {/* Missions table */}
      <div className="flex-1 overflow-auto">
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ background: "#111111", position: "sticky", top: 0 }}>
              {["ID", "TARGET", "SURFACE", "MODE", "STATUS", "NODES", "FINDINGS", "COST", "STARTED"].map(h => (
                <th key={h} style={{ padding: "6px 16px", textAlign: "left", fontSize: 8.5, color: "#444444", letterSpacing: "0.18em", fontWeight: 600, borderBottom: "1px solid #1E1E1E", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(m => (
              <tr
                key={m.id}
                style={{ borderBottom: "1px solid #191919", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#131313")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                onClick={() => onOpenMission?.(m.id)}
              >
                <td style={{ padding: "8px 16px", color: "#E31B23", fontWeight: 600, letterSpacing: "0.08em", whiteSpace: "nowrap" }}>{m.id}</td>
                <td style={{ padding: "8px 16px", color: "#A0A0A0", whiteSpace: "nowrap", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis" }}>{m.target}</td>
                <td style={{ padding: "8px 16px", color: "#666666", whiteSpace: "nowrap", fontSize: 10 }}>{m.surface}</td>
                <td style={{ padding: "8px 16px", color: "#666666", whiteSpace: "nowrap", fontSize: 10 }}>{m.mode}</td>
                <td style={{ padding: "8px 16px", whiteSpace: "nowrap" }}><StatusBadge status={m.status} /></td>
                <td style={{ padding: "8px 16px", color: "#A0A0A0", textAlign: "right" }}>{m.nodes}</td>
                <td style={{ padding: "8px 16px", color: m.findings > 0 ? "#FF2A32" : "#666666", textAlign: "right", fontWeight: m.findings > 0 ? 600 : 400 }}>{m.findings}</td>
                <td style={{ padding: "8px 16px", color: "#A0A0A0", textAlign: "right" }}>{m.cost}</td>
                <td style={{ padding: "8px 16px", color: "#555555", fontSize: 9.5, whiteSpace: "nowrap" }}>{m.started}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
