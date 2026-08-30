import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { STATUS_C } from "@/features/specialists/constants";
import { type VDGEntry } from "@/features/specialists/data/fixtures/teamDashboardMockData";

export const VDGScoringTable = React.memo(function ({
    vdg,
    setUcbEntry,
}: {
    vdg: VDGEntry[];
    setUcbEntry: (v: VDGEntry | null) => void;
}) {
    return (
        <div className="border-border flex flex-1 flex-col overflow-hidden border-r">
            <div className="bg-background text-muted-foreground border-border shrink-0 border-b px-4 py-2 text-sm tracking-widest">
                VDG SCORING — UCB POLICY
            </div>
            <div className="flex-1 overflow-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-card hover:bg-card sticky top-0">
                            {[
                                "NODE",
                                "TYPE",
                                "STATUS",
                                "UCB ↓",
                                "EXPLOIT",
                                "EXPLORE",
                                "VISITS",
                                "E_ORD",
                                "COST",
                            ].map((h) => (
                                <TableHead
                                    key={h}
                                    className="text-muted-foreground border-border border-b px-3 py-1 text-xs font-semibold tracking-widest"
                                >
                                    {h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vdg
                            .sort((a, b) => b.ucb - a.ucb)
                            .map((v) => {
                                let ucbColor = "text-border";
                                if (v.ucb > 0.8) {
                                    ucbColor = "text-destructive";
                                } else if (v.ucb > 0.6) {
                                    ucbColor = "text-primary";
                                } else if (v.ucb > 0) {
                                    ucbColor = "text-muted-foreground";
                                }

                                let eordColor = "text-muted-foreground";
                                if (v.eord >= 4) {
                                    eordColor = "text-success";
                                } else if (v.eord >= 2) {
                                    eordColor = "text-warning";
                                }

                                return (
                                    <TableRow
                                        key={v.id}
                                        onClick={() => setUcbEntry(v)}
                                        className="border-border hover:bg-background cursor-pointer border-b"
                                    >
                                        <TableCell className="text-primary px-3 py-1.5 text-base font-bold tracking-tight">
                                            {v.id}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                            {v.type}
                                        </TableCell>
                                        <TableCell className="px-3 py-1.5">
                                            <span
                                                className="text-sm font-semibold tracking-normal"
                                                style={{
                                                    color: STATUS_C[v.status],
                                                }}
                                            >
                                                {v.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-3 py-1.5 text-right">
                                            <span className={`text-xs font-bold ${ucbColor}`}>
                                                {v.ucb > 0 ? v.ucb.toFixed(3) : "—"}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground px-3 py-1.5 text-right text-base">
                                            {v.exploit > 0 ? v.exploit.toFixed(3) : "—"}
                                        </TableCell>
                                        <TableCell className="text-success px-3 py-1.5 text-right text-base">
                                            {v.explore > 0 ? v.explore.toFixed(3) : "—"}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground px-3 py-1.5 text-right text-base">
                                            {v.visits}
                                        </TableCell>
                                        <TableCell
                                            className={`px-3 py-1.5 text-right text-base ${eordColor}`}
                                        >
                                            {v.eord}/5
                                        </TableCell>
                                        <TableCell className="text-muted-foreground px-3 py-1.5 text-right text-base">
                                            {v.cost}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
});
VDGScoringTable.displayName = "VDGScoringTable";
