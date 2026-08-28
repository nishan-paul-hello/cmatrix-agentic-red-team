import { useEffect, useState } from "react";

import { MemoryRepository } from "@/features/memory/data/MemoryRepository";
import { type BranchEntry } from "@/types/domain-types";

export default function BranchTree({ nodes, depth = 0 }: { nodes: BranchEntry[]; depth?: number }) {
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
        <>
            {nodes.map((b: BranchEntry) => (
                <div
                    key={b.id}
                    style={{
                        marginLeft: depth * 24,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "stretch",
                            gap: 0,
                        }}
                    >
                        {depth > 0 && (
                            <div
                                className="mb-[8px] w-[20px] shrink-0"
                                style={{
                                    borderLeft: "1px solid var(--color-hex-1e1e1e)",
                                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                                }}
                            />
                        )}
                        <div className="mb-[10px] flex-1 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                            <div
                                className="flex items-center gap-3 bg-[var(--color-hex-0d0d0d)] px-4 py-2"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-141414)",
                                }}
                            >
                                <span className="text-base font-bold tracking-normal text-[var(--color-brand)]">
                                    {b.id}
                                </span>
                                <span className="text-base-tight flex-1 text-[var(--color-hex-a0a0a0)]">
                                    {b.decision}
                                </span>
                                <span className="text-sm text-[var(--color-hex-333333)]">
                                    {b.ts}
                                </span>
                                <span
                                    className="text-sm font-semibold tracking-wide"
                                    style={{
                                        color: (() => {
                                            if (b.outcome === "SUCCESS") {
                                                return "var(--color-success)";
                                            }
                                            if (
                                                b.outcome === "IN PROGRESS" ||
                                                b.outcome === "RUNNING"
                                            ) {
                                                return "var(--color-warning)";
                                            }
                                            return "var(--color-brand)";
                                        })(),
                                    }}
                                >
                                    {b.outcome}
                                </span>
                            </div>
                            <div className="px-4 py-3">
                                <div className="mb-[8px]">
                                    <div className="text-sm-tight tracking-wider-3 mb-[4px] text-[var(--color-hex-444444)]">
                                        CHOSEN PATH
                                    </div>
                                    <div className="tracking-tight-1 text-lg font-semibold text-[var(--color-success)]">
                                        {b.chosen}
                                    </div>
                                </div>
                                <div className="mb-[8px]">
                                    <div className="text-sm-tight tracking-wider-3 mb-[4px] text-[var(--color-hex-444444)]">
                                        ALTERNATIVES REJECTED
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {b.alternatives.map((a: string) => (
                                            <span
                                                key={a}
                                                className="text-base-tight rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-111111)] px-[7px] py-[2px] text-[var(--color-hex-333333)]"
                                                style={{
                                                    textDecoration: "line-through",
                                                }}
                                            >
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-[6px]">
                                    <div className="text-sm-tight tracking-wider-3 mb-[4px] text-[var(--color-hex-444444)]">
                                        RATIONALE
                                    </div>
                                    <div className="text-lg-tight leading-relaxed text-[var(--color-hex-555555)]">
                                        {b.reason}
                                    </div>
                                </div>
                                <div
                                    className="mt-[8px]"
                                    style={{
                                        borderTop: "1px solid var(--color-hex-141414)",
                                        paddingTop: 8,
                                    }}
                                >
                                    <div className="text-sm-tight tracking-wider-3 mb-[3px] text-[var(--color-hex-444444)]">
                                        IMPACT
                                    </div>
                                    <div className="text-lg-tight leading-normal text-[var(--color-hex-666666)]">
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
