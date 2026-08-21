import { useState } from "react";

type SpecStatus = "RUNNING"|"IDLE"|"QUEUED"|"WAITING"|"VALIDATING"|"COMPLETED"|"FAILED"|"BLOCKED";

interface Spec {
  id: string; role: string; status: SpecStatus; task: string;
  context: string; evidence: number; node: string; failures: number; skills: number;
}

const ALL: Spec[] = [
  { id:"S-01", role:"RECON SPECIALIST",     status:"COMPLETED",  task:"recon_target()",         context:"COMPACTED",  evidence:34, node:"RECON-001",    failures:2, skills:3 },
  { id:"S-02", role:"AUTH SPECIALIST",      status:"COMPLETED",  task:"exploit_auth()",         context:"COMPACTED",  evidence:12, node:"AUTH-001",     failures:1, skills:2 },
  { id:"S-03", role:"INJECTION SPECIALIST", status:"RUNNING",    task:"sqli_blind_time()",      context:"FRESH",      evidence:7,  node:"SQLI-001",     failures:1, skills:4 },
  { id:"S-04", role:"VALIDATION AGENT",     status:"VALIDATING", task:"oracle_test(AUTH-001)",  context:"FRESH",      evidence:4,  node:"AUTH-001",     failures:0, skills:1 },
  { id:"S-05", role:"LOGIC SPECIALIST",     status:"IDLE",       task:"—",                      context:"—",          evidence:0,  node:"—",            failures:0, skills:2 },
  { id:"S-06", role:"XSS SPECIALIST",       status:"QUEUED",     task:"xss_reflect_scan()",     context:"PENDING",    evidence:0,  node:"XSS-002",      failures:0, skills:3 },
  { id:"S-07", role:"NETWORK SPECIALIST",   status:"BLOCKED",    task:"lateral_pivot()",        context:"STALE",      evidence:2,  node:"DB-ACCESS-002",failures:3, skills:2 },
  { id:"S-08", role:"EVAL AGENT",           status:"COMPLETED",  task:"eval_evidence(SQLI-001)",context:"COMPACTED",  evidence:9,  node:"SQLI-001",     failures:0, skills:1 },
];

const DOT: Record<SpecStatus, string> = {
  RUNNING:"#E31B23", IDLE:"#333333", QUEUED:"#555555", WAITING:"#D29922",
  VALIDATING:"#FF2A32", COMPLETED:"#3FB950", FAILED:"#FF2A32", BLOCKED:"#6F171B",
};
const BADGE_BG: Record<SpecStatus, string> = {
  RUNNING:"#1A0608", IDLE:"transparent", QUEUED:"transparent", WAITING:"#1A1200",
  VALIDATING:"#1A0608", COMPLETED:"#0A1A10", FAILED:"#1A0608", BLOCKED:"#0D0808",
};

const TIMELINE = [
  { ts:"06:12:01", event:"SPAWN",            detail:"FRESH context initialized" },
  { ts:"06:12:04", event:"CONTEXT INJECTION",detail:"Mission metadata + EL snapshot (87 facts) injected" },
  { ts:"06:12:09", event:"TASK EXECUTION",   detail:"sqli_blind_time() dispatched to execution agent" },
  { ts:"06:29:03", event:"OUTPUT",           detail:"Response delta 4.18s — timing confirmed" },
  { ts:"06:29:08", event:"EVALUATION",       detail:"E_ord raised 3→4 by eval agent" },
  { ts:"06:31:04", event:"HANDOFF",          detail:"Evidence returned to team manager — UCB updated" },
];

export default function Specialists() {
  const [detail, setDetail] = useState<Spec|null>(null);
  return detail ? <SpecDetail spec={detail} onBack={() => setDetail(null)} /> : <SpecGrid onSelect={setDetail} />;
}

function SpecGrid({ onSelect }: { onSelect: (s: Spec) => void }) {
  return (
    <div className="flex flex-col h-full" style={{ minHeight:0 }}>
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom:"1px solid #1E1E1E" }}>
        <div style={{ fontSize:9, color:"#666666", letterSpacing:"0.22em", marginBottom:3 }}>MISSION</div>
        <div className="flex items-baseline gap-3">
          <h1 style={{ fontSize:20, fontWeight:700, color:"#F2F2F2", letterSpacing:"0.12em" }}>SPECIALISTS</h1>
          <span style={{ fontSize:10, color:"#444444", letterSpacing:"0.18em" }}>AGENT ROSTER · CVE-001</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="grid grid-cols-4 gap-3">
          {ALL.map(s => {
            const dot = DOT[s.status], bg = BADGE_BG[s.status];
            const running = s.status === "RUNNING" || s.status === "VALIDATING";
            return (
              <button key={s.id} onClick={() => onSelect(s)} className="flex flex-col text-left"
                style={{ background:"#0D0D0D", border:`1px solid ${running?"#E31B23":"#1E1E1E"}`, borderRadius:2, padding:"14px 14px 12px", cursor:"pointer", fontFamily:"inherit", position:"relative", transition:"border-color 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor=running?"#FF2A32":"#333333"}
                onMouseLeave={e => e.currentTarget.style.borderColor=running?"#E31B23":"#1E1E1E"}>
                {running && <div style={{ position:"absolute", inset:-3, border:"1px solid #E31B2330", borderRadius:3, pointerEvents:"none", animation:"ring 2s ease infinite" }} />}
                <div className="flex items-center justify-between mb-2">
                  <div style={{ width:8, height:8, borderRadius:"50%", background: s.status!=="IDLE"&&s.status!=="QUEUED" ? dot : "transparent", border:`1px solid ${dot}`, flexShrink:0, animation: running?"pulse 1.4s ease infinite":"none" }} />
                  <span style={{ fontSize:8, color:dot, background:bg, border:`1px solid ${dot}44`, borderRadius:2, padding:"1px 5px", letterSpacing:"0.12em", fontWeight:600 }}>{s.status}</span>
                </div>
                <div style={{ fontSize:10, fontWeight:700, color:"#A0A0A0", letterSpacing:"0.1em", marginBottom:4, lineHeight:1.3 }}>{s.role}</div>
                <div style={{ fontSize:8.5, color:"#444444", letterSpacing:"0.06em", marginBottom:10, minHeight:28 }}>{s.task}</div>
                <div style={{ height:1, background:"#1A1A1A", marginBottom:8 }} />
                <div className="grid grid-cols-2 gap-1">
                  <Kv k="NODE"    v={s.node} />
                  <Kv k="CTX"     v={s.context} />
                  <Kv k="EL"      v={String(s.evidence)} />
                  <Kv k="FAILURES" v={String(s.failures)} red={s.failures>0} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <style>{`@keyframes ring{0%,100%{opacity:.5}50%{opacity:.1}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

function SpecDetail({ spec, onBack }: { spec: Spec; onBack: () => void }) {
  const dot = DOT[spec.status];
  return (
    <div className="flex flex-col h-full" style={{ minHeight:0 }}>
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom:"1px solid #1E1E1E" }}>
        <button onClick={onBack} style={{ fontSize:9, color:"#666666", background:"transparent", border:"none", cursor:"pointer", letterSpacing:"0.14em", fontFamily:"inherit", padding:0, marginBottom:10 }}
          onMouseEnter={e => e.currentTarget.style.color="#A0A0A0"} onMouseLeave={e => e.currentTarget.style.color="#666666"}>
          ← SPECIALISTS
        </button>
        <div className="flex items-center gap-3">
          <h1 style={{ fontSize:18, fontWeight:700, color:"#F2F2F2", letterSpacing:"0.12em" }}>{spec.role}</h1>
          <span style={{ fontSize:8.5, color:dot, background:BADGE_BG[spec.status], border:`1px solid ${dot}44`, borderRadius:2, padding:"2px 7px", letterSpacing:"0.14em", fontWeight:600 }}>{spec.status}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{ minHeight:0 }}>
        {/* Main */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* Key-value block */}
          <div style={{ border:"1px solid #1E1E1E", borderRadius:2, overflow:"hidden", marginBottom:20 }}>
            {[
              { k:"CURRENT TASK",    v:spec.task     },
              { k:"ASSIGNED NODE",   v:spec.node     },
              { k:"CONTEXT",         v:spec.context  },
              { k:"EL SNAPSHOT",     v:`${spec.evidence} facts` },
              { k:"FAILURE MEMORY",  v:`${spec.failures} relevant reflections` },
              { k:"SKILL LIBRARY",   v:`${spec.skills} matching skills` },
            ].map((r,i,a) => (
              <div key={r.k} className="flex" style={{ borderBottom:i<a.length-1?"1px solid #141414":"none", background:i%2?"#0B0B0B":"#0D0D0D" }}>
                <div style={{ width:140, flexShrink:0, padding:"9px 14px", fontSize:8.5, color:"#444444", letterSpacing:"0.18em", fontWeight:600, borderRight:"1px solid #141414" }}>{r.k}</div>
                <div style={{ flex:1, padding:"9px 14px", fontSize:10, color:"#888888", letterSpacing:"0.04em" }}>{r.v}</div>
              </div>
            ))}
          </div>

          {/* Invocation timeline */}
          <div style={{ fontSize:9, color:"#444444", letterSpacing:"0.2em", marginBottom:14 }}>INVOCATION TIMELINE</div>
          <div className="flex flex-col" style={{ gap:0 }}>
            {TIMELINE.map((t,i) => (
              <div key={t.event} className="flex items-start gap-4">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div style={{ width:8, height:8, borderRadius:1, border:`1px solid ${i===TIMELINE.length-1?"#E31B23":"#333333"}`, background:i===TIMELINE.length-1?"#E31B23":i<TIMELINE.length-1?"#1A1A1A":"transparent", marginTop:2 }} />
                  {i<TIMELINE.length-1 && <div style={{ width:1, height:28, background:"#1E1E1E" }} />}
                </div>
                <div style={{ paddingBottom: i<TIMELINE.length-1?0:0, marginBottom:4 }}>
                  <div className="flex items-center gap-3 mb-0.5">
                    <span style={{ fontSize:8.5, color:"#333333", letterSpacing:"0.06em" }}>{t.ts}</span>
                    <span style={{ fontSize:9.5, color:i===TIMELINE.length-1?"#E31B23":"#666666", fontWeight:600, letterSpacing:"0.12em" }}>{t.event}</span>
                  </div>
                  <div style={{ fontSize:9, color:"#444444", letterSpacing:"0.04em" }}>{t.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="flex-shrink-0 overflow-y-auto" style={{ width:240, borderLeft:"1px solid #1E1E1E", background:"#0B0B0B" }}>
          <Sidebar label="AGENT ID"><span style={{ fontSize:10, color:"#666666" }}>{spec.id}</span></Sidebar>
          <Sidebar label="SKILL LIBRARY">
            {["sqli_blind_time","sqli_error_based","sqli_union"].slice(0,spec.skills).map(sk => (
              <div key={sk} className="flex items-center gap-2 mb-1">
                <span style={{ fontSize:8, color:"#E31B23" }}>◈</span>
                <span style={{ fontSize:9, color:"#555555", letterSpacing:"0.06em" }}>{sk}()</span>
              </div>
            ))}
          </Sidebar>
          <Sidebar label="FAILURE MEMORY">
            {spec.failures===0
              ? <span style={{ fontSize:9, color:"#333333" }}>No failures recorded</span>
              : Array.from({length:spec.failures}).map((_,i) => (
                  <div key={i} style={{ fontSize:9, color:"#555555", marginBottom:4, lineHeight:1.5 }}>Reflection #{i+1}: payload timeout on FILTERED port</div>
                ))}
          </Sidebar>
          <Sidebar label="CONTEXT UTILIZATION" last>
            <div style={{ height:6, background:"#111111", border:"1px solid #1E1E1E", borderRadius:2, overflow:"hidden" }}>
              <div style={{ width:`${spec.context==="FRESH"?12:spec.context==="COMPACTED"?31:0}%`, height:"100%", background:"#E31B23" }} />
            </div>
            <div style={{ fontSize:8, color:"#444444", marginTop:4, letterSpacing:"0.1em" }}>{spec.context==="FRESH"?"12%":spec.context==="COMPACTED"?"31% (post-compaction)":"—"}</div>
          </Sidebar>
        </div>
      </div>
    </div>
  );
}

function Kv({ k, v, red }: { k: string; v: string; red?: boolean }) {
  return (
    <div>
      <div style={{ fontSize:7, color:"#333333", letterSpacing:"0.14em" }}>{k}</div>
      <div style={{ fontSize:9, color:red?"#E31B23":"#555555", letterSpacing:"0.06em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v}</div>
    </div>
  );
}
function Sidebar({ label, children, last }: { label:string; children:React.ReactNode; last?:boolean }) {
  return (
    <div className="px-4 py-4" style={{ borderBottom:last?"none":"1px solid #1E1E1E" }}>
      <div style={{ fontSize:8, color:"#444444", letterSpacing:"0.2em", marginBottom:8 }}>{label}</div>
      {children}
    </div>
  );
}
