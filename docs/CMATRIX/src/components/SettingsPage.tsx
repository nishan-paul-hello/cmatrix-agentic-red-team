import { useState } from "react";

type SettingsTab = "GENERAL"|"ROE DEFAULTS"|"MODELS"|"NOTIFICATIONS"|"MODAL REFERENCE"|"STATE REFERENCE";

export default function SettingsPage() {
  const [tab,setTab] = useState<SettingsTab>("GENERAL");
  return (
    <div className="flex flex-col h-full" style={{minHeight:0}}>
      <div className="flex-shrink-0 px-6 pt-5 pb-0" style={{borderBottom:"1px solid #1E1E1E"}}>
        <div style={{fontSize:9,color:"#666666",letterSpacing:"0.22em",marginBottom:3}}>SYSTEM</div>
        <h1 style={{fontSize:20,fontWeight:700,color:"#F2F2F2",letterSpacing:"0.12em",marginBottom:12}}>SETTINGS</h1>
        <div className="flex overflow-x-auto">
          {(["GENERAL","ROE DEFAULTS","MODELS","NOTIFICATIONS","MODAL REFERENCE","STATE REFERENCE"] as SettingsTab[]).map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{fontSize:8.5,letterSpacing:"0.12em",padding:"5px 14px",background:"transparent",border:"none",borderBottom:t===tab?"2px solid #E31B23":"2px solid transparent",color:t===tab?"#F2F2F2":"#444444",cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap",marginBottom:-1}}>{t}</button>
          ))}
        </div>
      </div>
      {tab==="GENERAL"          && <GeneralSettings/>}
      {tab==="ROE DEFAULTS"     && <ROEDefaults/>}
      {tab==="MODELS"           && <ModelSettings/>}
      {tab==="NOTIFICATIONS"    && <NotificationSettings/>}
      {tab==="MODAL REFERENCE"  && <ModalReference/>}
      {tab==="STATE REFERENCE"  && <StateReference/>}
    </div>
  );
}

/* ── Field helpers ── */
function Field({label,children}:{label:string;children:React.ReactNode}) {
  return <div style={{marginBottom:20}}><div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:8}}>{label}</div>{children}</div>;
}
function TextInput({value,placeholder}:{value:string;placeholder?:string}) {
  const [v,setV] = useState(value);
  return <input value={v} onChange={e=>setV(e.target.value)} placeholder={placeholder} style={{width:"100%",background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"7px 12px",fontSize:10,color:"#A0A0A0",fontFamily:"inherit",outline:"none",letterSpacing:"0.04em",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#1E1E1E"}/>;
}
function Toggle({on}:{on:boolean}) {
  const [v,setV] = useState(on);
  return <div onClick={()=>setV(!v)} style={{width:32,height:16,borderRadius:8,background:v?"#E31B23":"#1E1E1E",border:`1px solid ${v?"#E31B23":"#292929"}`,cursor:"pointer",position:"relative",transition:"background 0.15s"}}><div style={{width:12,height:12,borderRadius:"50%",background:"#F2F2F2",position:"absolute",top:1,left:v?16:2,transition:"left 0.15s"}}/></div>;
}
function NumInput({value,unit}:{value:string;unit?:string}) {
  const [v,setV] = useState(value);
  return <div className="flex items-center gap-2"><input value={v} onChange={e=>setV(e.target.value)} style={{width:80,background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"7px 10px",fontSize:10,color:"#A0A0A0",fontFamily:"inherit",outline:"none",textAlign:"right"}} onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#1E1E1E"}/>{unit&&<span style={{fontSize:9,color:"#444444"}}>{unit}</span>}</div>;
}
function SaveBar() {
  const [saved,setSaved] = useState(false);
  return <div className="flex gap-3 mt-8"><button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}} style={{fontSize:9.5,color:"#F2F2F2",background:"#E31B23",border:"none",borderRadius:2,padding:"7px 20px",letterSpacing:"0.14em",cursor:"pointer",fontFamily:"inherit"}}>{saved?"SAVED ✓":"SAVE CHANGES"}</button><button style={{fontSize:9.5,color:"#666666",background:"transparent",border:"1px solid #292929",borderRadius:2,padding:"7px 16px",letterSpacing:"0.14em",cursor:"pointer",fontFamily:"inherit"}}>RESET DEFAULTS</button></div>;
}
function SectionHead({label}:{label:string}) {
  return <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:16,borderBottom:"1px solid #141414",paddingBottom:6,marginTop:24}}>{label}</div>;
}

/* ── GENERAL ── */
function GeneralSettings() {
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="OPERATOR"/>
    <Field label="OPERATOR ID"><TextInput value="usr-01"/></Field>
    <Field label="DISPLAY NAME"><TextInput value="Security Researcher"/></Field>
    <Field label="ORGANIZATION"><TextInput value="CMatrix Research Lab"/></Field>
    <SectionHead label="INTERFACE"/>
    {[{l:"AUTO-REFRESH LIVE FEED",on:true},{l:"SHOW TIMESTAMPS IN UTC",on:true},{l:"COMPACT TABLE ROWS",on:false},{l:"SOUND ALERTS ON ESCALATION",on:false}].map(s=>(
      <div key={s.l} className="flex items-center justify-between mb-4">
        <span style={{fontSize:10,color:"#888888",letterSpacing:"0.06em"}}>{s.l}</span><Toggle on={s.on}/>
      </div>
    ))}
    <SectionHead label="DANGER ZONE"/>
    <div style={{border:"1px solid #FF2A3244",borderRadius:2,padding:"14px 16px",background:"#0A0605"}}>
      <div style={{fontSize:9,color:"#FF2A32",letterSpacing:"0.16em",marginBottom:8}}>DESTRUCTIVE ACTIONS</div>
      <div className="flex gap-3">
        {["CLEAR ALL MISSIONS","RESET KNOWLEDGE BASE","FACTORY RESET"].map(a=>(
          <button key={a} style={{fontSize:8.5,color:"#FF2A32",background:"transparent",border:"1px solid #FF2A3266",borderRadius:2,padding:"5px 10px",letterSpacing:"0.1em",cursor:"pointer",fontFamily:"inherit"}}>{a}</button>
        ))}
      </div>
    </div>
    <SaveBar/>
  </div>;
}

/* ── ROE DEFAULTS ── */
function ROEDefaults() {
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="RUNTIME LIMITS"/>
    <Field label="MAX RUNTIME"><NumInput value="4" unit="hours"/></Field>
    <Field label="COST CEILING"><NumInput value="5.00" unit="USD"/></Field>
    <Field label="TOOL TIMEOUT"><NumInput value="120" unit="seconds"/></Field>
    <Field label="MAX RETRIES PER NODE"><NumInput value="3" unit="attempts"/></Field>
    <SectionHead label="DEFAULT RULES OF ENGAGEMENT"/>
    <Field label="DEFAULT ROE TEXT">
      <textarea defaultValue={"No destructive actions. No data exfiltration beyond evidence collection. No lateral movement beyond defined scope. Stop on any sign of production data exposure. Authorized targets only."} style={{width:"100%",minHeight:100,background:"#0D0D0D",border:"1px solid #1E1E1E",borderRadius:2,padding:"10px 12px",fontSize:10,color:"#888888",fontFamily:"inherit",letterSpacing:"0.04em",lineHeight:1.8,resize:"vertical",outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#E31B23"} onBlur={e=>e.target.style.borderColor="#1E1E1E"}/>
    </Field>
    <SectionHead label="ESCALATION TRIGGERS"/>
    {[{l:"ESCALATE ON NOVEL VULNERABILITY",on:true},{l:"ESCALATE ON HIGH-RISK ACTION",on:true},{l:"ESCALATE WHEN COST EXCEEDS 80% CEILING",on:true},{l:"ESCALATE ON ORACLE FAILURE",on:false}].map(s=>(
      <div key={s.l} className="flex items-center justify-between mb-4">
        <span style={{fontSize:10,color:"#888888",letterSpacing:"0.06em"}}>{s.l}</span><Toggle on={s.on}/>
      </div>
    ))}
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
    <Field label="MAX TOKENS PER CALL"><NumInput value="8192" unit="tokens"/></Field>
    <Field label="TEMPERATURE"><NumInput value="0.7"/></Field>
    {[{l:"ENABLE PROMPT CACHING",on:true},{l:"STREAMING RESPONSES",on:true}].map(s=>(
      <div key={s.l} className="flex items-center justify-between mb-4">
        <span style={{fontSize:10,color:"#888888"}}>{s.l}</span><Toggle on={s.on}/>
      </div>
    ))}
    <SaveBar/>
  </div>;
}

/* ── NOTIFICATIONS ── */
function NotificationSettings() {
  return <div className="flex-1 overflow-y-auto px-6 py-6" style={{maxWidth:600}}>
    <SectionHead label="NOTIFICATION CHANNELS"/>
    {[{l:"BROWSER NOTIFICATIONS",on:true},{l:"SOUND ALERTS",on:false},{l:"EMAIL DIGEST",on:false}].map(s=>(
      <div key={s.l} className="flex items-center justify-between mb-4">
        <span style={{fontSize:10,color:"#888888"}}>{s.l}</span><Toggle on={s.on}/>
      </div>
    ))}
    <SectionHead label="NOTIFY ON"/>
    {[{l:"MISSION COMPLETE",on:true},{l:"CRITICAL FINDING",on:true},{l:"HUMAN ESCALATION REQUEST",on:true},{l:"COST THRESHOLD WARNING",on:true},{l:"SPECIALIST SPAWNED",on:false},{l:"ORACLE RESULT",on:false}].map(s=>(
      <div key={s.l} className="flex items-center justify-between mb-4">
        <span style={{fontSize:10,color:"#888888"}}>{s.l}</span><Toggle on={s.on}/>
      </div>
    ))}
    <SaveBar/>
  </div>;
}

/* ── MODAL REFERENCE (screen 47) ── */
const MODALS = [
  {id:"VDGNodeDrawer",     trigger:"Click node in Attack Graph",     size:"320px right drawer", desc:"VDG node detail: attack intent, scores, E_ord indicator, prerequisites, lifecycle"},
  {id:"UCBModal",          trigger:"Click row in Team Manager",       size:"540px center modal", desc:"UCB formula breakdown with exploit/explore bars, score composition"},
  {id:"StateMachineModal", trigger:"STATE MACHINE button in Validation",size:"680px center modal", desc:"Validation flow: ORACLE TEST→SUCCESS→VALIDATED / FAILURE→DIAGNOSIS→RETRY loop"},
  {id:"OraclePanel",       trigger:"ORACLE PANEL button in Validation",size:"320px right panel",  desc:"3 oracle states (CVE-BENCH/PREDIQL/MHBENCH) with pass/fail and verification"},
  {id:"ExecDrawer",        trigger:"Click row in Execution Console",  size:"340px right drawer", desc:"Execution detail: SUMMARY/RAW OUTPUT/PARSED OUTPUT/EL CHANGES/TRAJECTORY tabs"},
  {id:"EvidenceModal",     trigger:"VIEW EVIDENCE in Finding Detail", size:"700px center modal", desc:"Evidence viewer: REQUEST/RESPONSE/EVIDENCE/ORACLE tabs with redacted data"},
  {id:"CommandPalette",    trigger:"Ctrl+K global",                   size:"600px center overlay",desc:"Global search: missions, findings, actions, specialists, quick navigation"},
];

function ModalReference() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div style={{fontSize:9,color:"#666666",letterSpacing:"0.16em",marginBottom:20}}>MODAL SYSTEM — {MODALS.length} COMPONENTS</div>
      <div style={{border:"1px solid #1E1E1E",borderRadius:2,overflow:"hidden"}}>
        <div className="flex" style={{background:"#0F0F0F",borderBottom:"1px solid #1A1A1A"}}>
          {["COMPONENT","TRIGGER","SIZE","DESCRIPTION"].map(h=>(
            <div key={h} style={{flex:h==="DESCRIPTION"?3:h==="TRIGGER"?2:1,padding:"5px 14px",fontSize:7.5,color:"#444444",letterSpacing:"0.16em",fontWeight:600}}>{h}</div>
          ))}
        </div>
        {MODALS.map((m,i)=>(
          <div key={m.id} className="flex items-start" style={{borderBottom:i<MODALS.length-1?"1px solid #111111":"none",background:i%2?"#0B0B0B":"transparent"}}>
            <div style={{flex:1,padding:"10px 14px",fontSize:10,color:"#E31B23",fontWeight:700,letterSpacing:"0.04em"}}>{m.id}</div>
            <div style={{flex:2,padding:"10px 14px",fontSize:9,color:"#555555",lineHeight:1.6}}>{m.trigger}</div>
            <div style={{flex:1,padding:"10px 14px",fontSize:9,color:"#444444"}}>{m.size}</div>
            <div style={{flex:3,padding:"10px 14px",fontSize:9,color:"#666666",lineHeight:1.6}}>{m.desc}</div>
          </div>
        ))}
      </div>
      {/* Keyboard shortcuts */}
      <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginTop:28,marginBottom:14}}>KEYBOARD SHORTCUTS</div>
      <div style={{border:"1px solid #1E1E1E",borderRadius:2,overflow:"hidden"}}>
        {[{k:"Ctrl + K",v:"Open global command palette"},{k:"Esc",v:"Close any modal / drawer"},{k:"↑ / ↓",v:"Navigate list / table rows"},{k:"Enter",v:"Open selected item detail"},{k:"Ctrl + /",v:"Focus search input"},{k:"G + D",v:"Go to dashboard"},{k:"G + M",v:"Go to missions"}].map((r,i,a)=>(
          <div key={r.k} className="flex items-center" style={{borderBottom:i<a.length-1?"1px solid #111111":"none",padding:"8px 14px",background:i%2?"#0B0B0B":"#0D0D0D"}}>
            <div style={{minWidth:140}}><kbd style={{fontSize:9,color:"#E31B23",background:"#120608",border:"1px solid #E31B2344",borderRadius:2,padding:"2px 8px",fontFamily:"inherit",letterSpacing:"0.1em"}}>{r.k}</kbd></div>
            <div style={{fontSize:10,color:"#666666"}}>{r.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── STATE REFERENCE (screen 49) ── */
function StateReference() {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div style={{fontSize:9,color:"#666666",letterSpacing:"0.16em",marginBottom:20}}>LOADING & EMPTY STATE PATTERNS</div>

      {/* Loading states */}
      <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:14}}>LOADING STATES</div>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          {label:"SPECIALIST RUNNING",el:<div className="flex items-center gap-2"><div style={{width:7,height:7,borderRadius:"50%",background:"#FF2A32",animation:"pulse 1.2s ease infinite"}}/><span style={{fontSize:9,color:"#FF2A32",letterSpacing:"0.14em"}}>RUNNING</span></div>},
          {label:"TABLE SKELETON",el:<div className="flex flex-col gap-1">{[1,2,3].map(i=><div key={i} style={{height:20,background:"linear-gradient(90deg,#111111 25%,#1A1A1A 50%,#111111 75%)",backgroundSize:"200% 100%",borderRadius:1,animation:"shimmer 1.5s infinite"}}/>)}</div>},
          {label:"SPINNER",el:<div style={{width:20,height:20,border:"2px solid #1E1E1E",borderTop:"2px solid #E31B23",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>},
          {label:"PROGRESS BAR",el:<div style={{height:4,background:"#1A1A1A",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:"40%",background:"#E31B23",borderRadius:2,animation:"progress 2s ease infinite"}}/></div>},
          {label:"ORACLE AWAITING",el:<div style={{border:"1px solid #D2992233",borderRadius:2,padding:"8px 12px",background:"#110E00"}}><div style={{fontSize:8.5,color:"#D29922",letterSpacing:"0.14em"}}>AWAITING ORACLE…</div></div>},
          {label:"MISSION PAUSED",el:<div style={{border:"1px solid #E31B2333",borderRadius:2,padding:"8px 12px",background:"#120608"}}><div style={{fontSize:8.5,color:"#E31B23",letterSpacing:"0.14em"}}>AGENT PAUSED</div></div>},
        ].map(s=>(
          <div key={s.label} style={{border:"1px solid #1E1E1E",borderRadius:2,padding:"14px 14px"}}>
            <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:12}}>{s.label}</div>
            <div style={{minHeight:28,display:"flex",alignItems:"center"}}>{s.el}</div>
          </div>
        ))}
      </div>

      {/* Empty states */}
      <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:14}}>EMPTY STATES</div>
      <div className="grid grid-cols-2 gap-4">
        {[
          {label:"NO MISSIONS",icon:"◎",msg:"No active missions",sub:"Start a new mission from the dashboard"},
          {label:"NO FINDINGS",icon:"◈",msg:"No validated findings yet",sub:"Findings appear when oracle confirms a vulnerability"},
          {label:"NO LOGS",    icon:"≡",msg:"No execution events",sub:"Events will appear as specialists run tools"},
          {label:"NO DATA",    icon:"◇",msg:"No benchmark data available",sub:"Run a benchmark to generate results"},
        ].map(e=>(
          <div key={e.label} style={{border:"1px solid #1E1E1E",borderRadius:2,padding:"24px 20px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center"}}>
            <div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.18em",marginBottom:16,alignSelf:"flex-start"}}>{e.label}</div>
            <div style={{fontSize:28,color:"#1E1E1E",marginBottom:10}}>{e.icon}</div>
            <div style={{fontSize:10,color:"#333333",fontWeight:600,letterSpacing:"0.08em",marginBottom:4}}>{e.msg}</div>
            <div style={{fontSize:8.5,color:"#222222",letterSpacing:"0.06em"}}>{e.sub}</div>
          </div>
        ))}
      </div>

      {/* VDG node status colors */}
      <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginTop:28,marginBottom:14}}>VDG NODE STATUS COLORS</div>
      <div className="flex flex-wrap gap-3">
        {[{s:"EXPLOITED",c:"#3FB950"},{s:"ELIGIBLE",c:"#E31B23"},{s:"IN_PROGRESS",c:"#FF2A32"},{s:"BLOCKED",c:"#333333"},{s:"DEPRIORITIZED",c:"#555555"},{s:"INFEASIBLE",c:"#2A2A2A"},{s:"COMPLETED",c:"#3FB950"}].map(n=>(
          <div key={n.s} className="flex items-center gap-2" style={{border:"1px solid #1E1E1E",borderRadius:2,padding:"6px 12px"}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:n.c,flexShrink:0}}/>
            <span style={{fontSize:8.5,color:n.c,letterSpacing:"0.1em",fontWeight:600}}>{n.s}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}@keyframes progress{0%{width:0%}50%{width:70%}100%{width:100%}}`}</style>
    </div>
  );
}
