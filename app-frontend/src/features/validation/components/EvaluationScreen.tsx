import { globalSupervisor, type EvaluationDecision } from "@/features/validation/domain/Supervisor";
import { EORD_LABELS } from "@/lib/constants";

export default function EvaluationScreen({
    entry = globalSupervisor.evaluateEvidence("00483"),
}: {
    entry?: EvaluationDecision;
}) {
    const VALUE = entry.eord;
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="tracking-widest-2 mb-[3px] text-base text-[var(--color-hex-666666)]">
                    EXECUTION / {entry.nodeId}
                </div>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        EVALUATION
                    </h1>
                    <span className="tracking-wider-1 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-d2992244)] bg-[var(--color-hex-1a1200)] px-[7px] py-[1px] text-base text-[var(--color-warning)]">
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
                            <div className="h-[16px] w-[2px] bg-[var(--color-brand)]" />
                            <span className="tracking-wider-3 text-lg font-bold text-[var(--color-fg)]">
                                {block.label}
                            </span>
                        </div>
                        <div
                            className="text-xl-tight leading-loose tracking-tighter"
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
                    <div className="text-base-tight mb-[20px] tracking-widest text-[var(--color-hex-444444)]">
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
                            className="absolute top-[7px] left-0 h-[1px] bg-[var(--color-brand)]"
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
                                            border: `1px solid ${i <= VALUE ? "var(--color-brand)" : "var(--color-hex-292929)"}`,
                                            background: (() => {
                                                if (i < VALUE) {
                                                    return "var(--color-brand)";
                                                }
                                                if (i === VALUE) {
                                                    return "var(--color-danger)";
                                                }
                                                return "transparent";
                                            })(),
                                        }}
                                    />
                                    {i === VALUE && (
                                        <div className="mt-[2px] text-sm font-bold text-[var(--color-danger)]">
                                            ▲
                                        </div>
                                    )}
                                    <div
                                        className="text-sm-tight absolute bottom-0 tracking-normal whitespace-nowrap"
                                        style={{
                                            color:
                                                i === VALUE
                                                    ? "var(--color-brand)"
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
                        <span className="text-lg font-bold tracking-tight text-[var(--color-brand)]">
                            E_ord {VALUE} — {EORD_LABELS[VALUE]}
                        </span>
                        <span className="tracking-tight-1 text-base text-[var(--color-hex-444444)]">
                            Raised from {VALUE - 1} ({EORD_LABELS[VALUE - 1]}) after timing
                            confirmation
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
