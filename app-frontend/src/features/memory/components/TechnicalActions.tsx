import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { MemoryRepository } from "@/features/memory/data/MemoryRepository";
import { TASK_STATUS, type ActionEntry } from "@/types/domain-types";

export default function TechnicalActions() {
    const [ACTIONS, setData] = useState<ActionEntry[]>([]);
    useEffect(() => {
        void new MemoryRepository()
            .fetchAll<ActionEntry>({ collection: "ACTIONS", limit: 1000 })
            .then(setData)
            .catch(console.error);
    }, []);

    const [selId, setSelId] = useState<string | null>(null);

    if (ACTIONS.length === 0) {
        return null;
    }

    const sel = ACTIONS.find((a) => a.id === selId) ?? ACTIONS[0];
    const sc: Record<string, string> = {
        [TASK_STATUS.SUCCESS]: "text-success",
        [TASK_STATUS.TIMEOUT]: "text-warning",
        [TASK_STATUS.FAILED]: "text-destructive",
        [TASK_STATUS.RUNNING]: "text-primary",
    };
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
            <div className="flex-1 overflow-y-auto">
                <Table className="w-full border-collapse text-xs">
                    <TableHeader>
                        <TableRow className="bg-card sticky top-0">
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
                                <TableHead
                                    key={h}
                                    className="text-muted-foreground border-border border-b px-3 py-1.5 text-left text-xs font-semibold tracking-widest whitespace-nowrap"
                                >
                                    {h}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ACTIONS.map((a: ActionEntry) => (
                            <TableRow
                                key={a.id}
                                onClick={() => setSelId(a.id)}
                                className="border-border hover:bg-background cursor-pointer border-b transition-colors"
                            >
                                <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                    {a.id}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                    {a.ts}
                                </TableCell>
                                <TableCell className="text-primary px-3 py-1.5 text-base font-bold tracking-tight">
                                    {a.spec}
                                </TableCell>
                                <TableCell className="font-inherit text-muted-foreground px-3 py-1.5 text-base">
                                    {a.action}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3 py-1.5 text-base">
                                    {a.tool}
                                </TableCell>
                                <TableCell className="text-muted-foreground max-w-panel-sm overflow-hidden px-3 py-1.5 text-base text-ellipsis whitespace-nowrap">
                                    {a.result}
                                </TableCell>
                                <TableCell
                                    className={`px-3 py-1.5 text-base font-semibold ${a.eord !== "—" ? "text-success" : "text-border"}`}
                                >
                                    {a.eord}
                                </TableCell>
                                <TableCell className="px-3 py-1.5">
                                    <span
                                        className={`text-sm font-semibold tracking-normal ${sc[a.status] ?? "text-muted-foreground"}`}
                                    >
                                        {a.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="bg-background border-border lg:w-drawer-md flex w-full flex-shrink-0 flex-col overflow-y-auto border-t lg:border-t-0 lg:border-l">
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
                        aria-label="Close"
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
                                className={`text-xs leading-normal ${r.col?.replace("var(--", "text-").replace(")", "") ?? (r.red ? "text-success" : "text-muted-foreground")}`}
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
