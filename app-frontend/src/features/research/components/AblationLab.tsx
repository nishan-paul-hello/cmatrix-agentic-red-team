import { useState } from "react";

import { ABLATION_RUNS, COMPONENTS } from "@/features/research/data/fixtures/researchMockData";

import { AblationLabDetailPanel } from "./AblationLabDetailPanel";
import { AblationLabTable } from "./AblationLabTable";

export default function AblationLab() {
    const [sel, setSel] = useState(ABLATION_RUNS[0]);
    const baseline = ABLATION_RUNS[ABLATION_RUNS.length - 1];
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            {/* Left: config + results */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-[14px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    ABLATION RUNS — SELECT TO COMPARE
                </div>
                <AblationLabTable sel={sel} setSel={setSel} />
                {/* Component impact summary */}
                <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    COMPONENT IMPACT (vs baseline)
                </div>
                {COMPONENTS.map((c) => {
                    const withComp = ABLATION_RUNS.find(
                        (r) =>
                            r[c.key] === true &&
                            Object.values(r).filter((v) => v === false).length === 0,
                    );
                    const withoutComp = ABLATION_RUNS.find(
                        (r) => r[c.key] === false && ABLATION_RUNS[0].score > r.score + 0.05,
                    );
                    const impact = withComp && withoutComp ? withComp.score - withoutComp.score : 0;
                    return (
                        <div key={c.key} className="mb-[14px]">
                            <div className="mb-1 flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] font-semibold tracking-[0.1em] text-[var(--color-hex-a0a0a0)]">
                                        {c.label}
                                    </span>
                                    <span className="ml-[8px] text-[8px] text-[var(--color-hex-333333)]">
                                        {c.desc}
                                    </span>
                                </div>
                                <span
                                    className="text-[10px] font-bold"
                                    style={{
                                        color: (() => {
                                            if (impact > 0.1) {
                                                return "var(--color-hex-e31b23)";
                                            }
                                            if (impact > 0.05) {
                                                return "var(--color-hex-d29922)";
                                            }
                                            return "var(--color-hex-555555)";
                                        })(),
                                    }}
                                >
                                    -{(impact * 100).toFixed(1)}% if removed
                                </span>
                            </div>
                            <div className="h-[4px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full rounded-[2px]"
                                    style={{
                                        width: `${Math.min(impact * 200, 100)}%`,
                                        background: (() => {
                                            if (impact > 0.1) {
                                                return "var(--color-hex-e31b23)";
                                            }
                                            if (impact > 0.05) {
                                                return "var(--color-hex-d29922)";
                                            }
                                            return "var(--color-hex-555555)";
                                        })(),
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Right: detail */}
            <AblationLabDetailPanel sel={sel} baseline={baseline} />
        </div>
    );
}
