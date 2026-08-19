const EORD_LABELS = ["UNSEEN","NOTHING","WEAK","CLEAR","CONFIRMED","ORACLE"];
const VALUE = 3;

export default function EvaluationScreen() {
  return (
    <div className="flex flex-col h-full" style={{ minHeight:0 }}>
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{ borderBottom:"1px solid #1E1E1E" }}>
        <div style={{ fontSize:9, color:"#666666", letterSpacing:"0.22em", marginBottom:3 }}>EXECUTION / SQLI-001</div>
        <div className="flex items-baseline gap-3">
          <h1 style={{ fontSize:20, fontWeight:700, color:"#F2F2F2", letterSpacing:"0.12em" }}>EVALUATION</h1>
          <span style={{ fontSize:9, color:"#D29922", background:"#1A1200", border:"1px solid #D2992244", borderRadius:2, padding:"1px 7px", letterSpacing:"0.14em" }}>EXECUTION #00483</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6" style={{ maxWidth:760 }}>
        {/* Three labeled blocks */}
        {[
          {
            label:"WHAT HAPPENED",
            color:"#A0A0A0",
            content:`Time-based blind SQL injection payload was dispatched to GET /api/users?id=1 via the execution agent using sqlmap with --technique=T --time-sec=4. The server responded with a 200 OK after 4.18 seconds — significantly above the 4-second threshold — indicating successful time delay induced by the injected payload. The injection point in the id parameter is confirmed to be vulnerable. No WAF block or rate-limiting was observed.`,
          },
          {
            label:"EXPECTED VS ACTUAL",
            color:"#A0A0A0",
            content:`EXPECTED: Server response within baseline 80–120ms (no injection effect).\nACTUAL: Server response at 4.18s with time-sec=4 payload — delta of ~4.06s above baseline.\n\nThis matches the success condition for E_ord elevation: reproducible, statistically significant timing delta (>3σ above baseline). A second confirmation request at 06:31:09 yielded 4.21s, confirming consistency.`,
          },
          {
            label:"NEXT STEP",
            color:"#A0A0A0",
            content:`E_ord raised from 3 (CLEAR) to 4 (CONFIRMED). VDG node SQLI-001 status updated to IN_PROGRESS. Team manager UCB score updated to 0.891. Specialist will proceed to enumerate database schema via time-based extraction. DB-ACCESS-002 and RCE-007 dependency edges are now eligible for scheduling once SQLI-001 reaches EXPLOITED state.`,
          },
        ].map((block, i, arr) => (
          <div key={block.label}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width:2, height:16, background:"#E31B23" }} />
              <span style={{ fontSize:10, fontWeight:700, color:"#F2F2F2", letterSpacing:"0.18em" }}>{block.label}</span>
            </div>
            <div style={{ fontSize:10.5, color:block.color, letterSpacing:"0.04em", lineHeight:1.8, whiteSpace:"pre-wrap", marginBottom: i<arr.length-1?0:24 }}>
              {block.content}
            </div>
            {i < arr.length-1 && <div style={{ height:1, background:"#1A1A1A", margin:"24px 0" }} />}
          </div>
        ))}

        {/* E_ord indicator */}
        <div style={{ border:"1px solid #1E1E1E", borderRadius:2, padding:"20px 24px", background:"#0D0D0D", marginTop:8 }}>
          <div style={{ fontSize:8.5, color:"#444444", letterSpacing:"0.2em", marginBottom:20 }}>EVIDENCE LEVEL INDICATOR</div>
          <div style={{ position:"relative", paddingBottom:32 }}>
            {/* Track */}
            <div style={{ position:"absolute", top:7, left:0, right:0, height:1, background:"#292929" }} />
            <div style={{ position:"absolute", top:7, left:0, width:`${(VALUE/5)*100}%`, height:1, background:"#E31B23" }} />
            {/* Ticks */}
            <div className="flex justify-between">
              {EORD_LABELS.map((lbl,i) => (
                <div key={lbl} className="flex flex-col items-center" style={{ zIndex:1 }}>
                  <div style={{ width:7, height:7, borderRadius:1, border:`1px solid ${i<=VALUE?"#E31B23":"#292929"}`, background:i<VALUE?"#E31B23":i===VALUE?"#FF2A32":"transparent" }} />
                  {i === VALUE && (
                    <div style={{ fontSize:8, color:"#FF2A32", marginTop:2, fontWeight:700 }}>▲</div>
                  )}
                  <div style={{ position:"absolute", bottom:0, fontSize:7.5, color:i===VALUE?"#E31B23":"#333333", letterSpacing:"0.1em", whiteSpace:"nowrap", transform:"translateX(-50%)", left:`${(i/5)*100}%` }}>
                    {lbl}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span style={{ fontSize:10, color:"#E31B23", fontWeight:700, letterSpacing:"0.08em" }}>E_ord {VALUE} — {EORD_LABELS[VALUE]}</span>
            <span style={{ fontSize:9, color:"#444444", letterSpacing:"0.06em" }}>Raised from {VALUE-1} ({EORD_LABELS[VALUE-1]}) after timing confirmation</span>
          </div>
        </div>
      </div>
    </div>
  );
}
