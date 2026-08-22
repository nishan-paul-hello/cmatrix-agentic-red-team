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
        <div
            className="flex flex-1 flex-col overflow-hidden"
            style={{
                borderRight: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div
                className="shrink-0 bg-[var(--color-hex-0a0a0a)] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]"
                style={{
                    padding: "10px 20px 8px",
                    borderBottom: "1px solid var(--color-hex-111111)",
                }}
            >
                VDG SCORING — UCB POLICY
            </div>
            <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
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
                                    className="px-[12px] py-[5px] text-[7.5px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                    style={{
                                        textAlign:
                                            h === "UCB ↓" ||
                                            h === "EXPLOIT" ||
                                            h === "EXPLORE" ||
                                            h === "VISITS" ||
                                            h === "E_ORD"
                                                ? "right"
                                                : "left",
                                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                    }}
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
                                    className="cursor-pointer"
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-111111)",
                                        opacity: v.status === "BLOCKED" ? 0.4 : 1,
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                            "var(--color-hex-0d0d0d)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background = "transparent")
                                    }
                                >
                                    <td className="px-[12px] py-[7px] text-[9.5px] font-bold tracking-[0.06em] text-[var(--color-hex-e31b23)]">
                                        {v.id}
                                    </td>
                                    <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                        {v.type}
                                    </td>
                                    <td className="px-[12px] py-[7px]">
                                        <span
                                            className="text-[8.5px] font-semibold tracking-[0.1em]"
                                            style={{
                                                color: STATUS_C[v.status],
                                            }}
                                        >
                                            {v.status}
                                        </span>
                                    </td>
                                    <td className="px-[12px] py-[7px] text-right">
                                        <span
                                            className="text-[10px] font-bold"
                                            style={{
                                                color: (() => {
                                                    if (v.ucb > 0.8) {
                                                        return "var(--color-hex-ff2a32)";
                                                    }
                                                    if (v.ucb > 0.6) {
                                                        return "var(--color-hex-e31b23)";
                                                    }
                                                    if (v.ucb > 0) {
                                                        return "var(--color-hex-a0a0a0)";
                                                    }
                                                    return "var(--color-hex-333333)";
                                                })(),
                                            }}
                                        >
                                            {v.ucb > 0 ? v.ucb.toFixed(3) : "—"}
                                        </span>
                                    </td>
                                    <td className="px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-555555)]">
                                        {v.exploit > 0 ? v.exploit.toFixed(3) : "—"}
                                    </td>
                                    <td className="px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-3fb950)]">
                                        {v.explore > 0 ? v.explore.toFixed(3) : "—"}
                                    </td>
                                    <td className="px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-444444)]">
                                        {v.visits}
                                    </td>
                                    <td
                                        className="px-[12px] py-[7px] text-right text-[9px]"
                                        style={{
                                            color: (() => {
                                                if (v.eord >= 4) {
                                                    return "var(--color-hex-3fb950)";
                                                }
                                                if (v.eord >= 2) {
                                                    return "var(--color-hex-d29922)";
                                                }
                                                return "var(--color-hex-444444)";
                                            })(),
                                        }}
                                    >
                                        {v.eord}/5
                                    </td>
                                    <td className="px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-444444)]">
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
