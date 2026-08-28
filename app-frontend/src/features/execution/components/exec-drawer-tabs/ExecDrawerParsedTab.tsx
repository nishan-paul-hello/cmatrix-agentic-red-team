import React from "react";

import { type ExecEntry } from "@/types/domain-types";

export function ExecDrawerParsedTab({
    entry,
    parsedRows,
}: {
    entry: ExecEntry;
    parsedRows: Record<string, string | number | boolean>[];
}) {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-card">
                    {(entry.command.tool.outputShape
                        ? Object.keys(entry.command.tool.outputShape)
                        : ["PORT", "STATE", "SERVICE", "VERSION"]
                    ).map((h) => (
                        <th
                            key={h}
                            className="text-muted-foreground border-border border-b px-2 py-1 text-left text-xs tracking-widest uppercase"
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {parsedRows.map((r, i) => {
                    const keys = entry.command.tool.outputShape
                        ? Object.keys(entry.command.tool.outputShape)
                        : ["port", "state", "service", "version"];
                    return (
                        <tr
                            key={r.id ? String(r.id) : i}
                            style={{
                                borderBottom: "1px solid var(--border)",
                            }}
                        >
                            {keys.map((k) => (
                                <td key={k} className="text-muted-foreground px-2 py-1 text-base">
                                    {String(r[k] ?? "")}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
