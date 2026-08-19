import { useState } from "react";

interface Bench {
  id: string; name: string; type: "CVE-BENCH"|"PREDIQL"|"MHBENCH"; tasks: number; solved: number;
  partial: number; score: number; avgCost: string; avgTime: string; date: string; status: "COMPLETE"|"RUNNING"|"QUEUED";
}

const BENCHMARKS: Bench[] = [
  {id:"B-041",name:"CVE-BENCH v2 Full",   type:"CVE-BENCH",tasks:50, solved:38,partial:6, score:0.812,avgCost:"$0.184",avgTime:"18m",date:"Today",    status:"COMPLETE"},
  {id:"B-038",name:"PrediQL Reasoning",   type:"PREDIQL",  tasks:30, solved:21,partial:4, score:0.741,avgCost:"$0.091",avgTime:"9m", date:"Yesterday",status:"COMPLETE"},
  {id:"B-035",name:"MH-Bench Multi-Host", type:"MHBENCH",  tasks:20, solved:11,partial:3, score:0.622,avgCost:"$0.321",avgTime:"34m",date:"2d ago",   status:"COMPLETE"},
  {id:"B-033",name:"CVE-BENCH v2 Fast",   type:"CVE-BENCH",tasks:20, solved:16,partial:2, score:0.848,avgCost:"$0.072",avgTime:"11m",date:"3d ago",   status:"COMPLETE"},
  {id:"B-042",name:"CVE-BENCH v2 Nightly",type:"CVE-BENCH",tasks:50, solved:0, partial:3, score:0,    avgCost:"—",      avgTime:"—",  date:"Running",  status:"RUNNING"},
  {id:"B-043",name:"PrediQL v2 Beta",     type:"PREDIQL",  tasks:40, solved:0, partial:0, score:0,    avgCost:"—",      avgTime:"—",  date:"Queued",   status:"QUEUED"},
];

const TYPE_C: Record<Bench["type"],string> = {"CVE-BENCH":"#E31B23","PREDIQL":"#D29922","MHBENCH":"#3FB950"};

const TASK_DATA = [
  {id:"T-001",name:"CVE-2024-1234 SQLi",category:"SQL INJECTION",   solved:true, partial:false,cost:"$0.082",time:"14m",eord:5,attempts:2},
  {id:"T-002",name:"CVE-2024-5678 AuthBypass",category:"AUTH",      solved:true, partial:false,cost:"$0.054",time:"9m", eord:5,attempts:1},
  {id:"T-003",name:"CVE-2024-9012 RCE",   category:"RCE",           solved:false,partial:true, cost:"$0.211",time:"22m",eord:3,attempts:3},
  {id:"T-004",name:"CVE-2024-3456 IDOR",  category:"ACCESS CTRL",   solved:true, partial:false,cost:"$0.021",time:"5m", eord:4,attempts:1},
  {id:"T-005",name:"CVE-2024-7890 XSS",   category:"XSS",           solved:true, partial:false,cost:"$0.031",time:"6m", eord:5,attempts:1},
  {id:"T-006",name:"CVE-2024-2468 SSRF",  category:"SSRF",          solved:false,partial:false,cost:"$0.148",time:"18m",eord:1,attempts:3},
  {id:"T-007",name:"CVE-2024-1357 XXE",   category:"XXE",           solved:true, partial:false,cost:"$0.061",time:"11m",eord:4,attempts:2},
  {id:"T-008",name:"CVE-2024-8024 PathTrv",category:"PATH TRAVERSAL",solved:true,partial:false,cost:"$0.018",time:"4m", eord:5,attempts:1},
];

export default function BenchmarksHub() {
  const [detail, setDetail] = useState<Bench|null>(null);
  return detail ? <BenchmarkDetail bench={detail} onBack={()=>setDetail(null)}/> : <BenchmarkList onSelect={setDetail}/>;
}

function BenchmarkList({onSelect}:{onSelect:(b:Bench)=>void}) {
  const [filter,setFilter] = useState<string>("ALL");
  const types = ["ALL","CVE-BENCH","PREDIQL","MHBENCH"];
  const filtered = filter==="ALL" ? BENCHMARKS : BENCHMARKS.filter(b=>b.type===filter);

  const best = BENCHMARKS.filter(b=>b.status==="COMPLETE").reduce((a,b)=>b.score>a.score?b:a, BENCHMARKS[0]);

  return (
    <div className="flex flex-col h-full" style={{minHeight:0}}>
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{borderBottom:"1px solid #1E1E1E"}}>
        <div style={{fontSize:9,color:"#666666",letterSpacing:"0.22em",marginBottom:3}}>RESEARCH</div>
        <div className="flex items-baseline justify-between">
          <h1 style={{fontSize:20,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.12em"}}>BENCHMARKS</h1>
          <div className="flex gap-2">
            {types.map(t=>(
              <button key={t} onClick={()=>setFilter(t)} style={{fontSize:8,letterSpacing:"0.12em",padding:"3px 10px",background:filter===t?TYPE_C[t as Bench["type"]]??"#120608":"transparent",border:`1px solid ${filter===t?TYPE_C[t as Bench["type"]]??"#E31B23":"#1E1E1E"}`,borderRadius:2,color:filter===t?TYPE_C[t as Bench["type"]]??"#F2F2F2":"#444444",cursor:"pointer",fontFamily:"inherit"}}>{t}</button>
            ))}
          </div>
        </div>
      </div>
      {/* KPI strip */}
      <div className="flex-shrink-0 grid grid-cols-4" style={{borderBottom:"1px solid #1E1E1E"}}>
        {[{k:"BEST SCORE",v:`${(best.score*100).toFixed(1)}%`,sub:best.id,red:true},{k:"BENCHMARKS RUN",v:String(BENCHMARKS.filter(b=>b.status==="COMPLETE").length)},{k:"TOTAL TASKS",v:String(BENCHMARKS.filter(b=>b.status==="COMPLETE").reduce((s,b)=>s+b.tasks,0))},{k:"AVG SOLVE RATE",v:`${Math.round(BENCHMARKS.filter(b=>b.status==="COMPLETE").reduce((s,b)=>s+(b.solved/b.tasks),0)/BENCHMARKS.filter(b=>b.status==="COMPLETE").length*100)}%`}].map((m,i,a)=>(
          <div key={m.k} style={{padding:"12px 20px",borderRight:i<a.length-1?"1px solid #1E1E1E":"none",background:"#0D0D0D"}}>
            <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:5}}>{m.k}</div>
            <div style={{fontSize:20,fontWeight:700,color:(m as any).red?"#E31B23":"#F2F2F2",marginBottom:2}}>{m.v}</div>
            {(m as any).sub&&<div style={{fontSize:7.5,color:"#333333"}}>{(m as any).sub}</div>}
          </div>
        ))}
      </div>
      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:"#0F0F0F",position:"sticky",top:0}}>
            {["ID","NAME","TYPE","TASKS","SOLVED","PARTIAL","SCORE","AVG COST","AVG TIME","DATE","STATUS"].map(h=>(
              <th key={h} style={{padding:"5px 14px",textAlign:"left",fontSize:7.5,color:"#444444",letterSpacing:"0.16em",borderBottom:"1px solid #1A1A1A",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(b=>{
              const pct=b.tasks>0?Math.round((b.solved/b.tasks)*100):0;
              return (
                <tr key={b.id} onClick={()=>onSelect(b)} style={{borderBottom:"1px solid #111111",cursor:"pointer",opacity:b.status==="QUEUED"?0.5:1}}
                  onMouseEnter={e=>e.currentTarget.style.background="#0D0D0D"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{padding:"9px 14px",color:"#E31B23",fontWeight:700,fontSize:9}}>{b.id}</td>
                  <td style={{padding:"9px 14px",color:"#A0A0A0",fontSize:10}}>{b.name}</td>
                  <td style={{padding:"9px 14px"}}><span style={{fontSize:8.5,color:TYPE_C[b.type],letterSpacing:"0.1em",fontWeight:600}}>{b.type}</span></td>
                  <td style={{padding:"9px 14px",color:"#555555",fontSize:9}}>{b.tasks}</td>
                  <td style={{padding:"9px 14px",color:"#3FB950",fontSize:9,fontWeight:700}}>{b.solved}</td>
                  <td style={{padding:"9px 14px",color:"#D29922",fontSize:9}}>{b.partial}</td>
                  <td style={{padding:"9px 14px"}}>
                    {b.score>0?<div className="flex items-center gap-2"><span style={{fontSize:10,fontWeight:700,color:b.score>0.8?"#3FB950":b.score>0.6?"#D29922":"#E31B23"}}>{(b.score*100).toFixed(1)}%</span><div style={{width:36,height:3,background:"#1A1A1A",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:b.score>0.8?"#3FB950":b.score>0.6?"#D29922":"#E31B23"}}/></div></div>:<span style={{fontSize:9,color:"#333333"}}>—</span>}
                  </td>
                  <td style={{padding:"9px 14px",color:"#444444",fontSize:9}}>{b.avgCost}</td>
                  <td style={{padding:"9px 14px",color:"#444444",fontSize:9}}>{b.avgTime}</td>
                  <td style={{padding:"9px 14px",color:"#444444",fontSize:9}}>{b.date}</td>
                  <td style={{padding:"9px 14px"}}><span style={{fontSize:8.5,color:b.status==="COMPLETE"?"#3FB950":b.status==="RUNNING"?"#FF2A32":"#333333",letterSpacing:"0.12em",fontWeight:600}}>{b.status}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── screen 40: BENCHMARK DETAIL ── */
function BenchmarkDetail({bench,onBack}:{bench:Bench;onBack:()=>void}) {
  const [tab,setTab] = useState<"OVERVIEW"|"TASKS"|"CATEGORIES">("OVERVIEW");
  const cats = ["SQL INJECTION","AUTH","RCE","ACCESS CTRL","XSS","SSRF","XXE","PATH TRAVERSAL"];
  const catStats = cats.map(c=>({cat:c,tasks:TASK_DATA.filter(t=>t.category===c),solved:TASK_DATA.filter(t=>t.category===c&&t.solved).length}));

  return (
    <div className="flex flex-col h-full" style={{minHeight:0}}>
      <div className="flex-shrink-0 px-6 pt-5 pb-0" style={{borderBottom:"1px solid #1E1E1E"}}>
        <button onClick={onBack} style={{fontSize:9,color:"#666666",background:"transparent",border:"none",cursor:"pointer",letterSpacing:"0.14em",fontFamily:"inherit",padding:0,marginBottom:10}}
          onMouseEnter={e=>e.currentTarget.style.color="#A0A0A0"} onMouseLeave={e=>e.currentTarget.style.color="#666666"}>← BENCHMARKS</button>
        <div className="flex items-baseline gap-3 mb-3">
          <h1 style={{fontSize:18,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.1em"}}>{bench.id}</h1>
          <span style={{fontSize:9,color:TYPE_C[bench.type],letterSpacing:"0.12em",fontWeight:600}}>{bench.type}</span>
          <span style={{fontSize:14,fontWeight:700,color:"#3FB950",marginLeft:"auto"}}>{(bench.score*100).toFixed(1)}%</span>
        </div>
        <div style={{fontSize:11,color:"#555555",marginBottom:12,letterSpacing:"0.04em"}}>{bench.name}</div>
        <div className="flex">
          {(["OVERVIEW","TASKS","CATEGORIES"] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{fontSize:9,letterSpacing:"0.14em",padding:"5px 14px",background:"transparent",border:"none",borderBottom:t===tab?"2px solid #E31B23":"2px solid transparent",color:t===tab?"#F2F2F2":"#444444",cursor:"pointer",fontFamily:"inherit",marginBottom:-1}}>{t}</button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-5">
        {tab==="OVERVIEW"&&(
          <>
            <div className="grid grid-cols-4 gap-0 mb-6" style={{border:"1px solid #1E1E1E",borderRadius:2,overflow:"hidden"}}>
              {[{k:"TASKS",v:String(bench.tasks)},{k:"SOLVED",v:String(bench.solved),green:true},{k:"PARTIAL",v:String(bench.partial),warn:true},{k:"FAILED",v:String(bench.tasks-bench.solved-bench.partial),red:true}].map((m,i,a)=>(
                <div key={m.k} style={{padding:"14px 18px",borderRight:i<a.length-1?"1px solid #1A1A1A":"none",background:"#0D0D0D"}}>
                  <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:5}}>{m.k}</div>
                  <div style={{fontSize:22,fontWeight:700,color:(m as any).green?"#3FB950":(m as any).warn?"#D29922":(m as any).red?"#FF2A32":"#F2F2F2"}}>{m.v}</div>
                </div>
              ))}
            </div>
            {/* Score breakdown */}
            <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:12}}>SCORE BREAKDOWN</div>
            {[{l:"SOLVED (1.0 pts each)",v:bench.solved,max:bench.tasks,c:"#3FB950"},{l:"PARTIAL (0.5 pts each)",v:bench.partial,max:bench.tasks,c:"#D29922"},{l:"OVERALL SCORE",v:Math.round(bench.score*100),max:100,c:"#E31B23",pct:true}].map(b=>(
              <div key={b.l} style={{marginBottom:14}}>
                <div className="flex justify-between mb-2"><span style={{fontSize:9,color:"#444444",letterSpacing:"0.14em"}}>{b.l}</span><span style={{fontSize:10,fontWeight:700,color:b.c}}>{b.pct?`${b.v}%`:b.v}</span></div>
                <div style={{height:4,background:"#1A1A1A",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(b.v/b.max)*100}%`,background:b.c,borderRadius:2}}/></div>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-0 mt-5" style={{border:"1px solid #1E1E1E",borderRadius:2,overflow:"hidden"}}>
              {[{k:"AVG COST",v:bench.avgCost},{k:"AVG TIME",v:bench.avgTime},{k:"DATE",v:bench.date}].map((m,i,a)=>(
                <div key={m.k} style={{padding:"12px 16px",borderRight:i<a.length-1?"1px solid #1A1A1A":"none",background:"#0D0D0D"}}>
                  <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:4}}>{m.k}</div>
                  <div style={{fontSize:14,fontWeight:700,color:"#F2F2F2"}}>{m.v}</div>
                </div>
              ))}
            </div>
          </>
        )}
        {tab==="TASKS"&&(
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"#0F0F0F"}}>
              {["TASK","CATEGORY","RESULT","COST","TIME","E_ORD","ATTEMPTS"].map(h=>(
                <th key={h} style={{padding:"5px 12px",textAlign:"left",fontSize:7.5,color:"#444444",letterSpacing:"0.16em",borderBottom:"1px solid #1A1A1A",fontWeight:600}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{TASK_DATA.map((t,i)=>(
              <tr key={t.id} style={{borderBottom:"1px solid #111111",background:i%2?"#0B0B0B":"transparent"}}>
                <td style={{padding:"8px 12px",color:"#E31B23",fontWeight:700,fontSize:9}}>{t.id}</td>
                <td style={{padding:"8px 12px",color:"#555555",fontSize:9}}>{t.name}</td>
                <td style={{padding:"8px 12px"}}><span style={{fontSize:8.5,color:t.solved?"#3FB950":t.partial?"#D29922":"#FF2A32",fontWeight:700,letterSpacing:"0.12em"}}>{t.solved?"SOLVED":t.partial?"PARTIAL":"FAILED"}</span></td>
                <td style={{padding:"8px 12px",color:"#444444",fontSize:9}}>{t.cost}</td>
                <td style={{padding:"8px 12px",color:"#444444",fontSize:9}}>{t.time}</td>
                <td style={{padding:"8px 12px",color:"#555555",fontSize:9}}>{t.eord}/5</td>
                <td style={{padding:"8px 12px",color:t.attempts>2?"#D29922":"#444444",fontSize:9}}>{t.attempts}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
        {tab==="CATEGORIES"&&(
          <div className="flex flex-col gap-3">
            {catStats.filter(c=>c.tasks.length>0).map(c=>{
              const pct=c.tasks.length>0?Math.round((c.solved/c.tasks.length)*100):0;
              return (
                <div key={c.cat} style={{border:"1px solid #1E1E1E",borderRadius:2,padding:"12px 16px"}}>
                  <div className="flex items-center justify-between mb-2">
                    <span style={{fontSize:10,color:"#A0A0A0",letterSpacing:"0.08em",fontWeight:600}}>{c.cat}</span>
                    <span style={{fontSize:10,fontWeight:700,color:pct>80?"#3FB950":pct>50?"#D29922":"#FF2A32"}}>{pct}%</span>
                  </div>
                  <div style={{height:3,background:"#1A1A1A",borderRadius:2,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${pct}%`,background:pct>80?"#3FB950":pct>50?"#D29922":"#FF2A32"}}/>
                  </div>
                  <div style={{fontSize:8,color:"#333333",marginTop:4}}>{c.solved}/{c.tasks.length} SOLVED</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
