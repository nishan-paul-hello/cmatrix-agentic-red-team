import {
    FAILURE_CLASSES,
    KvGrid,
    MetaRow,
    type FailureClass,
} from "@/features/benchmarks/components/BenchmarkSharedUI";
import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function Tier0SandboxOverview({
    bench,
}: {
    bench: BenchRecord & { tier: "TIER0_SANDBOX" };
}) {
    const d = bench.detail;
    return (
        <>
            {KvGrid([
                { k: "TASKS", v: d.tasksTotal },
                {
                    k: "FANG FLOOR (pass@5)",
                    v: `${(d.passAt5FloorPct * 100).toFixed(1)}%`,
                    warn: true,
                },
                {
                    k: "REDGRID (pass@5)",
                    v: `${(d.redGridPassAt5Pct * 100).toFixed(1)}%`,
                    green: true,
                },
                {
                    k: "DELTA vs FLOOR",
                    v: `+${((d.redGridPassAt5Pct - d.passAt5FloorPct) * 100).toFixed(1)}pp`,
                    green: true,
                },
            ])}
            <div className="mb-3 text-sm tracking-widest text-[var(--color-hex-444444)]">
                FAILURE CLASS COVERAGE
            </div>
            {FAILURE_CLASSES.map((cls) => {
                const closed = (d.failureClassesClosed as readonly FailureClass[]).includes(cls);
                return (
                    <div key={cls} className="mb-2 flex items-center gap-2">
                        <span
                            className="text-lg font-bold"
                            style={{
                                color: closed ? "var(--color-success)" : "var(--color-hex-333333)",
                            }}
                        >
                            {closed ? "✓" : "✗"}
                        </span>
                        <span
                            className="text-base"
                            style={{
                                color: closed
                                    ? "var(--color-hex-666666)"
                                    : "var(--color-hex-333333)",
                            }}
                        >
                            {cls}
                        </span>
                    </div>
                );
            })}
            <MetaRow bench={bench} />
        </>
    );
}
