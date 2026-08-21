import { useState } from "react";

import { FAILURE_LOG } from "../data/mockData";

export default function FailuresPanel() {
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
                        SPECIALIST FAILURE LOG
                    </span>
                    <span className="ml-auto text-[8px] tracking-[0.12em] text-[var(--color-hex-d29922)]">
                        {FAILURE_LOG.filter((f) => !f.resolved).length} UNRESOLVED
                    </span>
                </div>
                <table className="w-full border-collapse text-[10.5px]">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                            {[
                                "ID",
                                "TIMESTAMP",
                                "SPECIALIST",
                                "ACTION",
                                "TARGET",
                                "ERROR",
                                "E_ORD",
                                "RESOLVED",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-[12px] py-[6px] text-left text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
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
                        {FAILURE_LOG.map((f, i) => (
                            <tr
                                key={f.id}
                                onClick={() => setSel(f.id === sel ? null : f.id)}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                    background: (() => {
                                        if (sel === f.id) {
                                            return "var(--color-hex-110808)";
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
                                        if (sel === f.id) {
                                            return "var(--color-hex-110808)";
                                        }
                                        if (i % 2) {
                                            return "var(--color-hex-0b0b0b)";
                                        }
                                        return "transparent";
                                    })())
                                }
                            >
                                <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                    {f.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                    {f.ts}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] font-semibold text-[var(--color-hex-a0a0a0)]">
                                    {f.spec}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                    {f.action}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                    {f.target}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                    {f.error}
                                </td>
                                <td className="px-[12px] py-[7px] text-[var(--color-hex-555555)]">
                                    {f.eord}/5
                                </td>
                                <td className="px-[12px] py-[7px]">
                                    <span
                                        className="text-[8.5px] font-semibold tracking-[0.12em]"
                                        style={{
                                            color: f.resolved
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-d29922)",
                                        }}
                                    >
                                        {f.resolved ? "YES" : "NO"}
                                    </span>
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
                        const f = FAILURE_LOG.find((x) => x.id === sel);
                        if (!f) {
                            return null;
                        }
                        return (
                            <>
                                <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                    FAILURE DETAIL
                                </div>
                                {[
                                    {
                                        k: "ID",
                                        v: f.id,
                                    },
                                    {
                                        k: "TIMESTAMP",
                                        v: f.ts,
                                    },
                                    {
                                        k: "SPECIALIST",
                                        v: f.spec,
                                    },
                                    {
                                        k: "ACTION",
                                        v: f.action,
                                    },
                                    {
                                        k: "TARGET",
                                        v: f.target,
                                    },
                                    {
                                        k: "E_ORD",
                                        v: `${f.eord}/5`,
                                    },
                                    {
                                        k: "RESOLVED",
                                        v: f.resolved ? "YES" : "NO",
                                    },
                                ].map((r) => (
                                    <div key={r.k} className="mb-[8px]">
                                        <div className="mb-[2px] text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                            {r.k}
                                        </div>
                                        <div
                                            className="text-[10px]"
                                            style={{
                                                color: (() => {
                                                    if (r.k === "RESOLVED" && f.resolved) {
                                                        return "var(--color-hex-3fb950)";
                                                    }
                                                    if (r.k === "RESOLVED") {
                                                        return "var(--color-hex-d29922)";
                                                    }
                                                    return "var(--color-hex-888888)";
                                                })(),
                                            }}
                                        >
                                            {r.v}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-[12px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[10px] py-[8px] text-[9px] leading-[1.7] text-[var(--color-hex-ff2a32)]">
                                    {f.error}
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
