import { useState } from "react";

import { ACTIONS } from "@/features/memory/data/mockData";
import { TASK_STATUS } from "@/types/domain-types";

export default function TechnicalActions() {
    const [sel, setSel] = useState<(typeof ACTIONS)[0] | null>(null);
    const sc: Record<string, string> = {
        [TASK_STATUS.SUCCESS]: "var(--color-hex-3fb950)",
        [TASK_STATUS.TIMEOUT]: "var(--color-hex-d29922)",
        [TASK_STATUS.FAILED]: "var(--color-hex-ff2a32)",
        [TASK_STATUS.RUNNING]: "var(--color-hex-e31b23)",
    };
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse text-[10px]">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                            {[
                                "ID",
                                "TIME",
                                "SPECIALIST",
                                "ACTION",
                                "TOOL",
                                "RESULT",
                                "E_ORD",
                                "STATUS",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-[12px] py-[6px] text-left text-[7.5px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
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
                        {ACTIONS.map((a) => (
                            <tr
                                key={a.id}
                                onClick={() => setSel(a)}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0d0d0d)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                    {a.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-333333)]">
                                    {a.ts}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] font-bold tracking-[0.06em] text-[var(--color-hex-e31b23)]">
                                    {a.spec}
                                </td>
                                <td className="font-inherit px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                    {a.action}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                    {a.tool}
                                </td>
                                <td
                                    className="max-w-[240px] overflow-hidden px-[12px] py-[7px] text-[9px] whitespace-nowrap text-[var(--color-hex-555555)]"
                                    style={{
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {a.result}
                                </td>
                                <td
                                    className="px-[12px] py-[7px] text-[9px] font-semibold"
                                    style={{
                                        color:
                                            a.eord !== "—"
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-333333)",
                                    }}
                                >
                                    {a.eord}
                                </td>
                                <td className="px-[12px] py-[7px]">
                                    <span
                                        className="text-[8.5px] font-semibold tracking-[0.1em]"
                                        style={{
                                            color: sc[a.status] ?? "var(--color-hex-666666)",
                                        }}
                                    >
                                        {a.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sel && (
                <div
                    className="flex w-[320px] flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0d0d0d)]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-292929)",
                    }}
                >
                    <div
                        className="flex items-start justify-between px-4 pt-4 pb-3"
                        style={{
                            borderBottom: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        <div>
                            <div className="text-[12px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                                {sel.id}
                            </div>
                            <div className="mt-[2px] text-[8.5px] text-[var(--color-hex-444444)]">
                                {sel.spec} · {sel.tool}
                            </div>
                        </div>
                        <button
                            onClick={() => setSel(null)}
                            className="cursor-pointer border-none bg-[transparent] text-[14px] text-[var(--color-hex-444444)]"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex flex-col gap-4 px-4 py-4">
                        {(
                            [
                                {
                                    k: "ACTION",
                                    v: sel.action,
                                },
                                {
                                    k: "TOOL",
                                    v: sel.tool,
                                },
                                {
                                    k: "ARGUMENTS",
                                    v: sel.args,
                                },
                                {
                                    k: "RESULT",
                                    v: sel.result,
                                },
                                {
                                    k: "E_ORD DELTA",
                                    v: sel.eord,
                                    red: sel.eord !== "—",
                                },
                                {
                                    k: "STATUS",
                                    v: sel.status,
                                    col: sc[sel.status],
                                },
                            ] as {
                                k: string;
                                v: string;
                                red?: boolean;
                                col?: string;
                            }[]
                        ).map((r) => (
                            <div key={r.k}>
                                <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                    {r.k}
                                </div>
                                <div
                                    className="text-[10px] leading-[1.6]"
                                    style={{
                                        color:
                                            r.col ??
                                            (r.red
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-888888)"),
                                    }}
                                >
                                    {r.v}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
