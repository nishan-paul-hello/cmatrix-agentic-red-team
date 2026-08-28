import React from "react";

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
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="tracking-widest-2 mb-[3px] text-base text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                    VALIDATED FINDINGS
                </h1>
            </div>
            {/* Severity KPIs */}
            <div
                className="grid flex-shrink-0 grid-cols-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                {(["CRITICAL", "HIGH", "MEDIUM", "LOW"] as Severity[]).map((s, i) => (
                    <div
                        key={s}
                        className="bg-[var(--color-hex-0d0d0d)] px-[20px] py-[14px]"
                        style={{
                            borderRight: i < 3 ? "1px solid var(--color-hex-1e1e1e)" : "none",
                        }}
                    >
                        <div className="mb-[6px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                            {s}
                        </div>
                        <div
                            className="text-13xl leading-none font-bold"
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
                <table className="text-xl-tight w-full border-collapse">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
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
                                <th
                                    key={h}
                                    className="tracking-wider-2 px-[14px] py-[6px] text-left text-sm font-semibold whitespace-nowrap text-[var(--color-hex-444444)]"
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
                        {findings.map((f) => {
                            const sc = SEV_C[f.severity],
                                stc = STATUS_C[f.status] ?? "var(--color-hex-666666)";
                            return (
                                <tr
                                    key={f.id}
                                    className="cursor-pointer"
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-111111)",
                                    }}
                                    onClick={() => onSelect(f)}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                            "var(--color-hex-0f0f0f)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background = "transparent")
                                    }
                                >
                                    <td className="px-[14px] py-[8px] font-bold tracking-tight text-[var(--color-brand)]">
                                        {f.id}
                                    </td>
                                    <td className="px-[14px] py-[8px] text-[var(--color-hex-a0a0a0)]">
                                        {f.type}
                                    </td>
                                    <td className="text-lg-tight px-[14px] py-[8px] text-[var(--color-hex-555555)]">
                                        {f.target}
                                    </td>
                                    <td className="px-[14px] py-[8px]">
                                        <span
                                            className="rounded-[2px] px-[5px] py-[1px] text-base font-semibold tracking-normal"
                                            style={{
                                                color: sc.color,
                                                background: sc.bg,
                                                border: `1px solid ${sc.color}33`,
                                            }}
                                        >
                                            {f.severity}
                                        </span>
                                    </td>
                                    <td className="px-[14px] py-[8px] text-center text-[var(--color-hex-666666)]">
                                        {f.eord}/5
                                    </td>
                                    <td className="px-[14px] py-[8px]">
                                        <span
                                            className="text-base font-semibold tracking-normal"
                                            style={{
                                                color: stc,
                                            }}
                                        >
                                            {f.status}
                                        </span>
                                    </td>
                                    <td className="px-[14px] py-[8px] text-base text-[var(--color-hex-444444)]">
                                        {f.first}
                                    </td>
                                    <td className="px-[14px] py-[8px] text-base text-[var(--color-hex-444444)]">
                                        {f.validated}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-2 flex items-center justify-between px-6 pb-4">
                <div className="text-lg tracking-normal text-[var(--color-hex-666666)]">
                    PAGE {page}
                </div>
                <div className="flex gap-2">
                    <button
                        className="font-inherit tracking-wider-2 cursor-pointer rounded-[2px] border-none bg-[var(--color-hex-111111)] px-[12px] py-[6px] text-base font-semibold text-[var(--color-fg)]"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{ opacity: page === 1 ? 0.5 : 1 }}
                    >
                        PREV
                    </button>
                    <button
                        className="font-inherit tracking-wider-2 cursor-pointer rounded-[2px] border-none bg-[var(--color-hex-111111)] px-[12px] py-[6px] text-base font-semibold text-[var(--color-fg)]"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={findings.length < 50}
                        style={{ opacity: findings.length < 50 ? 0.5 : 1 }}
                    >
                        NEXT
                    </button>
                </div>
            </div>
        </div>
    );
}
