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
        <div className="flex-1 overflow-y-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                        {["ID", "NAME", "TIER", "AVG COST", "AVG TIME", "DATE", "STATUS"].map(
                            (h) => (
                                <th
                                    key={h}
                                    className="text-sm-tight tracking-wider-2 px-[14px] py-[5px] text-left font-semibold whitespace-nowrap text-[var(--color-hex-444444)]"
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                    }}
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
                                <td className="px-[14px] py-[9px] text-base font-bold text-[var(--color-brand)]">
                                    {b.id}
                                </td>
                                <td className="px-[14px] py-[9px] text-lg text-[var(--color-hex-a0a0a0)]">
                                    {b.name}
                                </td>
                                <td className="px-[14px] py-[9px]">
                                    <span
                                        className="text-sm font-semibold tracking-normal"
                                        style={{ color: tierMeta.color }}
                                    >
                                        {tierMeta.label}
                                    </span>
                                </td>
                                <td className="px-[14px] py-[9px] text-base text-[var(--color-hex-444444)]">
                                    {b.avgCost}
                                </td>
                                <td className="px-[14px] py-[9px] text-base text-[var(--color-hex-444444)]">
                                    {b.avgTime}
                                </td>
                                <td className="px-[14px] py-[9px] text-base text-[var(--color-hex-444444)]">
                                    {b.date}
                                </td>
                                <td className="px-[14px] py-[9px]">
                                    <span
                                        className="text-base-tight font-semibold tracking-wide"
                                        style={{
                                            color: (() => {
                                                if (b.status === BENCHMARK_STATUS.COMPLETE) {
                                                    return "var(--color-success)";
                                                }
                                                if (b.status === BENCHMARK_STATUS.RUNNING) {
                                                    return "var(--color-danger)";
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
