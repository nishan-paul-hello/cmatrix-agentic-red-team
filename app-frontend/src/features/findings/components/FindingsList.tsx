import React from "react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SEV_C, STATUS_C } from "@/features/findings/data/fixtures/findingsMockData";
import { type Finding, type Severity } from "@/types/domain-types";

export default function FindingsList({
    findings,
    counts,
    onSelect,
    page,
    setPage,
}: {
    findings: Finding[];
    counts: Record<Severity, number>;
    onSelect: (f: Finding) => void;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}) {
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    MISSION / CVE-001
                </div>
                <h1 className="text-foreground text-xs font-bold tracking-wide">
                    VALIDATED FINDINGS
                </h1>
            </div>
            {/* Severity KPIs */}
            <div className="border-border grid flex-shrink-0 grid-cols-1 border-b sm:grid-cols-2 lg:grid-cols-4">
                {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as Severity[]).map((s) => (
                    <div key={s} className="bg-background border-border border-r px-5 py-3.5">
                        <div className="text-muted-foreground mb-1.5 text-sm tracking-widest">
                            {s}
                        </div>
                        <div
                            className="text-sm leading-none font-bold"
                            style={{
                                color: SEV_C[s].color,
                            }}
                        >
                            {String(counts[s]).padStart(2, "0")}
                        </div>
                    </div>
                ))}
            </div>
            {/* Table */}
            <div className="flex-1 overflow-auto">
                <Table className="w-full border-collapse text-xs">
                    <TableHeader>
                        <TableRow className="bg-card sticky top-0">
                            {[
                                "ID",
                                "TYPE",
                                "TARGET",
                                "SEVERITY",
                                "E_ORD",
                                "STATUS",
                                "FIRST SEEN",
                                "VALIDATED",
                            ].map((h) => (
                                <TableHead
                                    key={h}
                                    className="text-muted-foreground border-border border-b px-3.5 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
                                >
                                    {h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {findings.map((f) => {
                            const sc = SEV_C[f.severity],
                                stc = STATUS_C[f.status] ?? "text-muted-foreground";
                            return (
                                <TableRow
                                    key={f.id}
                                    className="border-border hover:bg-border cursor-pointer border-b transition-colors"
                                    onClick={() => onSelect(f)}
                                >
                                    <TableCell className="text-primary px-3.5 py-2 font-bold tracking-tight">
                                        {f.id}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-3.5 py-2">
                                        {f.type}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-3.5 py-2 text-base">
                                        {f.target}
                                    </TableCell>
                                    <TableCell className="px-3.5 py-2">
                                        <span
                                            className="rounded-sm px-1 py-px text-base font-semibold tracking-normal"
                                            style={{
                                                color: sc.color,
                                                background: sc.bg,
                                                border: `1px solid ${sc.color}33`,
                                            }}
                                        >
                                            {f.severity}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-3.5 py-2 text-center">
                                        {f.eord}/5
                                    </TableCell>
                                    <TableCell className="px-3.5 py-2">
                                        <span
                                            className="text-base font-semibold tracking-normal"
                                            style={{
                                                color: stc,
                                            }}
                                        >
                                            {f.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-3.5 py-2 text-base">
                                        {f.first}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-3.5 py-2 text-base">
                                        {f.validated}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-2 flex items-center justify-between px-6 pb-4">
                <div className="text-muted-foreground text-xs tracking-normal">PAGE {page}</div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        className="bg-card text-foreground hover:bg-card/80 h-auto rounded-sm px-3 py-1.5 text-base font-semibold tracking-widest"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        PREV
                    </Button>
                    <Button
                        variant="secondary"
                        className="bg-card text-foreground hover:bg-card/80 h-auto rounded-sm px-3 py-1.5 text-base font-semibold tracking-widest"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={findings.length < 50}
                    >
                        NEXT
                    </Button>
                </div>
            </div>
        </div>
    );
}
