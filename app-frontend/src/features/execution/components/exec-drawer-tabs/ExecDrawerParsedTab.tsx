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
                <tr className="bg-[var(--color-hex-111111)]">
                    {(entry.command.tool.outputShape
                        ? Object.keys(entry.command.tool.outputShape)
                        : ["PORT", "STATE", "SERVICE", "VERSION"]
                    ).map((h) => (
                        <th
                            key={h}
                            className="text-sm-tight tracking-wider-1 px-[8px] py-[5px] text-left text-[var(--color-hex-444444)] uppercase"
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
                {parsedRows.map((r, i) => {
                    const keys = entry.command.tool.outputShape
                        ? Object.keys(entry.command.tool.outputShape)
                        : ["port", "state", "service", "version"];
                    return (
                        <tr
                            key={r.id ? String(r.id) : i}
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                            }}
                        >
                            {keys.map((k) => (
                                <td
                                    key={k}
                                    className="px-[8px] py-[5px] text-base text-[var(--color-hex-a0a0a0)]"
                                >
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
