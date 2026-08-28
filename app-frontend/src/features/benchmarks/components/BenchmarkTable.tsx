import {
    TIER_META,
    type BenchRecord,
} from "@/features/benchmarks/data/fixtures/benchmarksMockData";
import { BENCHMARK_STATUS } from "@/types/domain-types";

export function BenchmarkTable({
    filtered,
    onSelect,
}: {
    filtered: BenchRecord[];
    onSelect: (b: BenchRecord) => void;
}) {
    return (
        <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-card sticky top-0">
                        {["ID", "NAME", "TIER", "AVG COST", "AVG TIME", "DATE", "STATUS"].map(
                            (h) => (
                                <th
                                    key={h}
                                    className="text-muted-foreground border-border border-b px-3.5 py-1 text-left text-xs font-semibold tracking-widest whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((b) => {
                        const tierMeta = TIER_META[b.tier];
                        return (
                            <tr
                                key={b.id}
                                onClick={() => onSelect(b)}
                                className="border-border cursor-pointer border-b"
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--background)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td className="text-primary px-3.5 py-2 text-base font-bold">
                                    {b.id}
                                </td>
                                <td className="text-muted-foreground px-3.5 py-2 text-xs">
                                    {b.name}
                                </td>
                                <td className="px-3.5 py-2">
                                    <span
                                        className="text-sm font-semibold tracking-normal"
                                        style={{ color: tierMeta.color }}
                                    >
                                        {tierMeta.label}
                                    </span>
                                </td>
                                <td className="text-muted-foreground px-3.5 py-2 text-base">
                                    {b.avgCost}
                                </td>
                                <td className="text-muted-foreground px-3.5 py-2 text-base">
                                    {b.avgTime}
                                </td>
                                <td className="text-muted-foreground px-3.5 py-2 text-base">
                                    {b.date}
                                </td>
                                <td className="px-3.5 py-2">
                                    <span
                                        className="text-sm font-semibold tracking-wide"
                                        style={{
                                            color: (() => {
                                                if (b.status === BENCHMARK_STATUS.COMPLETE) {
                                                    return "var(--success)";
                                                }
                                                if (b.status === BENCHMARK_STATUS.RUNNING) {
                                                    return "var(--destructive)";
                                                }
                                                return "var(--border)";
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
