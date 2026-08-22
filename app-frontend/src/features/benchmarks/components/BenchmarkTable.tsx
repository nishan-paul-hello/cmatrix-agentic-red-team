import { TYPE_C, type Bench } from "@/features/benchmarks/data/fixtures/benchmarksMockData";
import { BENCHMARK_STATUS } from "@/types/domain-types";

export function BenchmarkTable({
    filtered,
    onSelect,
}: {
    filtered: Bench[];
    onSelect: (b: Bench) => void;
}) {
    return (
        <div className="flex-1 overflow-y-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                        {[
                            "ID",
                            "NAME",
                            "TYPE",
                            "TASKS",
                            "SOLVED",
                            "PARTIAL",
                            "SCORE",
                            "AVG COST",
                            "AVG TIME",
                            "DATE",
                            "STATUS",
                        ].map((h) => (
                            <th
                                key={h}
                                className="px-[14px] py-[5px] text-left text-[7.5px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((b) => {
                        const pct = b.tasks > 0 ? Math.round((b.solved / b.tasks) * 100) : 0;
                        return (
                            <tr
                                key={b.id}
                                onClick={() => onSelect(b)}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                    opacity: b.status === BENCHMARK_STATUS.QUEUED ? 0.5 : 1,
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0d0d0d)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td className="px-[14px] py-[9px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                    {b.id}
                                </td>
                                <td className="px-[14px] py-[9px] text-[10px] text-[var(--color-hex-a0a0a0)]">
                                    {b.name}
                                </td>
                                <td className="px-[14px] py-[9px]">
                                    <span
                                        className="text-[8.5px] font-semibold tracking-[0.1em]"
                                        style={{
                                            color: TYPE_C[b.type],
                                        }}
                                    >
                                        {b.type}
                                    </span>
                                </td>
                                <td className="px-[14px] py-[9px] text-[9px] text-[var(--color-hex-555555)]">
                                    {b.tasks}
                                </td>
                                <td className="px-[14px] py-[9px] text-[9px] font-bold text-[var(--color-hex-3fb950)]">
                                    {b.solved}
                                </td>
                                <td className="px-[14px] py-[9px] text-[9px] text-[var(--color-hex-d29922)]">
                                    {b.partial}
                                </td>
                                <td className="px-[14px] py-[9px]">
                                    {b.score > 0 ? (
                                        <div className="flex items-center gap-2">
                                            <span
                                                className="text-[10px] font-bold"
                                                style={{
                                                    color: (() => {
                                                        if (b.score > 0.8) {
                                                            return "var(--color-hex-3fb950)";
                                                        }
                                                        if (b.score > 0.6) {
                                                            return "var(--color-hex-d29922)";
                                                        }
                                                        return "var(--color-hex-e31b23)";
                                                    })(),
                                                }}
                                            >
                                                {(b.score * 100).toFixed(1)}%
                                            </span>
                                            <div className="h-[3px] w-[36px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                                <div
                                                    className="h-full"
                                                    style={{
                                                        width: `${pct}%`,
                                                        background: (() => {
                                                            if (b.score > 0.8) {
                                                                return "var(--color-hex-3fb950)";
                                                            }
                                                            if (b.score > 0.6) {
                                                                return "var(--color-hex-d29922)";
                                                            }
                                                            return "var(--color-hex-e31b23)";
                                                        })(),
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-[9px] text-[var(--color-hex-333333)]">
                                            —
                                        </span>
                                    )}
                                </td>
                                <td className="px-[14px] py-[9px] text-[9px] text-[var(--color-hex-444444)]">
                                    {b.avgCost}
                                </td>
                                <td className="px-[14px] py-[9px] text-[9px] text-[var(--color-hex-444444)]">
                                    {b.avgTime}
                                </td>
                                <td className="px-[14px] py-[9px] text-[9px] text-[var(--color-hex-444444)]">
                                    {b.date}
                                </td>
                                <td className="px-[14px] py-[9px]">
                                    <span
                                        className="text-[8.5px] font-semibold tracking-[0.12em]"
                                        style={{
                                            color: (() => {
                                                if (b.status === BENCHMARK_STATUS.COMPLETE) {
                                                    return "var(--color-hex-3fb950)";
                                                }
                                                if (b.status === BENCHMARK_STATUS.RUNNING) {
                                                    return "var(--color-hex-ff2a32)";
                                                }
                                                return "var(--color-hex-333333)";
                                            })(),
                                        }}
                                    >
                                        {b.status}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
