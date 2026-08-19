import { useState } from "react";

type VStatus = "PENDING"|"RETRY"|"VALIDATED"|"RULED OUT";
interface VFinding { id:string; type:string; evidence:string; retry:number; status:VStatus; oracle:string; }

const FINDINGS: VFinding[] = [
  { id:"F-001", type:"SQL INJECTION",      evidence:"E_ord 4/5", retry:0, status:"VALIDATED",  oracle:"CVE-BENCH"  },
  { id:"F-002", type:"AUTHENTICATION BYPASS",evidence:"E_ord 3/5",retry:2, status:"RETRY",     oracle:"CVE-BENCH"  },
  { id:"F-003", type:"IDOR",               evidence:"E_ord 4/5", retry:0, status:"VALIDATED",  oracle:"PREDIQL"    },
  { id:"F-004", type:"XSS REFLECTED",      evidence:"E_ord 2/5", retry:0, status:"PENDING",    oracle:"—"          },
  { id:"F-005", type:"SSRF",               evidence:"E_ord 1/5", retry:3, status:"RULED OUT",  oracle:"CVE-BENCH"  },
  { id:"F-006", type:"CSRF",               evidence:"E_ord 2/5", retry:1, status:"PENDING",    oracle:"—"          },
  { id:"F-007", type:"PATH TRAVERSAL",     evidence:"E_ord 3/5", retry:0, status:"PENDING",    oracle:"—"          },
  { id:"F-008", type:"SQL INJECTION",      evidence:"E_ord 4/5", retry:1, status:"RETRY",      oracle:"CVE-BENCH"  },
];

const SB: Record<VStatus,{color:string;bg:string;border:string}> = {
  "PENDING":   {color:"#D29922",bg:"#1A1200",border:"#D2992244"},
  "RETRY":     {color:"#FF2A32",bg:"#1A0608",border:"#FF2A3244"},
  "VALIDATED": {color:"#3FB950",bg:"#0A1A10",border:"#3FB95044"},
  "RULED OUT": {color:"#555555",bg:"#111111",border:"#33333344"},
};

export default function ValidationCenter() {
  const [modal, setModal] = useState(false);
  const [oracleOpen, setOracleOpen] = useState(false);
  const [selected, setSelected] = useState<VFinding|null>(null);
  const metrics = [
    {label:"PENDING VALIDATION",value:"08",color:"#D29922"},
    {label:"VALIDATED",         value:"21",color:"#3FB950"},
    {label:"RULED OUT",         value:"13",color:"#555555"},
    {label:"RETRIES",           value:"17",color:"#FF2A32"},
  ];

  return (
    <div className="flex flex-col h-full" style={{minHeight:0}}>
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{borderBottom:"1px solid #1E1E1E"}}>
        <div style={{fontSize:9,color:"#666666",letterSpacing:"0.22em",marginBottom:3}}>MISSION / CVE-001</div>
        <div className="flex items-center justify-between">
          <h1 style={{fontSize:20,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.12em"}}>VALIDATION CENTER</h1>
          <div className="flex gap-2">
            <Btn onClick={()=>setModal(true)} label="STATE MACHINE" />
            <Btn onClick={()=>setOracleOpen(v=>!v)} label="ORACLE PANEL" red />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex-shrink-0 grid grid-cols-4" style={{borderBottom:"1px solid #1E1E1E"}}>
        {metrics.map((m,i)=>(
          <div key={m.label} style={{padding:"14px 20px",borderRight:i<3?"1px solid #1E1E1E":"none",background:"#0D0D0D"}}>
            <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:6}}>{m.label}</div>
            <div style={{fontSize:28,fontWeight:700,color:m.color,lineHeight:1}}>{m.value}</div>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden" style={{minHeight:0}}>
        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:10.5}}>
            <thead>
              <tr style={{background:"#0F0F0F",position:"sticky",top:0}}>
                {["FINDING","TYPE","EVIDENCE","RETRY","STATUS","ORACLE",""].map(h=>(
                  <th key={h} style={{padding:"6px 16px",textAlign:"left",fontSize:8,color:"#444444",letterSpacing:"0.18em",borderBottom:"1px solid #1A1A1A",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FINDINGS.map(f=>{
                const sb=SB[f.status];
                return (
                  <tr key={f.id} style={{borderBottom:"1px solid #111111",cursor:"pointer"}}
                    onMouseEnter={e=>e.currentTarget.style.background="#0F0F0F"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{padding:"8px 16px",color:"#E31B23",fontWeight:700,letterSpacing:"0.08em"}}>{f.id}</td>
                    <td style={{padding:"8px 16px",color:"#A0A0A0"}}>{f.type}</td>
                    <td style={{padding:"8px 16px",color:"#666666",fontSize:9}}>{f.evidence}</td>
                    <td style={{padding:"8px 16px",color:f.retry>0?"#D29922":"#444444",textAlign:"right"}}>{f.retry}</td>
                    <td style={{padding:"8px 16px"}}>
                      <span style={{fontSize:9,color:sb.color,background:sb.bg,border:`1px solid ${sb.border}`,borderRadius:2,padding:"1px 6px",letterSpacing:"0.12em",fontWeight:600}}>{f.status}</span>
                    </td>
                    <td style={{padding:"8px 16px",color:"#555555",fontSize:9}}>{f.oracle}</td>
                    <td style={{padding:"8px 16px"}}>
                      <button onClick={()=>setSelected(f)} style={{fontSize:8.5,color:"#666666",background:"#111111",border:"1px solid #292929",borderRadius:2,padding:"2px 8px",letterSpacing:"0.1em",cursor:"pointer",fontFamily:"inherit"}}
                        onMouseEnter={e=>e.currentTarget.style.borderColor="#E31B23"}
                        onMouseLeave={e=>e.currentTarget.style.borderColor="#292929"}>DETAIL</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Oracle panel */}
        {oracleOpen && <OraclePanel onClose={()=>setOracleOpen(false)} />}
      </div>

      {/* State machine modal */}
      {modal && <StateMachineModal onClose={()=>setModal(false)} />}

      {/* Finding detail drawer */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center" style={{background:"#00000088",zIndex:50}} onClick={()=>setSelected(null)}>
          <div style={{background:"#111111",border:"1px solid #292929",borderRadius:2,padding:"24px 28px",width:400}} onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between mb-4">
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.1em"}}>{selected.id}</div>
                <div style={{fontSize:9,color:"#666666",letterSpacing:"0.14em"}}>{selected.type}</div>
              </div>
              <button onClick={()=>setSelected(null)} style={{color:"#444444",background:"transparent",border:"none",cursor:"pointer",fontSize:14}}>✕</button>
            </div>
            <div className="flex flex-col gap-3">
              {[{k:"STATUS",v:selected.status},{k:"EVIDENCE",v:selected.evidence},{k:"ORACLE",v:selected.oracle},{k:"RETRY COUNT",v:String(selected.retry)}].map(r=>(
                <div key={r.k}><div style={{fontSize:8,color:"#444444",letterSpacing:"0.18em",marginBottom:1}}>{r.k}</div><div style={{fontSize:10,color:"#888888"}}>{r.v}</div></div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StateMachineModal({onClose}:{onClose:()=>void}) {
  const nodes = [
    {id:"VALIDATION",  x:200, y:20,  w:120, h:32, color:"#333333", text:"#A0A0A0"},
    {id:"ORACLE TEST", x:200, y:100, w:120, h:32, color:"#1A0608", text:"#E31B23", border:"#E31B23"},
    {id:"SUCCESS",     x:60,  y:190, w:100, h:28, color:"#0A1A10", text:"#3FB950", border:"#3FB95066"},
    {id:"VALIDATED",   x:40,  y:260, w:120, h:32, color:"#0A1A10", text:"#3FB950", border:"#3FB95066"},
    {id:"FAILURE",     x:340, y:190, w:100, h:28, color:"#1A0608", text:"#FF2A32", border:"#FF2A3266"},
    {id:"DIAGNOSIS",   x:330, y:260, w:120, h:32, color:"#120608", text:"#E31B23", border:"#E31B2344"},
    {id:"CORRECTABLE", x:230, y:340, w:120, h:28, color:"#1A1200", text:"#D29922", border:"#D2992244"},
    {id:"FUNDAMENTAL", x:420, y:340, w:120, h:28, color:"#1A0608", text:"#FF2A32", border:"#FF2A3244"},
    {id:"ADAPT",       x:230, y:410, w:100, h:28, color:"#111111", text:"#666666", border:"#33333344"},
    {id:"RULED OUT",   x:420, y:410, w:100, h:28, color:"#111111", text:"#555555", border:"#33333344"},
    {id:"RETRY",       x:230, y:480, w:100, h:28, color:"#1A0608", text:"#E31B23", border:"#E31B2344"},
  ];
  const edges = [
    {x1:260,y1:52,  x2:260,y2:100, label:""},
    {x1:260,y1:132, x2:110,y2:190, label:"SUCCESS"},
    {x1:260,y1:132, x2:390,y2:190, label:"FAILURE"},
    {x1:110,y1:218, x2:100,y2:260, label:""},
    {x1:390,y1:218, x2:390,y2:260, label:""},
    {x1:390,y1:292, x2:290,y2:340, label:"CORRECTABLE"},
    {x1:390,y1:292, x2:480,y2:340, label:"FUNDAMENTAL"},
    {x1:290,y1:368, x2:280,y2:410, label:""},
    {x1:480,y1:368, x2:470,y2:410, label:""},
    {x1:280,y1:438, x2:280,y2:480, label:""},
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{background:"#00000099",zIndex:60}} onClick={onClose}>
      <div style={{background:"#0D0D0D",border:"1px solid #292929",borderRadius:2,padding:"24px",width:620}} onClick={e=>e.stopPropagation()}>
        <div className="flex justify-between mb-5">
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.12em"}}>VALIDATION STATE MACHINE</div>
            <div style={{fontSize:8.5,color:"#444444",letterSpacing:"0.16em"}}>DIAGNOSIS → ADAPT → CAP RETRY LOOP</div>
          </div>
          <button onClick={onClose} style={{color:"#444444",background:"transparent",border:"none",cursor:"pointer",fontSize:14}}>✕</button>
        </div>
        <div style={{position:"relative",height:530}}>
          <svg style={{position:"absolute",inset:0}} width="100%" height="100%">
            {edges.map((e,i)=>(
              <g key={i}>
                <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="#333333" strokeWidth="1" markerEnd="url(#sm-arrow)" />
                {e.label && <text x={(e.x1+e.x2)/2+6} y={(e.y1+e.y2)/2} fill="#555555" fontSize="8" letterSpacing="1">{e.label}</text>}
              </g>
            ))}
            {/* Retry back-arrow */}
            <path d="M 280 508 Q 140 508 140 132 Q 140 116 200 116" stroke="#6F171B" strokeWidth="1" fill="none" strokeDasharray="4 3" markerEnd="url(#sm-arrow-red)" />
            <text x="100" y="340" fill="#6F171B" fontSize="8" letterSpacing="1">RETRY</text>
            <defs>
              <marker id="sm-arrow"     markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#333333" /></marker>
              <marker id="sm-arrow-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#6F171B" /></marker>
            </defs>
          </svg>
          {nodes.map(n=>(
            <div key={n.id} style={{position:"absolute",left:n.x,top:n.y,width:n.w,height:n.h,background:n.color,border:`1px solid ${(n as any).border??"#292929"}`,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center"}}>
              <span style={{fontSize:9,fontWeight:700,color:n.text,letterSpacing:"0.12em"}}>{n.id}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OraclePanel({onClose}:{onClose:()=>void}) {
  const oracles = [
    {oracle:"CVE-BENCH",  type:"FILE ACCESS",          result:"PASS",  severity:"CRITICAL", details:"Flag file /flag.txt read — exploit confirmed"},
    {oracle:"PREDIQL",    type:"IDOR",                  result:"PASS",  severity:"HIGH",     details:"Unauthorized record access validated"},
    {oracle:"MHBENCH",    type:"HOST COMPROMISED",      result:"FAIL",  severity:"HIGH",     details:"Lateral pivot objective not satisfied"},
  ];
  return (
    <div className="flex flex-col flex-shrink-0 overflow-y-auto" style={{width:300,borderLeft:"1px solid #1E1E1E",background:"#0B0B0B"}}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3" style={{borderBottom:"1px solid #1E1E1E"}}>
        <span style={{fontSize:10,fontWeight:600,color:"#A0A0A0",letterSpacing:"0.16em"}}>ORACLE PANEL</span>
        <button onClick={onClose} style={{color:"#444444",background:"transparent",border:"none",cursor:"pointer",fontSize:13}}>✕</button>
      </div>
      {oracles.map((o,i)=>(
        <div key={o.oracle} className="px-4 py-4" style={{borderBottom:"1px solid #141414"}}>
          <div className="flex items-center justify-between mb-3">
            <span style={{fontSize:10,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.1em"}}>{o.oracle}</span>
            <span style={{fontSize:9,color:o.result==="PASS"?"#3FB950":"#FF2A32",background:o.result==="PASS"?"#0A1A10":"#1A0608",border:`1px solid ${o.result==="PASS"?"#3FB95044":"#FF2A3244"}`,borderRadius:2,padding:"1px 6px",letterSpacing:"0.12em",fontWeight:700}}>{o.result}</span>
          </div>
          {[{k:"ATTACK TYPE",v:o.type},{k:"SEVERITY",v:o.severity},{k:"DETAILS",v:o.details}].map(r=>(
            <div key={r.k} style={{marginBottom:6}}>
              <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:1}}>{r.k}</div>
              <div style={{fontSize:9.5,color:"#666666",letterSpacing:"0.04em",lineHeight:1.5}}>{r.v}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function Btn({onClick,label,red}:{onClick:()=>void;label:string;red?:boolean}) {
  return (
    <button onClick={onClick} style={{fontSize:9,color:red?"#E31B23":"#666666",background:"transparent",border:`1px solid ${red?"#6F171B":"#292929"}`,borderRadius:2,padding:"4px 12px",letterSpacing:"0.14em",cursor:"pointer",fontFamily:"inherit"}}
      onMouseEnter={e=>e.currentTarget.style.borderColor=red?"#E31B23":"#444444"}
      onMouseLeave={e=>e.currentTarget.style.borderColor=red?"#6F171B":"#292929"}>{label}</button>
  );
}
