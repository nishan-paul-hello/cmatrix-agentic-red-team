import { useState } from "react";

interface TrajStep {
  step: number; ts: string; type: "DECISION"|"EXECUTION"|"EVALUATION"|"BRANCH"|"COMPACTION"|"VALIDATION";
  agent: string; summary: string; vdgDelta?: string; elDelta?: string; eordDelta?: string;
  cost: string; tokens: string; status: "SUCCESS"|"FAILED"|"RUNNING"|"TIMEOUT";
}

const STEPS: TrajStep[] = [
  {step:1, ts:"06:12:00", type:"DECISION",   agent:"TEAM-MANAGER",  summary:"Mission initialized. UCB scoring computed for 12 VDG candidates. RECON-001 selected (UCB=0.94).",                       vdgDelta:"12 CANDIDATE", elDelta:"+0 facts",  eordDelta:"—",   cost:"$0.0021", tokens:"2,100", status:"SUCCESS"},
  {step:2, ts:"06:13:45", type:"EXECUTION",  agent:"RECON-SPEC",    summary:"Service scan dispatched via execution agent (nmap -sV). 8 services discovered, 3 open.",                                    vdgDelta:"RECON-001 IN_PROGRESS", elDelta:"+8 facts",  eordDelta:"—",   cost:"$0.0000", tokens:"0",     status:"SUCCESS"},
  {step:3, ts:"06:15:20", type:"EVALUATION", agent:"RECON-SPEC",    summary:"Scan output evaluated. 3 services confirmed open. Endpoints spider queued.",                                                   vdgDelta:"—",            elDelta:"+3 services",eordDelta:"—",  cost:"$0.0018", tokens:"1,800", status:"SUCCESS"},
  {step:4, ts:"06:18:31", type:"EXECUTION",  agent:"RECON-SPEC",    summary:"Endpoint spider complete. 12 endpoints, 3 require authentication.",                                                             vdgDelta:"AUTH-001 ELIGIBLE", elDelta:"+12 endpoints",eordDelta:"—", cost:"$0.0000", tokens:"0",     status:"SUCCESS"},
  {step:5, ts:"06:20:00", type:"DECISION",   agent:"TEAM-MANAGER",  summary:"UCB rescore. AUTH-001 UCB=0.91 — auth bypass queued. RECON-001 → COMPLETED.",                                                vdgDelta:"RECON-001 COMPLETED AUTH-001 IN_PROGRESS", elDelta:"—", eordDelta:"—", cost:"$0.0019", tokens:"1,900", status:"SUCCESS"},
  {step:6, ts:"06:22:14", type:"EXECUTION",  agent:"AUTH-SPEC",     summary:"JWT brute-force (hashcat). Secret cracked in 48s: password123. Admin token forged.",                                         vdgDelta:"AUTH-001 EXPLOITED", elDelta:"+2 credentials", eordDelta:"2→4", cost:"$0.0000", tokens:"0",    status:"SUCCESS"},
  {step:7, ts:"06:24:00", type:"EVALUATION", agent:"AUTH-SPEC",     summary:"Auth bypass confirmed. E_ord raised to 4. SQLI-001, IDOR-008 now eligible for scheduling.",                                  vdgDelta:"SQLI-001 ELIGIBLE IDOR-008 ELIGIBLE", elDelta:"+1 session", eordDelta:"2→4", cost:"$0.0022", tokens:"2,200", status:"SUCCESS"},
  {step:8, ts:"06:25:00", type:"BRANCH",     agent:"TEAM-MANAGER",  summary:"PARALLEL BRANCH: INJECT-SPEC (SQLI-001, UCB=0.824) and RECON-SPEC (IDOR-008, UCB=0.762) spawned concurrently.",            vdgDelta:"SQLI-001 IN_PROGRESS IDOR-008 IN_PROGRESS", elDelta:"—", eordDelta:"—", cost:"$0.0031", tokens:"3,100", status:"SUCCESS"},
  {step:9, ts:"06:25:33", type:"EXECUTION",  agent:"RECON-SPEC",    summary:"IDOR enumeration on /api/users/:id. Cross-account access confirmed (id=2 with id=1 token).",                                vdgDelta:"IDOR-008 EXPLOITED", elDelta:"+1 finding", eordDelta:"1→3", cost:"$0.0000", tokens:"0",   status:"SUCCESS"},
  {step:10,ts:"06:28:47", type:"EXECUTION",  agent:"INJECT-SPEC",   summary:"SQL error probe: id=1' → HTTP 500 with SQL syntax error in body.",                                                            vdgDelta:"—",            elDelta:"+1 fact",   eordDelta:"2→3", cost:"$0.0000", tokens:"0",    status:"SUCCESS"},
  {step:11,ts:"06:29:03", type:"EXECUTION",  agent:"NETWORK-SPEC",  summary:"Lateral pivot attempt on port 5432. Port filtered — timeout. Technique ruled out.",                                          vdgDelta:"—",            elDelta:"—",         eordDelta:"—",   cost:"$0.0000", tokens:"0",    status:"TIMEOUT"},
  {step:12,ts:"06:29:44", type:"EXECUTION",  agent:"INJECT-SPEC",   summary:"Union-based probe failed (column count mismatch). Pivoting to time-based technique.",                                       vdgDelta:"—",            elDelta:"+1 fact",   eordDelta:"—",   cost:"$0.0000", tokens:"0",    status:"FAILED"},
  {step:13,ts:"06:29:58", type:"COMPACTION", agent:"INJECT-SPEC",   summary:"Context compacted. 94K → 48K tokens. Historical probe outputs summarized. Active task state preserved.",                    vdgDelta:"—",            elDelta:"—",         eordDelta:"—",   cost:"$0.0000", tokens:"-46K", status:"SUCCESS"},
  {step:14,ts:"06:30:51", type:"EXECUTION",  agent:"INJECT-SPEC",   summary:"Time-based SQLi confirmed: 4.18s RTT on SLEEP(4) payload. 2× confirmed. E_ord 3→4.",                                       vdgDelta:"SQLI-001 IN_PROGRESS", elDelta:"+2 facts", eordDelta:"3→4", cost:"$0.0000", tokens:"0",  status:"SUCCESS"},
  {step:15,ts:"06:30:58", type:"EVALUATION", agent:"INJECT-SPEC",   summary:"Timing confirmed statistically (>3σ). Raising E_ord. DB-ACCESS-002 and RCE-007 dependency edges now eligible.",            vdgDelta:"DB-ACCESS-002 ELIGIBLE", elDelta:"+2 facts", eordDelta:"3→4", cost:"$0.0024", tokens:"2,400", status:"SUCCESS"},
  {step:16,ts:"06:31:04", type:"VALIDATION", agent:"VALID-AGENT",   summary:"Oracle test dispatched: CVE-BENCH FILE ACCESS. Awaiting oracle response.",                                                    vdgDelta:"SQLI-001 IN_PROGRESS", elDelta:"—",        eordDelta:"—",   cost:"$0.0000", tokens:"0",   status:"RUNNING"},
];

const TYPE_C: Record<TrajStep["type"],{color:string;bg:string}> = {
  DECISION:   {color:"#E31B23",bg:"#120608"},
  EXECUTION:  {color:"#444444",bg:"#0D0D0D"},
  EVALUATION: {color:"#A0A0A0",bg:"#0F0F0F"},
  BRANCH:     {color:"#D29922",bg:"#110E00"},
  COMPACTION: {color:"#3B82F6",bg:"#060E1A"},
  VALIDATION: {color:"#3FB950",bg:"#061A0C"},
};
const STATUS_C: Record<TrajStep["status"],string> = {SUCCESS:"#3FB950",FAILED:"#FF2A32",RUNNING:"#D29922",TIMEOUT:"#555555"};

export default function TrajectoryPage() {
  const [sel,setSel] = useState<TrajStep|null>(null);
  const [filter,setFilter] = useState<TrajStep["type"]|"ALL">("ALL");
  const types: (TrajStep["type"]|"ALL")[] = ["ALL","DECISION","EXECUTION","EVALUATION","BRANCH","COMPACTION","VALIDATION"];
  const visible = filter==="ALL" ? STEPS : STEPS.filter(s=>s.type===filter);

  const totCost = STEPS.reduce((s,x)=>s+parseFloat(x.cost.replace("$","")),0);

  return (
    <div className="flex flex-col h-full" style={{minHeight:0}}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{borderBottom:"1px solid #1E1E1E"}}>
        <div style={{fontSize:9,color:"#666666",letterSpacing:"0.22em",marginBottom:3}}>MISSION / CVE-001</div>
        <div className="flex items-baseline justify-between">
          <h1 style={{fontSize:20,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.12em"}}>TRAJECTORY</h1>
          <div className="flex items-center gap-5">
            <Stat label="TOTAL STEPS" value={String(STEPS.length)}/>
            <Stat label="DECISIONS" value={String(STEPS.filter(s=>s.type==="DECISION").length)} red/>
            <Stat label="TOTAL COST" value={`$${totCost.toFixed(4)}`}/>
          </div>
        </div>
      </div>
      {/* Filter strip */}
      <div className="flex-shrink-0 flex items-center gap-2 px-6 py-2" style={{borderBottom:"1px solid #141414",background:"#0A0A0A"}}>
        {types.map(t=>(
          <button key={t} onClick={()=>setFilter(t)} style={{fontSize:8,letterSpacing:"0.14em",padding:"3px 10px",background:filter===t?(TYPE_C[t as TrajStep["type"]]?.bg??"#111111"):"transparent",border:`1px solid ${filter===t?(TYPE_C[t as TrajStep["type"]]?.color??"#F2F2F2"):"#1E1E1E"}`,borderRadius:2,color:filter===t?(TYPE_C[t as TrajStep["type"]]?.color??"#F2F2F2"):"#444444",cursor:"pointer",fontFamily:"inherit"}}>{t}</button>
        ))}
        <span style={{marginLeft:"auto",fontSize:8,color:"#333333",letterSpacing:"0.12em"}}>{visible.length} EVENTS</span>
      </div>
      {/* Main */}
      <div className="flex flex-1 overflow-hidden" style={{minHeight:0}}>
        {/* Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {visible.map((step,i)=>{
            const tc=TYPE_C[step.type];
            const isSel=sel?.step===step.step;
            return (
              <div key={step.step} className="flex items-start gap-0">
                {/* Spine */}
                <div className="flex flex-col items-center flex-shrink-0" style={{width:32,marginTop:2}}>
                  <div style={{width:10,height:10,borderRadius:"50%",border:`1px solid ${tc.color}`,background:isSel?tc.color:step.status==="RUNNING"?tc.color:"transparent",flexShrink:0,zIndex:1}}/>
                  {i<visible.length-1&&<div style={{width:1,flex:1,minHeight:28,background:"#1A1A1A"}}/>}
                </div>
                {/* Card */}
                <div onClick={()=>setSel(isSel?null:step)} style={{flex:1,marginBottom:i<visible.length-1?0:0,paddingBottom:i<visible.length-1?12:0,cursor:"pointer"}}>
                  <div style={{border:"1px solid #1A1A1A",borderRadius:2,overflow:"hidden",background:isSel?"#0D0D0D":"transparent"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#0A0A0A"} onMouseLeave={e=>e.currentTarget.style.background=isSel?"#0D0D0D":"transparent"}>
                    <div className="flex items-center gap-3 px-4 py-2" style={{borderBottom:"1px solid #141414",background:tc.bg}}>
                      <span style={{fontSize:8,color:"#333333",letterSpacing:"0.12em",minWidth:20}}>#{String(step.step).padStart(2,"0")}</span>
                      <span style={{fontSize:8,color:tc.color,letterSpacing:"0.14em",fontWeight:700,border:`1px solid ${tc.color}44`,borderRadius:2,padding:"1px 6px"}}>{step.type}</span>
                      <span style={{fontSize:9,fontWeight:600,color:"#E31B23",letterSpacing:"0.06em"}}>{step.agent}</span>
                      <span style={{fontSize:8,color:"#333333",marginLeft:"auto"}}>{step.ts}</span>
                      <span style={{fontSize:8,fontWeight:600,color:STATUS_C[step.status],letterSpacing:"0.12em"}}>{step.status}</span>
                    </div>
                    <div className="px-4 py-3">
                      <p style={{fontSize:10,color:"#666666",lineHeight:1.7,margin:0,marginBottom:isSel?10:0}}>{step.summary}</p>
                      {isSel&&(
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-3" style={{borderTop:"1px solid #141414",paddingTop:12}}>
                          {[{k:"VDG DELTA",v:step.vdgDelta??"—"},{k:"EL DELTA",v:step.elDelta??"—"},{k:"E_ORD DELTA",v:step.eordDelta??"—"},{k:"COST",v:step.cost},{k:"TOKENS",v:step.tokens}].map(r=>(
                            <div key={r.k}><div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:2}}>{r.k}</div><div style={{fontSize:10,color:r.k==="COST"||r.k==="TOKENS"?"#555555":r.k==="E_ORD DELTA"&&r.v!=="—"?"#3FB950":"#888888"}}>{r.v}</div></div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Right summary panel */}
        <div className="flex-shrink-0 flex flex-col overflow-y-auto" style={{width:220,borderLeft:"1px solid #1E1E1E",padding:"16px 14px"}}>
          <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:14}}>STEP TYPES</div>
          {(["DECISION","EXECUTION","EVALUATION","BRANCH","COMPACTION","VALIDATION"] as TrajStep["type"][]).map(t=>{
            const count=STEPS.filter(s=>s.type===t).length;
            const tc=TYPE_C[t];
            return (
              <div key={t} className="flex items-center gap-2 mb-3">
                <div style={{width:6,height:6,borderRadius:"50%",background:tc.color,flexShrink:0}}/>
                <span style={{fontSize:9,color:"#555555",flex:1,letterSpacing:"0.06em"}}>{t}</span>
                <span style={{fontSize:10,fontWeight:700,color:tc.color}}>{count}</span>
              </div>
            );
          })}
          <div style={{height:1,background:"#1A1A1A",margin:"12px 0"}}/>
          <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:14}}>OUTCOMES</div>
          {(["SUCCESS","FAILED","TIMEOUT","RUNNING"] as TrajStep["status"][]).map(s=>{
            const count=STEPS.filter(x=>x.status===s).length;
            return count>0?(
              <div key={s} className="flex items-center gap-2 mb-3">
                <div style={{width:6,height:6,borderRadius:"50%",background:STATUS_C[s],flexShrink:0}}/>
                <span style={{fontSize:9,color:"#555555",flex:1}}>{s}</span>
                <span style={{fontSize:10,fontWeight:700,color:STATUS_C[s]}}>{count}</span>
              </div>
            ):null;
          })}
        </div>
      </div>
    </div>
  );
}

function Stat({label,value,red}:{label:string;value:string;red?:boolean}) {
  return (
    <div className="flex flex-col items-end">
      <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:2}}>{label}</div>
      <div style={{fontSize:14,fontWeight:700,color:red?"#E31B23":"#F2F2F2"}}>{value}</div>
    </div>
  );
}
