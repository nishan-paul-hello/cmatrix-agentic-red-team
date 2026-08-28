import React from "react";

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
            <div className="bg-background text-muted-foreground border-border shrink-0 border-b text-sm tracking-widest">
                VDG SCORING — UCB POLICY
            </div>
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-card sticky top-0">
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
                                <th
                                    key={h}
                                    className="text-muted-foreground border-border border-b px-3 py-1 text-xs font-semibold tracking-widest whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {vdg
                            .sort((a, b) => b.ucb - a.ucb)
                            .map((v) => (
                                <tr
                                    key={v.id}
                                    onClick={() => setUcbEntry(v)}
                                    className="border-border cursor-pointer border-b"
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background = "var(--background)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background = "transparent")
                                    }
                                >
                                    <td className="text-primary px-3 py-1.5 text-base font-bold tracking-tight">
                                        {v.id}
                                    </td>
                                    <td className="text-muted-foreground px-3 py-1.5 text-base">
                                        {v.type}
                                    </td>
                                    <td className="px-3 py-1.5">
                                        <span
                                            className="text-sm font-semibold tracking-normal"
                                            style={{
                                                color: STATUS_C[v.status],
                                            }}
                                        >
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-1.5 text-right">
                                        <span
                                            className="text-xs font-bold"
                                            style={{
                                                color: (() => {
                                                    if (v.ucb > 0.8) {
                                                        return "var(--destructive)";
                                                    }
                                                    if (v.ucb > 0.6) {
                                                        return "var(--primary)";
                                                    }
                                                    if (v.ucb > 0) {
                                                        return "var(--muted-foreground)";
                                                    }
                                                    return "var(--border)";
                                                })(),
                                            }}
                                        >
                                            {v.ucb > 0 ? v.ucb.toFixed(3) : "—"}
                                        </span>
                                    </td>
                                    <td className="text-muted-foreground px-3 py-1.5 text-right text-base">
                                        {v.exploit > 0 ? v.exploit.toFixed(3) : "—"}
                                    </td>
                                    <td className="text-success px-3 py-1.5 text-right text-base">
                                        {v.explore > 0 ? v.explore.toFixed(3) : "—"}
                                    </td>
                                    <td className="text-muted-foreground px-3 py-1.5 text-right text-base">
                                        {v.visits}
                                    </td>
                                    <td
                                        className="px-3 py-1.5 text-right text-base"
                                        style={{
                                            color: (() => {
                                                if (v.eord >= 4) {
                                                    return "var(--success)";
                                                }
                                                if (v.eord >= 2) {
                                                    return "var(--warning)";
                                                }
                                                return "var(--muted-foreground)";
                                            })(),
                                        }}
                                    >
                                        {v.eord}/5
                                    </td>
                                    <td className="text-muted-foreground px-3 py-1.5 text-right text-base">
                                        {v.cost}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
});
VDGScoringTable.displayName = "VDGScoringTable";
