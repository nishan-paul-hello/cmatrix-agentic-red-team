import { EORD_LABELS } from "@/lib/constants";
interface EvalEntry {
  execId: string;
  nodeId: string;
  nodeType: string;
  eord: number;
  whatHappened: string;
  expectedVsActual: string;
  nextStep: string;
}
const DEFAULT_ENTRY: EvalEntry = {
  execId: "00483",
  nodeId: "SQLI-001",
  nodeType: "SQL INJECTION",
  eord: 3,
  whatHappened: `Time-based blind SQL injection payload was dispatched to GET /api/users?id=1 via the execution agent using sqlmap with --technique=T --time-sec=4. The server responded with a 200 OK after 4.18 seconds — significantly above the 4-second threshold — indicating successful time delay induced by the injected payload. The injection point in the id parameter is confirmed to be vulnerable. No WAF block or rate-limiting was observed.`,
  expectedVsActual: `EXPECTED: Server response within baseline 80–120ms (no injection effect).\nACTUAL: Server response at 4.18s with time-sec=4 payload — delta of ~4.06s above baseline.\n\nThis matches the success condition for E_ord elevation: reproducible, statistically significant timing delta (>3σ above baseline). A second confirmation request at 06:31:09 yielded 4.21s, confirming consistency.`,
  nextStep: `E_ord raised from 3 (CLEAR) to 4 (CONFIRMED). VDG node SQLI-001 status updated to IN_PROGRESS. Team manager UCB score updated to 0.891. Specialist will proceed to enumerate database schema via time-based extraction. DB-ACCESS-002 and RCE-007 dependency edges are now eligible for scheduling once SQLI-001 reaches EXPLOITED state.`
};
export default function EvaluationScreen({
  entry = DEFAULT_ENTRY
}: {
  entry?: EvalEntry;
}) {
  const VALUE = entry.eord;
  return <div className="flex flex-col h-full min-h-[0px]">
      <div className="flex-shrink-0 px-6 pt-5 pb-4" style={{
      borderBottom: "1px solid var(--color-hex-1e1e1e)"
    }}>
        <div className="text-[9px] text-[var(--color-hex-666666)] tracking-[0.22em] mb-[3px]">EXECUTION / {entry.nodeId}</div>
        <div className="flex items-baseline gap-3">
          <h1 className="text-[20px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.12em]">EVALUATION</h1>
          <span className="text-[9px] text-[var(--color-hex-d29922)] bg-[var(--color-hex-1a1200)] border-[1px] border-solid border-[var(--color-hex-d2992244)] rounded-[2px] py-[1px] px-[7px] tracking-[0.14em]">EXECUTION #{entry.execId}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 max-w-[760px]">
        {/* Three labeled blocks */}
        {[{
        label: "WHAT HAPPENED",
        color: "var(--color-hex-a0a0a0)",
        content: entry.whatHappened
      }, {
        label: "EXPECTED VS ACTUAL",
        color: "var(--color-hex-a0a0a0)",
        content: entry.expectedVsActual
      }, {
        label: "NEXT STEP",
        color: "var(--color-hex-a0a0a0)",
        content: entry.nextStep
      }].map((block, i, arr) => <div key={block.label}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-[2px] h-[16px] bg-[var(--color-hex-e31b23)]" />
              <span className="text-[10px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.18em]">{block.label}</span>
            </div>
            <div className="text-[10.5px] tracking-[0.04em] leading-[1.8]" style={{
          color: block.color,
          whiteSpace: "pre-wrap",
          marginBottom: i < arr.length - 1 ? 0 : 24
        }}>
              {block.content}
            </div>
            {i < arr.length - 1 && <div className="h-[1px] bg-[var(--color-hex-1a1a1a)]" style={{
          margin: "24px 0"
        }} />}
          </div>)}

        {/* E_ord indicator */}
        <div className="border-[1px] border-solid border-[var(--color-hex-1e1e1e)] rounded-[2px] py-[20px] px-[24px] bg-[var(--color-hex-0d0d0d)] mt-[8px]">
          <div className="text-[8.5px] text-[var(--color-hex-444444)] tracking-[0.2em] mb-[20px]">EVIDENCE LEVEL INDICATOR</div>
          <div className="relative" style={{
          paddingBottom: 32
        }}>
            {/* Track */}
            <div className="absolute top-[7px] left-0 right-0 h-[1px] bg-[var(--color-hex-292929)]" />
            <div className="absolute top-[7px] left-0 h-[1px] bg-[var(--color-hex-e31b23)]" style={{
            width: `${VALUE / 5 * 100}%`
          }} />
            {/* Ticks — F3: fix ORACLE (i===5) label overflow */}
            <div className="flex justify-between">
              {EORD_LABELS.map((lbl, i) => <div key={lbl} className="flex flex-col items-center" style={{
              zIndex: 1
            }}>
                  <div className="w-[7px] h-[7px] rounded-[1px]" style={{
                border: `1px solid ${i <= VALUE ? "var(--color-hex-e31b23)" : "var(--color-hex-292929)"}`,
                background: i < VALUE ? "var(--color-hex-e31b23)" : i === VALUE ? "var(--color-hex-ff2a32)" : "transparent"
              }} />
                  {i === VALUE && <div className="text-[8px] text-[var(--color-hex-ff2a32)] mt-[2px] font-bold">▲</div>}
                  <div className="absolute bottom-0 text-[7.5px] tracking-[0.1em] whitespace-nowrap" style={{
                color: i === VALUE ? "var(--color-hex-e31b23)" : "var(--color-hex-333333)",
                transform: i === 5 ? "translateX(-90%)" : i === 0 ? "translateX(-10%)" : "translateX(-50%)",
                left: `${i / 5 * 100}%`
              }}>
                    {lbl}
                  </div>
                </div>)}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-[var(--color-hex-e31b23)] font-bold tracking-[0.08em]">E_ord {VALUE} — {EORD_LABELS[VALUE]}</span>
            <span className="text-[9px] text-[var(--color-hex-444444)] tracking-[0.06em]">Raised from {VALUE - 1} ({EORD_LABELS[VALUE - 1]}) after timing confirmation</span>
          </div>
        </div>
      </div>
    </div>;
}