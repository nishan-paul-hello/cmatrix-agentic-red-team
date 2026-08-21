import { useState, useEffect } from "react";

/* ── UCB data ── */
interface VDGEntry {
  id: string;
  type: string;
  status: "ELIGIBLE" | "IN_PROGRESS" | "EXPLOITED" | "BLOCKED" | "DEPRIORITIZED";
  ucb: number;
  exploit: number;
  explore: number;
  visits: number;
  eord: number;
  cost: string;
  specialist: string | null;
}
const VDG: VDGEntry[] = [{
  id: "SQLI-001",
  type: "SQL INJECTION",
  status: "IN_PROGRESS",
  ucb: 0.891,
  exploit: 0.712,
  explore: 0.179,
  visits: 4,
  eord: 4,
  cost: "$0.084",
  specialist: "INJECT-SPEC"
}, {
  id: "AUTH-001",
  type: "AUTH BYPASS",
  status: "EXPLOITED",
  ucb: 0.000,
  exploit: 0.910,
  explore: 0.000,
  visits: 9,
  eord: 5,
  cost: "$0.054",
  specialist: null
}, {
  id: "IDOR-008",
  type: "ACCESS CONTROL",
  status: "EXPLOITED",
  ucb: 0.000,
  exploit: 0.780,
  explore: 0.000,
  visits: 3,
  eord: 4,
  cost: "$0.019",
  specialist: null
}, {
  id: "DB-ACCESS-002",
  type: "DATABASE ACCESS",
  status: "ELIGIBLE",
  ucb: 0.762,
  exploit: 0.680,
  explore: 0.082,
  visits: 0,
  eord: 0,
  cost: "—",
  specialist: null
}, {
  id: "RCE-007",
  type: "REMOTE CODE EXEC",
  status: "ELIGIBLE",
  ucb: 0.721,
  exploit: 0.640,
  explore: 0.081,
  visits: 0,
  eord: 0,
  cost: "—",
  specialist: null
}, {
  id: "XSS-002",
  type: "CROSS SITE SCRIPTING",
  status: "ELIGIBLE",
  ucb: 0.644,
  exploit: 0.520,
  explore: 0.124,
  visits: 1,
  eord: 2,
  cost: "$0.008",
  specialist: null
}, {
  id: "CSRF-003",
  type: "CSRF",
  status: "ELIGIBLE",
  ucb: 0.598,
  exploit: 0.490,
  explore: 0.108,
  visits: 1,
  eord: 2,
  cost: "$0.006",
  specialist: null
}, {
  id: "PATH-005",
  type: "PATH TRAVERSAL",
  status: "DEPRIORITIZED",
  ucb: 0.312,
  exploit: 0.310,
  explore: 0.002,
  visits: 2,
  eord: 1,
  cost: "$0.004",
  specialist: null
}, {
  id: "XXE-009",
  type: "XXE INJECTION",
  status: "BLOCKED",
  ucb: 0.000,
  exploit: 0.210,
  explore: 0.000,
  visits: 0,
  eord: 0,
  cost: "—",
  specialist: null
}];
const SPECIALISTS = [{
  id: "S-01",
  role: "RECON-SPEC",
  status: "COMPLETED",
  task: "recon_target()",
  node: "RECON-001",
  score: 0.940
}, {
  id: "S-02",
  role: "AUTH-SPEC",
  status: "COMPLETED",
  task: "exploit_auth()",
  node: "AUTH-001",
  score: 0.910
}, {
  id: "S-03",
  role: "INJECT-SPEC",
  status: "RUNNING",
  task: "sqli_blind_time()",
  node: "SQLI-001",
  score: 0.891
}, {
  id: "S-04",
  role: "VALID-AGENT",
  status: "WAITING",
  task: "oracle_test(AUTH-001)",
  node: "SQLI-001",
  score: 0.762
}, {
  id: "S-05",
  role: "NETWORK-SPEC",
  status: "IDLE",
  task: "—",
  node: "—",
  score: 0.000
}];
const SCHED = [{
  step: "NEXT",
  node: "DB-ACCESS-002",
  ucb: 0.762,
  eta: "~2min",
  reason: "SQLI-001 EXPLOITED → dependency unlocked"
}, {
  step: "QUEUED",
  node: "RCE-007",
  ucb: 0.721,
  eta: "~5min",
  reason: "Depends on DB-ACCESS-002"
}, {
  step: "QUEUED",
  node: "XSS-002",
  ucb: 0.644,
  eta: "~7min",
  reason: "Parallel — no dependency"
}];
const STATUS_C: Record<VDGEntry["status"], string> = {
  ELIGIBLE: "var(--color-hex-e31b23)",
  IN_PROGRESS: "var(--color-hex-ff2a32)",
  EXPLOITED: "var(--color-hex-3fb950)",
  BLOCKED: "var(--color-hex-333333)",
  DEPRIORITIZED: "var(--color-hex-555555)"
};
const SPEC_C: Record<string, string> = {
  COMPLETED: "var(--color-hex-3fb950)",
  RUNNING: "var(--color-hex-ff2a32)",
  WAITING: "var(--color-hex-d29922)",
  IDLE: "var(--color-hex-333333)"
};
export default function TeamManagerDashboard() {
  const [ucbEntry, setUcbEntry] = useState<VDGEntry | null>(null);
  return <div className="flex flex-col h-full min-h-[0px]">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{
      borderBottom: "1px solid var(--color-hex-1e1e1e)"
    }}>
        <div className="text-[9px] text-[var(--color-hex-666666)] tracking-[0.22em] mb-[3px]">MISSION / CVE-001</div>
        <div className="flex items-baseline justify-between">
          <h1 className="text-[20px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.12em]">TEAM MANAGER</h1>
          <div className="flex items-center gap-6">
            <KPI label="ACTIVE SPECIALISTS" value="1" />
            <KPI label="VDG ELIGIBLE" value={String(VDG.filter(v => v.status === "ELIGIBLE").length)} red />
            <KPI label="TOTAL COST" value="$1.42" />
            <KPI label="RUNTIME" value="00:19:04" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden min-h-[0px]">
        {/* LEFT: VDG scoring table */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{
        borderRight: "1px solid var(--color-hex-1e1e1e)"
      }}>
          <div className="text-[8px] text-[var(--color-hex-444444)] tracking-[0.2em] bg-[var(--color-hex-0a0a0a)] shrink-0" style={{
          padding: "10px 20px 8px",
          borderBottom: "1px solid var(--color-hex-111111)"
        }}>VDG SCORING — UCB POLICY</div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--color-hex-0f0f0f)] sticky top-0">
                  {["NODE", "TYPE", "STATUS", "UCB ↓", "EXPLOIT", "EXPLORE", "VISITS", "E_ORD", "COST"].map(h => <th key={h} className="py-[5px] px-[12px] text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.16em] font-semibold whitespace-nowrap" style={{
                  textAlign: h === "UCB ↓" || h === "EXPLOIT" || h === "EXPLORE" || h === "VISITS" || h === "E_ORD" ? "right" : "left",
                  borderBottom: "1px solid var(--color-hex-1a1a1a)"
                }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {VDG.sort((a, b) => b.ucb - a.ucb).map((v, i) => <tr key={v.id} onClick={() => setUcbEntry(v)} className="cursor-pointer" style={{
                borderBottom: "1px solid var(--color-hex-111111)",
                opacity: v.status === "BLOCKED" ? 0.4 : 1
              }} onMouseEnter={e => e.currentTarget.style.background = "var(--color-hex-0d0d0d)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td className="py-[7px] px-[12px] text-[var(--color-hex-e31b23)] font-bold text-[9.5px] tracking-[0.06em]">{v.id}</td>
                    <td className="py-[7px] px-[12px] text-[var(--color-hex-555555)] text-[9px]">{v.type}</td>
                    <td className="py-[7px] px-[12px]"><span className="text-[8.5px] tracking-[0.1em] font-semibold" style={{
                    color: STATUS_C[v.status]
                  }}>{v.status}</span></td>
                    <td className="py-[7px] px-[12px] text-right">
                      <span className="text-[10px] font-bold" style={{
                    color: v.ucb > 0.8 ? "var(--color-hex-ff2a32)" : v.ucb > 0.6 ? "var(--color-hex-e31b23)" : v.ucb > 0 ? "var(--color-hex-a0a0a0)" : "var(--color-hex-333333)"
                  }}>{v.ucb > 0 ? v.ucb.toFixed(3) : "—"}</span>
                    </td>
                    <td className="py-[7px] px-[12px] text-right text-[9px] text-[var(--color-hex-555555)]">{v.exploit > 0 ? v.exploit.toFixed(3) : "—"}</td>
                    <td className="py-[7px] px-[12px] text-right text-[9px] text-[var(--color-hex-3fb950)]">{v.explore > 0 ? v.explore.toFixed(3) : "—"}</td>
                    <td className="py-[7px] px-[12px] text-right text-[9px] text-[var(--color-hex-444444)]">{v.visits}</td>
                    <td className="py-[7px] px-[12px] text-right text-[9px]" style={{
                  color: v.eord >= 4 ? "var(--color-hex-3fb950)" : v.eord >= 2 ? "var(--color-hex-d29922)" : "var(--color-hex-444444)"
                }}>{v.eord}/5</td>
                    <td className="py-[7px] px-[12px] text-right text-[9px] text-[var(--color-hex-444444)]">{v.cost}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: specialists + schedule */}
        <div className="flex flex-col flex-shrink-0 overflow-y-auto w-[280px]">
          {/* Specialists */}
          <div className="text-[8px] text-[var(--color-hex-444444)] tracking-[0.2em] bg-[var(--color-hex-0a0a0a)]" style={{
          padding: "10px 16px 8px",
          borderBottom: "1px solid var(--color-hex-111111)"
        }}>SPECIALIST STATUS</div>
          {SPECIALISTS.map(s => <div key={s.id} className="py-[10px] px-[16px]" style={{
          borderBottom: "1px solid var(--color-hex-111111)"
        }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-[6px] h-[6px] shrink-0" style={{
              borderRadius: "50%",
              background: SPEC_C[s.status] ?? "var(--color-hex-333333)"
            }} />
                <span className="text-[10px] font-bold text-[var(--color-hex-a0a0a0)] tracking-[0.06em] flex-1">{s.role}</span>
                <span className="text-[8px] tracking-[0.1em] font-semibold" style={{
              color: SPEC_C[s.status] ?? "var(--color-hex-333333)"
            }}>{s.status}</span>
              </div>
              <div className="text-[8.5px] text-[var(--color-hex-333333)] tracking-[0.06em] mb-[1px]">{s.task}</div>
              {s.score > 0 && <div className="text-[8px] text-[var(--color-hex-e31b23)] tracking-[0.1em]">UCB={s.score.toFixed(3)}</div>}
            </div>)}
          {/* Schedule */}
          <div className="text-[8px] text-[var(--color-hex-444444)] tracking-[0.2em] bg-[var(--color-hex-0a0a0a)]" style={{
          padding: "10px 16px 8px",
          borderBottom: "1px solid var(--color-hex-111111)",
          borderTop: "1px solid var(--color-hex-1e1e1e)"
        }}>NEXT SCHEDULED</div>
          {SCHED.map((s, i) => <div key={i} className="py-[10px] px-[16px]" style={{
          borderBottom: "1px solid var(--color-hex-111111)"
        }}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[8px] tracking-[0.14em] font-bold min-w-[48px]" style={{
              color: i === 0 ? "var(--color-hex-d29922)" : "var(--color-hex-333333)"
            }}>{s.step}</span>
                <span className="text-[10px] text-[var(--color-hex-e31b23)] font-bold tracking-[0.06em]">{s.node}</span>
                <span className="text-[9px] text-[var(--color-hex-3fb950)] ml-auto font-bold">{s.ucb.toFixed(3)}</span>
              </div>
              <div className="text-[8px] text-[var(--color-hex-333333)] tracking-[0.06em] leading-[1.5]">{s.reason}</div>
            </div>)}
        </div>
      </div>

      {ucbEntry && <UCBModal entry={ucbEntry} onClose={() => setUcbEntry(null)} />}
    </div>;
}

/* ── screen 37: UCB BREAKDOWN MODAL ── */
function UCBModal({
  entry,
  onClose
}: {
  entry: VDGEntry;
  onClose: () => void;
}) {
  // F10: ESC key closes modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const BAR_W = 280;
  const epss = 0.42;
  const bars = [{
    label: "EXPLOIT TERM",
    value: entry.exploit,
    color: "var(--color-hex-e31b23)",
    desc: "Q(s,a) — average reward from past attempts"
  }, {
    label: "EXPLORE TERM",
    value: entry.explore,
    color: "var(--color-hex-3fb950)",
    desc: "c × √(ln N / n) — exploration bonus"
  }, {
    label: "EPSS PRIOR",
    value: epss,
    color: "var(--color-hex-d29922)",
    desc: "λ × EPSS score — initial exploitability prior from NVD/FIRST API"
  }, {
    label: "UCB SCORE",
    value: entry.ucb,
    color: "var(--color-hex-ff2a32)",
    desc: "Combined final selection score"
  }];
  const C = 0.4;
  const N = VDG.reduce((s, v) => s + v.visits, 0);
  const n = entry.visits;
  return <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-hex-00000099)]" style={{
    zIndex: 60
  }} onClick={onClose}>
      <div className="w-[540px] bg-[var(--color-hex-0d0d0d)] border-[1px] border-solid border-[var(--color-hex-292929)] rounded-[2px]" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start px-5 pt-4 pb-3" style={{
        borderBottom: "1px solid var(--color-hex-1e1e1e)"
      }}>
          <div>
            <div className="text-[14px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.1em] mb-[2px]">UCB BREAKDOWN</div>
            <div className="text-[9px] text-[var(--color-hex-e31b23)] tracking-[0.1em]">{entry.id} — {entry.type}</div>
          </div>
          <button onClick={onClose} className="text-[var(--color-hex-444444)] bg-[transparent] border-none cursor-pointer text-[16px]">✕</button>
        </div>
        <div className="px-5 py-5">
          {/* Formula */}
          <div className="bg-[var(--color-hex-080808)] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] rounded-[2px] py-[12px] px-[16px] mb-[20px] text-center">
            <div className="text-[11px] text-[var(--color-hex-555555)] tracking-[0.08em] mb-[6px]">UCB FORMULA</div>
            <div className="text-[13px] text-[var(--color-hex-a0a0a0)] tracking-[0.06em]">
              UCB(s) = <span className="text-[var(--color-hex-e31b23)]">Q(s,a)</span> + <span className="text-[var(--color-hex-3fb950)]">c × √(ln N / n)</span>
            </div>
            <div className="text-[9px] text-[var(--color-hex-333333)] mt-[8px] tracking-[0.08em]">
              c={C} · N={N} total visits · n={n === 0 ? "0 (new node)" : n} visits · ln(N)={Math.log(N || 1).toFixed(3)}
            </div>
            {/* G1: c constant note */}
            <div className="text-[8px] text-[var(--color-hex-333333)] mt-[6px] tracking-[0.1em]">UCB POLICY c = {C.toFixed(2)} — configurable in Settings → VDG</div>
          </div>
          {/* Score bars */}
          {bars.map(b => <div key={b.label} className="mb-[16px]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-[9px] text-[var(--color-hex-444444)] tracking-[0.18em] font-semibold">{b.label}</span>
                  <div className="text-[8.5px] text-[var(--color-hex-333333)] mt-[2px]">{b.desc}</div>
                </div>
                <span className="text-[16px] font-bold" style={{
              color: b.color
            }}>{b.value.toFixed(3)}</span>
              </div>
              <div className="h-[5px] bg-[var(--color-hex-1a1a1a)] rounded-[2px] overflow-hidden">
                <div className="h-full rounded-[2px]" style={{
              width: `${b.value * 100}%`,
              background: b.color
            }} />
              </div>
            </div>)}
          {/* G3: EPSS ONE-DAY mode footnote */}
          <div className="text-[8px] text-[var(--color-hex-333333)] tracking-[0.1em] mt-[6px]">ONE-DAY mode: Q(s,a) seeded from EPSS prior</div>
          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-0 mt-4 border-[1px] border-solid border-[var(--color-hex-1e1e1e)] rounded-[2px] overflow-hidden">
            {[{
            k: "E_ORD",
            v: `${entry.eord}/5`
          }, {
            k: "VISITS",
            v: String(entry.visits)
          }, {
            k: "STATUS",
            v: entry.status
          }, {
            k: "COST",
            v: entry.cost
          }].map((m, i, a) => <div key={m.k} className="py-[10px] px-[12px] bg-[var(--color-hex-0b0b0b)]" style={{
            borderRight: i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none"
          }}>
                <div className="text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.18em] mb-[4px]">{m.k}</div>
                <div className="text-[13px] font-bold" style={{
              color: m.k === "STATUS" ? STATUS_C[entry.status] : "var(--color-hex-f2f2f2)"
            }}>{m.v}</div>
              </div>)}
          </div>
        </div>
      </div>
    </div>;
}
function KPI({
  label,
  value,
  red
}: {
  label: string;
  value: string;
  red?: boolean;
}) {
  return <div className="flex flex-col items-end">
      <div className="text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.18em] mb-[2px]">{label}</div>
      <div className="text-[14px] font-bold" style={{
      color: red ? "var(--color-hex-e31b23)" : "var(--color-hex-f2f2f2)"
    }}>{value}</div>
    </div>;
}