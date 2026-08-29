import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
        <div className="mb-6">
            <Table>
                <TableHeader>
                    <TableRow className="bg-card hover:bg-card">
                        {[
                            "CONDITION",
                            "SCORE (pass@5 1-day)",
                            "Δ vs BASELINE",
                            "AVG COST",
                            "AVG TIME",
                        ].map((h) => (
                            <TableHead
                                key={h}
                                className="text-muted-foreground border-border border-b px-3 py-1 text-left text-xs font-semibold tracking-widest"
                            >
                                {h}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sel.conditions.map((cond, idx) => {
                        const isBase = !!cond.isBaseline;
                        let scoreColor = "text-destructive";
                        if (cond.score > 0.75) {
                            scoreColor = "text-success";
                        } else if (cond.score > 0.55) {
                            scoreColor = "text-warning";
                        }

                        let deltaColor = "text-destructive";
                        if (cond.delta === 0) {
                            deltaColor = "text-muted-foreground";
                        } else if (cond.delta > -0.05) {
                            deltaColor = "text-warning";
                        }

                        return (
                            <TableRow
                                key={cond.label}
                                className={`border-border hover:bg-muted/50 border-b ${isBase ? "bg-background border-l-success border-l-2" : "border-l-2 border-l-transparent bg-transparent"}`}
                            >
                                <TableCell className="px-3 py-2">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-base tracking-tighter ${isBase ? "text-success" : "text-muted-foreground"}`}
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
                                </TableCell>
                                <TableCell className={`px-3 py-2 text-xs font-bold ${scoreColor}`}>
                                    {(cond.score * 100).toFixed(1)}%
                                </TableCell>
                                <TableCell
                                    className={`px-3 py-2 text-base font-bold ${deltaColor}`}
                                >
                                    {cond.delta === 0 ? "—" : `${(cond.delta * 100).toFixed(1)}pp`}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3 py-2 text-base">
                                    {cond.avgCost}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3 py-2 text-base">
                                    {cond.avgTime}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
