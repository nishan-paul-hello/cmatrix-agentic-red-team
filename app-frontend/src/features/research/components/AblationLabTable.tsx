import { type AblationSpec } from "@/features/research/data/fixtures/researchMockData";

/**
 * AblationLabTable — renders the conditions table for a selected ablation.
 *
 * Pattern: each ablation's conditions are rows.
 * The baseline condition (isBaseline=true) gets a special highlight.
 * Discriminating pairs are flagged inline via the parent panel's discriminatingNote.
 */
export function AblationLabTable({ sel }: { sel: AblationSpec }) {
    return (
        <table className="mb-[24px] w-full border-collapse">
            <thead>
                <tr className="bg-[var(--color-hex-0f0f0f)]">
                    {[
                        "CONDITION",
                        "SCORE (pass@5 1-day)",
                        "Δ vs BASELINE",
                        "AVG COST",
                        "AVG TIME",
                    ].map((h) => (
                        <th
                            key={h}
                            className="text-sm-tight tracking-wider-1 px-[12px] py-[5px] text-left font-semibold whitespace-nowrap text-[var(--color-hex-444444)]"
                            style={{
                                borderBottom: "1px solid var(--color-hex-1a1a1a)",
                            }}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {sel.conditions.map((cond, idx) => {
                    const isBase = !!cond.isBaseline;
                    return (
                        <tr
                            key={cond.label}
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                                background: isBase ? "var(--color-hex-0d0d0d)" : "transparent",
                                borderLeft: isBase
                                    ? "2px solid var(--color-success)"
                                    : "2px solid transparent",
                            }}
                        >
                            <td className="px-[12px] py-[8px]">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-base tracking-tighter"
                                        style={{
                                            color: isBase
                                                ? "var(--color-success)"
                                                : "var(--color-hex-888888)",
                                        }}
                                    >
                                        {cond.label}
                                    </span>
                                    {isBase && (
                                        <span className="tracking-wider-1 rounded-[2px] border border-solid border-[var(--color-hex-3fb95033)] bg-[var(--color-hex-0a1a10)] px-[4px] py-[1px] text-xs font-semibold text-[var(--color-success)]">
                                            BASELINE
                                        </span>
                                    )}
                                    {/* A1 special: highlight (c)/(d) discriminating pair */}
                                    {sel.id === "A1" && (idx === 2 || idx === 3) && (
                                        <span className="rounded-[2px] border border-solid border-[var(--color-hex-d2992233)] bg-[var(--color-hex-1a1200)] px-[4px] py-[1px] text-xs tracking-wide text-[var(--color-warning)]">
                                            DISCRIMINATING PAIR
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td
                                className="px-[12px] py-[8px] text-lg font-bold"
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
                            </td>
                            <td
                                className="px-[12px] py-[8px] text-base font-bold"
                                style={{
                                    color: (() => {
                                        if (cond.delta === 0) {
                                            return "var(--color-hex-555555)";
                                        }
                                        if (cond.delta > -0.05) {
                                            return "var(--color-warning)";
                                        }
                                        return "var(--color-danger)";
                                    })(),
                                }}
                            >
                                {cond.delta === 0 ? "—" : `${(cond.delta * 100).toFixed(1)}pp`}
                            </td>
                            <td className="px-[12px] py-[8px] text-base text-[var(--color-hex-444444)]">
                                {cond.avgCost}
                            </td>
                            <td className="px-[12px] py-[8px] text-base text-[var(--color-hex-444444)]">
                                {cond.avgTime}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
