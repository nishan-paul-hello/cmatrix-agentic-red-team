import { useEffect, useState } from "react";

import { MemoryRepository } from "@/features/memory/data/MemoryRepository";
import { TASK_STATUS, type ActionEntry } from "@/types/domain-types";

export default function TechnicalActions() {
    const [ACTIONS, setData] = useState<ActionEntry[]>([]);
    useEffect(() => {
        void new MemoryRepository()
            .fetchAll<ActionEntry>({ collection: "ACTIONS", limit: 1000 })
            .then(setData);
    }, []);

    const [selId, setSelId] = useState<string | null>(null);

    if (ACTIONS.length === 0) {
        return null;
    }

    const sel = ACTIONS.find((a) => a.id === selId) ?? ACTIONS[0];
    const sc: Record<string, string> = {
        [TASK_STATUS.SUCCESS]: "var(--color-success)",
        [TASK_STATUS.TIMEOUT]: "var(--color-warning)",
        [TASK_STATUS.FAILED]: "var(--color-danger)",
        [TASK_STATUS.RUNNING]: "var(--color-brand)",
    };
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse text-lg">
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
                                    className="text-sm-tight tracking-wider-2 px-[12px] py-[6px] text-left font-semibold whitespace-nowrap text-[var(--color-hex-444444)]"
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
                        {ACTIONS.map((a: ActionEntry) => (
                            <tr
                                key={a.id}
                                onClick={() => setSelId(a.id)}
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
                                <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-555555)]">
                                    {a.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-333333)]">
                                    {a.ts}
                                </td>
                                <td className="tracking-tight-1 px-[12px] py-[7px] text-base font-bold text-[var(--color-brand)]">
                                    {a.spec}
                                </td>
                                <td className="font-inherit px-[12px] py-[7px] text-base text-[var(--color-hex-666666)]">
                                    {a.action}
                                </td>
                                <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-444444)]">
                                    {a.tool}
                                </td>
                                <td
                                    className="max-w-[240px] overflow-hidden px-[12px] py-[7px] text-base whitespace-nowrap text-[var(--color-hex-555555)]"
                                    style={{
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {a.result}
                                </td>
                                <td
                                    className="px-[12px] py-[7px] text-base font-semibold"
                                    style={{
                                        color:
                                            a.eord !== "—"
                                                ? "var(--color-success)"
                                                : "var(--color-hex-333333)",
                                    }}
                                >
                                    {a.eord}
                                </td>
                                <td className="px-[12px] py-[7px]">
                                    <span
                                        className="text-base-tight font-semibold tracking-normal"
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
            <div
                className="flex w-[var(--width-drawer-md)] flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0d0d0d)]"
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
                        <div className="text-2xl font-bold tracking-normal text-[var(--color-fg)]">
                            {sel.id}
                        </div>
                        <div className="text-base-tight mt-[2px] text-[var(--color-hex-444444)]">
                            {sel.spec} · {sel.tool}
                        </div>
                    </div>
                    <button
                        onClick={() => setSelId(null)}
                        className="cursor-pointer border-none bg-[transparent] text-4xl text-[var(--color-hex-444444)]"
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
                            <div className="text-sm-tight tracking-wider-3 mb-[3px] text-[var(--color-hex-444444)]">
                                {r.k}
                            </div>
                            <div
                                className="text-lg leading-normal"
                                style={{
                                    color:
                                        r.col ??
                                        (r.red
                                            ? "var(--color-success)"
                                            : "var(--color-hex-888888)"),
                                }}
                            >
                                {r.v}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
