import { useState } from "react";

import { EVIDENCE_ARTIFACTS } from "@/features/environment/data/mockData";

export default function EvidencePanel() {
    const [sel, setSel] = useState<string | null>(null);
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex min-w-[0px] flex-1 flex-col overflow-y-auto">
                <div
                    className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                    style={{
                        borderBottom: "1px solid var(--color-hex-141414)",
                    }}
                >
                    <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                        RAW EVIDENCE ARTIFACTS
                    </span>
                    <span className="ml-auto text-[8px] text-[var(--color-hex-555555)]">
                        {EVIDENCE_ARTIFACTS.length} ARTIFACTS
                    </span>
                </div>
                <table className="w-full border-collapse text-[10.5px]">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                            {["ARTIFACT ID", "TYPE", "FINDING", "TIMESTAMP", "SIZE", "NOTE"].map(
                                (h) => (
                                    <th
                                        key={h}
                                        className="px-[12px] py-[6px] text-left text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                        style={{
                                            borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ),
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {EVIDENCE_ARTIFACTS.map((a, i) => (
                            <tr
                                key={a.id}
                                onClick={() => setSel(a.id === sel ? null : a.id)}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                    background: (() => {
                                        if (sel === a.id) {
                                            return "var(--color-hex-0f0f0f)";
                                        }
                                        if (i % 2) {
                                            return "var(--color-hex-0b0b0b)";
                                        }
                                        return "transparent";
                                    })(),
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = (() => {
                                        if (sel === a.id) {
                                            return "var(--color-hex-0f0f0f)";
                                        }
                                        if (i % 2) {
                                            return "var(--color-hex-0b0b0b)";
                                        }
                                        return "transparent";
                                    })())
                                }
                            >
                                <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                    {a.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                    {a.type}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                    {a.finding}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                    {a.ts}
                                </td>
                                <td className="px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-444444)]">
                                    {a.size}
                                </td>
                                <td className="px-[12px] py-[7px] text-[var(--color-hex-555555)]">
                                    {a.note}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sel && (
                <div
                    className="w-[280px] shrink-0 overflow-y-auto bg-[var(--color-hex-0a0a0a)] px-[14px] py-[16px]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    {(() => {
                        const a = EVIDENCE_ARTIFACTS.find((x) => x.id === sel);
                        if (!a) {
                            return null;
                        }
                        return (
                            <>
                                <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                    ARTIFACT DETAIL
                                </div>
                                {[
                                    {
                                        k: "ID",
                                        v: a.id,
                                    },
                                    {
                                        k: "TYPE",
                                        v: a.type,
                                    },
                                    {
                                        k: "FINDING",
                                        v: a.finding,
                                    },
                                    {
                                        k: "TIMESTAMP",
                                        v: a.ts,
                                    },
                                    {
                                        k: "SIZE",
                                        v: a.size,
                                    },
                                ].map((r) => (
                                    <div key={r.k} className="mb-[8px]">
                                        <div className="mb-[2px] text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                            {r.k}
                                        </div>
                                        <div className="text-[10px] text-[var(--color-hex-888888)]">
                                            {r.v}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-[12px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[10px] py-[8px] text-[9px] leading-[1.8] text-[var(--color-hex-555555)]">
                                    {a.note}
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
