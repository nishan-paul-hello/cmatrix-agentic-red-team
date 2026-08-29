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
        <div className="bg-background border-border lg:w-drawer-sm flex w-full flex-shrink-0 flex-col overflow-y-auto border-t lg:border-t-0 lg:border-l">
            <div className="border-border border-b px-5 pt-5 pb-4">
                <div className="text-muted-foreground mb-2.5 text-xs font-semibold uppercase tracking-widest">
                    MISSION SUMMARY
                </div>
                <div className="flex flex-col gap-3">
                    <MetaRow label="TARGET" value={target || "—"} />
                    <MetaRow label="TARGET TYPE" value={targetType} />
                    <MetaRow label="SURFACE" value={step >= 3 ? surface : "—"} />
                    <MetaRow label="MODE" value={step >= 4 ? mode : "—"} />
                    <MetaRow label="MAX RUNTIME" value={runtimeNum ? runtimeLabel() : "—"} />
                    <MetaRow
                        label="COST CEILING"
                        value={costNum ? `$${costNum.toFixed(2)}` : "—"}
                    />
                    <MetaRow label="TOOL TIMEOUT" value={timeoutNum ? `${timeoutNum}s` : "—"} />
                </div>
            </div>

            {/* ROE preview */}
            {step >= 2 && roe && (
                <div className="border-border border-b px-5 pt-4 pb-4">
                    <div className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-widest">
                        ROE PREVIEW
                    </div>
                    <div className="text-muted-foreground line-clamp-6 overflow-hidden text-xs leading-relaxed tracking-tight">
                        {roe}
                    </div>
                </div>
            )}

            <div className="px-5 pt-4">
                <div className="text-muted-foreground mb-2 text-xs font-semibold uppercase tracking-widest">
                    VALIDATION
                </div>
                <div className="text-muted-foreground text-xs leading-loose tracking-normal">
                    Oracle validation available for BENCHMARK ENVIRONMENT targets.
                </div>
            </div>
        </div>
    );
}
