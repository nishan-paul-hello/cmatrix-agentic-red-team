import BranchTree from "@/features/memory/components/BranchTree";
import { BRANCHES } from "@/features/memory/data/mockData";

export default function StrategyBranching() {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-5 flex items-center justify-between">
                <div className="text-[9px] tracking-[0.16em] text-[var(--color-hex-666666)]">
                    {BRANCHES.length} ROOT DECISIONS · 4 TOTAL BRANCHES
                </div>
                <div className="flex gap-4">
                    {[
                        {
                            l: "SUCCESS",
                            c: "var(--color-hex-3fb950)",
                        },
                        {
                            l: "IN PROGRESS",
                            c: "var(--color-hex-d29922)",
                        },
                        {
                            l: "RUNNING",
                            c: "var(--color-hex-d29922)",
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
                            <span className="text-[8px] tracking-[0.12em] text-[var(--color-hex-444444)]">
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
