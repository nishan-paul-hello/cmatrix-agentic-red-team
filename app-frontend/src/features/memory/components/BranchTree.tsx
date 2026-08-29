import { useEffect, useState } from "react";

import { MemoryRepository } from "@/features/memory/data/MemoryRepository";
import { type BranchEntry } from "@/types/domain-types";

export default function BranchTree({ nodes, depth = 0 }: { nodes: BranchEntry[]; depth?: number }) {
    const [BRANCHES, setData] = useState<BranchEntry[]>([]);
    useEffect(() => {
        void new MemoryRepository()
            .fetchAll<BranchEntry>({ collection: "BRANCHES", limit: 1000 })
            .then(setData)
            .catch(console.error);
    }, []);

    if (BRANCHES.length === 0) {
        return null;
    }

    return (
        <>
            {nodes.map((b: BranchEntry) => (
                <div
                    key={b.id}
                    style={{
                        marginLeft: depth * 24,
                    }}
                >
                    <div className="flex items-stretch gap-0">
                        {depth > 0 && <div className="border-border mb-2 w-5 shrink-0 border-b" />}
                        <div className="border-border mb-2.5 flex-1 overflow-hidden rounded-sm border-[1px] border-solid">
                            <div className="bg-background border-border flex items-center gap-3 border-b px-4 py-2">
                                <span className="text-primary text-base font-bold tracking-normal">
                                    {b.id}
                                </span>
                                <span className="text-muted-foreground flex-1 text-sm">
                                    {b.decision}
                                </span>
                                <span className="text-muted-foreground text-sm">{b.ts}</span>
                                <span
                                    className={`text-sm font-semibold tracking-wide ${(() => {
                                        if (b.outcome === "SUCCESS") {
                                            return "text-success";
                                        }
                                        if (
                                            b.outcome === "IN PROGRESS" ||
                                            b.outcome === "RUNNING"
                                        ) {
                                            return "text-warning";
                                        }
                                        return "text-primary";
                                    })()}`}
                                >
                                    {b.outcome}
                                </span>
                            </div>
                            <div className="px-4 py-3">
                                <div className="mb-2">
                                    <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                                        CHOSEN PATH
                                    </div>
                                    <div className="text-success text-xs font-semibold tracking-tight">
                                        {b.chosen}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                                        ALTERNATIVES REJECTED
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {b.alternatives.map((a: string) => (
                                            <span
                                                key={a}
                                                className="border-border bg-card text-muted-foreground rounded-sm border-[1px] border-solid px-1.5 py-0.5 text-sm line-through"
                                            >
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-1.5">
                                    <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                                        RATIONALE
                                    </div>
                                    <div className="text-muted-foreground text-base leading-relaxed">
                                        {b.reason}
                                    </div>
                                </div>
                                <div className="border-border mt-2 border-t">
                                    <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                                        IMPACT
                                    </div>
                                    <div className="text-muted-foreground text-base leading-normal">
                                        {b.impact}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {b.children.length > 0 && <BranchTree nodes={b.children} depth={depth + 1} />}
                </div>
            ))}
        </>
    );
}
