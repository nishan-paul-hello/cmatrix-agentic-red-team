import { useState } from "react";
type Sev = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type Tab = "OVERVIEW" | "EVIDENCE" | "ATTACK PATH" | "VALIDATION" | "TRAJECTORY";
interface Finding {
  id: string;
  type: string;
  target: string;
  severity: Sev;
  eord: number;
  status: string;
  first: string;
  validated: string;
  path: string[];
}
const DATA: Finding[] = [{
  id: "F-001",
  type: "SQL INJECTION",
  target: "/api/users?id=",
  severity: "CRITICAL",
  eord: 5,
  status: "ORACLE CONFIRMED",
  first: "06:29:58",
  validated: "06:30:42",
  path: ["RECON-001", "AUTH-001", "SQLI-001", "DB-ACCESS-002"]
}, {
  id: "F-002",
  type: "AUTHENTICATION BYPASS",
  target: "/api/auth/login",
  severity: "HIGH",
  eord: 4,
  status: "ORACLE CONFIRMED",
  first: "06:22:14",
  validated: "06:30:42",
  path: ["RECON-001", "AUTH-001"]
}, {
  id: "F-003",
  type: "IDOR",
  target: "/api/users/:id",
  severity: "HIGH",
  eord: 4,
  status: "ORACLE CONFIRMED",
  first: "06:25:33",
  validated: "06:31:01",
  path: ["RECON-001", "AUTH-001", "IDOR-008"]
}, {
  id: "F-004",
  type: "XSS REFLECTED",
  target: "/search?q=",
  severity: "MEDIUM",
  eord: 3,
  status: "PENDING",
  first: "06:28:47",
  validated: "—",
  path: ["RECON-001", "XSS-002"]
}, {
  id: "F-005",
  type: "SENSITIVE DATA EXPOSURE",
  target: "/static/config.json",
  severity: "MEDIUM",
  eord: 4,
  status: "VALIDATED",
  first: "06:16:07",
  validated: "06:28:11",
  path: ["RECON-001"]
}, {
  id: "F-006",
  type: "CSRF",
  target: "/api/users/:id",
  severity: "MEDIUM",
  eord: 2,
  status: "PENDING",
  first: "06:29:44",
  validated: "—",
  path: ["RECON-001", "AUTH-001", "CSRF-003"]
}, {
  id: "F-007",
  type: "PATH TRAVERSAL",
  target: "/api/upload",
  severity: "LOW",
  eord: 3,
  status: "PENDING",
  first: "06:30:11",
  validated: "—",
  path: ["RECON-001", "AUTH-001"]
}];
const SEV_C: Record<Sev, {
  color: string;
  bg: string;
}> = {
  CRITICAL: {
    color: "var(--color-hex-ff2a32)",
    bg: "var(--color-hex-1a0608)"
  },
  HIGH: {
    color: "var(--color-hex-e31b23)",
    bg: "var(--color-hex-150608)"
  },
  MEDIUM: {
    color: "var(--color-hex-d29922)",
    bg: "var(--color-hex-1a1200)"
  },
  LOW: {
    color: "var(--color-hex-666666)",
    bg: "var(--color-hex-111111)"
  }
};
const STATUS_C: Record<string, string> = {
  "ORACLE CONFIRMED": "var(--color-hex-ff2a32)",
  "VALIDATED": "var(--color-hex-3fb950)",
  "PENDING": "var(--color-hex-d29922)",
  "RULED OUT": "var(--color-hex-555555)"
};
export default function FindingsDashboard() {
  const [detail, setDetail] = useState<Finding | null>(null);
  return detail ? <FindingDetail f={detail} onBack={() => setDetail(null)} /> : <FindingsList onSelect={setDetail} />;
}
function FindingsList({
  onSelect
}: {
  onSelect: (f: Finding) => void;
}) {
  const counts: Record<Sev, number> = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0
  };
  DATA.forEach(f => counts[f.severity]++);
  return <div className="flex flex-col h-full min-h-[0px]">
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{
      borderBottom: "1px solid var(--color-hex-1e1e1e)"
    }}>
        <div className="text-[9px] text-[var(--color-hex-666666)] tracking-[0.22em] mb-[3px]">MISSION / CVE-001</div>
        <h1 className="text-[20px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.12em]">VALIDATED FINDINGS</h1>
      </div>
      {/* Severity KPIs */}
      <div className="flex-shrink-0 grid grid-cols-4" style={{
      borderBottom: "1px solid var(--color-hex-1e1e1e)"
    }}>
        {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as Sev[]).map((s, i) => <div key={s} className="py-[14px] px-[20px] bg-[var(--color-hex-0d0d0d)]" style={{
        borderRight: i < 3 ? "1px solid var(--color-hex-1e1e1e)" : "none"
      }}>
            <div className="text-[8px] text-[var(--color-hex-444444)] tracking-[0.2em] mb-[6px]">{s}</div>
            <div className="text-[28px] font-bold leading-[1]" style={{
          color: SEV_C[s].color
        }}>{String(counts[s]).padStart(2, "0")}</div>
          </div>)}
      </div>
      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-[10.5px]">
          <thead>
            <tr className="bg-[var(--color-hex-0f0f0f)] sticky top-0">
              {["ID", "TYPE", "TARGET", "SEVERITY", "E_ORD", "STATUS", "FIRST SEEN", "VALIDATED"].map(h => <th key={h} className="py-[6px] px-[14px] text-left text-[8px] text-[var(--color-hex-444444)] tracking-[0.16em] font-semibold whitespace-nowrap" style={{
              borderBottom: "1px solid var(--color-hex-1a1a1a)"
            }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {DATA.map(f => {
            const sc = SEV_C[f.severity],
              stc = STATUS_C[f.status] ?? "var(--color-hex-666666)";
            return <tr key={f.id} className="cursor-pointer" style={{
              borderBottom: "1px solid var(--color-hex-111111)"
            }} onClick={() => onSelect(f)} onMouseEnter={e => e.currentTarget.style.background = "var(--color-hex-0f0f0f)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <td className="py-[8px] px-[14px] text-[var(--color-hex-e31b23)] font-bold tracking-[0.08em]">{f.id}</td>
                  <td className="py-[8px] px-[14px] text-[var(--color-hex-a0a0a0)]">{f.type}</td>
                  <td className="py-[8px] px-[14px] text-[var(--color-hex-555555)] text-[9.5px]">{f.target}</td>
                  <td className="py-[8px] px-[14px]">
                    <span className="text-[9px] rounded-[2px] py-[1px] px-[5px] tracking-[0.1em] font-semibold" style={{
                  color: sc.color,
                  background: sc.bg,
                  border: `1px solid ${sc.color}33`
                }}>{f.severity}</span>
                  </td>
                  <td className="py-[8px] px-[14px] text-[var(--color-hex-666666)] text-center">{f.eord}/5</td>
                  <td className="py-[8px] px-[14px]"><span className="text-[9px] tracking-[0.1em] font-semibold" style={{
                  color: stc
                }}>{f.status}</span></td>
                  <td className="py-[8px] px-[14px] text-[var(--color-hex-444444)] text-[9px]">{f.first}</td>
                  <td className="py-[8px] px-[14px] text-[var(--color-hex-444444)] text-[9px]">{f.validated}</td>
                </tr>;
          })}
          </tbody>
        </table>
      </div>
    </div>;
}
function FindingDetail({
  f,
  onBack
}: {
  f: Finding;
  onBack: () => void;
}) {
  const [tab, setTab] = useState<Tab>("OVERVIEW");
  const [evOpen, setEvOpen] = useState(false);
  const sc = SEV_C[f.severity];
  const stc = STATUS_C[f.status] ?? "var(--color-hex-666666)";
  return <div className="flex flex-col h-full min-h-[0px]">
      <div className="flex-shrink-0 px-6 pt-5 pb-0" style={{
      borderBottom: "1px solid var(--color-hex-1e1e1e)"
    }}>
        <button onClick={onBack} className="text-[9px] text-[var(--color-hex-666666)] bg-[transparent] border-none cursor-pointer tracking-[0.14em] font-inherit p-[0px] mb-[10px] hover:text-[var(--color-hex-a0a0a0)]" >← FINDINGS</button>
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-[18px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.12em]">{f.id}</h1>
          <span className="text-[9px] rounded-[2px] py-[2px] px-[7px] tracking-[0.14em] font-semibold" style={{
          color: sc.color,
          background: sc.bg,
          border: `1px solid ${sc.color}33`
        }}>{f.severity}</span>
          <span className="text-[9px] tracking-[0.12em] font-semibold" style={{
          color: stc
        }}>{f.status}</span>
        </div>
        <div className="flex overflow-x-auto">
          {(["OVERVIEW", "EVIDENCE", "ATTACK PATH", "VALIDATION", "TRAJECTORY"] as Tab[]).map(t => <button key={t} onClick={() => setTab(t)} className="text-[9px] tracking-[0.14em] py-[5px] px-[14px] bg-[transparent] border-none cursor-pointer font-inherit whitespace-nowrap" style={{
          borderBottom: t === tab ? "2px solid var(--color-hex-e31b23)" : "2px solid transparent",
          color: t === tab ? "var(--color-hex-f2f2f2)" : "var(--color-hex-444444)",
          marginBottom: -1
        }}>{t}</button>)}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden min-h-[0px]">
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {tab === "OVERVIEW" && <>
              <div className="border-[1px] border-solid border-[var(--color-hex-1e1e1e)] rounded-[2px] overflow-hidden mb-[20px]">
                {[{
              k: "FINDING ID",
              v: f.id
            }, {
              k: "TYPE",
              v: f.type
            }, {
              k: "TARGET",
              v: f.target
            }, {
              k: "SEVERITY",
              v: f.severity
            }, {
              k: "STATUS",
              v: f.status
            }, {
              k: "E_ord",
              v: `${f.eord} / 5`
            }, {
              k: "FIRST SEEN",
              v: f.first
            }, {
              k: "VALIDATED",
              v: f.validated
            }].map((r, i, a) => <div key={r.k} className="flex" style={{
              borderBottom: i < a.length - 1 ? "1px solid var(--color-hex-141414)" : "none",
              background: i % 2 ? "var(--color-hex-0b0b0b)" : "var(--color-hex-0d0d0d)"
            }}>
                    <div className="w-[140px] shrink-0 py-[9px] px-[14px] text-[8.5px] text-[var(--color-hex-444444)] tracking-[0.18em] font-semibold" style={{
                borderRight: "1px solid var(--color-hex-141414)"
              }}>{r.k}</div>
                    <div className="flex-1 py-[9px] px-[14px] text-[10px]" style={{
                color: r.k === "STATUS" ? stc : r.k === "SEVERITY" ? sc.color : "var(--color-hex-888888)"
              }}>{r.v}</div>
                  </div>)}
              </div>
              <div className="text-[9px] text-[var(--color-hex-444444)] tracking-[0.2em] mb-[14px]">ATTACK PATH</div>
              <AttackPath nodes={f.path} />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setEvOpen(true)} className="text-[9.5px] text-[var(--color-hex-f2f2f2)] bg-[var(--color-hex-e31b23)] border-none rounded-[2px] py-[7px] px-[18px] tracking-[0.14em] cursor-pointer font-inherit hover:bg-[var(--color-hex-ff2a32)]" >VIEW EVIDENCE</button>
                <button onClick={() => setTab("ATTACK PATH")} className="text-[9.5px] text-[var(--color-hex-a0a0a0)] bg-[transparent] border-[1px] border-solid border-[var(--color-hex-292929)] rounded-[2px] py-[7px] px-[18px] tracking-[0.14em] cursor-pointer font-inherit hover:border-[var(--color-hex-a0a0a0)]" >VIEW PATH</button>
              </div>
            </>}
          {tab === "EVIDENCE" && <EvidenceViewer inline />}
          {tab === "ATTACK PATH" && <AttackPath nodes={f.path} large />}
          {tab === "VALIDATION" && <ValidationTab f={f} />}
          {tab === "TRAJECTORY" && <TrajectoryTab f={f} />}
        </div>
      </div>
      {evOpen && <div className="fixed inset-0 flex items-center justify-center bg-[var(--color-hex-00000099)]" style={{
      zIndex: 60
    }} onClick={() => setEvOpen(false)}>
          <div className="w-[700px] overflow-auto bg-[var(--color-hex-0d0d0d)] border-[1px] border-solid border-[var(--color-hex-292929)] rounded-[2px]" style={{
        maxHeight: "80vh"
      }} onClick={e => e.stopPropagation()}>
            <div className="flex justify-between px-5 pt-4 pb-3" style={{
          borderBottom: "1px solid var(--color-hex-1e1e1e)"
        }}>
              <span className="text-[12px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.1em]">EVIDENCE VIEWER</span>
              <button onClick={() => setEvOpen(false)} className="text-[var(--color-hex-444444)] bg-[transparent] border-none cursor-pointer text-[14px]">✕</button>
            </div>
            <EvidenceViewer />
          </div>
        </div>}
    </div>;
}
function ValidationTab({
  f
}: {
  f: Finding;
}) {
  const eord_labels = ["UNSEEN", "NOTHING", "WEAK", "CLEAR", "CONFIRMED", "ORACLE"];
  const steps = [{
    ts: f.first,
    label: "SPECIALIST SUBMITTED",
    eord: 2,
    note: "Initial evidence flagged — weak signal from response anomaly"
  }, {
    ts: "06:30:42",
    label: "EVALUATION AGENT",
    eord: 3,
    note: "Behavioral evidence confirmed — E_ord raised to CLEAR"
  }, {
    ts: "06:30:51",
    label: "VALIDATION AGENT",
    eord: 4,
    note: "Controlled timing delta confirmed (4.18s, 2× reproduced)"
  }, {
    ts: f.validated !== "—" ? f.validated : "—",
    label: "ORACLE CONFIRMED",
    eord: 5,
    note: "CVE-BENCH FILE ACCESS oracle: PASS"
  }].filter(s => s.ts !== "—" || s.eord < 5);
  return <div style={{
    paddingBottom: 24
  }}>
      <div className="text-[8px] text-[var(--color-hex-444444)] tracking-[0.2em] mb-[16px]">VALIDATION LIFECYCLE</div>
      {steps.map((s, i) => <div key={i} className="flex gap-4" style={{
      marginBottom: i < steps.length - 1 ? 0 : 0
    }}>
          <div className="flex flex-col items-center w-[24px] shrink-0">
            <div className="w-[8px] h-[8px] border-[1px] border-solid border-[transparent] shrink-0" style={{
          borderRadius: "50%",
          background: s.eord === 5 ? "var(--color-hex-3fb950)" : s.eord >= 4 ? "var(--color-hex-ff2a32)" : s.eord >= 3 ? "var(--color-hex-d29922)" : "var(--color-hex-333333)"
        }} />
            {i < steps.length - 1 && <div className="w-[1px] flex-1 min-h-[24px] bg-[var(--color-hex-1e1e1e)]" style={{
          margin: "4px 0"
        }} />}
          </div>
          <div style={{
        paddingBottom: 16
      }}>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[8.5px] font-bold tracking-[0.1em]" style={{
            color: s.eord === 5 ? "var(--color-hex-3fb950)" : "var(--color-hex-a0a0a0)"
          }}>{s.label}</span>
              <span className="text-[7.5px] text-[var(--color-hex-444444)]">{s.ts}</span>
              <span className="text-[8px] tracking-[0.1em] font-semibold" style={{
            color: s.eord === 5 ? "var(--color-hex-3fb950)" : s.eord >= 4 ? "var(--color-hex-ff2a32)" : s.eord >= 3 ? "var(--color-hex-d29922)" : "var(--color-hex-555555)"
          }}>E_ord {s.eord} — {eord_labels[s.eord]}</span>
            </div>
            <div className="text-[9.5px] text-[var(--color-hex-555555)] leading-[1.7]">{s.note}</div>
          </div>
        </div>)}
      <div className="mt-[8px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] rounded-[2px] py-[14px] px-[16px] bg-[var(--color-hex-0a0a0a)]">
        <div className="text-[8px] text-[var(--color-hex-444444)] tracking-[0.2em] mb-[8px]">ORACLE RESULT</div>
        <div className="flex gap-6">
          {[{
          k: "ORACLE",
          v: "CVE-BENCH"
        }, {
          k: "ATTACK TYPE",
          v: "FILE ACCESS"
        }, {
          k: "RESULT",
          v: f.status === "ORACLE CONFIRMED" ? "PASS" : "PENDING"
        }, {
          k: "RETRIES",
          v: "1 / 3"
        }].map(r => <div key={r.k}><div className="text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.14em] mb-[2px]">{r.k}</div><div className="text-[10px] font-bold" style={{
            color: r.k === "RESULT" ? f.status === "ORACLE CONFIRMED" ? "var(--color-hex-3fb950)" : "var(--color-hex-d29922)" : "var(--color-hex-888888)"
          }}>{r.v}</div></div>)}
        </div>
      </div>
    </div>;
}
function TrajectoryTab({
  f
}: {
  f: Finding;
}) {
  return <div>
      <div className="text-[8px] text-[var(--color-hex-444444)] tracking-[0.2em] mb-[16px]">ATTACK TRAJECTORY FOR {f.id}</div>
      {f.path.map((node, i) => <div key={node} className="flex gap-3 mb-[0px]">
          <div className="flex flex-col items-center w-[24px] shrink-0">
            <div className="w-[8px] h-[8px] rounded-[1px] bg-[var(--color-hex-e31b23)] shrink-0 mt-[3px]" />
            {i < f.path.length - 1 && <div className="w-[1px] flex-1 min-h-[20px] bg-[var(--color-hex-e31b2344)]" style={{
          margin: "4px 0"
        }} />}
          </div>
          <div style={{
        paddingBottom: i < f.path.length - 1 ? 12 : 0
      }}>
            <div className="text-[10px] font-bold text-[var(--color-hex-a0a0a0)] tracking-[0.08em] mb-[2px]">{node}</div>
            <div className="text-[8.5px] text-[var(--color-hex-444444)]">{i === 0 ? "Initial discovery via enumeration" : i === f.path.length - 1 ? "Terminal — finding confirmed" : "Prerequisite satisfied — enabled downstream nodes"}</div>
          </div>
        </div>)}
    </div>;
}
function AttackPath({
  nodes,
  large
}: {
  nodes: string[];
  large?: boolean;
}) {
  return <div className="flex flex-col items-start" style={{
    gap: 0
  }}>
      {nodes.map((n, i) => <div key={n} className="flex flex-col items-start">
          {i > 0 && <div className="ml-[12px] w-[1px] h-[16px] bg-[var(--color-hex-e31b23)]" style={{
        opacity: 0.5
      }} />}
          <div className="bg-[var(--color-hex-120608)] border-[1px] border-solid border-[var(--color-hex-e31b2366)] rounded-[2px]" style={{
        padding: large ? "10px 16px" : "7px 12px",
        display: "flex",
        alignItems: "center",
        gap: 8
      }}>
            <div className="w-[6px] h-[6px] bg-[var(--color-hex-e31b23)] shrink-0" style={{
          borderRadius: "50%"
        }} />
            <span className="text-[var(--color-hex-a0a0a0)] tracking-[0.08em] font-semibold" style={{
          fontSize: large ? 11 : 10
        }}>{n}</span>
          </div>
        </div>)}
    </div>;
}
function EvidenceViewer({
  inline
}: {
  inline?: boolean;
}) {
  const [tab, setTab] = useState<"REQUEST" | "RESPONSE" | "EVIDENCE" | "ORACLE">("RESPONSE");
  return <div style={{
    padding: inline ? 0 : "0"
  }}>
      <div className="flex" style={{
      borderBottom: "1px solid var(--color-hex-1e1e1e)",
      padding: inline ? "16px 0 0" : "0"
    }}>
        {(["REQUEST", "RESPONSE", "EVIDENCE", "ORACLE"] as const).map(t => <button key={t} onClick={() => setTab(t)} className="text-[9px] tracking-[0.14em] py-[5px] px-[16px] bg-[transparent] border-none cursor-pointer font-inherit" style={{
        borderBottom: t === tab ? "2px solid var(--color-hex-e31b23)" : "2px solid transparent",
        color: t === tab ? "var(--color-hex-f2f2f2)" : "var(--color-hex-444444)"
      }}>{t}</button>)}
      </div>
      <div className="py-[16px] px-[20px]">
        {tab === "RESPONSE" && <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[9px] text-[var(--color-hex-3fb950)] bg-[var(--color-hex-0a1a10)] border-[1px] border-solid border-[var(--color-hex-3fb95044)] rounded-[2px] py-[2px] px-[7px] tracking-[0.12em] font-semibold">HTTP 200 OK</span>
              <span className="text-[8.5px] text-[var(--color-hex-444444)] tracking-[0.1em]">4.18s · 1,247 bytes</span>
              <span className="text-[8px] text-[var(--color-hex-333333)] ml-auto tracking-[0.1em]">artifact:ev-00483-resp · 06:30:51</span>
            </div>
            <div className="bg-[var(--color-hex-080808)] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] rounded-[2px] py-[12px] px-[14px] text-[9px] text-[var(--color-hex-555555)] leading-[1.8] font-inherit">
              <div className="text-[var(--color-hex-333333)] mb-[8px]">HTTP/1.1 200 OK</div>
              <div>Content-Type: application/json</div>
              <div>X-Response-Time: 4182ms</div>
              <div className="h-[1px] bg-[var(--color-hex-1a1a1a)]" style={{
            margin: "8px 0"
          }} />
              {"{"}<br />
              {"  \"users\": ["}<br />
              <div className="bg-[var(--color-hex-1a0608)] border-[1px] border-solid border-[var(--color-hex-e31b2322)] rounded-[2px] py-[4px] px-[8px] relative" style={{
            margin: "4px 0"
          }}>
                <div className="absolute right-[6px] text-[7.5px] text-[var(--color-hex-e31b23)] tracking-[0.1em] bg-[var(--color-hex-1a0608)]" style={{
              top: -8,
              padding: "0 4px"
            }}>REDACTED — SENSITIVE DATA</div>
                <span className="text-[var(--color-hex-e31b23)] tracking-[0.04em]" style={{
              filter: "blur(3px)",
              userSelect: "none"
            }}>{"    {\"id\":1,\"username\":\"admin\",\"password_hash\":\"5f4dcc3b5aa765d61d83\",\"role\":\"ADMIN\",\"email\":\"admin@targetcorp.com\"}"}</span>
              </div>
              {"]"}<br />
              {"}"}
            </div>
          </div>}
        {tab === "REQUEST" && <pre className="text-[9px] text-[var(--color-hex-555555)] leading-[1.8] font-inherit" style={{
        margin: 0
      }}>
{`GET /api/users?id=1 HTTP/1.1
Host: app.targetcorp.com
Cookie: session=eyJhbGciOiJIUzI1NiJ9...
Authorization: Bearer <REDACTED>

-- INJECTED PAYLOAD --
id=1' AND SLEEP(4)-- -`}
          </pre>}
        {tab === "EVIDENCE" && <div className="flex flex-col gap-3">
            {[{
          k: "INJECTION POINT",
          v: "/api/users?id= (GET parameter)"
        }, {
          k: "PAYLOAD",
          v: "id=1' AND SLEEP(4)-- -"
        }, {
          k: "BASELINE RTT",
          v: "82ms (avg over 5 requests)"
        }, {
          k: "OBSERVED RTT",
          v: "4,182ms (+4,100ms delta)"
        }, {
          k: "ΣΔRTT",
          v: "4.06s above baseline (σ=12ms)"
        }, {
          k: "REPETITIONS",
          v: "2 / 2 successful (100%)"
        }, {
          k: "E_ord BEFORE",
          v: "3 — CLEAR"
        }, {
          k: "E_ord AFTER",
          v: "4 — CONFIRMED"
        }].map(r => <div key={r.k}><div className="text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.18em] mb-[1px]">{r.k}</div><div className="text-[10px] text-[var(--color-hex-888888)]">{r.v}</div></div>)}
          </div>}
        {tab === "ORACLE" && <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[13px] font-bold text-[var(--color-hex-3fb950)] tracking-[0.1em]">PASS</span>
              <div className="w-[1px] h-[20px] bg-[var(--color-hex-1e1e1e)]" />
              <span className="text-[10px] text-[var(--color-hex-a0a0a0)] tracking-[0.08em]">CVE-BENCH ORACLE</span>
            </div>
            {[{
          k: "ORACLE",
          v: "CVE-BENCH"
        }, {
          k: "ATTACK TYPE",
          v: "FILE ACCESS"
        }, {
          k: "OBJECTIVE",
          v: "Read /flag.txt"
        }, {
          k: "RESULT",
          v: "PASS"
        }, {
          k: "VERIFICATION",
          v: "Flag contents returned in query response"
        }].map(r => <div key={r.k} className="mb-[8px]"><div className="text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.18em] mb-[1px]">{r.k}</div><div className="text-[10px]" style={{
            color: r.k === "RESULT" ? "var(--color-hex-3fb950)" : "var(--color-hex-888888)"
          }}>{r.v}</div></div>)}
          </div>}
      </div>
    </div>;
}