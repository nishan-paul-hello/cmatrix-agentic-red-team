import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
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
        [TASK_STATUS.SUCCESS]: "var(--success)",
        [TASK_STATUS.TIMEOUT]: "var(--warning)",
        [TASK_STATUS.FAILED]: "var(--destructive)",
        [TASK_STATUS.RUNNING]: "var(--primary)",
    };
    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse text-xs">
                    <thead>
                        <tr className="bg-card sticky top-0">
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
                                    className="text-muted-foreground border-border border-b px-3 py-1.5 text-left text-xs font-semibold tracking-widest whitespace-nowrap"
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
                                className="border-border cursor-pointer border-b"
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--background)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td className="text-muted-foreground px-3 py-1.5 text-base">
                                    {a.id}
                                </td>
                                <td className="text-muted-foreground px-3 py-1.5 text-base">
                                    {a.ts}
                                </td>
                                <td className="text-primary px-3 py-1.5 text-base font-bold tracking-tight">
                                    {a.spec}
                                </td>
                                <td className="font-inherit text-muted-foreground px-3 py-1.5 text-base">
                                    {a.action}
                                </td>
                                <td className="text-muted-foreground px-3 py-1.5 text-base">
                                    {a.tool}
                                </td>
                                <td
                                    className="text-muted-foreground max-w-[240px] overflow-hidden px-3 py-1.5 text-base whitespace-nowrap"
                                    style={{
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {a.result}
                                </td>
                                <td
                                    className="px-3 py-1.5 text-base font-semibold"
                                    style={{
                                        color: a.eord !== "—" ? "var(--success)" : "var(--border)",
                                    }}
                                >
                                    {a.eord}
                                </td>
                                <td className="px-3 py-1.5">
                                    <span
                                        className="text-sm font-semibold tracking-normal"
                                        style={{
                                            color: sc[a.status] ?? "var(--muted-foreground)",
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
            <div className="bg-background border-border flex w-[var(--width-drawer-md)] flex-shrink-0 flex-col overflow-y-auto border-l">
                <div className="border-border flex items-start justify-between border-b px-4 pt-4 pb-3">
                    <div>
                        <div className="text-foreground text-xs font-bold tracking-normal">
                            {sel.id}
                        </div>
                        <div className="text-muted-foreground mt-0.5 text-sm">
                            {sel.spec} · {sel.tool}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => setSelId(null)}
                        className="text-muted-foreground hover:text-muted-foreground h-auto p-0.5 text-sm hover:bg-transparent"
                    >
                        ✕
                    </Button>
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
                            <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                                {r.k}
                            </div>
                            <div
                                className="text-xs leading-normal"
                                style={{
                                    color:
                                        r.col ??
                                        (r.red ? "var(--success)" : "var(--muted-foreground)"),
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
