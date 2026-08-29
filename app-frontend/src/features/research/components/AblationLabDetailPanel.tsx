import { type AblationSpec } from "@/features/research/data/fixtures/researchMockData";

/**
 * AblationLabDetailPanel — right-side detail panel for selected ablation.
 * Updated to work with AblationSpec (new discriminated model).
 */
export function AblationLabDetailPanel({ sel }: { sel: AblationSpec }) {
    const baseline = sel.conditions.find((c) => c.isBaseline) ?? sel.conditions[0];
    const worst = [...sel.conditions].sort((a, b) => a.score - b.score)[0];
    const bestDelta = Math.abs(worst.delta);

    return (
        <div className="border-border w-panel-sm-alt flex flex-shrink-0 flex-col overflow-y-auto border-l px-3.5 py-4">
            <div className="text-foreground mb-1 text-xs font-bold tracking-normal">{sel.id}</div>
            <div className="text-muted-foreground mb-2 text-base leading-snug">{sel.name}</div>

            {/* Category badge */}
            <div
                className={`border-border bg-border mb-3.5 inline-flex self-start rounded-sm border border-solid px-1.5 py-0.5 text-xs font-semibold tracking-widest ${sel.category === "CORE" ? "text-primary" : "text-muted-foreground"}`}
            >
                {sel.category}
            </div>

            <div className="bg-card mb-4 h-px" />

            {/* Condition scorecards */}
            {sel.conditions.map((cond) => {
                const isBase = !!cond.isBaseline;
                let scoreColor = "text-destructive";
                if (cond.score > 0.75) {
                    scoreColor = "text-success";
                } else if (cond.score > 0.55) {
                    scoreColor = "text-warning";
                }

                let deltaColor = "text-muted-foreground";
                if (cond.delta < -0.1) {
                    deltaColor = "text-destructive";
                } else if (cond.delta < -0.05) {
                    deltaColor = "text-warning";
                }

                return (
                    <div key={cond.label} className="mb-3">
                        <div
                            className={`mb-0.5 text-xs tracking-wide ${isBase ? "text-success" : "text-muted-foreground"}`}
                        >
                            {cond.label}
                        </div>
                        <div className={`text-sm font-bold ${scoreColor}`}>
                            {(cond.score * 100).toFixed(1)}%
                        </div>
                        {!isBase && (
                            <div className={`text-xs font-bold ${deltaColor}`}>
                                {cond.delta === 0
                                    ? "baseline"
                                    : `${(cond.delta * 100).toFixed(1)}pp`}
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="bg-card mb-4 h-px" />

            {/* Worst delta callout */}
            <div className="border-border bg-muted mt-2 rounded-sm border-[1px] border-solid px-3 py-2.5">
                <div className="text-primary mb-1 text-sm tracking-widest">MAX DEGRADATION</div>
                <div className="text-destructive text-base font-bold">
                    -{(bestDelta * 100).toFixed(1)}pp
                </div>
                <div className="text-muted-foreground mt-0.5 text-xs leading-tight tracking-tight">
                    {worst.label}
                </div>
            </div>

            {/* Baseline scores */}
            <div className="mt-3">
                <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                    BASELINE (full system)
                </div>
                <div className="text-success text-sm font-bold">
                    {(baseline.score * 100).toFixed(1)}%
                </div>
                <div className="text-muted-foreground mt-0.5 text-sm">
                    {baseline.avgCost} · {baseline.avgTime}
                </div>
            </div>
        </div>
    );
}
