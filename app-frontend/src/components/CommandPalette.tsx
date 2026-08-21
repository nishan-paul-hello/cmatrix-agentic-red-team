import { useState, useEffect, useRef } from "react";

interface PaletteItem {
  id: string; label: string; sub: string;
  category: "MISSION"|"FINDING"|"SPECIALIST"|"ACTION"|"NAV"|"SETTING";
  kbd?: string;
}

const ALL_ITEMS: PaletteItem[] = [
  {id:"go-dashboard",   label:"Dashboard",               sub:"Go to command center",          category:"NAV",        kbd:"G D"},
  {id:"go-missions",    label:"Missions",                sub:"Go to missions list",            category:"NAV",        kbd:"G M"},
  {id:"go-benchmarks",  label:"Benchmarks",              sub:"Go to benchmark results",        category:"NAV"},
  {id:"go-reports",     label:"Reports",                 sub:"Go to generated reports",        category:"NAV"},
  {id:"go-audit",       label:"Audit Log",               sub:"View system audit events",       category:"NAV"},
  {id:"go-settings",    label:"Settings",                sub:"Open system settings",           category:"NAV",        kbd:"G S"},
  {id:"m-cve001",       label:"CVE-001",                 sub:"app.targetcorp.com · ACTIVE",   category:"MISSION"},
  {id:"m-bench014",     label:"BENCH-014",               sub:"CVE-BENCH v2 Full · COMPLETE",  category:"MISSION"},
  {id:"m-bench013",     label:"BENCH-013",               sub:"PrediQL Reasoning · COMPLETE",  category:"MISSION"},
  {id:"f-001",          label:"F-001 SQL INJECTION",     sub:"/api/users?id= · CRITICAL",     category:"FINDING"},
  {id:"f-002",          label:"F-002 AUTH BYPASS",       sub:"/api/auth/login · HIGH",        category:"FINDING"},
  {id:"f-003",          label:"F-003 IDOR",              sub:"/api/users/:id · HIGH",         category:"FINDING"},
  {id:"s-inject",       label:"INJECT-SPEC",             sub:"RUNNING · sqli_blind_time()",   category:"SPECIALIST"},
  {id:"s-auth",         label:"AUTH-SPEC",               sub:"COMPLETED · exploit_auth()",    category:"SPECIALIST"},
  {id:"s-recon",        label:"RECON-SPEC",              sub:"COMPLETED · recon_target()",    category:"SPECIALIST"},
  {id:"act-new",        label:"New Mission",             sub:"Start a new VAPT mission",      category:"ACTION",     kbd:"N"},
  {id:"act-pause",      label:"Pause Mission",           sub:"Pause active mission agents",   category:"ACTION"},
  {id:"act-escalate",   label:"Human Escalation",        sub:"Open escalation panel",         category:"ACTION"},
  {id:"act-report",     label:"Generate Report",         sub:"Generate mission report",       category:"ACTION"},
  {id:"set-roe",        label:"ROE Defaults",            sub:"Edit rules of engagement",      category:"SETTING"},
  {id:"set-models",     label:"Model Settings",          sub:"Configure LLM assignments",     category:"SETTING"},
];

const CAT_C: Record<PaletteItem["category"],{color:string;bg:string}> = {
  NAV:        {color:"#A0A0A0",bg:"#111111"},
  MISSION:    {color:"#E31B23",bg:"#120608"},
  FINDING:    {color:"#FF2A32",bg:"#1A0608"},
  SPECIALIST: {color:"#D29922",bg:"#110E00"},
  ACTION:     {color:"#3FB950",bg:"#061A0C"},
  SETTING:    {color:"#555555",bg:"#111111"},
};

interface Props { onClose: ()=>void; onNavigate: (id:string)=>void; }

export default function CommandPalette({onClose,onNavigate}:Props) {
  const [query,setQuery] = useState("");
  const [cursor,setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? ALL_ITEMS.filter(i=>i.label.toLowerCase().includes(query.toLowerCase())||i.sub.toLowerCase().includes(query.toLowerCase())||i.category.includes(query.toUpperCase()))
    : ALL_ITEMS;

  useEffect(()=>{ inputRef.current?.focus(); },[]);

  useEffect(()=>{ setCursor(0); },[query]);

  function handleKey(e:React.KeyboardEvent) {
    if (e.key==="ArrowDown"){e.preventDefault();setCursor(c=>Math.min(c+1,filtered.length-1));}
    if (e.key==="ArrowUp")  {e.preventDefault();setCursor(c=>Math.max(c-1,0));}
    if (e.key==="Enter"&&filtered[cursor]){onNavigate(filtered[cursor].id);onClose();}
    if (e.key==="Escape")onClose();
  }

  useEffect(()=>{
    const el=listRef.current?.children[cursor] as HTMLElement;
    el?.scrollIntoView({block:"nearest"});
  },[cursor]);

  // Group by category
  const cats = Array.from(new Set(filtered.map(i=>i.category)));

  return (
    <div className="fixed inset-0 flex items-start justify-center" style={{background:"#00000099",zIndex:100,paddingTop:120}} onClick={onClose}>
      <div style={{width:600,background:"#0D0D0D",border:"1px solid #292929",borderRadius:3,overflow:"hidden",boxShadow:"0 24px 48px #000000cc"}} onClick={e=>e.stopPropagation()}>
        {/* Input */}
        <div className="flex items-center gap-3 px-4" style={{borderBottom:"1px solid #1E1E1E",height:48}}>
          <span style={{fontSize:14,color:"#333333"}}>⌘</span>
          <input ref={inputRef} value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={handleKey}
            placeholder="Search missions, findings, actions…"
            style={{flex:1,background:"transparent",border:"none",outline:"none",fontSize:12,color:"#F2F2F2",fontFamily:"inherit",letterSpacing:"0.04em"}}/>
          {query&&<button onClick={()=>setQuery("")} style={{color:"#333333",background:"transparent",border:"none",cursor:"pointer",fontSize:12}}>✕</button>}
          <kbd style={{fontSize:8,color:"#333333",background:"#111111",border:"1px solid #1E1E1E",borderRadius:2,padding:"2px 6px",fontFamily:"inherit"}}>ESC</kbd>
        </div>
        {/* Results */}
        <div ref={listRef} style={{maxHeight:420,overflowY:"auto"}}>
          {filtered.length===0?(
            <div className="flex flex-col items-center justify-center py-10">
              <div style={{fontSize:20,color:"#1E1E1E",marginBottom:8}}>◇</div>
              <div style={{fontSize:10,color:"#333333",letterSpacing:"0.14em"}}>NO RESULTS</div>
            </div>
          ):(
            cats.map(cat=>(
              <div key={cat}>
                <div style={{padding:"6px 16px 3px",fontSize:7.5,color:"#333333",letterSpacing:"0.2em",background:"#0A0A0A",borderTop:"1px solid #111111"}}>{cat}</div>
                {filtered.filter(i=>i.category===cat).map(item=>{
                  const idx=filtered.indexOf(item);
                  const cc=CAT_C[item.category];
                  const active=idx===cursor;
                  return (
                    <div key={item.id} onClick={()=>{onNavigate(item.id);onClose();}} onMouseEnter={()=>setCursor(idx)}
                      style={{padding:"9px 16px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",background:active?"#141414":"transparent",borderLeft:active?"2px solid #E31B23":"2px solid transparent"}}>
                      <span style={{fontSize:9,color:cc.color,background:cc.bg,border:`1px solid ${cc.color}33`,borderRadius:2,padding:"1px 6px",letterSpacing:"0.1em",fontWeight:600,flexShrink:0}}>{item.category}</span>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:10.5,color:active?"#F2F2F2":"#A0A0A0",fontWeight:active?700:400,letterSpacing:"0.04em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.label}</div>
                        <div style={{fontSize:8.5,color:"#444444",letterSpacing:"0.04em",marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.sub}</div>
                      </div>
                      {item.kbd&&<kbd style={{fontSize:8,color:"#333333",background:"#111111",border:"1px solid #1E1E1E",borderRadius:2,padding:"2px 6px",fontFamily:"inherit",flexShrink:0}}>{item.kbd}</kbd>}
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>
        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2" style={{borderTop:"1px solid #141414",background:"#0A0A0A"}}>
          <div className="flex items-center gap-4">
            {[{k:"↑↓",v:"navigate"},{k:"↵",v:"open"},{k:"ESC",v:"close"}].map(h=>(
              <div key={h.k} className="flex items-center gap-1">
                <kbd style={{fontSize:7.5,color:"#333333",background:"#111111",border:"1px solid #1E1E1E",borderRadius:2,padding:"1px 5px",fontFamily:"inherit"}}>{h.k}</kbd>
                <span style={{fontSize:7.5,color:"#333333",letterSpacing:"0.1em"}}>{h.v}</span>
              </div>
            ))}
          </div>
          <span style={{fontSize:7.5,color:"#222222",letterSpacing:"0.12em"}}>{filtered.length} RESULTS</span>
        </div>
      </div>
    </div>
  );
}
