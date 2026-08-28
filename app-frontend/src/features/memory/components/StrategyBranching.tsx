import { useEffect, useState } from "react";

import BranchTree from "@/features/memory/components/BranchTree";
import { MemoryRepository } from "@/features/memory/data/MemoryRepository";
import { type BranchEntry } from "@/types/domain-types";

export default function StrategyBranching() {
    const [BRANCHES, setData] = useState<BranchEntry[]>([]);
    useEffect(() => {
        void new MemoryRepository()
            .fetchAll<BranchEntry>({ collection: "BRANCHES", limit: 1000 })
            .then(setData);
    }, []);

    if (BRANCHES.length === 0) {
        return null;
    }

    return (
        <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-5 flex items-center justify-between">
                <div className="tracking-wider-2 text-base text-[var(--color-hex-666666)]">
                    {BRANCHES.length} ROOT DECISIONS · 4 TOTAL BRANCHES
                </div>
                <div className="flex gap-4">
                    {[
                        {
                            l: "SUCCESS",
                            c: "var(--color-success)",
                        },
                        {
                            l: "IN PROGRESS",
                            c: "var(--color-warning)",
                        },
                        {
                            l: "RUNNING",
                            c: "var(--color-warning)",
                        },
                    ].map((x) => (
                        <div key={x.l} className="flex items-center gap-2">
                            <div
                                className="h-[6px] w-[6px]"
                                style={{
                                    borderRadius: "50%",
                                    background: x.c,
                                }}
                            />
                            <span className="text-sm tracking-wide text-[var(--color-hex-444444)]">
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
