import { useState } from "react";
const REPORTS = [{
  id: "RPT-0041",
  mission: "CVE-001",
  type: "EXECUTIVE SUMMARY",
  status: "READY",
  generated: "06:31:04",
  findings: 7,
  critical: 1,
  pages: 4
}, {
  id: "RPT-0039",
  mission: "CVE-001",
  type: "TECHNICAL DETAIL",
  status: "GENERATING",
  generated: "—",
  findings: 7,
  critical: 1,
  pages: 0
}, {
  id: "RPT-0031",
  mission: "BENCH-014",
  type: "BENCHMARK REPORT",
  status: "READY",
  generated: "Yesterday 22:14",
  findings: 12,
  critical: 3,
  pages: 9
}, {
  id: "RPT-0028",
  mission: "BENCH-013",
  type: "BENCHMARK REPORT",
  status: "READY",
  generated: "Yesterday 18:07",
  findings: 8,
  critical: 1,
  pages: 7
}, {
  id: "RPT-0022",
  mission: "CVE-003",
  type: "TECHNICAL DETAIL",
  status: "READY",
  generated: "2d ago",
  findings: 3,
  critical: 0,
  pages: 6
}, {
  id: "RPT-0019",
  mission: "CVE-002",
  type: "EXECUTIVE SUMMARY",
  status: "READY",
  generated: "3d ago",
  findings: 5,
  critical: 2,
  pages: 3
}];
const PREVIEW_SECTIONS = [{
  title: "EXECUTIVE SUMMARY",
  content: "CMATRIX completed mission CVE-001 against target app.targetcorp.com. 7 vulnerabilities identified, 3 oracle-confirmed. Critical finding: time-based SQL injection in /api/users endpoint grants full database read access."
}, {
  title: "CRITICAL FINDINGS",
  items: [{
    sev: "CRITICAL",
    id: "F-001",
    name: "SQL INJECTION",
    target: "/api/users?id=",
    eord: "5/5"
  }, {
    sev: "HIGH",
    id: "F-002",
    name: "AUTH BYPASS",
    target: "/api/auth/login",
    eord: "4/5"
  }, {
    sev: "HIGH",
    id: "F-003",
    name: "IDOR",
    target: "/api/users/:id",
    eord: "4/5"
  }]
}, {
  title: "ATTACK NARRATIVE",
  content: "Agent initiated passive/active recon hybrid, discovering 12 endpoints. JWT authentication was bypassed via HS256 secret brute-force (password123, 48s). Authenticated access enabled SQL injection enumeration. Time-based blind injection confirmed via 4.18s timing delta (>3σ above baseline). Oracle validation: CVE-BENCH FILE ACCESS PASS."
}, {
  title: "RISK ASSESSMENT",
  content: "OVERALL RISK: CRITICAL\nPriority remediation: parameterize SQL queries (F-001), rotate JWT secrets with RS256 migration (F-002), implement ownership checks on user endpoints (F-003).\nEstimated remediation effort: 3–5 engineer-days."
}];
export default function ReportsPage() {
  const [sel, setSel] = useState(REPORTS[0]);
  const [filter, setFilter] = useState<string>("ALL");
  const types = ["ALL", "EXECUTIVE SUMMARY", "TECHNICAL DETAIL", "BENCHMARK REPORT"];
  const filtered = filter === "ALL" ? REPORTS : REPORTS.filter(r => r.type === filter);
  return <div className="flex flex-col h-full min-h-[0px]">
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{
      borderBottom: "1px solid var(--color-hex-1e1e1e)"
    }}>
        <div className="text-[9px] text-[var(--color-hex-666666)] tracking-[0.22em] mb-[3px]">RESEARCH</div>
        <div className="flex items-baseline justify-between">
          <h1 className="text-[20px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.12em]">REPORTS</h1>
          <div className="flex gap-2">
            {types.map(t => <button key={t} onClick={() => setFilter(t)} className="text-[8px] tracking-[0.12em] py-[3px] px-[10px] rounded-[2px] cursor-pointer font-inherit" style={{
            background: filter === t ? "var(--color-hex-120608)" : "transparent",
            border: `1px solid ${filter === t ? "var(--color-hex-e31b23)" : "var(--color-hex-1e1e1e)"}`,
            color: filter === t ? "var(--color-hex-e31b23)" : "var(--color-hex-444444)"
          }}>{t}</button>)}
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden min-h-[0px]">
        {/* List */}
        <div className="flex-shrink-0 flex flex-col overflow-y-auto w-[300px]" style={{
        borderRight: "1px solid var(--color-hex-1e1e1e)"
      }}>
          {filtered.map(r => <div key={r.id} onClick={() => setSel(r)} className="py-[13px] px-[16px] cursor-pointer" style={{
          borderBottom: "1px solid var(--color-hex-111111)",
          background: sel.id === r.id ? "var(--color-hex-0d0d0d)" : "transparent",
          borderLeft: sel.id === r.id ? "2px solid var(--color-hex-e31b23)" : "2px solid transparent"
        }} onMouseEnter={e => {
          if (sel.id !== r.id) e.currentTarget.style.background = "var(--color-hex-0a0a0a)";
        }} onMouseLeave={e => {
          if (sel.id !== r.id) e.currentTarget.style.background = "transparent";
        }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[9px] font-bold text-[var(--color-hex-e31b23)] tracking-[0.08em]">{r.id}</span>
                <span className="text-[8px] tracking-[0.12em] font-semibold" style={{
              color: r.status === "READY" ? "var(--color-hex-3fb950)" : "var(--color-hex-d29922)"
            }}>{r.status}</span>
              </div>
              <div className="text-[10px] text-[var(--color-hex-a0a0a0)] mb-[2px] tracking-[0.04em]">{r.type}</div>
              <div className="text-[8.5px] text-[var(--color-hex-333333)] tracking-[0.06em]">{r.mission} · {r.generated}</div>
              <div className="flex gap-3 mt-2">
                <span className="text-[7.5px] text-[var(--color-hex-555555)] tracking-[0.1em]">{r.findings} FINDINGS</span>
                {r.critical > 0 && <span className="text-[7.5px] text-[var(--color-hex-ff2a32)] tracking-[0.1em]">{r.critical} CRITICAL</span>}
                {r.pages > 0 && <span className="text-[7.5px] text-[var(--color-hex-333333)] tracking-[0.1em]">{r.pages} PAGES</span>}
              </div>
            </div>)}
        </div>
        {/* Preview */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-[0px]">
          {/* Preview header */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-[var(--color-hex-0a0a0a)]" style={{
          borderBottom: "1px solid var(--color-hex-1e1e1e)"
        }}>
            <div>
              <div className="text-[11px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.08em]">{sel.id} — {sel.type}</div>
              <div className="text-[8.5px] text-[var(--color-hex-444444)] mt-[2px] tracking-[0.1em]">{sel.mission} · {sel.generated}</div>
            </div>
            <div className="flex gap-2">
              {["DOWNLOAD PDF", "COPY LINK"].map(a => <button key={a} className="text-[8.5px] text-[var(--color-hex-a0a0a0)] bg-[transparent] border-[1px] border-solid border-[var(--color-hex-292929)] rounded-[2px] py-[5px] px-[12px] tracking-[0.1em] font-inherit" style={{
              cursor: sel.status === "READY" ? "pointer" : "not-allowed",
              opacity: sel.status === "READY" ? 1 : 0.4
            }}>{a}</button>)}
            </div>
          </div>
          {sel.status === "GENERATING" ? <div className="flex-1 flex items-center justify-center flex-col gap-3">
              <div style={{
            borderRadius: "50%"
          }} className="animate-pulse w-[8px] h-[8px] bg-[var(--color-hex-e31b23)]" />
              <div className="text-[9px] text-[var(--color-hex-444444)] tracking-[0.2em]">GENERATING REPORT…</div>
            </div> : <div className="flex-1 overflow-y-auto px-8 py-6 max-w-[720px]">
              {/* Report cover block */}
              <div className="border-[1px] border-solid border-[var(--color-hex-1e1e1e)] rounded-[2px] py-[20px] px-[24px] bg-[var(--color-hex-0d0d0d)] mb-[24px]">
                <div className="text-[8.5px] text-[var(--color-hex-444444)] tracking-[0.2em] mb-[6px]">CMATRIX REPORT</div>
                <div className="text-[18px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.1em] mb-[4px]">{sel.type}</div>
                <div className="text-[9px] text-[var(--color-hex-e31b23)] tracking-[0.1em] mb-[12px]">MISSION {sel.mission}</div>
                <div className="flex gap-6">
                  {([{
                k: "FINDINGS",
                v: String(sel.findings)
              }, {
                k: "CRITICAL",
                v: String(sel.critical),
                red: sel.critical > 0
              }, {
                k: "PAGES",
                v: String(sel.pages)
              }, {
                k: "GENERATED",
                v: sel.generated
              }] as {
                k: string;
                v: string;
                red?: boolean;
              }[]).map(m => <div key={m.k}><div className="text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.16em] mb-[2px]">{m.k}</div><div className="text-[12px] font-bold" style={{
                  color: m.red ? "var(--color-hex-ff2a32)" : "var(--color-hex-f2f2f2)"
                }}>{m.v}</div></div>)}
                </div>
              </div>
              {PREVIEW_SECTIONS.map((s, i) => <div key={i} className="mb-[24px]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-[2px] h-[14px] bg-[var(--color-hex-e31b23)]" />
                    <span className="text-[9px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.2em]">{s.title}</span>
                  </div>
                  {s.content && <p className="text-[10.5px] text-[var(--color-hex-666666)] leading-[1.9]" style={{
              margin: 0,
              whiteSpace: "pre-line"
            }}>{s.content}</p>}
                  {s.items && <div className="border-[1px] border-solid border-[var(--color-hex-1e1e1e)] rounded-[2px] overflow-hidden">
                      {(s.items as {
                sev: string;
                id: string;
                name: string;
                target: string;
                eord: string;
              }[]).map((item, j, a) => <div key={item.id} className="flex items-center gap-4 py-[9px] px-[14px]" style={{
                borderBottom: j < a.length - 1 ? "1px solid var(--color-hex-111111)" : "none",
                background: j % 2 ? "var(--color-hex-0b0b0b)" : "transparent"
              }}>
                          <span className="text-[8.5px] font-bold tracking-[0.12em] min-w-[60px]" style={{
                  color: item.sev === "CRITICAL" ? "var(--color-hex-ff2a32)" : "var(--color-hex-e31b23)"
                }}>{item.sev}</span>
                          <span className="text-[9.5px] text-[var(--color-hex-e31b23)] font-bold min-w-[50px]">{item.id}</span>
                          <span className="text-[10px] text-[var(--color-hex-888888)] flex-1">{item.name}</span>
                          <span className="text-[9px] text-[var(--color-hex-444444)]">{item.target}</span>
                          <span className="text-[9px] text-[var(--color-hex-3fb950)] font-bold">E_ord {item.eord}</span>
                        </div>)}
                    </div>}
                  {i < PREVIEW_SECTIONS.length - 1 && <div className="h-[1px] bg-[var(--color-hex-141414)] mt-[20px]" />}
                </div>)}
            </div>}
        </div>
      </div>
    </div>;
}
