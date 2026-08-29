import { useEffect, useState } from "react";

import BranchTree from "@/features/memory/components/BranchTree";
import { MemoryRepository } from "@/features/memory/data/MemoryRepository";
import { type BranchEntry } from "@/types/domain-types";

export default function StrategyBranching() {
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
        <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-5 flex items-center justify-between">
                <div className="text-muted-foreground text-base tracking-widest">
                    {BRANCHES.length} ROOT DECISIONS · 4 TOTAL BRANCHES
                </div>
                <div className="flex gap-4">
                    {[
                        {
                            l: "SUCCESS",
                            c: "bg-success",
                        },
                        {
                            l: "IN PROGRESS",
                            c: "bg-warning",
                        },
                        {
                            l: "RUNNING",
                            c: "bg-warning",
                        },
                    ].map((x) => (
                        <div key={x.l} className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${x.c}`} />
                            <span className="text-muted-foreground text-sm tracking-wide">
                                {x.l}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <BranchTree nodes={BRANCHES} />
        </div>
    );
}
