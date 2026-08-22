import { COMPONENTS, type AblationRun } from "@/features/research/data/fixtures/researchMockData";

export function AblationLabDetailPanel({
    sel,
    baseline,
}: {
    sel: AblationRun;
    baseline: AblationRun;
}) {
    return (
        <div
            className="flex w-[260px] flex-shrink-0 flex-col overflow-y-auto px-[14px] py-[16px]"
            style={{
                borderLeft: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div className="mb-[4px] text-[11px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                {sel.id}
            </div>
            <div className="mb-[16px] text-[9px] leading-[1.5] text-[var(--color-hex-555555)]">
                {sel.name}
            </div>
            <div className="mb-[16px]">
                <div className="mb-[8px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    COMPONENTS
                </div>
                {COMPONENTS.map((c) => (
                    <div key={c.key} className="mb-2 flex items-center gap-2">
                        <span
                            className="min-w-[12px] text-[9px] font-bold"
                            style={{
                                color: sel[c.key]
                                    ? "var(--color-hex-3fb950)"
                                    : "var(--color-hex-333333)",
                            }}
                        >
                            {sel[c.key] ? "✓" : "✗"}
                        </span>
                        <span
                            className="text-[9px]"
                            style={{
                                color: sel[c.key]
                                    ? "var(--color-hex-666666)"
                                    : "var(--color-hex-333333)",
                            }}
                        >
                            {c.label}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mb-[16px] h-[1px] bg-[var(--color-hex-1a1a1a)]" />
            {[
                {
                    k: "SCORE",
                    v: `${(sel.score * 100).toFixed(1)}%`,
                    c: (() => {
                        if (sel.score > 0.75) {
                            return "var(--color-hex-3fb950)";
                        }
                        if (sel.score > 0.55) {
                            return "var(--color-hex-d29922)";
                        }
                        return "var(--color-hex-ff2a32)";
                    })(),
                },
                {
                    k: "vs FULL SYSTEM",
                    v: sel.delta === 0 ? "baseline" : `${(sel.delta * 100).toFixed(1)}%`,
                    c: (() => {
                        if (sel.delta < -0.1) {
                            return "var(--color-hex-ff2a32)";
                        }
                        if (sel.delta < -0.05) {
                            return "var(--color-hex-d29922)";
                        }
                        return "var(--color-hex-555555)";
                    })(),
                },
                {
                    k: "COST",
                    v: sel.cost,
                },
                {
                    k: "RUNTIME",
                    v: sel.time,
                },
            ].map((r) => (
                <div key={r.k} className="mb-[12px]">
                    <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                        {r.k}
                    </div>
                    <div
                        className="text-[14px] font-bold"
                        style={{
                            color: r.c ?? "var(--color-hex-f2f2f2)",
                        }}
                    >
                        {r.v}
                    </div>
                </div>
            ))}
            <div className="mt-[8px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-e31b2333)] bg-[var(--color-hex-120608)] px-[12px] py-[10px]">
                <div className="mb-[4px] text-[8px] tracking-[0.16em] text-[var(--color-hex-e31b23)]">
                    SCORE DELTA vs BASELINE
                </div>
                <div
                    className="text-[16px] font-bold"
                    style={{
                        color:
                            sel.delta > -0.05
                                ? "var(--color-hex-d29922)"
                                : "var(--color-hex-ff2a32)",
                    }}
                >
                    {sel.delta === 0
                        ? "baseline"
                        : `${((sel.score - baseline.score) * 100).toFixed(1)}pp`}
                </div>
            </div>
        </div>
    );
}
