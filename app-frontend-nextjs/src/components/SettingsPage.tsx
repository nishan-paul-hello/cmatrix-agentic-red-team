import { useState } from "react";

type SettingsTab = "GENERAL"|"MODELS"|"MISSIONS"|"TOOLS"|"MEMORY"|"VDG"|"VALIDATION"|"BENCHMARKS"|"COST"|"SECURITY";
const TABS: SettingsTab[] = ["GENERAL","MODELS","MISSIONS","TOOLS","MEMORY","VDG","VALIDATION","BENCHMARKS","COST","SECURITY"];

export default function SettingsPage() {
  const [tab,setTab] = useState<SettingsTab>("GENERAL");
  return (
    <div className="flex h-full" style={{minHeight:0}}>
      {/* Left nav */}
      <div className="flex flex-col flex-shrink-0 overflow-y-auto py-4" style={{width:160,background:"#0B0B0B",borderRight:"1px solid #1E1E1E"}}>
        <div style={{fontSize:9,color:"#666666",letterSpacing:"0.22em",marginBottom:12,paddingLeft:16}}>SYSTEM / SETTINGS</div>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className="w-full text-left px-4 py-2"
            style={{fontSize:10,letterSpacing:"0.08em",background:t===tab?"#1A0A0B":"transparent",border:"none",borderLeft:`2px solid ${t===tab?"#E31B23":"transparent"}`,color:t===tab?"#F2F2F2":"#555555",cursor:"pointer",fontFamily:"inherit"}}
            onMouseEnter={e=>{if(t!==tab)e.currentTarget.style.color="#A0A0A0"}}
            onMouseLeave={e=>{if(t!==tab)e.currentTarget.style.color="#555555"}}
          >{t}</button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden" style={{minHeight:0}}>
        {tab==="GENERAL"     && <GeneralSettings/>}
        {tab==="MODELS"      && <ModelSettings/>}
        {tab==="MISSIONS"    && <MissionsSettings/>}
        {tab==="TOOLS"       && <ToolsSettings/>}
        {tab==="MEMORY"      && <MemorySettings/>}
        {tab==="VDG"         && <VDGSettings/>}
        {tab==="VALIDATION"  && <ValidationSettings/>}
        {tab==="BENCHMARKS"  && <BenchmarksSettings/>}
        {tab==="COST"        && <CostSettings/>}
        {tab==="SECURITY"    && <SecuritySettings/>}
      </div>
    </div>
  );
}

/* ── Shared helpers ── */
function Field({label,children}:{label:string;children:React.ReactNode}) {
  return <div style={{marginBottom:20}}><div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:8}}>{label}</div>{children}</div>;
}
function FieldRow({label,unit,value,onChange}:{label:string;unit?:string;value:string;onChange:(v:string)=>void}) {
  return (
    <div className="flex items-center justify-between mb-4" style={{borderBottom:"1px solid #111111",paddingBottom:10}}>
      <span style={{fontSize:10,color:"#888888",letterSpacing:"0.06em"}}>{label}</span>
      <div className="flex items-center gap-2">
        <input value={value} onChange={e=>onChange(e.target.value)} style={{width:72,background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"5px 8px",fontSize:10,color:"#A0A0A0",fontFamily:"inherit",outline:"none",textAlign:"right"}} onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#1E1E1E"}/>
        {unit&&<span style={{fontSize:8.5,color:"#444444",minWidth:52}}>{unit}</span>}
      </div>
    </div>
  );
}
function TextInput({value,placeholder}:{value:string;placeholder?:string}) {
  const [v,setV] = useState(value);
  return <input value={v} onChange={e=>setV(e.target.value)} placeholder={placeholder} style={{width:"100%",background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"7px 12px",fontSize:10,color:"#A0A0A0",fontFamily:"inherit",outline:"none",letterSpacing:"0.04em",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#1E1E1E"}/>;
}
function Toggle({on}:{on:boolean}) {
  const [v,setV] = useState(on);
  return <div onClick={()=>setV(!v)} style={{width:32,height:16,borderRadius:8,background:v?"#E31B23":"#1E1E1E",border:`1px solid ${v?"#E31B23":"#292929"}`,cursor:"pointer",position:"relative",transition:"background 0.15s",flexShrink:0}}><div style={{width:12,height:12,borderRadius:"50%",background:"#F2F2F2",position:"absolute",top:1,left:v?16:2,transition:"left 0.15s"}}/></div>;
}
function ToggleRow({label,on}:{label:string;on:boolean}) {
  return (
    <div className="flex items-center justify-between mb-4" style={{borderBottom:"1px solid #111111",paddingBottom:10}}>
      <span style={{fontSize:10,color:"#888888",letterSpacing:"0.06em"}}>{label}</span>
      <Toggle on={on}/>
    </div>
  );
}
function SaveBar() {
  const [saved,setSaved] = useState(false);
  return <div className="flex gap-3 mt-8"><button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}} style={{fontSize:9.5,color:"#F2F2F2",background:"#E31B23",border:"none",borderRadius:2,padding:"7px 20px",letterSpacing:"0.14em",cursor:"pointer",fontFamily:"inherit"}}>{saved?"SAVED ✓":"SAVE CHANGES"}</button><button style={{fontSize:9.5,color:"#666666",background:"transparent",border:"1px solid #292929",borderRadius:2,padding:"7px 16px",letterSpacing:"0.14em",cursor:"pointer",fontFamily:"inherit"}}>RESET DEFAULTS</button></div>;
}
function SectionHead({label}:{label:string}) {
  return <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:16,borderBottom:"1px solid #141414",paddingBottom:6,marginTop:24}}>{label}</div>;
}
function Chips({options,value,onChange}:{options:string[];value:string;onChange:(v:string)=>void}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map(o=>(
        <button key={o} onClick={()=>onChange(o)} style={{fontSize:9,padding:"4px 12px",background:value===o?"#1A0608":"transparent",border:`1px solid ${value===o?"#E31B23":"#292929"}`,color:value===o?"#FF2A32":"#555555",borderRadius:2,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.12em"}}>
          {o}
        </button>
      ))}
    </div>
  );
}

/* ── GENERAL ── */
function GeneralSettings() {
  const [devRef, setDevRef] = useState(false);
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="OPERATOR"/>
    <Field label="OPERATOR ID"><TextInput value="usr-01"/></Field>
    <Field label="DISPLAY NAME"><TextInput value="Security Researcher"/></Field>
    <Field label="ORGANIZATION"><TextInput value="CMatrix Research Lab"/></Field>
    <SectionHead label="INTERFACE"/>
    {[{l:"AUTO-REFRESH LIVE FEED",on:true},{l:"SHOW TIMESTAMPS IN UTC",on:true},{l:"COMPACT TABLE ROWS",on:false},{l:"SOUND ALERTS ON ESCALATION",on:false}].map(s=>(
      <div key={s.l} className="flex items-center justify-between mb-4" style={{borderBottom:"1px solid #111111",paddingBottom:10}}>
        <span style={{fontSize:10,color:"#888888",letterSpacing:"0.06em"}}>{s.l}</span><Toggle on={s.on}/>
      </div>
    ))}
    <SectionHead label="DEFAULT RULES OF ENGAGEMENT"/>
    <Field label="MAX RUNTIME"><div className="flex items-center gap-2"><input defaultValue="4" style={{width:72,background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"5px 8px",fontSize:10,color:"#A0A0A0",fontFamily:"inherit",outline:"none",textAlign:"right"}} onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#1E1E1E"}/><span style={{fontSize:8.5,color:"#444444"}}>hours</span></div></Field>
    <Field label="COST CEILING"><div className="flex items-center gap-2"><input defaultValue="5.00" style={{width:72,background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"5px 8px",fontSize:10,color:"#A0A0A0",fontFamily:"inherit",outline:"none",textAlign:"right"}} onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#1E1E1E"}/><span style={{fontSize:8.5,color:"#444444"}}>USD</span></div></Field>
    <Field label="DEFAULT MODE"><Chips options={["ONE-DAY","ZERO-DAY"]} value="ONE-DAY" onChange={()=>{}}/></Field>
    <Field label="DEFAULT SURFACE"><Chips options={["WEB APPLICATION","GRAPHQL","MULTI-HOST"]} value="WEB APPLICATION" onChange={()=>{}}/></Field>
    <Field label="ROE TEXT">
      <textarea defaultValue={"No destructive actions. No data exfiltration beyond evidence collection. No lateral movement beyond defined scope. Stop on any sign of production data exposure. Authorized targets only."} style={{width:"100%",minHeight:80,background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"10px 12px",fontSize:10,color:"#888888",fontFamily:"inherit",letterSpacing:"0.04em",lineHeight:1.8,resize:"vertical",outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#1E1E1E"}/>
    </Field>
    <SectionHead label="DANGER ZONE"/>
    <div style={{border:"1px solid #FF2A3244",borderRadius:2,padding:"14px 16px",background:"#0A0605"}}>
      <div style={{fontSize:9,color:"#FF2A32",letterSpacing:"0.16em",marginBottom:8}}>DESTRUCTIVE ACTIONS</div>
      <div className="flex gap-3">
        {["CLEAR ALL MISSIONS","RESET KNOWLEDGE BASE","FACTORY RESET"].map(a=>(
          <button key={a} style={{fontSize:8.5,color:"#FF2A32",background:"transparent",border:"1px solid #FF2A3266",borderRadius:2,padding:"5px 10px",letterSpacing:"0.1em",cursor:"pointer",fontFamily:"inherit"}}>{a}</button>
        ))}
      </div>
    </div>
    {/* DEV REFERENCE collapsible */}
    <div style={{marginTop:24}}>
      <button onClick={()=>setDevRef(!devRef)} style={{fontSize:8,color:"#333333",background:"transparent",border:"1px solid #1E1E1E",borderRadius:2,padding:"4px 10px",letterSpacing:"0.14em",cursor:"pointer",fontFamily:"inherit"}}>
        {devRef?"▾":"▸"} DEV REFERENCE
      </button>
      {devRef && (
        <div style={{marginTop:10,padding:"10px 14px",background:"#0B0B0B",border:"1px solid #1A1A1A",borderRadius:2,fontSize:9,color:"#444444",letterSpacing:"0.06em",lineHeight:1.8}}>
          Modal states: ELIGIBLE · IN_PROGRESS · EXPLOITED · BLOCKED · INFEASIBLE · DEPRIORITIZED<br/>
          Finding states: PENDING · RETRY · VALIDATED · RULED OUT<br/>
          Mission states: RUNNING · PAUSED · VALIDATING · QUEUED · COMPLETED · TERMINATED
        </div>
      )}
    </div>
    <SaveBar/>
  </div>;
}

/* ── MODELS ── */
function ModelSettings() {
  const [specialist,setSpecialist] = useState("claude-sonnet-5");
  const [manager,setManager] = useState("claude-opus-5");
  const [validator,setValidator] = useState("claude-haiku-4-5");
  const models = ["claude-opus-5","claude-sonnet-5","claude-haiku-4-5"];
  function Select({value,onChange}:{value:string;onChange:(v:string)=>void}) {
    return <select value={value} onChange={e=>onChange(e.target.value)} style={{background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"7px 12px",fontSize:10,color:"#A0A0A0",fontFamily:"inherit",outline:"none",cursor:"pointer"}}>{models.map(m=><option key={m} value={m}>{m}</option>)}</select>;
  }
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="MODEL ASSIGNMENTS"/>
    <Field label="SPECIALIST AGENTS"><Select value={specialist} onChange={setSpecialist}/></Field>
    <Field label="TEAM MANAGER"><Select value={manager} onChange={setManager}/></Field>
    <Field label="VALIDATION AGENT"><Select value={validator} onChange={setValidator}/></Field>
    <SectionHead label="INFERENCE SETTINGS"/>
    <Field label="MAX TOKENS PER CALL"><div className="flex items-center gap-2"><input defaultValue="8192" style={{width:80,background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"5px 8px",fontSize:10,color:"#A0A0A0",fontFamily:"inherit",outline:"none",textAlign:"right"}} onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#1E1E1E"}/><span style={{fontSize:8.5,color:"#444444"}}>tokens</span></div></Field>
    <Field label="TEMPERATURE"><input defaultValue="0.7" style={{width:80,background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"5px 8px",fontSize:10,color:"#A0A0A0",fontFamily:"inherit",outline:"none",textAlign:"right"}} onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#1E1E1E"}/></Field>
    {[{l:"ENABLE PROMPT CACHING",on:true},{l:"STREAMING RESPONSES",on:true}].map(s=>(
      <div key={s.l} className="flex items-center justify-between mb-4"><span style={{fontSize:10,color:"#888888"}}>{s.l}</span><Toggle on={s.on}/></div>
    ))}
    <SaveBar/>
  </div>;
}

/* ── MISSIONS ── */
function MissionsSettings() {
  const [surface,setSurface] = useState("WEB APPLICATION");
  const [mode,setMode] = useState("ONE-DAY");
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="MISSION DEFAULTS"/>
    <Field label="DEFAULT SURFACE"><Chips options={["WEB APPLICATION","GRAPHQL","MULTI-HOST"]} value={surface} onChange={setSurface}/></Field>
    <Field label="DEFAULT MODE"><Chips options={["ONE-DAY","ZERO-DAY"]} value={mode} onChange={setMode}/></Field>
    <SectionHead label="AUTOMATION"/>
    <ToggleRow label="AUTO-START VALIDATION AFTER EXPLOIT" on={true}/>
    <ToggleRow label="EARLY-STOP ON CRITICAL FINDING" on={false}/>
    <SaveBar/>
  </div>;
}

/* ── TOOLS ── */
function ToolsSettings() {
  const [timeout,setTimeout_] = useState("30");
  const [parallel,setParallel] = useState("4");
  const tools = ["nmap","sqlmap","curl","ffuf","nuclei","gobuster","hydra"];
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="EXECUTION LIMITS"/>
    <FieldRow label="TOOL TIMEOUT" unit="seconds" value={timeout} onChange={setTimeout_}/>
    <FieldRow label="MAX PARALLEL TOOL CALLS" value={parallel} onChange={setParallel}/>
    <SectionHead label="TOOL ALLOWLIST"/>
    {tools.map(t=>(
      <div key={t} className="flex items-center justify-between mb-4" style={{borderBottom:"1px solid #111111",paddingBottom:10}}>
        <span style={{fontSize:10,color:"#888888",fontFamily:"inherit",letterSpacing:"0.08em"}}>{t}</span>
        <Toggle on={["nmap","sqlmap","curl","ffuf","nuclei"].includes(t)}/>
      </div>
    ))}
    <SaveBar/>
  </div>;
}

/* ── MEMORY ── */
function MemorySettings() {
  const [thresh,setThresh] = useState("85");
  const [maxEp,setMaxEp] = useState("500");
  const [skillProm,setSkillProm] = useState("3");
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="CONTEXT MANAGEMENT"/>
    <FieldRow label="COMPACTION THRESHOLD" unit="% context used" value={thresh} onChange={setThresh}/>
    <FieldRow label="MAX EPISODIC ENTRIES" value={maxEp} onChange={setMaxEp}/>
    <SectionHead label="SKILL LIBRARY"/>
    <FieldRow label="SKILL PROMOTION THRESHOLD" unit="successful uses" value={skillProm} onChange={setSkillProm}/>
    <SaveBar/>
  </div>;
}

/* ── VDG ── */
function VDGSettings() {
  const [c,setC] = useState("0.40");
  const [eordThresh,setEordThresh] = useState("3");
  const [retryCap,setRetryCap] = useState("3");
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="UCB POLICY"/>
    <FieldRow label="UCB EXPLORATION CONSTANT c" value={c} onChange={setC}/>
    <SectionHead label="DISPATCH THRESHOLDS"/>
    <FieldRow label="E_ORD DISPATCH THRESHOLD" unit="min E_ord to dispatch" value={eordThresh} onChange={setEordThresh}/>
    <FieldRow label="RETRY CAP PER NODE" unit="attempts" value={retryCap} onChange={setRetryCap}/>
    <SaveBar/>
  </div>;
}

/* ── VALIDATION ── */
function ValidationSettings() {
  const [retries,setRetries] = useState("3");
  const [timeout,setTimeout_] = useState("60");
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="ORACLE SETTINGS"/>
    <FieldRow label="MAX ORACLE RETRIES" value={retries} onChange={setRetries}/>
    <FieldRow label="ORACLE TIMEOUT" unit="seconds" value={timeout} onChange={setTimeout_}/>
    <SectionHead label="REQUIREMENTS"/>
    <ToggleRow label="REQUIRE ORACLE FOR CRITICAL FINDINGS" on={true}/>
    <SaveBar/>
  </div>;
}

/* ── BENCHMARKS ── */
function BenchmarksSettings() {
  const [suite,setSuite] = useState("CVE-BENCH");
  const [runs,setRuns] = useState("3");
  const [budget,setBudget] = useState("5.00");
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="DEFAULT SUITE"/>
    <Field label="BENCHMARK SUITE"><Chips options={["CVE-BENCH","PREDIQL","MHBENCH"]} value={suite} onChange={setSuite}/></Field>
    <SectionHead label="RUN PARAMETERS"/>
    <FieldRow label="RUNS PER CONDITION" value={runs} onChange={setRuns}/>
    <FieldRow label="COMPUTE BUDGET PER RUN" unit="USD" value={budget} onChange={setBudget}/>
    <SaveBar/>
  </div>;
}

/* ── COST ── */
function CostSettings() {
  const [ceiling,setCeiling] = useState("10.00");
  const [perSpec,setPerSpec] = useState("2.00");
  const [alertPct,setAlertPct] = useState("80");
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="COST LIMITS"/>
    <FieldRow label="GLOBAL COST CEILING" unit="USD" value={ceiling} onChange={setCeiling}/>
    <FieldRow label="PER-SPECIALIST COST CAP" unit="USD" value={perSpec} onChange={setPerSpec}/>
    <SectionHead label="ALERTS"/>
    <FieldRow label="COST ALERT THRESHOLD" unit="% of ceiling" value={alertPct} onChange={setAlertPct}/>
    <SaveBar/>
  </div>;
}

/* ── SECURITY ── */
function SecuritySettings() {
  const [sessionTimeout,setSessionTimeout] = useState("60");
  const [retention,setRetention] = useState("90");
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="AUTHENTICATION"/>
    <ToggleRow label="REQUIRE MFA" on={true}/>
    <FieldRow label="SESSION TIMEOUT" unit="minutes" value={sessionTimeout} onChange={setSessionTimeout}/>
    <SectionHead label="AUDIT"/>
    <FieldRow label="AUDIT LOG RETENTION" unit="days" value={retention} onChange={setRetention}/>
    <SaveBar/>
  </div>;
}
