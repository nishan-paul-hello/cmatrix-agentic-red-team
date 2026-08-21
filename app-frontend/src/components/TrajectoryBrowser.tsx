import { useState } from "react";
import TrajectoryPage from "./TrajectoryPage";

const MISSION_OPTIONS = ["CVE-001", "CVE-002", "CVE-003", "BENCH-014"];

export default function TrajectoryBrowser() {
  const [mission, setMission] = useState("CVE-001");

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #1E1E1E" }}>
        <div style={{ fontSize: 9, color: "#666666", letterSpacing: "0.22em", marginBottom: 3 }}>RESEARCH</div>
        <div className="flex items-baseline justify-between">
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F2F2F2", letterSpacing: "0.12em" }}>TRAJECTORY BROWSER</h1>
          {/* Mission selector */}
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 8, color: "#444444", letterSpacing: "0.18em" }}>MISSION</span>
            <select
              value={mission}
              onChange={e => setMission(e.target.value)}
              style={{
                background: "#111111", border: "1px solid #292929", borderRadius: 2,
                color: "#A0A0A0", fontSize: 10, padding: "4px 8px",
                fontFamily: "inherit", letterSpacing: "0.08em", cursor: "pointer", outline: "none",
              }}
            >
              {MISSION_OPTIONS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Trajectory content for selected mission */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <TrajectoryPage key={mission} />
      </div>
    </div>
  );
}
