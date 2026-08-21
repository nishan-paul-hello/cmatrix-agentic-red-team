import { useState } from "react";
interface ExecEntry {
  id: string;
  ts: string;
  specialist: string;
  task: string;
  tool: string;
  duration: string;
  status: "SUCCESS" | "FAILED" | "TIMEOUT" | "RUNNING";
  output: string;
  size: string;
}
const ENTRIES: ExecEntry[] = [{
  id: "00484",
  ts: "06:31:04",
  specialist: "INJECT-SPEC",
  task: "sqli_blind_time()",
  tool: "sqlmap",
  duration: "6.2s",
  status: "RUNNING",
  output: "",
  size: "—"
}, {
  id: "00483",
  ts: "06:30:51",
  specialist: "INJECT-SPEC",
  task: "sqli_payload_dispatch()",
  tool: "curl",
  duration: "4.2s",
  status: "SUCCESS",
  output: "HTTP 200 · 4.18s delta · timing confirmed",
  size: "1.2 KB"
}, {
  id: "00482",
  ts: "06:30:39",
  specialist: "VALID-AGENT",
  task: "oracle_test(AUTH-001)",
  tool: "cve_bench",
  duration: "3.1s",
  status: "SUCCESS",
  output: "ORACLE PASS · CVE-BENCH · FILE ACCESS",
  size: "0.4 KB"
}, {
  id: "00481",
  ts: "06:30:22",
  specialist: "AUTH-SPEC",
  task: "exploit_auth()",
  tool: "requests",
  duration: "1.8s",
  status: "SUCCESS",
  output: "Session token returned · admin@targetcorp.com",
  size: "0.8 KB"
}, {
  id: "00480",
  ts: "06:29:58",
  specialist: "INJECT-SPEC",
  task: "sqli_error_probe()",
  tool: "curl",
  duration: "2.1s",
  status: "SUCCESS",
  output: "HTTP 500 · SQL error in response body",
  size: "3.1 KB"
}, {
  id: "00479",
  ts: "06:29:44",
  specialist: "RECON-SPEC",
  task: "endpoint_enumerate()",
  tool: "spider",
  duration: "18.4s",
  status: "SUCCESS",
  output: "12 endpoints discovered · 3 authenticated",
  size: "14.2KB"
}, {
  id: "00478",
  ts: "06:29:03",
  specialist: "NETWORK-SPEC",
  task: "lateral_pivot()",
  tool: "nmap",
  duration: "30.0s",
  status: "TIMEOUT",
  output: "Port 5432 filtered — timeout exceeded",
  size: "0.2 KB"
}, {
  id: "00477",
  ts: "06:28:47",
  specialist: "RECON-SPEC",
  task: "service_scan()",
  tool: "nmap",
  duration: "12.3s",
  status: "SUCCESS",
  output: "8 services · 3 open · SSH OpenSSH 8.9p1",
  size: "2.4 KB"
}];
const PARSED_ROWS = [{
  port: "22",
  state: "OPEN",
  service: "SSH",
  version: "OpenSSH 8.9p1"
}, {
  port: "80",
  state: "OPEN",
  service: "HTTP",
  version: "nginx/1.24.0"
}, {
  port: "443",
  state: "OPEN",
  service: "HTTPS",
  version: "nginx/1.24.0"
}, {
  port: "5432",
  state: "FILTERED",
  service: "POSTGRESQL",
  version: "—"
}, {
  port: "6379",
  state: "FILTERED",
  service: "REDIS",
  version: "—"
}];
const STATUS_C: Record<ExecEntry["status"], string> = {
  SUCCESS: "var(--color-hex-3fb950)",
  FAILED: "var(--color-hex-ff2a32)",
  TIMEOUT: "var(--color-hex-d29922)",
  RUNNING: "var(--color-hex-e31b23)"
};
export default function ExecutionConsole() {
  const [drawer, setDrawer] = useState<ExecEntry | null>(null);
  return <div className="flex h-full min-h-[0px]">
      <div className="flex flex-col flex-1 overflow-hidden min-h-[0px]">
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{
        borderBottom: "1px solid var(--color-hex-1e1e1e)"
      }}>
          <div className="text-[9px] text-[var(--color-hex-666666)] tracking-[0.22em] mb-[3px]">MISSION / CVE-001</div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-[18px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.12em]">EXECUTION AGENT</h1>
            <span className="text-[9px] text-[var(--color-hex-444444)] tracking-[0.16em]">DETERMINISTIC EXECUTION CHANNEL</span>
          </div>
        </div>

        {/* Architecture note */}
        <div className="flex-shrink-0 flex items-start gap-3 px-6 py-2 bg-[var(--color-hex-0b0b0b)]" style={{
        borderBottom: "1px solid var(--color-hex-1e1e1e)"
      }}>
          <div className="w-[2px] h-[28px] bg-[var(--color-hex-e31b23)] shrink-0 mt-[2px]" />
          <div>
            <div className="text-[8.5px] text-[var(--color-hex-444444)] tracking-[0.14em] mb-[2px]">REASONING / EXECUTION SEPARATION</div>
            <div className="text-[9px] text-[var(--color-hex-333333)] tracking-[0.06em] leading-[1.6]">
              Specialists reason and plan · Execution agent runs tools deterministically · No LLM reasoning occurs during tool execution
            </div>
          </div>
          <div className="ml-auto flex-shrink-0 flex items-center gap-2">
            <div className="w-[6px] h-[6px] bg-[var(--color-hex-ff2a32)]" style={{
            borderRadius: "50%",
            animation: "pulse 1.4s ease infinite"
          }} />
            <span className="text-[9px] text-[var(--color-hex-e31b23)] tracking-[0.14em]">1 RUNNING</span>
          </div>
        </div>

        {/* Console log */}
        <div className="flex-1 overflow-y-auto bg-[var(--color-hex-080808)]">
          {/* Header row */}
          <div className="flex gap-0 bg-[var(--color-hex-0d0d0d)] sticky top-0" style={{
          borderBottom: "1px solid var(--color-hex-1a1a1a)"
        }}>
            {["#", "TIMESTAMP", "SPECIALIST", "TASK", "TOOL", "DURATION", "STATUS", "OUTPUT"].map((h, i) => <div key={h} className="py-[5px] px-[12px] text-[7.5px] text-[var(--color-hex-333333)] tracking-[0.18em] font-semibold shrink-0" style={{
            width: [48, 80, 108, 160, 72, 64, 72, undefined][i],
            flex: i === 7 ? 1 : undefined
          }}>{h}</div>)}
          </div>

          {ENTRIES.map(e => <div key={e.id} className="flex gap-0 items-start cursor-pointer" style={{
          borderBottom: "1px solid var(--color-hex-0e0e0e)"
        }} onClick={() => setDrawer(e)} onMouseEnter={ev => ev.currentTarget.style.background = "var(--color-hex-0d0d0d)"} onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
              <div className="w-[48px] py-[7px] px-[12px] text-[9px] text-[var(--color-hex-333333)] shrink-0">{e.id}</div>
              <div className="w-[80px] py-[7px] px-[12px] text-[9px] text-[var(--color-hex-333333)] shrink-0 tracking-[0.04em]">{e.ts}</div>
              <div className="w-[108px] py-[7px] px-[12px] text-[9px] text-[var(--color-hex-e31b23)] shrink-0 tracking-[0.08em] font-semibold">{e.specialist}</div>
              <div className="w-[160px] py-[7px] px-[12px] text-[9px] text-[var(--color-hex-666666)] shrink-0 tracking-[0.04em] overflow-hidden whitespace-nowrap" style={{
            textOverflow: "ellipsis"
          }}>{e.task}</div>
              <div className="w-[72px] py-[7px] px-[12px] text-[9px] text-[var(--color-hex-444444)] shrink-0">{e.tool}</div>
              <div className="w-[64px] py-[7px] px-[12px] text-[9px] text-[var(--color-hex-444444)] shrink-0 text-right">{e.duration}</div>
              <div className="w-[72px] py-[7px] px-[12px] shrink-0">
                <span className="text-[8.5px] tracking-[0.1em] font-semibold" style={{
              color: STATUS_C[e.status]
            }}>{e.status}</span>
              </div>
              <div className="flex-1 py-[7px] px-[12px] text-[9px] text-[var(--color-hex-555555)] tracking-[0.03em] leading-[1.4] overflow-hidden whitespace-nowrap" style={{
            textOverflow: "ellipsis"
          }}>{e.output || <span className="text-[var(--color-hex-2a2a2a)]">IN PROGRESS…</span>}</div>
            </div>)}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
      </div>

      {/* Drawer */}
      {drawer && <ExecDrawer entry={drawer} onClose={() => setDrawer(null)} />}
    </div>;
}
function ExecDrawer({
  entry,
  onClose
}: {
  entry: ExecEntry;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"SUMMARY" | "RAW OUTPUT" | "PARSED OUTPUT" | "EL CHANGES" | "TRAJECTORY">("SUMMARY");
  const sc = STATUS_C[entry.status];
  return <div className="flex flex-col flex-shrink-0 overflow-hidden w-[340px] bg-[var(--color-hex-0d0d0d)]" style={{
    borderLeft: "1px solid var(--color-hex-292929)"
  }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{
      borderBottom: "1px solid var(--color-hex-1e1e1e)"
    }}>
        <div>
          <div className="text-[12px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.12em]">EXECUTION #{entry.id}</div>
          <div className="text-[8.5px] text-[var(--color-hex-444444)] tracking-[0.12em] mt-[2px]">{entry.specialist} · {entry.tool}</div>
        </div>
        <button onClick={onClose} className="text-[14px] text-[var(--color-hex-444444)] bg-[transparent] border-none cursor-pointer font-inherit">✕</button>
      </div>

      {/* Tabs */}
      <div className="flex flex-shrink-0" style={{
      borderBottom: "1px solid var(--color-hex-1e1e1e)"
    }}>
        {(["SUMMARY", "RAW OUTPUT", "PARSED OUTPUT", "EL CHANGES", "TRAJECTORY"] as const).map(t => <button key={t} onClick={() => setTab(t)} className="text-[8px] tracking-[0.1em] py-[5px] px-[8px] bg-[transparent] border-none cursor-pointer font-inherit whitespace-nowrap" style={{
        borderBottom: t === tab ? "2px solid var(--color-hex-e31b23)" : "2px solid transparent",
        color: t === tab ? "var(--color-hex-f2f2f2)" : "var(--color-hex-444444)"
      }}>{t}</button>)}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === "SUMMARY" && <div className="flex flex-col gap-3">
            {([{
          k: "SPECIALIST",
          v: entry.specialist
        }, {
          k: "TASK",
          v: entry.task
        }, {
          k: "TOOL",
          v: entry.tool
        }, {
          k: "START",
          v: entry.ts
        }, {
          k: "DURATION",
          v: entry.duration
        }, {
          k: "STATUS",
          v: entry.status,
          color: sc
        }, {
          k: "OUTPUT SIZE",
          v: entry.size
        }] as {
          k: string;
          v: string;
          color?: string;
        }[]).map(r => <div key={r.k}>
                <div className="text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.18em] mb-[1px]">{r.k}</div>
                <div className="text-[10px] tracking-[0.06em]" style={{
            color: r.color ?? "var(--color-hex-888888)"
          }}>{r.v}</div>
              </div>)}
          </div>}

        {tab === "PARSED OUTPUT" && <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--color-hex-111111)]">
                {["PORT", "STATE", "SERVICE", "VERSION"].map(h => <th key={h} className="py-[5px] px-[8px] text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.14em] text-left" style={{
              borderBottom: "1px solid var(--color-hex-1a1a1a)"
            }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {PARSED_ROWS.map(r => <tr key={r.port} style={{
            borderBottom: "1px solid var(--color-hex-111111)"
          }}>
                  <td className="py-[5px] px-[8px] text-[var(--color-hex-a0a0a0)] font-bold">{r.port}</td>
                  <td className="py-[5px] px-[8px] text-[9px]" style={{
              color: r.state === "OPEN" ? "var(--color-hex-3fb950)" : "var(--color-hex-d29922)"
            }}>{r.state}</td>
                  <td className="py-[5px] px-[8px] text-[var(--color-hex-666666)] text-[9px]">{r.service}</td>
                  <td className="py-[5px] px-[8px] text-[var(--color-hex-444444)] text-[8.5px]">{r.version}</td>
                </tr>)}
            </tbody>
          </table>}

        {tab === "RAW OUTPUT" && <pre className="text-[9px] text-[var(--color-hex-555555)] leading-[1.7] font-inherit" style={{
        whiteSpace: "pre-wrap",
        margin: 0
      }}>
{`$ nmap -sV -p 22,80,443,5432,6379 app.targetcorp.com
Starting Nmap 7.94 at 2026-08-19 06:28:47
Nmap scan report for app.targetcorp.com (104.21.3.212)
PORT     STATE    SERVICE    VERSION
22/tcp   open     ssh        OpenSSH 8.9p1
80/tcp   open     http       nginx 1.24.0
443/tcp  open     https      nginx 1.24.0
5432/tcp filtered postgresql
6379/tcp filtered redis
Nmap done: 1 IP address scanned in 12.3 seconds`}
          </pre>}

        {tab === "EL CHANGES" && <div className="flex flex-col gap-2">
            {["SERVICE ssh:22 ADDED", "SERVICE http:80 ADDED", "SERVICE https:443 ADDED", "HOST app.targetcorp.com CONFIRMED"].map(c => <div key={c} className="flex items-center gap-2">
                <span className="text-[9px] text-[var(--color-hex-3fb950)]">+</span>
                <span className="text-[9px] text-[var(--color-hex-555555)] tracking-[0.06em]">{c}</span>
              </div>)}
          </div>}

        {tab === "TRAJECTORY" && <div style={{
        paddingTop: 4
      }}>
            <div className="text-[8px] text-[var(--color-hex-444444)] tracking-[0.2em] mb-[10px]">
              TRAJECTORY CONTRIBUTION
            </div>
            {[{
          step: `STEP ${String(entry.id).padStart(3, "0")}`,
          vdgDelta: entry.task.split("(")[0].toUpperCase(),
          elDelta: "+2 facts",
          cost: entry.duration !== "—" ? `~$0.0${entry.id.slice(-2)}` : "$0.00"
        }].map((r, i) => <div key={i} className="border-[1px] border-solid border-[var(--color-hex-1e1e1e)] rounded-[2px] overflow-hidden" style={{
          display: "flex",
          gap: 0
        }}>
                {[["STEP", r.step], ["VDG DELTA", r.vdgDelta], ["EL DELTA", r.elDelta], ["COST", r.cost]].map(([k, v], j, a) => <div key={k} className="flex-1 py-[9px] px-[12px] bg-[var(--color-hex-0d0d0d)]" style={{
            borderRight: j < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none"
          }}>
                    <div className="text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.18em] mb-[4px]">{k}</div>
                    <div className="text-[10px] text-[var(--color-hex-888888)] font-semibold">{v}</div>
                  </div>)}
              </div>)}
          </div>}
      </div>
    </div>;
}
