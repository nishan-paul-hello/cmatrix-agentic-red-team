import { useState } from "react";

import { Button } from "@/components/ui/button";
import { KPIStrip } from "@/components/ui/KPIStrip";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    FAILURE_CLUSTERS,
    FAILURE_TIMELINE,
} from "@/features/research/data/fixtures/researchMockData";

export default function FailureAnalysis() {
    const [sel, setSel] = useState<(typeof FAILURE_CLUSTERS)[0] | null>(null);
    const total = FAILURE_CLUSTERS.reduce((s, c) => s + c.count, 0);
    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* KPIs */}
                <KPIStrip
                    className="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    items={[
                        {
                            k: "TOTAL FAILURES",
                            v: String(total),
                        },
                        {
                            k: "UNIQUE CLUSTERS",
                            v: String(FAILURE_CLUSTERS.length),
                        },
                        {
                            k: "FIXABLE",
                            v: String(
                                FAILURE_CLUSTERS.slice(0, 4).reduce((s, c) => s + c.count, 0),
                            ),
                        },
                    ]}
                />
                {/* Failure clusters */}
                <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                    FAILURE CLUSTERS
                </div>
                {FAILURE_CLUSTERS.map((c) => (
                    <button
                        type="button"
                        key={c.id}
                        onClick={() => setSel(sel?.id === c.id ? null : c)}
                        className={`border-border focus:ring-primary hover:bg-background mb-2 block w-full cursor-pointer rounded-sm border-[1px] border-solid text-left transition-colors focus:ring-1 focus:outline-none ${sel?.id === c.id ? "bg-background" : "bg-transparent"}`}
                    >
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div
                                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                                style={{
                                    background: c.color,
                                }}
                            />
                            <span className="text-muted-foreground flex-1 text-xs font-bold tracking-tight">
                                {c.label}
                            </span>
                            <span
                                className="text-sm font-bold"
                                style={{
                                    color: c.color,
                                }}
                            >
                                {c.count}
                            </span>
                            <span className="text-muted-foreground min-w-8 text-right text-base">
                                {c.pct}%
                            </span>
                        </div>
                        <div
                            className={`bg-card mx-4 h-0.5 overflow-hidden rounded-sm ${sel?.id === c.id ? "mb-0" : "mb-[10px]"}`}
                        >
                            <div
                                className="h-full"
                                style={{
                                    width: `${c.pct}%`,
                                    background: c.color,
                                }}
                            />
                        </div>
                        {sel?.id === c.id && (
                            <div className="border-border mt-2 border-t px-4 py-3">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm tracking-widest">
                                        {c.id} DETAIL
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSel(null);
                                        }}
                                        className="text-muted-foreground hover:text-muted-foreground h-auto cursor-pointer p-0.5 text-sm leading-none hover:bg-transparent"
                                        aria-label="Close"
                                    >
                                        ✕
                                    </Button>
                                </div>
                                <div className="text-muted-foreground mb-2.5 text-base leading-loose">
                                    {c.desc}
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-success shrink-0 text-sm font-bold tracking-widest">
                                        FIX
                                    </span>
                                    <span className="text-success text-base leading-relaxed">
                                        {c.fix}
                                    </span>
                                </div>
                            </div>
                        )}
                    </button>
                ))}
                {/* Failure timeline */}
                <div className="text-muted-foreground mt-5 mb-3 text-sm tracking-widest">
                    RECENT FAILURES
                </div>
                <div className="border-border overflow-hidden rounded-sm border-[1px] border-solid">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {[
                                    "TIME",
                                    "TYPE",
                                    "RUN",
                                    "TASK",
                                    "COST",
                                    "ATTEMPTS",
                                    "RESOLVED",
                                ].map((h) => (
                                    <TableHead
                                        key={h}
                                        className={`px-3 py-1 text-xs tracking-widest ${h === "TYPE" ? "w-[25%]" : "w-[12.5%]"}`}
                                    >
                                        {h}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {FAILURE_TIMELINE.map((f) => (
                                <TableRow key={f.ts}>
                                    <TableCell className="cell-truncate text-muted-foreground px-3 py-1.5">
                                        {f.ts}
                                    </TableCell>
                                    <TableCell className="cell-truncate text-muted-foreground px-3 py-1.5 font-semibold tracking-tight">
                                        {f.type}
                                    </TableCell>
                                    <TableCell className="cell-truncate text-primary px-3 py-1.5">
                                        {f.run}
                                    </TableCell>
                                    <TableCell className="cell-truncate text-muted-foreground px-3 py-1.5">
                                        {f.task}
                                    </TableCell>
                                    <TableCell className="cell-truncate text-muted-foreground px-3 py-1.5">
                                        {f.cost}
                                    </TableCell>
                                    <TableCell
                                        className={`cell-truncate px-3 py-1.5 ${f.attempts > 2 ? "text-warning" : "text-muted-foreground"}`}
                                    >
                                        {f.attempts}
                                    </TableCell>
                                    <TableCell className="px-3 py-1.5">
                                        <span
                                            className={`font-bold ${f.resolved ? "text-success" : "text-border"}`}
                                        >
                                            {f.resolved ? "YES" : "-"}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
