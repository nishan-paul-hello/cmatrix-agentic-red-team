import MetaRow from "@/features/missions/components/wizard/MetaRow";

export function WizardMissionSummary({
    target,
    targetType,
    surface,
    mode,
    runtimeNum,
    runtimeLabel,
    costNum,
    timeoutNum,
    step,
    roe,
}: {
    target: string;
    targetType: string;
    surface: string;
    mode: string;
    runtimeNum: number;
    runtimeLabel: () => string;
    costNum: number;
    timeoutNum: number;
    step: number;
    roe: string;
}) {
    return (
        <div
            className="flex w-[264px] flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0b0b0b)]"
            style={{
                borderLeft: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div
                className="px-5 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[10px] text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    MISSION SUMMARY
                </div>
                <div className="flex flex-col gap-3">
                    <MetaRow label="TARGET" value={target || "—"} highlight />
                    <MetaRow label="TARGET TYPE" value={targetType} />
                    <MetaRow label="SURFACE" value={step >= 3 ? surface : "—"} />
                    <MetaRow label="MODE" value={step >= 4 ? mode : "—"} />
                    <MetaRow label="MAX RUNTIME" value={runtimeNum ? runtimeLabel() : "—"} />
                    <MetaRow
                        label="COST CEILING"
                        value={costNum ? `$${costNum.toFixed(2)}` : "—"}
                        highlight={costNum > 0}
                    />
                    <MetaRow label="TOOL TIMEOUT" value={timeoutNum ? `${timeoutNum}s` : "—"} />
                </div>
            </div>

            {/* ROE preview */}
            {step >= 2 && roe && (
                <div
                    className="px-5 pt-4 pb-4"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div className="mb-[8px] text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        ROE PREVIEW
                    </div>
                    <div
                        className="overflow-hidden text-[9px] leading-[1.7] tracking-[0.06em] text-[var(--color-hex-333333)]"
                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 6,
                            WebkitBoxOrient: "vertical" as const,
                        }}
                    >
                        {roe}
                    </div>
                </div>
            )}

            <div className="px-5 pt-4">
                <div className="mb-[8px] text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    VALIDATION
                </div>
                <div className="text-[9px] leading-[1.8] tracking-[0.1em] text-[var(--color-hex-333333)]">
                    Oracle validation available for BENCHMARK ENVIRONMENT targets.
                </div>
            </div>
        </div>
    );
}
