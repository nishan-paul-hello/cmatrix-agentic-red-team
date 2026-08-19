import { useState } from "react";

type EvtType = "AUTH"|"MISSION"|"EXECUTION"|"ESCALATION"|"SYSTEM"|"CONFIG";

interface AuditEntry {
  id:string; ts:string; type:EvtType; actor:string; action:string; resource:string;
  result:"SUCCESS"|"FAILURE"|"WARNING"; ip:string; detail:string;
}

const ENTRIES: AuditEntry[] = [
  {id:"AL-0891",ts:"2026-08-19 06:31:04",type:"MISSION",    actor:"TEAM-MANAGER",   action:"ORACLE_DISPATCH",       resource:"CVE-001/SQLI-001",   result:"SUCCESS", ip:"internal",      detail:"Oracle test dispatched to CVE-BENCH FILE ACCESS endpoint"},
  {id:"AL-0890",ts:"2026-08-19 06:30:58",type:"EXECUTION",  actor:"INJECT-SPEC",    action:"SPECIALIST_EVALUATE",   resource:"CVE-001/SQLI-001",   result:"SUCCESS", ip:"internal",      detail:"E_ord raised 3→4. DB-ACCESS-002 unlocked."},
  {id:"AL-0889",ts:"2026-08-19 06:30:51",type:"EXECUTION",  actor:"EXEC-AGENT",     action:"TOOL_EXECUTION",        resource:"curl/sqli_payload",  result:"SUCCESS", ip:"internal",      detail:"time-based SQLi confirmed: RTT 4.18s"},
  {id:"AL-0888",ts:"2026-08-19 06:30:39",type:"MISSION",    actor:"VALID-AGENT",    action:"ORACLE_TEST",           resource:"CVE-001/AUTH-001",   result:"SUCCESS", ip:"internal",      detail:"CVE-BENCH oracle PASS — FILE ACCESS confirmed"},
  {id:"AL-0887",ts:"2026-08-19 06:29:58",type:"EXECUTION",  actor:"INJECT-SPEC",    action:"CONTEXT_COMPACTION",    resource:"S-03",               result:"SUCCESS", ip:"internal",      detail:"Context compacted 94K→48K tokens"},
  {id:"AL-0886",ts:"2026-08-19 06:29:44",type:"EXECUTION",  actor:"INJECT-SPEC",    action:"TOOL_EXECUTION",        resource:"curl/union_probe",   result:"FAILURE", ip:"internal",      detail:"Union-based SQLi failed — column count mismatch"},
  {id:"AL-0885",ts:"2026-08-19 06:29:03",type:"EXECUTION",  actor:"NETWORK-SPEC",   action:"TOOL_EXECUTION",        resource:"nmap/lateral",       result:"WARNING", ip:"internal",      detail:"Port 5432 filtered — timeout after 30s"},
  {id:"AL-0884",ts:"2026-08-19 06:25:33",type:"MISSION",    actor:"RECON-SPEC",     action:"FINDING_RECORDED",      resource:"CVE-001/F-003",      result:"SUCCESS", ip:"internal",      detail:"IDOR confirmed on /api/users/:id — E_ord 3"},
  {id:"AL-0883",ts:"2026-08-19 06:24:00",type:"ESCALATION", actor:"TEAM-MANAGER",   action:"HUMAN_ESCALATION",      resource:"CVE-001",            result:"SUCCESS", ip:"internal",      detail:"Cost threshold escalation — operator authorized continuation"},
  {id:"AL-0882",ts:"2026-08-19 06:22:14",type:"MISSION",    actor:"AUTH-SPEC",      action:"EXPLOIT_CONFIRMED",     resource:"CVE-001/AUTH-001",   result:"SUCCESS", ip:"internal",      detail:"JWT HS256 secret cracked: password123"},
  {id:"AL-0881",ts:"2026-08-19 06:20:00",type:"MISSION",    actor:"TEAM-MANAGER",   action:"UCB_RESCORE",           resource:"CVE-001",            result:"SUCCESS", ip:"internal",      detail:"12 VDG nodes rescored. AUTH-001 selected (UCB=0.91)"},
  {id:"AL-0880",ts:"2026-08-19 06:12:00",type:"MISSION",    actor:"OPERATOR:usr-01",action:"MISSION_START",         resource:"CVE-001",            result:"SUCCESS", ip:"10.0.0.4",      detail:"Mission initiated: target=app.targetcorp.com type=URL"},
  {id:"AL-0879",ts:"2026-08-19 06:11:42",type:"AUTH",       actor:"usr-01",         action:"LOGIN",                 resource:"AUTH",               result:"SUCCESS", ip:"10.0.0.4",      detail:"Interactive session authenticated — MFA verified"},
  {id:"AL-0878",ts:"2026-08-19 06:11:30",type:"AUTH",       actor:"usr-02",         action:"LOGIN",                 resource:"AUTH",               result:"FAILURE", ip:"10.0.0.9",      detail:"Authentication failed — incorrect password (attempt 1/3)"},
  {id:"AL-0877",ts:"2026-08-18 22:14:01",type:"CONFIG",     actor:"usr-01",         action:"CONFIG_CHANGE",         resource:"SETTINGS/ROE",       result:"SUCCESS", ip:"10.0.0.4",      detail:"MAX_RUNTIME updated: 4h→8h"},
  {id:"AL-0876",ts:"2026-08-18 22:13:50",type:"SYSTEM",     actor:"SYSTEM",         action:"BENCHMARK_COMPLETE",    resource:"B-031",              result:"SUCCESS", ip:"internal",      detail:"CVE-BENCH v2 Full completed: score 81.2%"},
];

const TYPE_C: Record<EvtType,{c:string;bg:string}> = {
  AUTH:       {c:"#3B82F6",bg:"#060E1A"},
  MISSION:    {c:"#E31B23",bg:"#120608"},
  EXECUTION:  {c:"#666666",bg:"#0D0D0D"},
  ESCALATION: {c:"#D29922",bg:"#110E00"},
  SYSTEM:     {c:"#3FB950",bg:"#061A0C"},
  CONFIG:     {c:"#A0A0A0",bg:"#111111"},
};
const RESULT_C = {SUCCESS:"#3FB950",FAILURE:"#FF2A32",WARNING:"#D29922"};

export default function AuditLogPage() {
  const [filter,setFilter] = useState<EvtType|"ALL">("ALL");
  const [result,setResult] = useState<"ALL"|"SUCCESS"|"FAILURE"|"WARNING">("ALL");
  const [sel,setSel] = useState<AuditEntry|null>(null);
  const [search,setSearch] = useState("");

  const visible = ENTRIES.filter(e=>
    (filter==="ALL"||e.type===filter)&&
    (result==="ALL"||(e.result as string)===result)&&
    (!search||e.action.includes(search.toUpperCase())||e.actor.toLowerCase().includes(search.toLowerCase())||e.resource.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full" style={{minHeight:0}}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{borderBottom:"1px solid #1E1E1E"}}>
        <div style={{fontSize:9,color:"#666666",letterSpacing:"0.22em",marginBottom:3}}>SYSTEM</div>
        <div className="flex items-baseline justify-between">
          <h1 style={{fontSize:20,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.12em"}}>AUDIT LOG</h1>
          <div className="flex items-center gap-4">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="SEARCH…"
              style={{background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"4px 10px",fontSize:9,color:"#A0A0A0",fontFamily:"inherit",outline:"none",letterSpacing:"0.08em",width:160}}
              onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#1E1E1E"}/>
            <span style={{fontSize:8.5,color:"#333333",letterSpacing:"0.12em"}}>{visible.length} EVENTS</span>
          </div>
        </div>
      </div>
      {/* Filter strip */}
      <div className="flex-shrink-0 flex items-center gap-3 px-6 py-2" style={{borderBottom:"1px solid #141414",background:"#0A0A0A",flexWrap:"wrap"}}>
        <div className="flex gap-1">
          {(["ALL","AUTH","MISSION","EXECUTION","ESCALATION","SYSTEM","CONFIG"] as (EvtType|"ALL")[]).map(t=>(
            <button key={t} onClick={()=>setFilter(t)} style={{fontSize:7.5,letterSpacing:"0.12em",padding:"2px 8px",background:filter===t?(TYPE_C[t as EvtType]?.bg??"#120608"):"transparent",border:`1px solid ${filter===t?(TYPE_C[t as EvtType]?.c??"#E31B23"):"#1E1E1E"}`,borderRadius:2,color:filter===t?(TYPE_C[t as EvtType]?.c??"#E31B23"):"#444444",cursor:"pointer",fontFamily:"inherit"}}>{t}</button>
          ))}
        </div>
        <div style={{width:1,height:16,background:"#1E1E1E"}}/>
        <div className="flex gap-1">
          {(["ALL","SUCCESS","FAILURE","WARNING"] as const).map(r=>(
            <button key={r} onClick={()=>setResult(r)} style={{fontSize:7.5,letterSpacing:"0.12em",padding:"2px 8px",background:"transparent",border:`1px solid ${result===r?(RESULT_C[r as keyof typeof RESULT_C]??"#E31B23"):"#1E1E1E"}`,borderRadius:2,color:result===r?(RESULT_C[r as keyof typeof RESULT_C]??"#E31B23"):"#444444",cursor:"pointer",fontFamily:"inherit"}}>{r}</button>
          ))}
        </div>
      </div>
      {/* Table + drawer */}
      <div className="flex flex-1 overflow-hidden" style={{minHeight:0}}>
        <div className="flex-1 overflow-y-auto">
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"#0F0F0F",position:"sticky",top:0}}>
              {["ID","TIMESTAMP","TYPE","ACTOR","ACTION","RESOURCE","RESULT"].map(h=>(
                <th key={h} style={{padding:"5px 12px",textAlign:"left",fontSize:7.5,color:"#444444",letterSpacing:"0.16em",borderBottom:"1px solid #1A1A1A",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {visible.map(e=>{
                const tc=TYPE_C[e.type]; const rc=RESULT_C[e.result];
                return (
                  <tr key={e.id} onClick={()=>setSel(sel?.id===e.id?null:e)} style={{borderBottom:"1px solid #0E0E0E",cursor:"pointer",background:sel?.id===e.id?"#0D0D0D":"transparent"}}
                    onMouseEnter={ev=>ev.currentTarget.style.background="#0A0A0A"} onMouseLeave={ev=>ev.currentTarget.style.background=sel?.id===e.id?"#0D0D0D":"transparent"}>
                    <td style={{padding:"7px 12px",color:"#333333",fontSize:8.5}}>{e.id}</td>
                    <td style={{padding:"7px 12px",color:"#333333",fontSize:8.5,whiteSpace:"nowrap"}}>{e.ts}</td>
                    <td style={{padding:"7px 12px"}}><span style={{fontSize:8,color:tc.c,background:tc.bg,border:`1px solid ${tc.c}33`,borderRadius:2,padding:"1px 5px",letterSpacing:"0.1em",fontWeight:600}}>{e.type}</span></td>
                    <td style={{padding:"7px 12px",color:"#666666",fontSize:9,letterSpacing:"0.04em"}}>{e.actor}</td>
                    <td style={{padding:"7px 12px",color:"#A0A0A0",fontSize:9,letterSpacing:"0.04em",fontWeight:600}}>{e.action}</td>
                    <td style={{padding:"7px 12px",color:"#444444",fontSize:9}}>{e.resource}</td>
                    <td style={{padding:"7px 12px"}}><span style={{fontSize:8.5,color:rc,letterSpacing:"0.1em",fontWeight:600}}>{e.result}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sel&&(
          <div className="flex-shrink-0 flex flex-col overflow-y-auto" style={{width:300,borderLeft:"1px solid #292929",background:"#0D0D0D"}}>
            <div className="flex justify-between items-start px-4 pt-4 pb-3" style={{borderBottom:"1px solid #1E1E1E"}}>
              <div><div style={{fontSize:11,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.1em"}}>{sel.id}</div><div style={{fontSize:8.5,color:"#444444",marginTop:2}}>{sel.ts}</div></div>
              <button onClick={()=>setSel(null)} style={{color:"#444444",background:"transparent",border:"none",cursor:"pointer",fontSize:14}}>✕</button>
            </div>
            <div className="px-4 py-4 flex flex-col gap-4">
              {[{k:"TYPE",v:sel.type,c:TYPE_C[sel.type].c},{k:"ACTOR",v:sel.actor},{k:"ACTION",v:sel.action},{k:"RESOURCE",v:sel.resource},{k:"RESULT",v:sel.result,c:RESULT_C[sel.result]},{k:"IP / SOURCE",v:sel.ip},{k:"DETAIL",v:sel.detail}].map(r=>(
                <div key={r.k}><div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:3}}>{r.k}</div><div style={{fontSize:10,color:(r as any).c??"#888888",lineHeight:1.6}}>{r.v}</div></div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
