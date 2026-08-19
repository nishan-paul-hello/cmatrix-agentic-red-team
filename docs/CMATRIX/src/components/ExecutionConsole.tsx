import { useState } from "react";

interface ExecEntry {
  id: string; ts: string; specialist: string; task: string; tool: string;
  duration: string; status: "SUCCESS"|"FAILED"|"TIMEOUT"|"RUNNING";
  output: string; size: string;
}

const ENTRIES: ExecEntry[] = [
  { id:"00484", ts:"06:31:04", specialist:"INJECT-SPEC",  task:"sqli_blind_time()",        tool:"sqlmap",    duration:"6.2s",  status:"RUNNING",  output:"",                                              size:"—"      },
  { id:"00483", ts:"06:30:51", specialist:"INJECT-SPEC",  task:"sqli_payload_dispatch()",  tool:"curl",      duration:"4.2s",  status:"SUCCESS",  output:"HTTP 200 · 4.18s delta · timing confirmed",     size:"1.2 KB" },
  { id:"00482", ts:"06:30:39", specialist:"VALID-AGENT",  task:"oracle_test(AUTH-001)",    tool:"cve_bench", duration:"3.1s",  status:"SUCCESS",  output:"ORACLE PASS · CVE-BENCH · FILE ACCESS",         size:"0.4 KB" },
  { id:"00481", ts:"06:30:22", specialist:"AUTH-SPEC",    task:"exploit_auth()",           tool:"requests",  duration:"1.8s",  status:"SUCCESS",  output:"Session token returned · admin@targetcorp.com", size:"0.8 KB" },
  { id:"00480", ts:"06:29:58", specialist:"INJECT-SPEC",  task:"sqli_error_probe()",       tool:"curl",      duration:"2.1s",  status:"SUCCESS",  output:"HTTP 500 · SQL error in response body",         size:"3.1 KB" },
  { id:"00479", ts:"06:29:44", specialist:"RECON-SPEC",   task:"endpoint_enumerate()",     tool:"spider",    duration:"18.4s", status:"SUCCESS",  output:"12 endpoints discovered · 3 authenticated",     size:"14.2KB" },
  { id:"00478", ts:"06:29:03", specialist:"NETWORK-SPEC", task:"lateral_pivot()",          tool:"nmap",      duration:"30.0s", status:"TIMEOUT",  output:"Port 5432 filtered — timeout exceeded",         size:"0.2 KB" },
  { id:"00477", ts:"06:28:47", specialist:"RECON-SPEC",   task:"service_scan()",           tool:"nmap",      duration:"12.3s", status:"SUCCESS",  output:"8 services · 3 open · SSH OpenSSH 8.9p1",       size:"2.4 KB" },
];

const PARSED_ROWS = [
  { port:"22",   state:"OPEN",     service:"SSH",         version:"OpenSSH 8.9p1" },
  { port:"80",   state:"OPEN",     service:"HTTP",        version:"nginx/1.24.0"  },
  { port:"443",  state:"OPEN",     service:"HTTPS",       version:"nginx/1.24.0"  },
  { port:"5432", state:"FILTERED", service:"POSTGRESQL",  version:"—"             },
  { port:"6379", state:"FILTERED", service:"REDIS",       version:"—"             },
];

const STATUS_C: Record<ExecEntry["status"], string> = {
  SUCCESS:"#3FB950", FAILED:"#FF2A32", TIMEOUT:"#D29922", RUNNING:"#E31B23",
};

export default function ExecutionConsole() {
  const [drawer, setDrawer] = useState<ExecEntry|null>(null);

  return (
    <div className="flex h-full" style={{ minHeight:0 }}>
      <div className="flex flex-col flex-1 overflow-hidden" style={{ minHeight:0 }}>
        {/* Header */}
        <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom:"1px solid #1E1E1E" }}>
          <div style={{ fontSize:9, color:"#666666", letterSpacing:"0.22em", marginBottom:3 }}>MISSION / CVE-001</div>
          <div className="flex items-baseline gap-3">
            <h1 style={{ fontSize:18, fontWeight:700, color:"#F2F2F2", letterSpacing:"0.12em" }}>EXECUTION AGENT</h1>
            <span style={{ fontSize:9, color:"#444444", letterSpacing:"0.16em" }}>DETERMINISTIC EXECUTION CHANNEL</span>
          </div>
        </div>

        {/* Architecture note */}
        <div className="flex-shrink-0 flex items-start gap-3 px-6 py-2" style={{ background:"#0B0B0B", borderBottom:"1px solid #1E1E1E" }}>
          <div style={{ width:2, height:28, background:"#E31B23", flexShrink:0, marginTop:2 }} />
          <div>
            <div style={{ fontSize:8.5, color:"#444444", letterSpacing:"0.14em", marginBottom:2 }}>REASONING / EXECUTION SEPARATION</div>
            <div style={{ fontSize:9, color:"#333333", letterSpacing:"0.06em", lineHeight:1.6 }}>
              Specialists reason and plan · Execution agent runs tools deterministically · No LLM reasoning occurs during tool execution
            </div>
          </div>
          <div className="ml-auto flex-shrink-0 flex items-center gap-2">
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#FF2A32", animation:"pulse 1.4s ease infinite" }} />
            <span style={{ fontSize:9, color:"#E31B23", letterSpacing:"0.14em" }}>1 RUNNING</span>
          </div>
        </div>

        {/* Console log */}
        <div className="flex-1 overflow-y-auto" style={{ background:"#080808" }}>
          {/* Header row */}
          <div className="flex gap-0" style={{ background:"#0D0D0D", borderBottom:"1px solid #1A1A1A", position:"sticky", top:0 }}>
            {["#","TIMESTAMP","SPECIALIST","TASK","TOOL","DURATION","STATUS","OUTPUT"].map((h,i) => (
              <div key={h} style={{ padding:"5px 12px", fontSize:7.5, color:"#333333", letterSpacing:"0.18em", fontWeight:600,
                width: [48,80,108,160,72,64,72,undefined][i], flex: i===7?1:undefined, flexShrink:0 }}>{h}</div>
            ))}
          </div>

          {ENTRIES.map(e => (
            <div key={e.id} className="flex gap-0 items-start"
              style={{ borderBottom:"1px solid #0E0E0E", cursor:"pointer" }}
              onClick={() => setDrawer(e)}
              onMouseEnter={ev => ev.currentTarget.style.background="#0D0D0D"}
              onMouseLeave={ev => ev.currentTarget.style.background="transparent"}>
              <div style={{ width:48, padding:"7px 12px", fontSize:9, color:"#333333", flexShrink:0 }}>{e.id}</div>
              <div style={{ width:80, padding:"7px 12px", fontSize:9, color:"#333333", flexShrink:0, letterSpacing:"0.04em" }}>{e.ts}</div>
              <div style={{ width:108, padding:"7px 12px", fontSize:9, color:"#E31B23", flexShrink:0, letterSpacing:"0.08em", fontWeight:600 }}>{e.specialist}</div>
              <div style={{ width:160, padding:"7px 12px", fontSize:9, color:"#666666", flexShrink:0, letterSpacing:"0.04em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.task}</div>
              <div style={{ width:72, padding:"7px 12px", fontSize:9, color:"#444444", flexShrink:0 }}>{e.tool}</div>
              <div style={{ width:64, padding:"7px 12px", fontSize:9, color:"#444444", flexShrink:0, textAlign:"right" }}>{e.duration}</div>
              <div style={{ width:72, padding:"7px 12px", flexShrink:0 }}>
                <span style={{ fontSize:8.5, color:STATUS_C[e.status], letterSpacing:"0.1em", fontWeight:600 }}>{e.status}</span>
              </div>
              <div style={{ flex:1, padding:"7px 12px", fontSize:9, color:"#555555", letterSpacing:"0.03em", lineHeight:1.4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{e.output || <span style={{ color:"#2A2A2A" }}>IN PROGRESS…</span>}</div>
            </div>
          ))}
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
      </div>

      {/* Drawer */}
      {drawer && <ExecDrawer entry={drawer} onClose={() => setDrawer(null)} />}
    </div>
  );
}

function ExecDrawer({ entry, onClose }: { entry: ExecEntry; onClose: () => void }) {
  const [tab, setTab] = useState<"SUMMARY"|"RAW OUTPUT"|"PARSED OUTPUT"|"EL CHANGES"|"TRAJECTORY">("SUMMARY");
  const sc = STATUS_C[entry.status];
  return (
    <div className="flex flex-col flex-shrink-0 overflow-hidden" style={{ width:340, borderLeft:"1px solid #292929", background:"#0D0D0D" }}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{ borderBottom:"1px solid #1E1E1E" }}>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:"#F2F2F2", letterSpacing:"0.12em" }}>EXECUTION #{entry.id}</div>
          <div style={{ fontSize:8.5, color:"#444444", letterSpacing:"0.12em", marginTop:2 }}>{entry.specialist} · {entry.tool}</div>
        </div>
        <button onClick={onClose} style={{ fontSize:14, color:"#444444", background:"transparent", border:"none", cursor:"pointer", fontFamily:"inherit" }}>✕</button>
      </div>

      {/* Tabs */}
      <div className="flex flex-shrink-0" style={{ borderBottom:"1px solid #1E1E1E" }}>
        {(["SUMMARY","RAW OUTPUT","PARSED OUTPUT","EL CHANGES","TRAJECTORY"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ fontSize:8, letterSpacing:"0.1em", padding:"5px 8px", background:"transparent", border:"none", borderBottom:t===tab?"2px solid #E31B23":"2px solid transparent", color:t===tab?"#F2F2F2":"#444444", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>{t}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {tab === "SUMMARY" && (
          <div className="flex flex-col gap-3">
            {[
              { k:"SPECIALIST", v:entry.specialist },
              { k:"TASK",       v:entry.task       },
              { k:"TOOL",       v:entry.tool       },
              { k:"START",      v:entry.ts         },
              { k:"DURATION",   v:entry.duration   },
              { k:"STATUS",     v:entry.status, color:sc },
              { k:"OUTPUT SIZE",v:entry.size      },
            ].map(r => (
              <div key={r.k}>
                <div style={{ fontSize:7.5, color:"#444444", letterSpacing:"0.18em", marginBottom:1 }}>{r.k}</div>
                <div style={{ fontSize:10, color:(r as any).color ?? "#888888", letterSpacing:"0.06em" }}>{r.v}</div>
              </div>
            ))}
          </div>
        )}

        {tab === "PARSED OUTPUT" && (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:"#111111" }}>
                {["PORT","STATE","SERVICE","VERSION"].map(h => (
                  <th key={h} style={{ padding:"5px 8px", fontSize:7.5, color:"#444444", letterSpacing:"0.14em", borderBottom:"1px solid #1A1A1A", textAlign:"left" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PARSED_ROWS.map(r => (
                <tr key={r.port} style={{ borderBottom:"1px solid #111111" }}>
                  <td style={{ padding:"5px 8px", color:"#A0A0A0", fontWeight:700 }}>{r.port}</td>
                  <td style={{ padding:"5px 8px", color:r.state==="OPEN"?"#3FB950":"#D29922", fontSize:9 }}>{r.state}</td>
                  <td style={{ padding:"5px 8px", color:"#666666", fontSize:9 }}>{r.service}</td>
                  <td style={{ padding:"5px 8px", color:"#444444", fontSize:8.5 }}>{r.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "RAW OUTPUT" && (
          <pre style={{ fontSize:9, color:"#555555", lineHeight:1.7, fontFamily:"inherit", whiteSpace:"pre-wrap", margin:0 }}>
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
          </pre>
        )}

        {tab === "EL CHANGES" && (
          <div className="flex flex-col gap-2">
            {["SERVICE ssh:22 ADDED","SERVICE http:80 ADDED","SERVICE https:443 ADDED","HOST app.targetcorp.com CONFIRMED"].map(c => (
              <div key={c} className="flex items-center gap-2">
                <span style={{ fontSize:9, color:"#3FB950" }}>+</span>
                <span style={{ fontSize:9, color:"#555555", letterSpacing:"0.06em" }}>{c}</span>
              </div>
            ))}
          </div>
        )}

        {tab === "TRAJECTORY" && (
          <div style={{ fontSize:9, color:"#444444", letterSpacing:"0.06em", lineHeight:1.7 }}>
            STEP 003 · VDG DELTA: RECON-001 → IN_PROGRESS · EL DELTA: +8 facts · COST: $0.00 (deterministic)
          </div>
        )}
      </div>
    </div>
  );
}
