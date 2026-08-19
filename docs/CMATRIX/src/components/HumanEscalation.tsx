import { useState } from "react";

type Reason = "AMBIGUOUS_SCOPE"|"NOVEL_VULNERABILITY"|"HIGH_RISK_ACTION"|"ORACLE_FAILURE"|"COST_THRESHOLD";

const REASONS: {id:Reason;label:string;desc:string;color:string}[] = [
  {id:"AMBIGUOUS_SCOPE",     label:"AMBIGUOUS SCOPE",      desc:"Agent cannot determine if target is in-scope for this engagement",                color:"#D29922"},
  {id:"NOVEL_VULNERABILITY", label:"NOVEL VULNERABILITY",  desc:"Potential zero-day pattern detected — requires human expert verification before exploitation",color:"#E31B23"},
  {id:"HIGH_RISK_ACTION",    label:"HIGH-RISK ACTION",     desc:"Next action may cause irreversible damage or unintended lateral impact",            color:"#FF2A32"},
  {id:"ORACLE_FAILURE",      label:"ORACLE FAILURE",       desc:"Validation oracle returned unexpected result — human review required",              color:"#D29922"},
  {id:"COST_THRESHOLD",      label:"COST THRESHOLD",       desc:"Projected cost exceeds ROE ceiling — explicit authorization required to continue",  color:"#555555"},
];

const CONTEXT_BLOCKS = [
  {k:"MISSION",       v:"CVE-001 — app.targetcorp.com"},
  {k:"CURRENT NODE",  v:"SQLI-001 (IN_PROGRESS, E_ord 4)"},
  {k:"SPECIALIST",    v:"INJECT-SPEC"},
  {k:"RUNTIME",       v:"00:19:04"},
  {k:"COST INCURRED", v:"$0.223"},
  {k:"NEXT ACTION",   v:"sqli_schema_dump() — full DB extraction via time-based blind"},
];

export default function HumanEscalation() {
  const [activeReason,setActiveReason] = useState<Reason>("HIGH_RISK_ACTION");
  const [response,setResponse] = useState("");
  const [submitted,setSubmitted] = useState(false);
  const reason = REASONS.find(r=>r.id===activeReason)!;

  if (submitted) return <EscalationSubmitted />;

  return (
    <div className="flex flex-col h-full" style={{minHeight:0}}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{borderBottom:"1px solid #1E1E1E"}}>
        <div style={{fontSize:9,color:"#666666",letterSpacing:"0.22em",marginBottom:3}}>MISSION / CVE-001</div>
        <div className="flex items-baseline gap-4">
          <h1 style={{fontSize:20,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.12em"}}>HUMAN ESCALATION</h1>
          <div className="flex items-center gap-2">
            <div style={{width:7,height:7,borderRadius:"50%",background:"#FF2A32",animation:"pulse 1.2s ease infinite"}}/>
            <span style={{fontSize:9,color:"#FF2A32",letterSpacing:"0.16em",fontWeight:700}}>AWAITING RESPONSE</span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{minHeight:0}}>
        {/* Left: escalation detail */}
        <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:680}}>
          {/* Alert banner */}
          <div style={{border:`1px solid ${reason.color}44`,background:`${reason.color}0D`,borderRadius:2,padding:"14px 18px",marginBottom:24,borderLeft:`3px solid ${reason.color}`}}>
            <div style={{fontSize:8.5,color:reason.color,letterSpacing:"0.2em",fontWeight:700,marginBottom:4}}>ESCALATION REASON</div>
            <div style={{fontSize:13,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.08em",marginBottom:6}}>{reason.label}</div>
            <div style={{fontSize:10,color:"#888888",lineHeight:1.8}}>{reason.desc}</div>
          </div>

          {/* Reason selector */}
          <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:12}}>ESCALATION CATEGORY</div>
          <div className="flex flex-col gap-2 mb-6">
            {REASONS.map(r=>(
              <div key={r.id} onClick={()=>setActiveReason(r.id)} style={{border:`1px solid ${activeReason===r.id?r.color+"66":"#1E1E1E"}`,borderRadius:2,padding:"10px 14px",cursor:"pointer",background:activeReason===r.id?"#0D0D0D":"transparent",display:"flex",alignItems:"center",gap:12}}
                onMouseEnter={e=>e.currentTarget.style.background="#0A0A0A"} onMouseLeave={e=>e.currentTarget.style.background=activeReason===r.id?"#0D0D0D":"transparent"}>
                <div style={{width:8,height:8,borderRadius:"50%",border:`2px solid ${r.color}`,background:activeReason===r.id?r.color:"transparent",flexShrink:0}}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:9.5,fontWeight:700,color:activeReason===r.id?"#F2F2F2":"#555555",letterSpacing:"0.08em"}}>{r.label}</div>
                  {activeReason===r.id&&<div style={{fontSize:8.5,color:"#444444",marginTop:2,lineHeight:1.5}}>{r.desc}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Mission context */}
          <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:12}}>MISSION CONTEXT</div>
          <div style={{border:"1px solid #1E1E1E",borderRadius:2,overflow:"hidden",marginBottom:24}}>
            {CONTEXT_BLOCKS.map((b,i,a)=>(
              <div key={b.k} className="flex" style={{borderBottom:i<a.length-1?"1px solid #141414":"none",background:i%2?"#0B0B0B":"#0D0D0D"}}>
                <div style={{width:120,flexShrink:0,padding:"8px 14px",fontSize:8,color:"#444444",letterSpacing:"0.18em",fontWeight:600,borderRight:"1px solid #141414"}}>{b.k}</div>
                <div style={{flex:1,padding:"8px 14px",fontSize:10,color:"#888888"}}>{b.v}</div>
              </div>
            ))}
          </div>

          {/* Agent question */}
          <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:12}}>AGENT QUESTION</div>
          <div style={{border:"1px solid #292929",borderRadius:2,padding:"16px 18px",marginBottom:20,background:"#0A0A0A"}}>
            <p style={{fontSize:11,color:"#A0A0A0",lineHeight:1.9,margin:0}}>
              I have confirmed SQL injection in <span style={{color:"#F2F2F2",fontWeight:700}}>/api/users?id=</span> via time-based blind technique (E_ord 4, CONFIRMED). The next step is full schema extraction which will issue approximately <span style={{color:"#D29922"}}>800–1200 additional timed requests</span> over 15–20 minutes, incurring an estimated <span style={{color:"#E31B23"}}>$0.40–0.60</span> additional cost.
              <br/><br/>
              Do you authorize proceeding with database schema dump, or should I halt at current evidence level and proceed to oracle validation only?
            </p>
          </div>

          {/* Response input */}
          <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:8}}>YOUR RESPONSE</div>
          <textarea value={response} onChange={e=>setResponse(e.target.value)}
            placeholder="Type your instructions…"
            style={{width:"100%",minHeight:96,background:"#0D0D0D",border:"1px solid #292929",borderRadius:2,padding:"10px 14px",fontSize:10,color:"#A0A0A0",fontFamily:"inherit",letterSpacing:"0.04em",lineHeight:1.8,resize:"vertical",outline:"none",boxSizing:"border-box"}}
            onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#292929"}
          />
          <div className="flex gap-3 mt-4">
            <button onClick={()=>setSubmitted(true)} disabled={!response.trim()} style={{fontSize:9.5,color:"#F2F2F2",background:response.trim()?"#E31B23":"#1A1A1A",border:"none",borderRadius:2,padding:"8px 20px",letterSpacing:"0.14em",cursor:response.trim()?"pointer":"not-allowed",fontFamily:"inherit",transition:"background 0.15s"}}
              onMouseEnter={e=>response.trim()&&(e.currentTarget.style.background="#FF2A32")} onMouseLeave={e=>response.trim()&&(e.currentTarget.style.background="#E31B23")}>SEND RESPONSE</button>
            <button style={{fontSize:9.5,color:"#3FB950",background:"transparent",border:"1px solid #3FB95044",borderRadius:2,padding:"8px 18px",letterSpacing:"0.14em",cursor:"pointer",fontFamily:"inherit"}}>AUTHORIZE ALL</button>
            <button style={{fontSize:9.5,color:"#FF2A32",background:"transparent",border:"1px solid #FF2A3244",borderRadius:2,padding:"8px 18px",letterSpacing:"0.14em",cursor:"pointer",fontFamily:"inherit"}}>HALT MISSION</button>
          </div>
        </div>

        {/* Right: escalation history */}
        <div className="flex-shrink-0 flex flex-col overflow-y-auto" style={{width:240,borderLeft:"1px solid #1E1E1E",padding:"16px 14px"}}>
          <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:14}}>ESCALATION HISTORY</div>
          {[
            {ts:"06:24:00",type:"COST THRESHOLD",  status:"RESOLVED", response:"Authorized — proceed"},
            {ts:"05:58:00",type:"AMBIGUOUS SCOPE",  status:"RESOLVED", response:"In-scope confirmed"},
            {ts:"04:12:00",type:"ORACLE FAILURE",   status:"RESOLVED", response:"Retry with PREDIQL"},
          ].map((h,i)=>(
            <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:"1px solid #141414"}}>
              <div style={{fontSize:8,color:"#333333",letterSpacing:"0.1em",marginBottom:3}}>{h.ts}</div>
              <div style={{fontSize:9,color:"#666666",fontWeight:600,letterSpacing:"0.08em",marginBottom:2}}>{h.type}</div>
              <div style={{fontSize:8.5,color:"#3FB950",marginBottom:1,letterSpacing:"0.1em"}}>{h.status}</div>
              <div style={{fontSize:8.5,color:"#444444",fontStyle:"italic"}}>"{h.response}"</div>
            </div>
          ))}
          <div style={{marginTop:8,padding:"10px 12px",background:"#110E00",border:"1px solid #D2992233",borderRadius:2}}>
            <div style={{fontSize:8,color:"#D29922",letterSpacing:"0.16em",marginBottom:4}}>AGENT PAUSED</div>
            <div style={{fontSize:8.5,color:"#444444",lineHeight:1.7}}>All specialist threads suspended. Execution agent idle. Awaiting human authorization.</div>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    </div>
  );
}

function EscalationSubmitted() {
  return (
    <div className="flex flex-col h-full items-center justify-center gap-5" style={{minHeight:0}}>
      <div style={{width:40,height:40,borderRadius:"50%",border:"2px solid #3FB950",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{color:"#3FB950",fontSize:18}}>✓</span>
      </div>
      <div style={{fontSize:13,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.1em"}}>RESPONSE SUBMITTED</div>
      <div style={{fontSize:9,color:"#444444",letterSpacing:"0.14em"}}>AGENT RESUMING — SPECIALISTS REACTIVATED</div>
    </div>
  );
}
