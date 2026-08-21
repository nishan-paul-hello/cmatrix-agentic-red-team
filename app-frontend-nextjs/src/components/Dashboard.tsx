import { useEffect, useRef, useState } from "react";
import { MISSIONS } from "../lib/data";



type ActivityEntry = {
  id: number;
  ts: string;
  agent: string;
  action: string;
  desc: string;
  color: string;
};

const INITIAL_ACTIVITY: ActivityEntry[] = [
  { id: 1, ts: "14:22:07", agent: "RECON-SPEC", action: "TOOL_CALL", desc: "nmap -sV -p 1-1024 app.targetcorp.com", color: "#A0A0A0" },
  { id: 2, ts: "14:22:05", agent: "TEAM-MGR", action: "UCB_SELECT", desc: "SQLI-007 selected, UCB=0.824, path=0.612", color: "#E31B23" },
  { id: 3, ts: "14:21:59", agent: "EVAL-AGENT", action: "E_ORD_UPDATE", desc: "AUTH-003 evidence raised to E_ord 4 (CONFIRMED)", color: "#3FB950" },
  { id: 4, ts: "14:21:54", agent: "SQLI-SPEC", action: "EXPLOIT_ATTEMPT", desc: "Injecting into /api/users?id= parameter", color: "#A0A0A0" },
  { id: 5, ts: "14:21:48", agent: "VALID-AGENT", action: "ORACLE_TEST", desc: "CVE-BENCH oracle invoked for SQLI-004", color: "#D29922" },
  { id: 6, ts: "14:21:41", agent: "TEAM-MGR", action: "EL_SNAPSHOT", desc: "Environmental Layer snapshot: 87 facts", color: "#A0A0A0" },
  { id: 7, ts: "14:21:38", agent: "RECON-SPEC", action: "CREDENTIAL_FOUND", desc: "Credential extracted: admin@targetcorp.com", color: "#3FB950" },
  { id: 8, ts: "14:21:30", agent: "VALID-AGENT", action: "VALIDATED", desc: "SQLI-004 ORACLE CONFIRMED — severity CRITICAL", color: "#FF2A32" },
  { id: 9, ts: "14:21:22", agent: "EXEC-AGENT", action: "TOOL_RESULT", desc: "sqlmap completed: 3 injectable endpoints found", color: "#A0A0A0" },
  { id: 10, ts: "14:21:14", agent: "TEAM-MGR", action: "COMPACTION", desc: "Context at 81% — scheduling FULLCOMPACT", color: "#D29922" },
  { id: 11, ts: "14:21:08", agent: "SQLI-SPEC", action: "SPAWN", desc: "Specialist spawned, FRESH context, node SQLI-007", color: "#A0A0A0" },
  { id: 12, ts: "14:20:59", agent: "TEAM-MGR", action: "PATH_SCORE", desc: "Path RECON→AUTH→SQLI→DB-ACCESS scored 0.61", color: "#A0A0A0" },
];

const NEW_EVENTS: Omit<ActivityEntry, "id">[] = [
  { ts: "14:22:11", agent: "SQLI-SPEC", action: "PAYLOAD_SENT", desc: "Time-based blind injection payload dispatched", color: "#A0A0A0" },
  { ts: "14:22:14", agent: "EVAL-AGENT", action: "RESPONSE_PARSE", desc: "Response delta 4.2s — timing confirmed", color: "#3FB950" },
  { ts: "14:22:17", agent: "TEAM-MGR", action: "UCB_UPDATE", desc: "SQLI-007 UCB updated to 0.891 post-evidence", color: "#E31B23" },
];

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

export default function Dashboard({ onNewMission, onOpenMission }: { onNewMission?: () => void; onOpenMission?: (id: string) => void }) {
  const [activity, setActivity] = useState<ActivityEntry[]>(INITIAL_ACTIVITY);
  const nextId = useRef(INITIAL_ACTIVITY.length + 1);
  const eventQueue = useRef([...NEW_EVENTS]);
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = eventQueue.current.shift();
      if (!next) return;
      const entry: ActivityEntry = { ...next, id: nextId.current++ };
      setActivity((prev) => [entry, ...prev].slice(0, 40));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Page header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom: "1px solid #1E1E1E" }}>
        <div style={{ fontSize: 9, color: "#666666", letterSpacing: "0.22em", marginBottom: 3 }}>OPERATIONS</div>
        <div className="flex items-baseline gap-3">
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F2F2F2", letterSpacing: "0.12em" }}>COMMAND CENTER</h1>
          <span style={{ fontSize: 10, color: "#444444", letterSpacing: "0.18em" }}>AUTONOMOUS VAPT OPERATIONS</span>
        </div>
      </div>

      {/* KPI strip */}
      <div className="flex-shrink-0 grid grid-cols-6 gap-0" style={{ borderBottom: "1px solid #1E1E1E" }}>
        {[
          { label: "ACTIVE MISSIONS",    value: "03",       red: true  },
          { label: "COMPLETED MISSIONS", value: "128",      red: false },
          { label: "VALIDATED FINDINGS", value: "421",      red: true  },
          { label: "VDG NODES",          value: "8,492",    red: false },
          { label: "SUCCESS RATE",       value: "27.4%",    red: false },
          { label: "TOTAL COST",         value: "$184.22",  red: true  },
        ].map((kpi, i) => (
          <div
            key={kpi.label}
            className="flex flex-col justify-center px-5 py-4"
            style={{
              background: "#0D0D0D",
              borderRight: i < 5 ? "1px solid #1E1E1E" : "none",
            }}
          >
            <div style={{ fontSize: 8.5, color: "#444444", letterSpacing: "0.2em", marginBottom: 6 }}>{kpi.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: kpi.red ? "#E31B23" : "#F2F2F2", letterSpacing: "0.04em", lineHeight: 1 }}>{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Body: table + live feed */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {/* Active missions table */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{ borderRight: "1px solid #1E1E1E" }}>
          <div className="flex items-center justify-between px-6 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #1E1E1E" }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#A0A0A0", letterSpacing: "0.16em" }}>ACTIVE MISSIONS</span>
            <button
              onClick={onNewMission}
              style={{ fontSize: 9, color: "#E31B23", background: "transparent", border: "1px solid #6F171B", borderRadius: 2, padding: "2px 8px", letterSpacing: "0.14em", cursor: "pointer", fontFamily: "inherit" }}
            >+ NEW MISSION</button>
          </div>
          <div className="overflow-auto flex-1">
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#111111" }}>
                  {["MISSION", "TARGET", "SURFACE", "MODE", "STATUS", "NODES", "FINDINGS", "COST"].map((h) => (
                    <th key={h} style={{ padding: "6px 16px", textAlign: "left", fontSize: 8.5, color: "#444444", letterSpacing: "0.18em", fontWeight: 600, borderBottom: "1px solid #1E1E1E", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MISSIONS.map((m, i) => (
                  <tr
                    key={m.id}
                    style={{ borderBottom: "1px solid #191919", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#131313")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live activity feed */}
        <div className="flex flex-col flex-shrink-0 overflow-hidden" style={{ width: 340 }}>
          <div className="flex items-center gap-2 px-4 py-3 flex-shrink-0" style={{ borderBottom: "1px solid #1E1E1E" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF2A32", animation: "pulse 1.4s ease-in-out infinite", flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: "#A0A0A0", letterSpacing: "0.16em" }}>LIVE ACTIVITY</span>
          </div>
          <div ref={feedRef} className="flex-1 overflow-y-auto" style={{ padding: "8px 0" }}>
            {activity.map((entry) => (
              <div
                key={entry.id}
                className="px-4 py-2"
                style={{ borderBottom: "1px solid #111111" }}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span style={{ fontSize: 9, color: "#444444", flexShrink: 0, letterSpacing: "0.06em" }}>{entry.ts}</span>
                  <span style={{ fontSize: 9, color: "#E31B23", letterSpacing: "0.1em", fontWeight: 600 }}>{entry.agent}</span>
                  <span style={{ fontSize: 9, color: "#333333", letterSpacing: "0.1em" }}>·</span>
                  <span style={{ fontSize: 9, color: "#555555", letterSpacing: "0.1em" }}>{entry.action}</span>
                </div>
                <div style={{ fontSize: 10, color: entry.color, letterSpacing: "0.02em", lineHeight: 1.4, paddingLeft: 0 }}>{entry.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
