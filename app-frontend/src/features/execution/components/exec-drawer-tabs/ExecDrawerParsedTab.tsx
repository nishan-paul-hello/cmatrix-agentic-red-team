import React from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { type ExecEntry } from "@/types/domain-types";

export function ExecDrawerParsedTab({
    entry,
    parsedRows,
}: {
    entry: ExecEntry;
    parsedRows: Record<string, string | number | boolean>[];
}) {
    return (
        <Table className="w-full border-collapse">
            <TableHeader>
                <TableRow className="bg-card">
                    {(entry.command.tool.outputShape
                        ? Object.keys(entry.command.tool.outputShape)
                        : ["PORT", "STATE", "SERVICE", "VERSION"]
                    ).map((h) => (
                        <TableHead
                            key={h}
                            className="text-muted-foreground border-border border-b px-2 py-1 text-left text-xs tracking-widest uppercase"
                        >
                            {h}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {parsedRows.map((r, i) => {
                    const keys = entry.command.tool.outputShape
                        ? Object.keys(entry.command.tool.outputShape)
                        : ["port", "state", "service", "version"];
                    return (
                        <TableRow key={r.id ? String(r.id) : i} className="border-border border-b">
                            {keys.map((k) => (
                                <TableCell
                                    key={k}
                                    className="text-muted-foreground px-2 py-1 text-base"
                                >
                                    {String(r[k] ?? "")}
                                </TableCell>
                            ))}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
