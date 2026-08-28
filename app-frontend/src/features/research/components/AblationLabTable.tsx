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
        <table className="mb-6 w-full border-collapse">
            <thead>
                <tr className="bg-card">
                    {[
                        "CONDITION",
                        "SCORE (pass@5 1-day)",
                        "Δ vs BASELINE",
                        "AVG COST",
                        "AVG TIME",
                    ].map((h) => (
                        <th
                            key={h}
                            className="text-muted-foreground border-border border-b px-3 py-1 text-left text-xs font-semibold tracking-widest whitespace-nowrap"
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
                                borderBottom: "1px solid var(--border)",
                                background: isBase ? "var(--background)" : "transparent",
                                borderLeft: isBase
                                    ? "2px solid var(--success)"
                                    : "2px solid transparent",
                            }}
                        >
                            <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="text-base tracking-tighter"
                                        style={{
                                            color: isBase
                                                ? "var(--success)"
                                                : "var(--muted-foreground)",
                                        }}
                                    >
                                        {cond.label}
                                    </span>
                                    {isBase && (
                                        <span className="border-border bg-muted text-success rounded-sm border border-solid px-1 py-px text-xs font-semibold tracking-widest">
                                            BASELINE
                                        </span>
                                    )}
                                    {/* A1 special: highlight (c)/(d) discriminating pair */}
                                    {sel.id === "A1" && (idx === 2 || idx === 3) && (
                                        <span className="border-border bg-muted text-warning rounded-sm border border-solid px-1 py-px text-xs tracking-wide">
                                            DISCRIMINATING PAIR
                                        </span>
                                    )}
                                </div>
                            </td>
                            <td
                                className="px-3 py-2 text-xs font-bold"
                                style={{
                                    color: (() => {
                                        if (cond.score > 0.75) {
                                            return "var(--success)";
                                        }
                                        if (cond.score > 0.55) {
                                            return "var(--warning)";
                                        }
                                        return "var(--destructive)";
                                    })(),
                                }}
                            >
                                {(cond.score * 100).toFixed(1)}%
                            </td>
                            <td
                                className="px-3 py-2 text-base font-bold"
                                style={{
                                    color: (() => {
                                        if (cond.delta === 0) {
                                            return "var(--muted-foreground)";
                                        }
                                        if (cond.delta > -0.05) {
                                            return "var(--warning)";
                                        }
                                        return "var(--destructive)";
                                    })(),
                                }}
                            >
                                {cond.delta === 0 ? "—" : `${(cond.delta * 100).toFixed(1)}pp`}
                            </td>
                            <td className="text-muted-foreground px-3 py-2 text-base">
                                {cond.avgCost}
                            </td>
                            <td className="text-muted-foreground px-3 py-2 text-base">
                                {cond.avgTime}
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
