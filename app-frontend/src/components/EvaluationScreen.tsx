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
    nextStep: `E_ord raised from 3 (CLEAR) to 4 (CONFIRMED). VDG node SQLI-001 status updated to IN_PROGRESS. Team manager UCB score updated to 0.891. Specialist will proceed to enumerate database schema via time-based extraction. DB-ACCESS-002 and RCE-007 dependency edges are now eligible for scheduling once SQLI-001 reaches EXPLOITED state.`,
};
export default function EvaluationScreen({ entry = DEFAULT_ENTRY }: { entry?: EvalEntry }) {
    const VALUE = entry.eord;
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    EXECUTION / {entry.nodeId}
                </div>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        EVALUATION
                    </h1>
                    <span className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-d2992244)] bg-[var(--color-hex-1a1200)] px-[7px] py-[1px] text-[9px] tracking-[0.14em] text-[var(--color-hex-d29922)]">
                        EXECUTION #{entry.execId}
                    </span>
                </div>
            </div>

            <div className="max-w-[760px] flex-1 overflow-y-auto px-6 py-6">
                {/* Three labeled blocks */}
                {[
                    {
                        label: "WHAT HAPPENED",
                        color: "var(--color-hex-a0a0a0)",
                        content: entry.whatHappened,
                    },
                    {
                        label: "EXPECTED VS ACTUAL",
                        color: "var(--color-hex-a0a0a0)",
                        content: entry.expectedVsActual,
                    },
                    {
                        label: "NEXT STEP",
                        color: "var(--color-hex-a0a0a0)",
                        content: entry.nextStep,
                    },
                ].map((block, i, arr) => (
                    <div key={block.label}>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="h-[16px] w-[2px] bg-[var(--color-hex-e31b23)]" />
                            <span className="text-[10px] font-bold tracking-[0.18em] text-[var(--color-hex-f2f2f2)]">
                                {block.label}
                            </span>
                        </div>
                        <div
                            className="text-[10.5px] leading-[1.8] tracking-[0.04em]"
                            style={{
                                color: block.color,
                                whiteSpace: "pre-wrap",
                                marginBottom: i < arr.length - 1 ? 0 : 24,
                            }}
                        >
                            {block.content}
                        </div>
                        {i < arr.length - 1 && (
                            <div
                                className="h-[1px] bg-[var(--color-hex-1a1a1a)]"
                                style={{
                                    margin: "24px 0",
                                }}
                            />
                        )}
                    </div>
                ))}

                {/* E_ord indicator */}
                <div className="mt-[8px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[24px] py-[20px]">
                    <div className="mb-[20px] text-[8.5px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        EVIDENCE LEVEL INDICATOR
                    </div>
                    <div
                        className="relative"
                        style={{
                            paddingBottom: 32,
                        }}
                    >
                        {/* Track */}
                        <div className="absolute top-[7px] right-0 left-0 h-[1px] bg-[var(--color-hex-292929)]" />
                        <div
                            className="absolute top-[7px] left-0 h-[1px] bg-[var(--color-hex-e31b23)]"
                            style={{
                                width: `${(VALUE / 5) * 100}%`,
                            }}
                        />
                        {/* Ticks — F3: fix ORACLE (i===5) label overflow */}
                        <div className="flex justify-between">
                            {EORD_LABELS.map((lbl, i) => (
                                <div
                                    key={lbl}
                                    className="flex flex-col items-center"
                                    style={{
                                        zIndex: 1,
                                    }}
                                >
                                    <div
                                        className="h-[7px] w-[7px] rounded-[1px]"
                                        style={{
                                            border: `1px solid ${i <= VALUE ? "var(--color-hex-e31b23)" : "var(--color-hex-292929)"}`,
                                            background: (() => {
                                                if (i < VALUE) {
                                                    return "var(--color-hex-e31b23)";
                                                }
                                                if (i === VALUE) {
                                                    return "var(--color-hex-ff2a32)";
                                                }
                                                return "transparent";
                                            })(),
                                        }}
                                    />
                                    {i === VALUE && (
                                        <div className="mt-[2px] text-[8px] font-bold text-[var(--color-hex-ff2a32)]">
                                            ▲
                                        </div>
                                    )}
                                    <div
                                        className="absolute bottom-0 text-[7.5px] tracking-[0.1em] whitespace-nowrap"
                                        style={{
                                            color:
                                                i === VALUE
                                                    ? "var(--color-hex-e31b23)"
                                                    : "var(--color-hex-333333)",
                                            transform: (() => {
                                                if (i === 5) {
                                                    return "translateX(-90%)";
                                                }
                                                if (i === 0) {
                                                    return "translateX(-10%)";
                                                }
                                                return "translateX(-50%)";
                                            })(),
                                            left: `${(i / 5) * 100}%`,
                                        }}
                                    >
                                        {lbl}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                        <span className="text-[10px] font-bold tracking-[0.08em] text-[var(--color-hex-e31b23)]">
                            E_ord {VALUE} — {EORD_LABELS[VALUE]}
                        </span>
                        <span className="text-[9px] tracking-[0.06em] text-[var(--color-hex-444444)]">
                            Raised from {VALUE - 1} ({EORD_LABELS[VALUE - 1]}) after timing
                            confirmation
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
