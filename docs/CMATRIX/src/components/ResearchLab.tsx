import { useState } from "react";

type LabTab = "ABLATION"|"STATISTICAL EVALUATION"|"FAILURE ANALYSIS";

export default function ResearchLab({initialTab}:{initialTab?:LabTab}) {
  const [tab,setTab] = useState<LabTab>(initialTab??"ABLATION");
  return (
    <div className="flex flex-col h-full" style={{minHeight:0}}>
      <div className="flex-shrink-0 px-6 pt-5 pb-0" style={{borderBottom:"1px solid #1E1E1E"}}>
        <div style={{fontSize:9,color:"#666666",letterSpacing:"0.22em",marginBottom:3}}>RESEARCH</div>
        <h1 style={{fontSize:20,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.12em",marginBottom:12}}>RESEARCH LAB</h1>
        <div className="flex">
          {(["ABLATION","STATISTICAL EVALUATION","FAILURE ANALYSIS"] as LabTab[]).map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{fontSize:9,letterSpacing:"0.14em",padding:"5px 16px",background:"transparent",border:"none",borderBottom:t===tab?"2px solid #E31B23":"2px solid transparent",color:t===tab?"#F2F2F2":"#444444",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",marginBottom:-1}}>{t}</button>
          ))}
        </div>
      </div>
      {tab==="ABLATION"              && <AblationLab/>}
      {tab==="STATISTICAL EVALUATION" && <StatisticalEval/>}
      {tab==="FAILURE ANALYSIS"       && <FailureAnalysis/>}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ABLATION LABORATORY (screen 41)
══════════════════════════════════════════════════════ */
const ABLATION_RUNS = [
  {id:"ABL-012",name:"Full System",            ucb:true,  eord:true,  compact:true,  parallel:true,  score:0.812, cost:"$0.184", time:"18m", delta:0},
  {id:"ABL-011",name:"No UCB (Random)",        ucb:false, eord:true,  compact:true,  parallel:true,  score:0.641, cost:"$0.312", time:"28m", delta:-0.171},
  {id:"ABL-010",name:"No E_ord Gating",        ucb:true,  eord:false, compact:true,  parallel:true,  score:0.724, cost:"$0.228", time:"22m", delta:-0.088},
  {id:"ABL-009",name:"No Compaction",          ucb:true,  eord:true,  compact:false, parallel:true,  score:0.798, cost:"$0.401", time:"19m", delta:-0.014},
  {id:"ABL-008",name:"No Parallel Branching",  ucb:true,  eord:true,  compact:true,  parallel:false, score:0.781, cost:"$0.192", time:"31m", delta:-0.031},
  {id:"ABL-007",name:"No UCB + No E_ord",      ucb:false, eord:false, compact:true,  parallel:true,  score:0.512, cost:"$0.488", time:"38m", delta:-0.300},
  {id:"ABL-006",name:"Baseline (All Off)",     ucb:false, eord:false, compact:false, parallel:false, score:0.401, cost:"$0.621", time:"54m", delta:-0.411},
];

const COMPONENTS = [
  {key:"ucb",   label:"UCB SCORING",        desc:"Upper confidence bound node selection policy"},
  {key:"eord",  label:"E_ORD GATING",       desc:"Evidence-level threshold for dispatch"},
  {key:"compact",label:"CONTEXT COMPACTION",desc:"Automatic specialist context refresh"},
  {key:"parallel",label:"PARALLEL BRANCHING",desc:"Concurrent multi-specialist scheduling"},
];

function AblationLab() {
  const [sel,setSel] = useState(ABLATION_RUNS[0]);
  const baseline = ABLATION_RUNS[ABLATION_RUNS.length-1];

  return (
    <div className="flex flex-1 overflow-hidden" style={{minHeight:0}}>
      {/* Left: config + results */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:14}}>ABLATION RUNS — SELECT TO COMPARE</div>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:24}}>
          <thead><tr style={{background:"#0F0F0F"}}>
            {["RUN","NAME","UCB","E_ORD","COMPACT","PARALLEL","SCORE","Δ SCORE","COST","TIME"].map(h=>(
              <th key={h} style={{padding:"5px 12px",textAlign:"left",fontSize:7.5,color:"#444444",letterSpacing:"0.14em",borderBottom:"1px solid #1A1A1A",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {ABLATION_RUNS.map(r=>(
              <tr key={r.id} onClick={()=>setSel(r)} style={{borderBottom:"1px solid #111111",cursor:"pointer",background:sel.id===r.id?"#0D0D0D":"transparent",borderLeft:sel.id===r.id?"2px solid #E31B23":"2px solid transparent"}}
                onMouseEnter={e=>e.currentTarget.style.background="#0A0A0A"} onMouseLeave={e=>e.currentTarget.style.background=sel.id===r.id?"#0D0D0D":"transparent"}>
                <td style={{padding:"8px 12px",color:"#E31B23",fontWeight:700,fontSize:9}}>{r.id}</td>
                <td style={{padding:"8px 12px",color:"#888888",fontSize:9.5}}>{r.name}</td>
                {["ucb","eord","compact","parallel"].map(k=>(
                  <td key={k} style={{padding:"8px 12px",textAlign:"center"}}>
                    <span style={{fontSize:10,color:(r as any)[k]?"#3FB950":"#333333",fontWeight:700}}>{(r as any)[k]?"✓":"✗"}</span>
                  </td>
                ))}
                <td style={{padding:"8px 12px",fontWeight:700,fontSize:10,color:r.score>0.75?"#3FB950":r.score>0.55?"#D29922":"#FF2A32"}}>{(r.score*100).toFixed(1)}%</td>
                <td style={{padding:"8px 12px",fontSize:9,color:r.delta===0?"#555555":r.delta>-0.05?"#D29922":"#FF2A32",fontWeight:700}}>
                  {r.delta===0?"—":`${(r.delta*100).toFixed(1)}%`}
                </td>
                <td style={{padding:"8px 12px",color:"#444444",fontSize:9}}>{r.cost}</td>
                <td style={{padding:"8px 12px",color:"#444444",fontSize:9}}>{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Component impact summary */}
        <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:12}}>COMPONENT IMPACT (vs baseline)</div>
        {COMPONENTS.map(c=>{
          const withComp   = ABLATION_RUNS.find(r=>(r as any)[c.key]===true  && Object.values(r).filter(v=>v===false).length===0);
          const withoutComp= ABLATION_RUNS.find(r=>(r as any)[c.key]===false && ABLATION_RUNS[0].score>(r.score+0.05));
          const impact = withComp&&withoutComp ? withComp.score - withoutComp.score : 0;
          return (
            <div key={c.key} style={{marginBottom:14}}>
              <div className="flex items-center justify-between mb-1">
                <div><span style={{fontSize:9,color:"#A0A0A0",letterSpacing:"0.1em",fontWeight:600}}>{c.label}</span><span style={{fontSize:8,color:"#333333",marginLeft:8}}>{c.desc}</span></div>
                <span style={{fontSize:10,fontWeight:700,color:impact>0.1?"#E31B23":impact>0.05?"#D29922":"#555555"}}>-{(impact*100).toFixed(1)}% if removed</span>
              </div>
              <div style={{height:4,background:"#1A1A1A",borderRadius:2,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${Math.min(impact*200,100)}%`,background:impact>0.1?"#E31B23":impact>0.05?"#D29922":"#555555",borderRadius:2}}/>
              </div>
            </div>
          );
        })}
      </div>
      {/* Right: detail */}
      <div className="flex-shrink-0 flex flex-col overflow-y-auto" style={{width:260,borderLeft:"1px solid #1E1E1E",padding:"16px 14px"}}>
        <div style={{fontSize:11,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.1em",marginBottom:4}}>{sel.id}</div>
        <div style={{fontSize:9,color:"#555555",marginBottom:16,lineHeight:1.5}}>{sel.name}</div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:8}}>COMPONENTS</div>
          {COMPONENTS.map(c=>(
            <div key={c.key} className="flex items-center gap-2 mb-2">
              <span style={{fontSize:9,color:(sel as any)[c.key]?"#3FB950":"#333333",fontWeight:700,minWidth:12}}>{(sel as any)[c.key]?"✓":"✗"}</span>
              <span style={{fontSize:9,color:(sel as any)[c.key]?"#666666":"#333333"}}>{c.label}</span>
            </div>
          ))}
        </div>
        <div style={{height:1,background:"#1A1A1A",marginBottom:16}}/>
        {[{k:"SCORE",v:`${(sel.score*100).toFixed(1)}%`,c:sel.score>0.75?"#3FB950":sel.score>0.55?"#D29922":"#FF2A32"},{k:"vs FULL SYSTEM",v:sel.delta===0?"baseline":`${(sel.delta*100).toFixed(1)}%`,c:sel.delta<-0.1?"#FF2A32":sel.delta<-0.05?"#D29922":"#555555"},{k:"COST",v:sel.cost},{k:"RUNTIME",v:sel.time}].map(r=>(
          <div key={r.k} style={{marginBottom:12}}>
            <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:3}}>{r.k}</div>
            <div style={{fontSize:14,fontWeight:700,color:r.c??"#F2F2F2"}}>{r.v}</div>
          </div>
        ))}
        <div style={{marginTop:8,padding:"10px 12px",background:"#120608",border:"1px solid #E31B2333",borderRadius:2}}>
          <div style={{fontSize:8,color:"#E31B23",letterSpacing:"0.16em",marginBottom:4}}>SCORE DELTA vs BASELINE</div>
          <div style={{fontSize:16,fontWeight:700,color:sel.delta>-0.05?"#D29922":"#FF2A32"}}>{sel.delta===0?"baseline":`${((sel.score-baseline.score)*100).toFixed(1)}pp`}</div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   STATISTICAL EVALUATION (screen 42)
══════════════════════════════════════════════════════ */
const STAT_DATA = [
  {metric:"Mean Solve Rate",  full:0.812, noUCB:0.641, noEord:0.724, baseline:0.401, pValue:0.003},
  {metric:"Median Cost/Task", full:0.184, noUCB:0.312, noEord:0.228, baseline:0.621, pValue:0.008},
  {metric:"Mean Attempts",    full:1.4,   noUCB:2.8,   noEord:1.9,   baseline:3.4,  pValue:0.001},
  {metric:"Success@1",        full:0.681, noUCB:0.412, noEord:0.598, baseline:0.289, pValue:0.002},
  {metric:"Success@3",        full:0.894, noUCB:0.744, noEord:0.831, baseline:0.601, pValue:0.011},
  {metric:"Partial Rate",     full:0.122, noUCB:0.189, noEord:0.144, baseline:0.221, pValue:0.044},
  {metric:"Fail Rate",        full:0.066, noUCB:0.370, noEord:0.132, baseline:0.490, pValue:0.001},
];

function StatisticalEval() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5">
      <div className="grid grid-cols-4 gap-0 mb-6" style={{border:"1px solid #1E1E1E",borderRadius:2,overflow:"hidden"}}>
        {[{k:"N BENCHMARKS",v:"7"},{k:"N TASKS",v:"350"},{k:"CONFIDENCE",v:"95%"},{k:"TEST",v:"WILCOXON"}].map((m,i,a)=>(
          <div key={m.k} style={{padding:"12px 16px",borderRight:i<a.length-1?"1px solid #1A1A1A":"none",background:"#0D0D0D"}}>
            <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:4}}>{m.k}</div>
            <div style={{fontSize:18,fontWeight:700,color:"#F2F2F2"}}>{m.v}</div>
          </div>
        ))}
      </div>
      <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:12}}>METRIC COMPARISON TABLE</div>
      <div style={{border:"1px solid #1E1E1E",borderRadius:2,overflow:"hidden",marginBottom:24}}>
        <div className="flex" style={{background:"#0F0F0F",borderBottom:"1px solid #1A1A1A"}}>
          {["METRIC","FULL SYSTEM","NO UCB","NO E_ORD","BASELINE","p-VALUE","SIG"].map(h=>(
            <div key={h} style={{flex:h==="METRIC"?2:1,padding:"5px 12px",fontSize:7.5,color:"#444444",letterSpacing:"0.14em",fontWeight:600,textAlign:h==="METRIC"?"left":"right"}}>{h}</div>
          ))}
        </div>
        {STAT_DATA.map((row,i)=>(
          <div key={row.metric} className="flex items-center" style={{borderBottom:i<STAT_DATA.length-1?"1px solid #111111":"none",background:i%2?"#0B0B0B":"transparent"}}>
            <div style={{flex:2,padding:"8px 12px",fontSize:10,color:"#888888"}}>{row.metric}</div>
            <div style={{flex:1,padding:"8px 12px",textAlign:"right",fontSize:10,fontWeight:700,color:"#3FB950"}}>{row.full}</div>
            <div style={{flex:1,padding:"8px 12px",textAlign:"right",fontSize:10,color:"#555555"}}>{row.noUCB}</div>
            <div style={{flex:1,padding:"8px 12px",textAlign:"right",fontSize:10,color:"#555555"}}>{row.noEord}</div>
            <div style={{flex:1,padding:"8px 12px",textAlign:"right",fontSize:10,color:"#333333"}}>{row.baseline}</div>
            <div style={{flex:1,padding:"8px 12px",textAlign:"right",fontSize:9,color:row.pValue<0.01?"#3FB950":row.pValue<0.05?"#D29922":"#555555"}}>{row.pValue.toFixed(3)}</div>
            <div style={{flex:1,padding:"8px 12px",textAlign:"right"}}><span style={{fontSize:9,color:row.pValue<0.01?"#3FB950":row.pValue<0.05?"#D29922":"#444444",fontWeight:700}}>{row.pValue<0.01?"***":row.pValue<0.05?"**":"ns"}</span></div>
          </div>
        ))}
      </div>
      {/* Effect sizes */}
      <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:12}}>UCB CONTRIBUTION — COHEN'S d</div>
      {[{metric:"Solve Rate",d:1.82,interp:"LARGE"},{metric:"Cost per Task",d:1.41,interp:"LARGE"},{metric:"Attempts",d:1.09,interp:"LARGE"},{metric:"Fail Rate",d:2.14,interp:"LARGE"}].map(e=>(
        <div key={e.metric} style={{marginBottom:12}}>
          <div className="flex justify-between mb-1">
            <span style={{fontSize:9,color:"#666666"}}>{e.metric}</span>
            <div className="flex items-center gap-3">
              <span style={{fontSize:9,color:"#3FB950",fontWeight:700}}>d = {e.d.toFixed(2)}</span>
              <span style={{fontSize:8,color:"#3FB950",letterSpacing:"0.1em"}}>{e.interp}</span>
            </div>
          </div>
          <div style={{height:3,background:"#1A1A1A",borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${Math.min((e.d/2.5)*100,100)}%`,background:"#3FB950",borderRadius:2}}/>
          </div>
        </div>
      ))}
      <div style={{marginTop:20,padding:"14px 16px",background:"#061A0C",border:"1px solid #3FB95044",borderRadius:2}}>
        <div style={{fontSize:8,color:"#3FB950",letterSpacing:"0.18em",marginBottom:6}}>CONCLUSION</div>
        <div style={{fontSize:10,color:"#555555",lineHeight:1.8}}>All core system components (UCB selection, E_ord gating) show statistically significant positive contribution (p &lt; 0.01, large effect size d &gt; 1.0). The full system outperforms the no-UCB baseline by 17.1 percentage points and the no-E_ord ablation by 8.8pp. Results support the design hypothesis.</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   FAILURE ANALYSIS (screen 43)
══════════════════════════════════════════════════════ */
const FAILURE_CLUSTERS = [
  {id:"FC-001",label:"NETWORK FILTERING",count:14,pct:34,color:"#E31B23",desc:"Egress-filtered ports (5432, 6379) block lateral movement. Agent correctly identifies and deprioritizes but wastes 2–4 attempts first.",fix:"Add network preflight probe before lateral attack dispatch"},
  {id:"FC-002",label:"PATCHED VULNERABILITY",count:9,pct:22,color:"#D29922",desc:"CVE target already patched in benchmark environment. E_ord reaches 2 (WEAK) but cannot confirm. Agent correctly rules out after 3 attempts.",fix:"Add CVE version check to RECON-SPEC pre-flight"},
  {id:"FC-003",label:"WAF BLOCKING",count:7,pct:17,color:"#D29922",desc:"Web application firewall blocks payload delivery. Agent detects 403/429 pattern but retry logic escalates cost unnecessarily.",fix:"WAF detection heuristic in INJECT-SPEC — halt early on consistent 403"},
  {id:"FC-004",label:"CONTEXT OVERFLOW",count:5,pct:12,color:"#555555",desc:"Specialist context exceeded threshold before task completion. Compaction triggered mid-task, losing active state in 2 cases.",fix:"Implement pre-task context budget estimation"},
  {id:"FC-005",label:"ORACLE MISMATCH",count:4,pct:10,color:"#555555",desc:"Exploit successful but oracle objective differs from exploitation path. File read oracle passed, SSRF vector not counted.",fix:"Align oracle objectives with exploit chain granularity"},
  {id:"FC-006",label:"RATE LIMITING",count:2,pct:5,color:"#333333",desc:"Target rate-limits after 10 requests/min. Scan tools exceeded threshold, triggering lockout.",fix:"Add adaptive rate control to execution agent"},
];

const FAILURE_TIMELINE = [
  {ts:"06:29:03",type:"NETWORK FILTERING",run:"B-041",task:"T-019",cost:"$0.000",attempts:1,resolved:false},
  {ts:"06:29:44",type:"WAF BLOCKING",     run:"B-041",task:"T-031",cost:"$0.148",attempts:3,resolved:false},
  {ts:"Yesterday 14:22",type:"PATCHED VULNERABILITY",run:"B-038",task:"T-008",cost:"$0.091",attempts:3,resolved:false},
  {ts:"Yesterday 11:04",type:"CONTEXT OVERFLOW",run:"B-038",task:"T-022",cost:"$0.312",attempts:2,resolved:true},
  {ts:"2d ago 09:17",type:"ORACLE MISMATCH",run:"B-035",task:"T-041",cost:"$0.044",attempts:2,resolved:false},
];

function FailureAnalysis() {
  const [sel,setSel] = useState<typeof FAILURE_CLUSTERS[0]|null>(null);
  const total = FAILURE_CLUSTERS.reduce((s,c)=>s+c.count,0);
  return (
    <div className="flex flex-1 overflow-hidden" style={{minHeight:0}}>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-0 mb-5" style={{border:"1px solid #1E1E1E",borderRadius:2,overflow:"hidden"}}>
          {[{k:"TOTAL FAILURES",v:String(total)},{k:"UNIQUE CLUSTERS",v:String(FAILURE_CLUSTERS.length)},{k:"FIXABLE",v:String(FAILURE_CLUSTERS.slice(0,4).reduce((s,c)=>s+c.count,0))}].map((m,i,a)=>(
            <div key={m.k} style={{padding:"12px 18px",borderRight:i<a.length-1?"1px solid #1A1A1A":"none",background:"#0D0D0D"}}>
              <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:5}}>{m.k}</div>
              <div style={{fontSize:20,fontWeight:700,color:"#F2F2F2"}}>{m.v}</div>
            </div>
          ))}
        </div>
        {/* Failure clusters */}
        <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:12}}>FAILURE CLUSTERS</div>
        {FAILURE_CLUSTERS.map(c=>(
          <div key={c.id} onClick={()=>setSel(sel?.id===c.id?null:c)} style={{border:"1px solid #1E1E1E",borderRadius:2,marginBottom:8,cursor:"pointer",background:sel?.id===c.id?"#0D0D0D":"transparent"}}
            onMouseEnter={e=>e.currentTarget.style.background="#0A0A0A"} onMouseLeave={e=>e.currentTarget.style.background=sel?.id===c.id?"#0D0D0D":"transparent"}>
            <div className="flex items-center gap-3 px-4 py-3">
              <div style={{width:10,height:10,borderRadius:2,background:c.color,flexShrink:0}}/>
              <span style={{fontSize:10,fontWeight:700,color:"#A0A0A0",letterSpacing:"0.08em",flex:1}}>{c.label}</span>
              <span style={{fontSize:14,fontWeight:700,color:c.color}}>{c.count}</span>
              <span style={{fontSize:9,color:"#444444",minWidth:32,textAlign:"right"}}>{c.pct}%</span>
            </div>
            <div style={{height:3,background:"#1A1A1A",margin:"0 16px 0",borderRadius:2,overflow:"hidden",marginBottom:sel?.id===c.id?0:10}}>
              <div style={{height:"100%",width:`${c.pct}%`,background:c.color}}/>
            </div>
            {sel?.id===c.id&&(
              <div style={{padding:"12px 16px",borderTop:"1px solid #141414",marginTop:8}}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{fontSize:8,color:"#444444",letterSpacing:"0.16em"}}>{c.id} DETAIL</span>
                  <button onClick={e=>{e.stopPropagation();setSel(null);}} style={{background:"transparent",border:"none",cursor:"pointer",color:"#444444",fontSize:13,lineHeight:1,padding:"0 2px"}}>✕</button>
                </div>
                <div style={{fontSize:9.5,color:"#555555",lineHeight:1.8,marginBottom:10}}>{c.desc}</div>
                <div className="flex items-start gap-2">
                  <span style={{fontSize:8,color:"#3FB950",letterSpacing:"0.14em",fontWeight:700,flexShrink:0}}>FIX →</span>
                  <span style={{fontSize:9.5,color:"#3FB950",lineHeight:1.7}}>{c.fix}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {/* Failure timeline */}
        <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginTop:20,marginBottom:12}}>RECENT FAILURES</div>
        <div style={{border:"1px solid #1E1E1E",borderRadius:2,overflow:"hidden"}}>
          <div className="flex" style={{background:"#0F0F0F",borderBottom:"1px solid #1A1A1A"}}>
            {["TIME","TYPE","RUN","TASK","COST","ATTEMPTS","RESOLVED"].map(h=>(
              <div key={h} style={{flex:h==="TYPE"?2:1,padding:"5px 12px",fontSize:7.5,color:"#444444",letterSpacing:"0.14em",fontWeight:600}}>{h}</div>
            ))}
          </div>
          {FAILURE_TIMELINE.map((f,i)=>(
            <div key={i} className="flex items-center" style={{borderBottom:i<FAILURE_TIMELINE.length-1?"1px solid #111111":"none",background:i%2?"#0B0B0B":"transparent"}}>
              <div style={{flex:1,padding:"7px 12px",fontSize:8.5,color:"#333333"}}>{f.ts}</div>
              <div style={{flex:2,padding:"7px 12px",fontSize:9,color:"#A0A0A0",fontWeight:600,letterSpacing:"0.06em"}}>{f.type}</div>
              <div style={{flex:1,padding:"7px 12px",fontSize:9,color:"#E31B23"}}>{f.run}</div>
              <div style={{flex:1,padding:"7px 12px",fontSize:9,color:"#444444"}}>{f.task}</div>
              <div style={{flex:1,padding:"7px 12px",fontSize:9,color:"#555555"}}>{f.cost}</div>
              <div style={{flex:1,padding:"7px 12px",fontSize:9,color:f.attempts>2?"#D29922":"#444444"}}>{f.attempts}</div>
              <div style={{flex:1,padding:"7px 12px"}}><span style={{fontSize:8.5,color:f.resolved?"#3FB950":"#333333",fontWeight:700}}>{f.resolved?"YES":"—"}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
