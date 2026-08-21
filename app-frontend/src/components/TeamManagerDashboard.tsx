import { useState, useEffect } from "react";

/* ── UCB data ── */
interface VDGEntry {
  id: string; type: string; status: "ELIGIBLE"|"IN_PROGRESS"|"EXPLOITED"|"BLOCKED"|"DEPRIORITIZED";
  ucb: number; exploit: number; explore: number; visits: number; eord: number; cost: string; specialist: string|null;
}

const VDG: VDGEntry[] = [
  {id:"SQLI-001",  type:"SQL INJECTION",       status:"IN_PROGRESS",  ucb:0.891, exploit:0.712, explore:0.179, visits:4,  eord:4, cost:"$0.084",  specialist:"INJECT-SPEC"},
  {id:"AUTH-001",  type:"AUTH BYPASS",          status:"EXPLOITED",    ucb:0.000, exploit:0.910, explore:0.000, visits:9,  eord:5, cost:"$0.054",  specialist:null},
  {id:"IDOR-008",  type:"ACCESS CONTROL",       status:"EXPLOITED",    ucb:0.000, exploit:0.780, explore:0.000, visits:3,  eord:4, cost:"$0.019",  specialist:null},
  {id:"DB-ACCESS-002",type:"DATABASE ACCESS",   status:"ELIGIBLE",     ucb:0.762, exploit:0.680, explore:0.082, visits:0,  eord:0, cost:"—",        specialist:null},
  {id:"RCE-007",   type:"REMOTE CODE EXEC",     status:"ELIGIBLE",     ucb:0.721, exploit:0.640, explore:0.081, visits:0,  eord:0, cost:"—",        specialist:null},
  {id:"XSS-002",   type:"CROSS SITE SCRIPTING", status:"ELIGIBLE",     ucb:0.644, exploit:0.520, explore:0.124, visits:1,  eord:2, cost:"$0.008",  specialist:null},
  {id:"CSRF-003",  type:"CSRF",                 status:"ELIGIBLE",     ucb:0.598, exploit:0.490, explore:0.108, visits:1,  eord:2, cost:"$0.006",  specialist:null},
  {id:"PATH-005",  type:"PATH TRAVERSAL",       status:"DEPRIORITIZED",ucb:0.312, exploit:0.310, explore:0.002, visits:2,  eord:1, cost:"$0.004",  specialist:null},
  {id:"XXE-009",   type:"XXE INJECTION",        status:"BLOCKED",      ucb:0.000, exploit:0.210, explore:0.000, visits:0,  eord:0, cost:"—",        specialist:null},
];

const SPECIALISTS = [
  {id:"S-01",role:"RECON-SPEC",   status:"COMPLETED", task:"recon_target()",       node:"RECON-001", score:0.940},
  {id:"S-02",role:"AUTH-SPEC",    status:"COMPLETED", task:"exploit_auth()",        node:"AUTH-001",  score:0.910},
  {id:"S-03",role:"INJECT-SPEC",  status:"RUNNING",   task:"sqli_blind_time()",     node:"SQLI-001",  score:0.891},
  {id:"S-04",role:"VALID-AGENT",  status:"WAITING",   task:"oracle_test(AUTH-001)", node:"SQLI-001",  score:0.762},
  {id:"S-05",role:"NETWORK-SPEC", status:"IDLE",      task:"—",                     node:"—",         score:0.000},
];

const SCHED = [
  {step:"NEXT",    node:"DB-ACCESS-002", ucb:0.762, eta:"~2min", reason:"SQLI-001 EXPLOITED → dependency unlocked"},
  {step:"QUEUED",  node:"RCE-007",       ucb:0.721, eta:"~5min", reason:"Depends on DB-ACCESS-002"},
  {step:"QUEUED",  node:"XSS-002",       ucb:0.644, eta:"~7min", reason:"Parallel — no dependency"},
];

const STATUS_C: Record<VDGEntry["status"],string> = {
  ELIGIBLE:"#E31B23", IN_PROGRESS:"#FF2A32", EXPLOITED:"#3FB950", BLOCKED:"#333333", DEPRIORITIZED:"#555555",
};
const SPEC_C: Record<string,string> = {COMPLETED:"#3FB950",RUNNING:"#FF2A32",WAITING:"#D29922",IDLE:"#333333"};

export default function TeamManagerDashboard() {
  const [ucbEntry, setUcbEntry] = useState<VDGEntry|null>(null);

  return (
    <div className="flex flex-col h-full" style={{minHeight:0}}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{borderBottom:"1px solid #1E1E1E"}}>
        <div style={{fontSize:9,color:"#666666",letterSpacing:"0.22em",marginBottom:3}}>MISSION / CVE-001</div>
        <div className="flex items-baseline justify-between">
          <h1 style={{fontSize:20,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.12em"}}>TEAM MANAGER</h1>
          <div className="flex items-center gap-6">
            <KPI label="ACTIVE SPECIALISTS" value="1" />
            <KPI label="VDG ELIGIBLE" value={String(VDG.filter(v=>v.status==="ELIGIBLE").length)} red />
            <KPI label="TOTAL COST" value="$1.42" />
            <KPI label="RUNTIME" value="00:19:04" />
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden" style={{minHeight:0}}>
        {/* LEFT: VDG scoring table */}
        <div className="flex flex-col flex-1 overflow-hidden" style={{borderRight:"1px solid #1E1E1E"}}>
          <div style={{padding:"10px 20px 8px",fontSize:8,color:"#444444",letterSpacing:"0.2em",borderBottom:"1px solid #111111",background:"#0A0A0A",flexShrink:0}}>VDG SCORING — UCB POLICY</div>
          <div className="flex-1 overflow-y-auto">
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:"#0F0F0F",position:"sticky",top:0}}>
                  {["NODE","TYPE","STATUS","UCB ↓","EXPLOIT","EXPLORE","VISITS","E_ORD","COST"].map(h=>(
                    <th key={h} style={{padding:"5px 12px",textAlign:h==="UCB ↓"||h==="EXPLOIT"||h==="EXPLORE"||h==="VISITS"||h==="E_ORD"?"right":"left",fontSize:7.5,color:"#444444",letterSpacing:"0.16em",borderBottom:"1px solid #1A1A1A",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VDG.sort((a,b)=>b.ucb-a.ucb).map((v,i)=>(
                  <tr key={v.id} onClick={()=>setUcbEntry(v)} style={{borderBottom:"1px solid #111111",cursor:"pointer",opacity:v.status==="BLOCKED"?0.4:1}}
                    onMouseEnter={e=>e.currentTarget.style.background="#0D0D0D"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"7px 12px",color:"#E31B23",fontWeight:700,fontSize:9.5,letterSpacing:"0.06em"}}>{v.id}</td>
                    <td style={{padding:"7px 12px",color:"#555555",fontSize:9}}>{v.type}</td>
                    <td style={{padding:"7px 12px"}}><span style={{fontSize:8.5,color:STATUS_C[v.status],letterSpacing:"0.1em",fontWeight:600}}>{v.status}</span></td>
                    <td style={{padding:"7px 12px",textAlign:"right"}}>
                      <span style={{fontSize:10,fontWeight:700,color:v.ucb>0.8?"#FF2A32":v.ucb>0.6?"#E31B23":v.ucb>0?"#A0A0A0":"#333333"}}>{v.ucb>0?v.ucb.toFixed(3):"—"}</span>
                    </td>
                    <td style={{padding:"7px 12px",textAlign:"right",fontSize:9,color:"#555555"}}>{v.exploit>0?v.exploit.toFixed(3):"—"}</td>
                    <td style={{padding:"7px 12px",textAlign:"right",fontSize:9,color:"#3FB950"}}>{v.explore>0?v.explore.toFixed(3):"—"}</td>
                    <td style={{padding:"7px 12px",textAlign:"right",fontSize:9,color:"#444444"}}>{v.visits}</td>
                    <td style={{padding:"7px 12px",textAlign:"right",fontSize:9,color:v.eord>=4?"#3FB950":v.eord>=2?"#D29922":"#444444"}}>{v.eord}/5</td>
                    <td style={{padding:"7px 12px",textAlign:"right",fontSize:9,color:"#444444"}}>{v.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: specialists + schedule */}
        <div className="flex flex-col flex-shrink-0 overflow-y-auto" style={{width:280}}>
          {/* Specialists */}
          <div style={{padding:"10px 16px 8px",fontSize:8,color:"#444444",letterSpacing:"0.2em",borderBottom:"1px solid #111111",background:"#0A0A0A"}}>SPECIALIST STATUS</div>
          {SPECIALISTS.map(s=>(
            <div key={s.id} style={{padding:"10px 16px",borderBottom:"1px solid #111111"}}>
              <div className="flex items-center gap-2 mb-1">
                <div style={{width:6,height:6,borderRadius:"50%",background:SPEC_C[s.status]??"#333333",flexShrink:0}}/>
                <span style={{fontSize:10,fontWeight:700,color:"#A0A0A0",letterSpacing:"0.06em",flex:1}}>{s.role}</span>
                <span style={{fontSize:8,color:SPEC_C[s.status]??"#333333",letterSpacing:"0.1em",fontWeight:600}}>{s.status}</span>
              </div>
              <div style={{fontSize:8.5,color:"#333333",letterSpacing:"0.06em",marginBottom:1}}>{s.task}</div>
              {s.score>0&&<div style={{fontSize:8,color:"#E31B23",letterSpacing:"0.1em"}}>UCB={s.score.toFixed(3)}</div>}
            </div>
          ))}
          {/* Schedule */}
          <div style={{padding:"10px 16px 8px",fontSize:8,color:"#444444",letterSpacing:"0.2em",borderBottom:"1px solid #111111",background:"#0A0A0A",borderTop:"1px solid #1E1E1E"}}>NEXT SCHEDULED</div>
          {SCHED.map((s,i)=>(
            <div key={i} style={{padding:"10px 16px",borderBottom:"1px solid #111111"}}>
              <div className="flex items-center gap-2 mb-1">
                <span style={{fontSize:8,color:i===0?"#D29922":"#333333",letterSpacing:"0.14em",fontWeight:700,minWidth:48}}>{s.step}</span>
                <span style={{fontSize:10,color:"#E31B23",fontWeight:700,letterSpacing:"0.06em"}}>{s.node}</span>
                <span style={{fontSize:9,color:"#3FB950",marginLeft:"auto",fontWeight:700}}>{s.ucb.toFixed(3)}</span>
              </div>
              <div style={{fontSize:8,color:"#333333",letterSpacing:"0.06em",lineHeight:1.5}}>{s.reason}</div>
            </div>
          ))}
        </div>
      </div>

      {ucbEntry && <UCBModal entry={ucbEntry} onClose={()=>setUcbEntry(null)}/>}
    </div>
  );
}

/* ── screen 37: UCB BREAKDOWN MODAL ── */
function UCBModal({entry,onClose}:{entry:VDGEntry;onClose:()=>void}) {
  // F10: ESC key closes modal
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const BAR_W = 280;
  const epss = 0.42;
  const bars = [
    {label:"EXPLOIT TERM", value:entry.exploit, color:"#E31B23", desc:"Q(s,a) — average reward from past attempts"},
    {label:"EXPLORE TERM", value:entry.explore, color:"#3FB950", desc:"c × √(ln N / n) — exploration bonus"},
    {label:"EPSS PRIOR",   value:epss,          color:"#D29922", desc:"λ × EPSS score — initial exploitability prior from NVD/FIRST API"},
    {label:"UCB SCORE",    value:entry.ucb,     color:"#FF2A32", desc:"Combined final selection score"},
  ];
  const C = 0.4;
  const N = VDG.reduce((s,v)=>s+v.visits,0);
  const n = entry.visits;
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{background:"#00000099",zIndex:60}} onClick={onClose}>
      <div style={{width:540,background:"#0D0D0D",border:"1px solid #292929",borderRadius:2}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-start px-5 pt-4 pb-3" style={{borderBottom:"1px solid #1E1E1E"}}>
          <div>
            <div style={{fontSize:14,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.1em",marginBottom:2}}>UCB BREAKDOWN</div>
            <div style={{fontSize:9,color:"#E31B23",letterSpacing:"0.1em"}}>{entry.id} — {entry.type}</div>
          </div>
          <button onClick={onClose} style={{color:"#444444",background:"transparent",border:"none",cursor:"pointer",fontSize:16}}>✕</button>
        </div>
        <div className="px-5 py-5">
          {/* Formula */}
          <div style={{background:"#080808",border:"1px solid #1A1A1A",borderRadius:2,padding:"12px 16px",marginBottom:20,textAlign:"center"}}>
            <div style={{fontSize:11,color:"#555555",letterSpacing:"0.08em",marginBottom:6}}>UCB FORMULA</div>
            <div style={{fontSize:13,color:"#A0A0A0",letterSpacing:"0.06em"}}>
              UCB(s) = <span style={{color:"#E31B23"}}>Q(s,a)</span> + <span style={{color:"#3FB950"}}>c × √(ln N / n)</span>
            </div>
            <div style={{fontSize:9,color:"#333333",marginTop:8,letterSpacing:"0.08em"}}>
              c={C} · N={N} total visits · n={n===0?"0 (new node)":n} visits · ln(N)={(Math.log(N||1)).toFixed(3)}
            </div>
            {/* G1: c constant note */}
            <div style={{fontSize:8,color:"#333333",marginTop:6,letterSpacing:"0.1em"}}>UCB POLICY c = {C.toFixed(2)} — configurable in Settings → VDG</div>
          </div>
          {/* Score bars */}
          {bars.map(b=>(
            <div key={b.label} style={{marginBottom:16}}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span style={{fontSize:9,color:"#444444",letterSpacing:"0.18em",fontWeight:600}}>{b.label}</span>
                  <div style={{fontSize:8.5,color:"#333333",marginTop:2}}>{b.desc}</div>
                </div>
                <span style={{fontSize:16,fontWeight:700,color:b.color}}>{b.value.toFixed(3)}</span>
              </div>
              <div style={{height:5,background:"#1A1A1A",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(b.value)*100}%`,background:b.color,borderRadius:2}}/>
              </div>
            </div>
          ))}
          {/* G3: EPSS ONE-DAY mode footnote */}
          <div style={{fontSize:8,color:"#333333",letterSpacing:"0.1em",marginTop:6}}>ONE-DAY mode: Q(s,a) seeded from EPSS prior</div>
          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-0 mt-4" style={{border:"1px solid #1E1E1E",borderRadius:2,overflow:"hidden"}}>
            {[{k:"E_ORD",v:`${entry.eord}/5`},{k:"VISITS",v:String(entry.visits)},{k:"STATUS",v:entry.status},{k:"COST",v:entry.cost}].map((m,i,a)=>(
              <div key={m.k} style={{padding:"10px 12px",borderRight:i<a.length-1?"1px solid #1A1A1A":"none",background:"#0B0B0B"}}>
                <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:4}}>{m.k}</div>
                <div style={{fontSize:13,fontWeight:700,color:m.k==="STATUS"?STATUS_C[entry.status]:"#F2F2F2"}}>{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({label,value,red}:{label:string;value:string;red?:boolean}) {
  return (
    <div className="flex flex-col items-end">
      <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:2}}>{label}</div>
      <div style={{fontSize:14,fontWeight:700,color:red?"#E31B23":"#F2F2F2"}}>{value}</div>
    </div>
  );
}
