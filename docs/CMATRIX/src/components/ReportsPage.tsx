import { useState } from "react";

const REPORTS = [
  {id:"RPT-0041",mission:"CVE-001",type:"EXECUTIVE SUMMARY",status:"READY",generated:"06:31:04",findings:7,critical:1,pages:4},
  {id:"RPT-0039",mission:"CVE-001",type:"TECHNICAL DETAIL",status:"GENERATING",generated:"—",findings:7,critical:1,pages:0},
  {id:"RPT-0031",mission:"BENCH-014",type:"BENCHMARK REPORT",status:"READY",generated:"Yesterday 22:14",findings:12,critical:3,pages:9},
  {id:"RPT-0028",mission:"BENCH-013",type:"BENCHMARK REPORT",status:"READY",generated:"Yesterday 18:07",findings:8,critical:1,pages:7},
  {id:"RPT-0022",mission:"CVE-003",type:"TECHNICAL DETAIL",status:"READY",generated:"2d ago",findings:3,critical:0,pages:6},
  {id:"RPT-0019",mission:"CVE-002",type:"EXECUTIVE SUMMARY",status:"READY",generated:"3d ago",findings:5,critical:2,pages:3},
];

const PREVIEW_SECTIONS = [
  {title:"EXECUTIVE SUMMARY",content:"CMatrix autonomous VAPT agent completed mission CVE-001 against target app.targetcorp.com. 7 vulnerabilities identified, 3 oracle-confirmed. Critical finding: time-based SQL injection in /api/users endpoint grants full database read access."},
  {title:"CRITICAL FINDINGS",items:[{sev:"CRITICAL",id:"F-001",name:"SQL INJECTION",target:"/api/users?id=",eord:"5/5"},{sev:"HIGH",id:"F-002",name:"AUTH BYPASS",target:"/api/auth/login",eord:"4/5"},{sev:"HIGH",id:"F-003",name:"IDOR",target:"/api/users/:id",eord:"4/5"}]},
  {title:"ATTACK NARRATIVE",content:"Agent initiated passive/active recon hybrid, discovering 12 endpoints. JWT authentication was bypassed via HS256 secret brute-force (password123, 48s). Authenticated access enabled SQL injection enumeration. Time-based blind injection confirmed via 4.18s timing delta (>3σ above baseline). Oracle validation: CVE-BENCH FILE ACCESS PASS."},
  {title:"RISK ASSESSMENT",content:"OVERALL RISK: CRITICAL\nPriority remediation: parameterize SQL queries (F-001), rotate JWT secrets with RS256 migration (F-002), implement ownership checks on user endpoints (F-003).\nEstimated remediation effort: 3–5 engineer-days."},
];

export default function ReportsPage() {
  const [sel,setSel] = useState(REPORTS[0]);
  const [filter,setFilter] = useState<string>("ALL");
  const types = ["ALL","EXECUTIVE SUMMARY","TECHNICAL DETAIL","BENCHMARK REPORT"];
  const filtered = filter==="ALL" ? REPORTS : REPORTS.filter(r=>r.type===filter);

  return (
    <div className="flex flex-col h-full" style={{minHeight:0}}>
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{borderBottom:"1px solid #1E1E1E"}}>
        <div style={{fontSize:9,color:"#666666",letterSpacing:"0.22em",marginBottom:3}}>RESEARCH</div>
        <div className="flex items-baseline justify-between">
          <h1 style={{fontSize:20,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.12em"}}>REPORTS</h1>
          <div className="flex gap-2">
            {types.map(t=>(
              <button key={t} onClick={()=>setFilter(t)} style={{fontSize:8,letterSpacing:"0.12em",padding:"3px 10px",background:filter===t?"#120608":"transparent",border:`1px solid ${filter===t?"#E31B23":"#1E1E1E"}`,borderRadius:2,color:filter===t?"#E31B23":"#444444",cursor:"pointer",fontFamily:"inherit"}}>{t}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden" style={{minHeight:0}}>
        {/* List */}
        <div className="flex-shrink-0 flex flex-col overflow-y-auto" style={{width:300,borderRight:"1px solid #1E1E1E"}}>
          {filtered.map(r=>(
            <div key={r.id} onClick={()=>setSel(r)} style={{padding:"13px 16px",borderBottom:"1px solid #111111",cursor:"pointer",background:sel.id===r.id?"#0D0D0D":"transparent",borderLeft:sel.id===r.id?"2px solid #E31B23":"2px solid transparent"}}
              onMouseEnter={e=>{if(sel.id!==r.id)e.currentTarget.style.background="#0A0A0A"}} onMouseLeave={e=>{if(sel.id!==r.id)e.currentTarget.style.background="transparent"}}>
              <div className="flex items-center justify-between mb-1">
                <span style={{fontSize:9,fontWeight:700,color:"#E31B23",letterSpacing:"0.08em"}}>{r.id}</span>
                <span style={{fontSize:8,color:r.status==="READY"?"#3FB950":"#D29922",letterSpacing:"0.12em",fontWeight:600}}>{r.status}</span>
              </div>
              <div style={{fontSize:10,color:"#A0A0A0",marginBottom:2,letterSpacing:"0.04em"}}>{r.type}</div>
              <div style={{fontSize:8.5,color:"#333333",letterSpacing:"0.06em"}}>{r.mission} · {r.generated}</div>
              <div className="flex gap-3 mt-2">
                <span style={{fontSize:7.5,color:"#555555",letterSpacing:"0.1em"}}>{r.findings} FINDINGS</span>
                {r.critical>0&&<span style={{fontSize:7.5,color:"#FF2A32",letterSpacing:"0.1em"}}>{r.critical} CRITICAL</span>}
                {r.pages>0&&<span style={{fontSize:7.5,color:"#333333",letterSpacing:"0.1em"}}>{r.pages} PAGES</span>}
              </div>
            </div>
          ))}
        </div>
        {/* Preview */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{minHeight:0}}>
          {/* Preview header */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-3" style={{borderBottom:"1px solid #1E1E1E",background:"#0A0A0A"}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.08em"}}>{sel.id} — {sel.type}</div>
              <div style={{fontSize:8.5,color:"#444444",marginTop:2,letterSpacing:"0.1em"}}>{sel.mission} · {sel.generated}</div>
            </div>
            <div className="flex gap-2">
              {["DOWNLOAD PDF","COPY LINK"].map(a=>(
                <button key={a} style={{fontSize:8.5,color:"#A0A0A0",background:"transparent",border:"1px solid #292929",borderRadius:2,padding:"5px 12px",letterSpacing:"0.1em",cursor:sel.status==="READY"?"pointer":"not-allowed",fontFamily:"inherit",opacity:sel.status==="READY"?1:0.4}}>{a}</button>
              ))}
            </div>
          </div>
          {sel.status==="GENERATING"?(
            <div className="flex-1 flex items-center justify-center flex-col gap-3">
              <div style={{width:8,height:8,borderRadius:"50%",background:"#E31B23"}} className="animate-pulse"/>
              <div style={{fontSize:9,color:"#444444",letterSpacing:"0.2em"}}>GENERATING REPORT…</div>
            </div>
          ):(
            <div className="flex-1 overflow-y-auto px-8 py-6" style={{maxWidth:720}}>
              {/* Report cover block */}
              <div style={{border:"1px solid #1E1E1E",borderRadius:2,padding:"20px 24px",background:"#0D0D0D",marginBottom:24}}>
                <div style={{fontSize:8.5,color:"#444444",letterSpacing:"0.2em",marginBottom:6}}>CMATRIX AUTONOMOUS VAPT REPORT</div>
                <div style={{fontSize:18,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.1em",marginBottom:4}}>{sel.type}</div>
                <div style={{fontSize:9,color:"#E31B23",letterSpacing:"0.1em",marginBottom:12}}>MISSION {sel.mission}</div>
                <div className="flex gap-6">
                  {[{k:"FINDINGS",v:String(sel.findings)},{k:"CRITICAL",v:String(sel.critical),red:sel.critical>0},{k:"PAGES",v:String(sel.pages)},{k:"GENERATED",v:sel.generated}].map(m=>(
                    <div key={m.k}><div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.16em",marginBottom:2}}>{m.k}</div><div style={{fontSize:12,fontWeight:700,color:(m as any).red?"#FF2A32":"#F2F2F2"}}>{m.v}</div></div>
                  ))}
                </div>
              </div>
              {PREVIEW_SECTIONS.map((s,i)=>(
                <div key={i} style={{marginBottom:24}}>
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{width:2,height:14,background:"#E31B23"}}/>
                    <span style={{fontSize:9,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.2em"}}>{s.title}</span>
                  </div>
                  {s.content&&<p style={{fontSize:10.5,color:"#666666",lineHeight:1.9,margin:0,whiteSpace:"pre-line"}}>{s.content}</p>}
                  {s.items&&(
                    <div style={{border:"1px solid #1E1E1E",borderRadius:2,overflow:"hidden"}}>
                      {(s.items as {sev:string;id:string;name:string;target:string;eord:string}[]).map((item,j,a)=>(
                        <div key={item.id} className="flex items-center gap-4" style={{padding:"9px 14px",borderBottom:j<a.length-1?"1px solid #111111":"none",background:j%2?"#0B0B0B":"transparent"}}>
                          <span style={{fontSize:8.5,color:item.sev==="CRITICAL"?"#FF2A32":"#E31B23",fontWeight:700,letterSpacing:"0.12em",minWidth:60}}>{item.sev}</span>
                          <span style={{fontSize:9.5,color:"#E31B23",fontWeight:700,minWidth:50}}>{item.id}</span>
                          <span style={{fontSize:10,color:"#888888",flex:1}}>{item.name}</span>
                          <span style={{fontSize:9,color:"#444444"}}>{item.target}</span>
                          <span style={{fontSize:9,color:"#3FB950",fontWeight:700}}>E_ord {item.eord}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {i<PREVIEW_SECTIONS.length-1&&<div style={{height:1,background:"#141414",marginTop:20}}/>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
