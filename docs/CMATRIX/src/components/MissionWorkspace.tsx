import { useEffect, useRef, useState } from "react";
import AttackGraphCanvas from "./AttackGraphCanvas";
import EnvironmentalLayer from "./EnvironmentalLayer";
import Specialists from "./Specialists";
import ExecutionConsole from "./ExecutionConsole";
import EvaluationScreen from "./EvaluationScreen";
import ValidationCenter from "./ValidationCenter";
import FindingsDashboard from "./FindingsDashboard";
import MemoryPage from "./MemoryPage";
import TrajectoryPage from "./TrajectoryPage";
import CostDashboard from "./CostDashboard";
import TeamManagerDashboard from "./TeamManagerDashboard";
import HumanEscalation from "./HumanEscalation";

/* ── Types ─────────────────────────────────────────────── */
type MissionSubNav =
  | "overview" | "attack-graph" | "environment" | "specialists"
  | "execution" | "evaluation" | "findings" | "validation" | "memory" | "trajectory" | "cost" | "team-manager" | "escalation";

type NodeStatus = "COMPLETED" | "EXPLOITED" | "ELIGIBLE" | "IN_PROGRESS" | "DEPENDENT" | "INFEASIBLE";

interface VDGNode {
  id: string; type: string; status: NodeStatus;
  ucb?: number; eord?: number; eordMax?: number;
  x: number; y: number;
}

interface LogEntry {
  id: number; ts: string; agent: string; action: string; desc: string; color: string;
}

interface Specialist {
  id: string; role: string; status: "RUNNING" | "IDLE" | "WAITING" | "COMPLETED" | "VALIDATING";
  task: string; context: string; evidence: number;
}

/* ── Static data ────────────────────────────────────────── */
const VDG_NODES: VDGNode[] = [
  { id: "RECON-001",    type: "RECONNAISSANCE", status: "COMPLETED",  x: 0, y: 0 },
  { id: "AUTH-001",     type: "AUTHENTICATION", status: "EXPLOITED",  x: 0, y: 1 },
  { id: "SQLI-001",     type: "SQL INJECTION",  status: "ELIGIBLE",   ucb: 0.824, eord: 3, eordMax: 5, x: 0, y: 2 },
  { id: "DB-ACCESS-002",type: "DATABASE ACCESS",status: "DEPENDENT",  x: 0, y: 3 },
];

const SPECIALISTS: Specialist[] = [
  { id: "S-01", role: "RECON SPECIALIST",     status: "COMPLETED",  task: "recon_target()",         context: "COMPACTED",      evidence: 34 },
  { id: "S-02", role: "AUTH SPECIALIST",      status: "COMPLETED",  task: "exploit_auth()",         context: "COMPACTED",      evidence: 12 },
  { id: "S-03", role: "INJECTION SPECIALIST", status: "RUNNING",    task: "sqli_blind_time()",      context: "FRESH",          evidence: 7  },
  { id: "S-04", role: "VALIDATION AGENT",     status: "VALIDATING", task: "oracle_test(AUTH-001)",  context: "FRESH",          evidence: 4  },
  { id: "S-05", role: "LOGIC SPECIALIST",     status: "IDLE",       task: "—",                      context: "—",              evidence: 0  },
];

const INITIAL_LOG: LogEntry[] = [
  { id: 12, ts: "06:31:04", agent: "TEAM-MGR",    action: "UCB_SELECT",       desc: "SQLI-001 selected — UCB 0.824, path 0.612, E_ord 3/5", color: "#E31B23" },
  { id: 11, ts: "06:30:58", agent: "INJECT-SPEC",  action: "TOOL_CALL",        desc: "sqlmap --time-sec=4 --technique=T -u /api/users", color: "#A0A0A0" },
  { id: 10, ts: "06:30:51", agent: "VALID-AGENT",  action: "ORACLE_PASS",      desc: "AUTH-001 oracle confirmed — CVE-BENCH PASS", color: "#3FB950" },
  { id: 9,  ts: "06:30:44", agent: "EVAL-AGENT",   action: "E_ORD_UPDATE",     desc: "AUTH-001 evidence raised E_ord 3 → 4 (CONFIRMED)", color: "#3FB950" },
  { id: 8,  ts: "06:30:39", agent: "INJECT-SPEC",  action: "PAYLOAD_SENT",     desc: "Time-based blind payload dispatched — 4.2s delta observed", color: "#A0A0A0" },
  { id: 7,  ts: "06:30:31", agent: "TEAM-MGR",     action: "EL_SNAPSHOT",      desc: "Environmental Layer snapshot: 87 confirmed facts", color: "#A0A0A0" },
  { id: 6,  ts: "06:30:22", agent: "AUTH-SPEC",    action: "CREDENTIAL_FOUND", desc: "admin@targetcorp.com extracted from /api/auth", color: "#3FB950" },
  { id: 5,  ts: "06:30:14", agent: "TEAM-MGR",     action: "PATH_SCORE",       desc: "RECON→AUTH→SQLI→DB-ACCESS path scored 0.612", color: "#A0A0A0" },
  { id: 4,  ts: "06:30:07", agent: "INJECT-SPEC",  action: "SPAWN",            desc: "INJECTION SPECIALIST spawned — FRESH context, node SQLI-001", color: "#666666" },
  { id: 3,  ts: "06:29:58", agent: "EVAL-AGENT",   action: "E_ORD_UPDATE",     desc: "AUTH-001 evidence raised E_ord 2 → 3 (WEAK → CLEAR)", color: "#A0A0A0" },
  { id: 2,  ts: "06:29:49", agent: "AUTH-SPEC",    action: "EXPLOIT_ATTEMPT",  desc: "Credential stuffing /api/login — 200 OK, session token returned", color: "#A0A0A0" },
  { id: 1,  ts: "06:29:40", agent: "RECON-SPEC",   action: "TOOL_RESULT",      desc: "nmap complete: 3 open ports, 14 endpoints enumerated", color: "#666666" },
];

const SUB_NAV: { id: MissionSubNav; label: string }[] = [
  { id: "overview",      label: "Overview"     },
  { id: "attack-graph",  label: "Attack Graph" },
  { id: "environment",   label: "Environment"  },
  { id: "specialists",   label: "Specialists"  },
  { id: "execution",     label: "Execution"    },
  { id: "evaluation",    label: "Evaluation"   },
  { id: "findings",      label: "Findings"     },
  { id: "validation",    label: "Validation"   },
  { id: "memory",        label: "Memory"       },
  { id: "trajectory",    label: "Trajectory"   },
  { id: "cost",          label: "Cost"         },
  { id: "team-manager",  label: "Team Manager" },
  { id: "escalation",    label: "Escalation" },
];

const STREAM_EVENTS: Omit<LogEntry, "id">[] = [
  { ts: "06:31:09", agent: "INJECT-SPEC",  action: "RESPONSE_PARSE", desc: "Response time 4.18s — timing injection confirmed", color: "#3FB950" },
  { ts: "06:31:14", agent: "TEAM-MGR",     action: "UCB_UPDATE",     desc: "SQLI-001 UCB raised to 0.891 post-evidence", color: "#E31B23" },
  { ts: "06:31:19", agent: "EVAL-AGENT",   action: "E_ORD_UPDATE",   desc: "SQLI-001 evidence raised E_ord 3 → 4 (CONFIRMED)", color: "#3FB950" },
];

/* ── Node status styles ─────────────────────────────────── */
function nodeStyle(status: NodeStatus): { border: string; bg: string; labelColor: string; typeColor: string } {
  switch (status) {
    case "COMPLETED":   return { border: "#333333", bg: "#0F0F0F", labelColor: "#555555", typeColor: "#333333" };
    case "EXPLOITED":   return { border: "#9E1118", bg: "#150608", labelColor: "#E31B23", typeColor: "#6F171B" };
    case "ELIGIBLE":    return { border: "#E31B23", bg: "#120608", labelColor: "#FF2A32", typeColor: "#9E1118" };
    case "IN_PROGRESS": return { border: "#FF2A32", bg: "#180A0B", labelColor: "#FF2A32", typeColor: "#9E1118" };
    case "DEPENDENT":   return { border: "#222222", bg: "#0B0B0B", labelColor: "#333333", typeColor: "#222222" };
    case "INFEASIBLE":  return { border: "#1E1E1E", bg: "#0A0A0A", labelColor: "#2A2A2A", typeColor: "#1E1E1E" };
  }
}

function statusBadge(status: NodeStatus) {
  const map: Record<NodeStatus, { color: string; bg: string }> = {
    COMPLETED:   { color: "#555555", bg: "transparent" },
    EXPLOITED:   { color: "#E31B23", bg: "#1A0608"     },
    ELIGIBLE:    { color: "#FF2A32", bg: "#1A0608"     },
    IN_PROGRESS: { color: "#FF2A32", bg: "#1A0608"     },
    DEPENDENT:   { color: "#333333", bg: "transparent" },
    INFEASIBLE:  { color: "#2A2A2A", bg: "transparent" },
  };
  return map[status];
}

function specialistStatusDot(status: Specialist["status"]): string {
  return { RUNNING: "#E31B23", IDLE: "#333333", WAITING: "#D29922", COMPLETED: "#3FB950", VALIDATING: "#FF2A32" }[status];
}

/* ── Specialist status badge ────────────────────────────── */
function SpecBadge({ status }: { status: Specialist["status"] }) {
  const color = specialistStatusDot(status);
  return (
    <span style={{ fontSize: 8.5, color, letterSpacing: "0.12em" }}>{status}</span>
  );
}

/* ── Elapsed timer ──────────────────────────────────────── */
function useElapsed(start: number) {
  const [elapsed, setElapsed] = useState(start);
  useEffect(() => {
    const iv = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(iv);
  }, []);
  const m = Math.floor(elapsed / 60).toString().padStart(2, "0");
  const s = (elapsed % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

/* ── Main component ─────────────────────────────────────── */
export default function MissionWorkspace({ missionId = "CVE-001" }: { missionId?: string }) {
  const [subNav, setSubNav] = useState<MissionSubNav>("overview");
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);
  const [paused, setPaused] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const nextId = useRef(INITIAL_LOG.length + 1);
  const queue = useRef([...STREAM_EVENTS]);
  const time = useElapsed(0);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const iv = setInterval(() => {
      if (pausedRef.current) return;
      const next = queue.current.shift();
      if (!next) return;
      setLog((prev) => [{ ...next, id: nextId.current++ }, ...prev].slice(0, 60));
    }, 3200);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* ── Mission status strip ── */}
      <div className="flex-shrink-0" style={{ background: "#0B0B0B", borderBottom: "1px solid #1E1E1E" }}>
        {/* Identity row */}
        <div className="flex items-center gap-6 px-4 py-2" style={{ borderBottom: "1px solid #151515" }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 9, color: "#444444", letterSpacing: "0.2em" }}>MISSION</span>
            <span style={{ fontSize: 9, color: "#E31B23", letterSpacing: "0.16em", fontWeight: 700 }}>{missionId}</span>
          </div>
          <Sep />
          <Meta label="TARGET" value="app.targetcorp.com" />
          <Meta label="MODE" value="ONE-DAY" />
          <Meta label="SURFACE" value="WEB APPLICATION" />
          <Sep />
          <div className="flex items-center gap-1.5 ml-auto">
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3FB950", animation: "pulse 1.4s ease infinite" }} />
            <span style={{ fontSize: 9, color: "#3FB950", letterSpacing: "0.16em", fontWeight: 600 }}>RUNNING</span>
          </div>
        </div>
        {/* Metrics row */}
        <div className="flex items-center gap-0">
          {[
            { label: "VDG NODES", value: "12"    },
            { label: "EL FACTS",  value: "87"    },
            { label: "FINDINGS",  value: "07", red: true },
            { label: "COST",      value: "$1.42", red: true },
            { label: "TIME",      value: time     },
          ].map((m, i) => (
            <div key={m.label} className="flex items-center gap-2 px-4 py-1.5" style={{ borderRight: "1px solid #151515" }}>
              <span style={{ fontSize: 8, color: "#444444", letterSpacing: "0.2em" }}>{m.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: m.red ? "#E31B23" : "#A0A0A0", letterSpacing: "0.06em" }}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Three-column workspace ── */}
      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>

        {/* LEFT: mission sub-nav */}
        <div
          className="flex flex-col flex-shrink-0 overflow-y-auto"
          style={{ width: 168, background: "#0B0B0B", borderRight: "1px solid #1E1E1E" }}
        >
          <div className="py-2 flex-1">
            {SUB_NAV.map((item) => {
              const active = subNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSubNav(item.id)}
                  className="w-full flex items-center text-left px-4 py-2"
                  style={{
                    background: active ? "#160809" : "transparent",
                    borderLeft: active ? "2px solid #E31B23" : "2px solid transparent",
                    color: active ? "#F2F2F2" : "#555555",
                    fontSize: 10.5,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "#888888"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "#555555"; }}
                >
                  {item.id === "findings" ? (
                    <span className="flex items-center gap-1.5">
                      {item.label}
                      <span style={{ fontSize: 8, color: "#E31B23", background: "#1A0608", border: "1px solid #6F171B", borderRadius: 2, padding: "0 4px", letterSpacing: "0.1em" }}>7</span>
                    </span>
                  ) : item.id === "escalation" ? (
                    <span className="flex items-center gap-1.5">
                      {item.label}
                      <span style={{ fontSize: 8, color: "#FF2A32", background: "#1A0608", border: "1px solid #FF2A3266", borderRadius: 2, padding: "0 4px", letterSpacing: "0.1em" }}>!</span>
                    </span>
                  ) : item.label}
                </button>
              );
            })}
          </div>

          {/* PAUSE / TERMINATE */}
          <div className="flex flex-col gap-2 p-3" style={{ borderTop: "1px solid #1E1E1E" }}>
            <button
              className="w-full"
              onClick={() => setPaused(p => !p)}
              style={{ background: "#111111", border: `1px solid ${paused ? "#D29922" : "#333333"}`, borderRadius: 2, color: paused ? "#D29922" : "#D29922", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.16em", padding: "7px 0", cursor: "pointer", fontFamily: "inherit" }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = "#D29922"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = paused ? "#D29922" : "#333333"}
            >
              {paused ? "▶ RESUME" : "⏸ PAUSE"}
            </button>
            <button
              className="w-full"
              onClick={() => { setPaused(true); setTerminated(true); }}
              disabled={terminated}
              style={{ background: terminated ? "#0D0808" : "#110808", border: `1px solid ${terminated ? "#333333" : "#6F171B"}`, borderRadius: 2, color: terminated ? "#555555" : "#E31B23", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.16em", padding: "7px 0", cursor: terminated ? "not-allowed" : "pointer", fontFamily: "inherit" }}
              onMouseEnter={(e) => { if (!terminated) { e.currentTarget.style.background = "#1A0A0B"; e.currentTarget.style.borderColor = "#E31B23"; } }}
              onMouseLeave={(e) => { if (!terminated) { e.currentTarget.style.background = "#110808"; e.currentTarget.style.borderColor = "#6F171B"; } }}
            >
              {terminated ? "— TERMINATED" : "✕ TERMINATE"}
            </button>
          </div>
        </div>

        {/* CENTER: overview split or full-bleed graph */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {subNav === "attack-graph"  && <AttackGraphCanvas />}
        {subNav === "environment"   && <EnvironmentalLayer />}
        {subNav === "specialists"   && <Specialists />}
        {subNav === "execution"     && <ExecutionConsole />}
        {subNav === "evaluation"    && <EvaluationScreen />}
        {subNav === "validation"    && <ValidationCenter />}
        {subNav === "findings"      && <FindingsDashboard />}
        {subNav === "memory"        && <MemoryPage />}
        {subNav === "trajectory"    && <TrajectoryPage />}
        {subNav === "cost"          && <CostDashboard />}
        {subNav === "team-manager"  && <TeamManagerDashboard />}
        {subNav === "escalation"    && <HumanEscalation />}
        {subNav !== "attack-graph" && subNav !== "environment" && subNav !== "specialists" && subNav !== "execution" && subNav !== "evaluation" && subNav !== "validation" && subNav !== "findings" && subNav !== "memory" && subNav !== "trajectory" && subNav !== "cost" && subNav !== "team-manager" && subNav !== "escalation" && <>

          {/* CENTER TOP: attack graph canvas */}
          <div
            className="flex-shrink-0 relative overflow-hidden"
            style={{ height: "54%", borderBottom: "1px solid #1E1E1E", background: "#080808" }}
          >
            {/* Grid */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "linear-gradient(rgba(30,30,30,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,30,30,0.4) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }} />

            {/* Canvas label */}
            <div className="absolute top-3 left-4 flex items-center gap-2">
              <span style={{ fontSize: 8.5, color: "#333333", letterSpacing: "0.2em" }}>ATTACK GRAPH — OVERVIEW (4 OF 12 NODES)</span>
              <span style={{ fontSize: 8, color: "#1E1E1E", letterSpacing: "0.12em" }}>VDG / CVE-001</span>
            </div>

            {/* Focus path button */}
            <div className="absolute top-3 right-4">
              <button onClick={() => setSubNav("attack-graph")} style={{ fontSize: 8.5, color: "#666666", background: "#111111", border: "1px solid #292929", borderRadius: 2, padding: "3px 10px", letterSpacing: "0.14em", cursor: "pointer", fontFamily: "inherit" }}>
                FOCUS HIGHEST-SCORE PATH
              </button>
            </div>

            {/* Node chain — centered */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center" style={{ gap: 0 }}>
                {VDG_NODES.map((node, i) => {
                  const s = nodeStyle(node.status);
                  const badge = statusBadge(node.status);
                  return (
                    <div key={node.id} className="flex flex-col items-center">
                      {/* Connector from previous */}
                      {i > 0 && (
                        <div style={{ width: 1, height: 20, background: node.status === "DEPENDENT" ? "#222222" : "#E31B23", opacity: node.status === "DEPENDENT" ? 0.4 : 1 }}>
                          {/* arrow tip */}
                        </div>
                      )}
                      {/* Arrow tip */}
                      {i > 0 && (
                        <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: `5px solid ${node.status === "DEPENDENT" ? "#222222" : "#E31B23"}`, marginBottom: -1, opacity: node.status === "DEPENDENT" ? 0.4 : 1 }} />
                      )}

                      {/* Node card */}
                      <div
                        onClick={() => setSubNav("attack-graph")}
                        style={{
                          width: 224,
                          background: s.bg,
                          border: `1px solid ${s.border}`,
                          borderRadius: 2,
                          padding: "10px 12px",
                          position: "relative",
                          cursor: "pointer",
                        }}
                        title="Click to open Attack Graph"
                      >
                        {/* Active pulse ring for ELIGIBLE */}
                        {node.status === "ELIGIBLE" && (
                          <div style={{ position: "absolute", inset: -3, border: "1px solid #E31B2340", borderRadius: 3, pointerEvents: "none", animation: "nodeRing 2s ease infinite" }} />
                        )}

                        <div className="flex items-center justify-between mb-1.5">
                          <span style={{ fontSize: 10, fontWeight: 700, color: s.labelColor, letterSpacing: "0.12em" }}>{node.id}</span>
                          <span style={{ fontSize: 8, color: badge.color, background: badge.bg, border: `1px solid ${badge.color}44`, borderRadius: 2, padding: "1px 5px", letterSpacing: "0.14em", fontWeight: 600 }}>
                            {node.status}
                          </span>
                        </div>

                        <div style={{ fontSize: 8.5, color: s.typeColor, letterSpacing: "0.16em", marginBottom: node.ucb !== undefined ? 8 : 0 }}>
                          {node.type}
                        </div>

                        {node.ucb !== undefined && (
                          <div className="flex items-center gap-4" style={{ borderTop: `1px solid ${s.border}`, paddingTop: 7 }}>
                            <Stat label="UCB" value={node.ucb.toFixed(3)} color={s.labelColor} />
                            <Stat label="E_ord" value={`${node.eord}/${node.eordMax}`} color={s.labelColor} />
                            <Stat label="PATH" value="0.612" color={s.typeColor} />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <style>{`
              @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
              @keyframes nodeRing { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.1;transform:scale(1.02)} }
            `}</style>
          </div>

          {/* CENTER BOTTOM: live log stream */}
          <div className="flex flex-col flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0" style={{ borderBottom: "1px solid #1E1E1E", background: "#0D0D0D" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF2A32", animation: "pulse 1.4s ease infinite" }} />
              <span style={{ fontSize: 9.5, fontWeight: 600, color: "#666666", letterSpacing: "0.18em" }}>EXECUTION LOG</span>
              <span style={{ fontSize: 8.5, color: "#333333", marginLeft: "auto", letterSpacing: "0.1em" }}>LIVE STREAM</span>
            </div>
            <div className="flex-1 overflow-y-auto" style={{ background: "#080808" }}>
              {log.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 px-4 py-1.5" style={{ borderBottom: "1px solid #0E0E0E" }}>
                  <span style={{ fontSize: 9, color: "#333333", flexShrink: 0, letterSpacing: "0.06em", paddingTop: 1 }}>{entry.ts}</span>
                  <span style={{ fontSize: 8.5, color: "#E31B23", flexShrink: 0, letterSpacing: "0.12em", fontWeight: 600, paddingTop: 1, minWidth: 88 }}>{entry.agent}</span>
                  <span style={{ fontSize: 8.5, color: "#333333", flexShrink: 0, letterSpacing: "0.1em", paddingTop: 1, minWidth: 108 }}>{entry.action}</span>
                  <span style={{ fontSize: 9.5, color: entry.color, letterSpacing: "0.02em", lineHeight: 1.4 }}>{entry.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </>}
        </div>

        {/* RIGHT: stats + specialists — hidden in full-bleed views */}
        {!["attack-graph","environment","specialists","execution","evaluation","validation","findings","memory","trajectory","cost","team-manager","escalation"].includes(subNav) && <div
          className="flex flex-col flex-shrink-0 overflow-hidden"
          style={{ width: 256, borderLeft: "1px solid #1E1E1E", background: "#0B0B0B" }}
        >
          {/* Live state stats */}
          <div style={{ borderBottom: "1px solid #1E1E1E" }}>
            <div className="px-4 pt-4 pb-2" style={{ fontSize: 8.5, color: "#444444", letterSpacing: "0.2em" }}>LIVE STATE</div>
            <div className="grid grid-cols-2 gap-0">
              {[
                { label: "VDG NODES",  value: "12",    sub: "3 ELIGIBLE" },
                { label: "EL FACTS",   value: "87",    sub: "23 NEW"     },
                { label: "FINDINGS",   value: "07",    sub: "1 CRITICAL", red: true },
                { label: "COST",       value: "$1.42", sub: "/ $10.00 CEI", red: true },
              ].map((s, i) => (
                <div key={s.label} style={{ padding: "10px 16px", borderRight: i % 2 === 0 ? "1px solid #151515" : "none", borderBottom: i < 2 ? "1px solid #151515" : "none" }}>
                  <div style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.2em", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: s.red ? "#E31B23" : "#F2F2F2", letterSpacing: "0.04em", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 7.5, color: "#333333", letterSpacing: "0.1em", marginTop: 3 }}>{s.sub}</div>
                </div>
              ))}
            </div>
            {/* Time */}
            <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderTop: "1px solid #151515" }}>
              <div>
                <div style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.2em", marginBottom: 2 }}>ELAPSED TIME</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#A0A0A0", letterSpacing: "0.1em", lineHeight: 1 }}>{time}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <div style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.2em", marginBottom: 2 }}>STEP</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#555555", letterSpacing: "0.06em", lineHeight: 1 }}>014</div>
              </div>
            </div>
          </div>

          {/* Specialists */}
          <div className="flex flex-col flex-1 overflow-hidden" style={{ minHeight: 0 }}>
            <div className="px-4 pt-3 pb-2 flex-shrink-0 flex items-center justify-between" style={{ borderBottom: "1px solid #1E1E1E" }}>
              <span style={{ fontSize: 8.5, color: "#444444", letterSpacing: "0.2em" }}>SPECIALISTS</span>
              <span style={{ fontSize: 8, color: "#E31B23", letterSpacing: "0.12em" }}>1 RUNNING</span>
            </div>
            <div className="overflow-y-auto flex-1">
              {SPECIALISTS.map((spec) => (
                <div
                  key={spec.id}
                  className="px-4 py-3"
                  style={{ borderBottom: "1px solid #111111" }}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div style={{ width: spec.status === "IDLE" ? 6 : 6, height: 6, borderRadius: "50%", border: `1px solid ${specialistStatusDot(spec.status)}`, background: spec.status !== "IDLE" && spec.status !== "WAITING" ? specialistStatusDot(spec.status) : "transparent", flexShrink: 0 }} />
                      <span style={{ fontSize: 9.5, color: spec.status === "IDLE" ? "#444444" : "#A0A0A0", fontWeight: 600, letterSpacing: "0.08em" }}>{spec.role}</span>
                    </div>
                    <SpecBadge status={spec.status} />
                  </div>
                  <div style={{ fontSize: 8.5, color: "#333333", letterSpacing: "0.08em", marginBottom: 2 }}>
                    {spec.task !== "—" && <span style={{ color: "#555555" }}>{spec.task}</span>}
                    {spec.task === "—" && <span>—</span>}
                  </div>
                  <div className="flex items-center gap-3">
                    {spec.context !== "—" && <span style={{ fontSize: 7.5, color: "#333333", letterSpacing: "0.12em" }}>CTX: {spec.context}</span>}
                    {spec.evidence > 0 && <span style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.1em" }}>EL: {spec.evidence}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>}

      </div>
    </div>
  );
}

/* ── Tiny helpers ───────────────────────────────────────── */
function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span style={{ fontSize: 8, color: "#444444", letterSpacing: "0.18em" }}>{label}</span>
      <span style={{ fontSize: 9, color: "#A0A0A0", letterSpacing: "0.1em" }}>{value}</span>
    </div>
  );
}

function Sep() {
  return <div style={{ width: 1, height: 12, background: "#222222" }} />;
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.16em" }}>{label}</span>
      <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: "0.06em" }}>{value}</span>
    </div>
  );
}
