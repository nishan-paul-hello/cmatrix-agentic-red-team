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
        <div
            className="flex w-[260px] flex-shrink-0 flex-col overflow-y-auto px-[14px] py-[16px]"
            style={{
                borderLeft: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div className="mb-[4px] text-xl font-bold tracking-normal text-[var(--color-fg)]">
                {sel.id}
            </div>
            <div className="mb-[8px] text-base leading-snug text-[var(--color-hex-a0a0a0)]">
                {sel.name}
            </div>

            {/* Category badge */}
            <div
                className="text-sm-tight tracking-wider-2 mb-[14px] inline-flex rounded-[2px] px-[6px] py-[2px] font-semibold"
                style={{
                    background:
                        sel.category === "CORE"
                            ? "var(--color-hex-1a0608)"
                            : "var(--color-hex-1a1a1a)",
                    color:
                        sel.category === "CORE" ? "var(--color-brand)" : "var(--color-hex-666666)",
                    border:
                        sel.category === "CORE"
                            ? "1px solid var(--color-hex-e31b2333)"
                            : "1px solid var(--color-hex-222222)",
                    alignSelf: "flex-start",
                }}
            >
                {sel.category}
            </div>

            <div className="mb-[16px] h-[1px] bg-[var(--color-hex-1a1a1a)]" />

            {/* Condition scorecards */}
            {sel.conditions.map((cond) => {
                const isBase = !!cond.isBaseline;
                return (
                    <div key={cond.label} className="mb-[12px]">
                        <div
                            className="text-sm-tight mb-[3px] tracking-wide"
                            style={{
                                color: isBase ? "var(--color-success)" : "var(--color-hex-444444)",
                            }}
                        >
                            {cond.label}
                        </div>
                        <div
                            className="text-4xl font-bold"
                            style={{
                                color: (() => {
                                    if (cond.score > 0.75) {
                                        return "var(--color-success)";
                                    }
                                    if (cond.score > 0.55) {
                                        return "var(--color-warning)";
                                    }
                                    return "var(--color-danger)";
                                })(),
                            }}
                        >
                            {(cond.score * 100).toFixed(1)}%
                        </div>
                        {!isBase && (
                            <div
                                className="text-lg font-bold"
                                style={{
                                    color: (() => {
                                        if (cond.delta < -0.1) {
                                            return "var(--color-danger)";
                                        }
                                        if (cond.delta < -0.05) {
                                            return "var(--color-warning)";
                                        }
                                        return "var(--color-hex-555555)";
                                    })(),
                                }}
                            >
                                {cond.delta === 0
                                    ? "baseline"
                                    : `${(cond.delta * 100).toFixed(1)}pp`}
                            </div>
                        )}
                    </div>
                );
            })}

            <div className="mb-[16px] h-[1px] bg-[var(--color-hex-1a1a1a)]" />

            {/* Worst delta callout */}
            <div className="mt-[8px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-e31b2333)] bg-[var(--color-hex-120608)] px-[12px] py-[10px]">
                <div className="tracking-wider-2 mb-[4px] text-sm text-[var(--color-brand)]">
                    MAX DEGRADATION
                </div>
                <div className="text-6xl font-bold text-[var(--color-danger)]">
                    -{(bestDelta * 100).toFixed(1)}pp
                </div>
                <div className="text-sm-tight mt-[2px] leading-tight tracking-tight text-[var(--color-hex-333333)]">
                    {worst.label}
                </div>
            </div>

            {/* Baseline scores */}
            <div className="mt-[12px]">
                <div className="text-sm-tight tracking-wider-3 mb-[3px] text-[var(--color-hex-444444)]">
                    BASELINE (full system)
                </div>
                <div className="text-4xl font-bold text-[var(--color-success)]">
                    {(baseline.score * 100).toFixed(1)}%
                </div>
                <div className="mt-[2px] text-sm text-[var(--color-hex-555555)]">
                    {baseline.avgCost} · {baseline.avgTime}
                </div>
            </div>
        </div>
    );
}
