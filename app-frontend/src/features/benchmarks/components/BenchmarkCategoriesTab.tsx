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
                            className="border-border rounded-sm border-[1px] border-solid px-4 py-3"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-muted-foreground text-xs font-semibold tracking-tight">
                                    {c.cat}
                                </span>
                                <span
                                    className="text-xs font-bold"
                                    style={{
                                        color: (() => {
                                            if (pct > 80) {
                                                return "var(--success)";
                                            }
                                            if (pct > 50) {
                                                return "var(--warning)";
                                            }
                                            return "var(--destructive)";
                                        })(),
                                    }}
                                >
                                    {pct}%
                                </span>
                            </div>
                            <div className="bg-card h-0.5 overflow-hidden rounded-sm">
                                <div
                                    className="h-full"
                                    style={{
                                        width: `${pct}%`,
                                        background: (() => {
                                            if (pct > 80) {
                                                return "var(--success)";
                                            }
                                            if (pct > 50) {
                                                return "var(--warning)";
                                            }
                                            return "var(--destructive)";
                                        })(),
                                    }}
                                />
                            </div>
                            <div className="text-muted-foreground mt-1 text-sm">
                                {c.solved}/{c.tasks.length} SOLVED
                            </div>
                        </div>
                    );
                })}
        </div>
    );
}
