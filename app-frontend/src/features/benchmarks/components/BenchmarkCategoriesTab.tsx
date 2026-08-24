import { type CategoryStat } from "@/features/benchmarks/utils";

export function BenchmarkCategoriesTab({ catStats }: { catStats: CategoryStat[] }) {
    return (
        <div className="flex flex-col gap-3">
            {catStats
                .filter((c) => c.tasks.length > 0)
                .map((c) => {
                    const pct =
                        c.tasks.length > 0 ? Math.round((c.solved / c.tasks.length) * 100) : 0;
                    return (
                        <div
                            key={c.cat}
                            className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] px-[16px] py-[12px]"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-[10px] font-semibold tracking-[0.08em] text-[var(--color-hex-a0a0a0)]">
                                    {c.cat}
                                </span>
                                <span
                                    className="text-[10px] font-bold"
                                    style={{
                                        color: (() => {
                                            if (pct > 80) {
                                                return "var(--color-hex-3fb950)";
                                            }
                                            if (pct > 50) {
                                                return "var(--color-hex-d29922)";
                                            }
                                            return "var(--color-hex-ff2a32)";
                                        })(),
                                    }}
                                >
                                    {pct}%
                                </span>
                            </div>
                            <div className="h-[3px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full"
                                    style={{
                                        width: `${pct}%`,
                                        background: (() => {
                                            if (pct > 80) {
                                                return "var(--color-hex-3fb950)";
                                            }
                                            if (pct > 50) {
                                                return "var(--color-hex-d29922)";
                                            }
                                            return "var(--color-hex-ff2a32)";
                                        })(),
                                    }}
                                />
                            </div>
                            <div className="mt-[4px] text-[8px] text-[var(--color-hex-333333)]">
                                {c.solved}/{c.tasks.length} SOLVED
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
