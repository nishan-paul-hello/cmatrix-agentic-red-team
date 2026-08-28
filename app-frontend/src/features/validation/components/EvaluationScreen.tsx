import { globalSupervisor, type EvaluationDecision } from "@/features/validation/domain/Supervisor";
import { EORD_LABELS } from "@/lib/constants";

export default function EvaluationScreen({
    entry = globalSupervisor.evaluateEvidence("00483"),
}: {
    entry?: EvaluationDecision;
}) {
    const VALUE = entry.eord;
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    EXECUTION / {entry.nodeId}
                </div>
                <div className="flex items-baseline gap-3">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">EVALUATION</h1>
                    <span className="border-border bg-muted text-warning rounded-sm border-[1px] border-solid px-1.5 py-px text-base tracking-widest">
                        EXECUTION #{entry.execId}
                    </span>
                </div>
            </div>

            <div className="max-w-[760px] flex-1 overflow-y-auto px-6 py-6">
                {/* Three labeled blocks */}
                {[
                    {
                        label: "WHAT HAPPENED",
                        color: "var(--muted-foreground)",
                        content: entry.whatHappened,
                    },
                    {
                        label: "EXPECTED VS ACTUAL",
                        color: "var(--muted-foreground)",
                        content: entry.expectedVsActual,
                    },
                    {
                        label: "NEXT STEP",
                        color: "var(--muted-foreground)",
                        content: entry.nextStep,
                    },
                ].map((block, i, arr) => (
                    <div key={block.label}>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="bg-primary h-4 w-0.5" />
                            <span className="text-foreground text-xs font-bold tracking-widest">
                                {block.label}
                            </span>
                        </div>
                        <div
                            className="text-xs leading-loose tracking-tighter whitespace-pre-wrap"
                            style={{
                                color: block.color,
                                marginBottom: i < arr.length - 1 ? 0 : 24,
                            }}
                        >
                            {block.content}
                        </div>
                        {i < arr.length - 1 && (
                            <div
                                className="bg-card h-px"
                                style={{
                                    margin: "24px 0",
                                }}
                            />
                        )}
                    </div>
                ))}

                {/* E_ord indicator */}
                <div className="border-border bg-background mt-2 rounded-sm border-[1px] border-solid px-6 py-5">
                    <div className="text-muted-foreground mb-5 text-sm tracking-widest">
                        EVIDENCE LEVEL INDICATOR
                    </div>
                    <div
                        className="relative"
                        style={{
                            paddingBottom: 32,
                        }}
                    >
                        {/* Track */}
                        <div className="bg-muted absolute top-1.5 right-0 left-0 h-px" />
                        <div
                            className="bg-primary absolute top-1.5 left-0 h-px"
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
                                        className="h-1.5 w-1.5 rounded-none"
                                        style={{
                                            border: `1px solid ${i <= VALUE ? "var(--primary)" : "var(--border)"}`,
                                            background: (() => {
                                                if (i < VALUE) {
                                                    return "var(--primary)";
                                                }
                                                if (i === VALUE) {
                                                    return "var(--destructive)";
                                                }
                                                return "transparent";
                                            })(),
                                        }}
                                    />
                                    {i === VALUE && (
                                        <div className="text-destructive mt-0.5 text-sm font-bold">
                                            ▲
                                        </div>
                                    )}
                                    <div
                                        className="absolute bottom-0 text-xs tracking-normal whitespace-nowrap"
                                        style={{
                                            color: i === VALUE ? "var(--primary)" : "var(--border)",
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
                        <span className="text-primary text-xs font-bold tracking-tight">
                            E_ord {VALUE} — {EORD_LABELS[VALUE]}
                        </span>
                        <span className="text-muted-foreground text-base tracking-tight">
                            Raised from {VALUE - 1} ({EORD_LABELS[VALUE - 1]}) after timing
                            confirmation
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
