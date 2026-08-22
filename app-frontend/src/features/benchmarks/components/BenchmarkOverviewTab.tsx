import { type Bench } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function BenchmarkOverviewTab({ bench }: { bench: Bench }) {
    return (
        <>
            <div className="mb-6 grid grid-cols-4 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                {(
                    [
                        {
                            k: "TASKS",
                            v: String(bench.tasks),
                        },
                        {
                            k: "SOLVED",
                            v: String(bench.solved),
                            green: true,
                        },
                        {
                            k: "PARTIAL",
                            v: String(bench.partial),
                            warn: true,
                        },
                        {
                            k: "FAILED",
                            v: String(bench.tasks - bench.solved - bench.partial),
                            red: true,
                        },
                    ] as {
                        k: string;
                        v: string;
                        green?: boolean;
                        warn?: boolean;
                        red?: boolean;
                    }[]
                ).map((m, i, a) => (
                    <div
                        key={m.k}
                        className="bg-[var(--color-hex-0d0d0d)] px-[18px] py-[14px]"
                        style={{
                            borderRight:
                                i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                        }}
                    >
                        <div className="mb-[5px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {m.k}
                        </div>
                        <div
                            className="text-[22px] font-bold"
                            style={{
                                color: (() => {
                                    if (m.green) {
                                        return "var(--color-hex-3fb950)";
                                    }
                                    if (m.warn) {
                                        return "var(--color-hex-d29922)";
                                    }
                                    if (m.red) {
                                        return "var(--color-hex-ff2a32)";
                                    }
                                    return "var(--color-hex-f2f2f2)";
                                })(),
                            }}
                        >
                            {m.v}
                        </div>
                    </div>
                ))}
            </div>
            {/* Score breakdown */}
            <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                SCORE BREAKDOWN
            </div>
            {[
                {
                    l: "SOLVED (1.0 pts each)",
                    v: bench.solved,
                    max: bench.tasks,
                    c: "var(--color-hex-3fb950)",
                },
                {
                    l: "PARTIAL (0.5 pts each)",
                    v: bench.partial,
                    max: bench.tasks,
                    c: "var(--color-hex-d29922)",
                },
                {
                    l: "OVERALL SCORE",
                    v: Math.round(bench.score * 100),
                    max: 100,
                    c: "var(--color-hex-e31b23)",
                    pct: true,
                },
            ].map((b) => (
                <div key={b.l} className="mb-[14px]">
                    <div className="mb-2 flex justify-between">
                        <span className="text-[9px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                            {b.l}
                        </span>
                        <span
                            className="text-[10px] font-bold"
                            style={{
                                color: b.c,
                            }}
                        >
                            {b.pct ? `${b.v}%` : b.v}
                        </span>
                    </div>
                    <div className="h-[4px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                        <div
                            className="h-full rounded-[2px]"
                            style={{
                                width: `${(b.v / b.max) * 100}%`,
                                background: b.c,
                            }}
                        />
                    </div>
                </div>
            ))}
            <div className="mt-5 grid grid-cols-3 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                {[
                    {
                        k: "AVG COST",
                        v: bench.avgCost,
                    },
                    {
                        k: "AVG TIME",
                        v: bench.avgTime,
                    },
                    {
                        k: "DATE",
                        v: bench.date,
                    },
                ].map((m, i, a) => (
                    <div
                        key={m.k}
                        className="bg-[var(--color-hex-0d0d0d)] px-[16px] py-[12px]"
                        style={{
                            borderRight:
                                i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                        }}
                    >
                        <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {m.k}
                        </div>
                        <div className="text-[14px] font-bold text-[var(--color-hex-f2f2f2)]">
                            {m.v}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
