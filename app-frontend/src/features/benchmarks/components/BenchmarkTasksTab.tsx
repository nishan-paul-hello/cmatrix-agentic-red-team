import { type Task } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function BenchmarkTasksTab({ tasks }: { tasks: Task[] }) {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-[var(--color-hex-0f0f0f)]">
                    {["TASK", "CATEGORY", "RESULT", "COST", "TIME", "E_ORD", "ATTEMPTS"].map(
                        (h) => (
                            <th
                                key={h}
                                className="text-sm-tight tracking-wider-2 px-[12px] py-[5px] text-left font-semibold text-[var(--color-hex-444444)]"
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
                {tasks.map((t, i) => (
                    <tr
                        key={t.id}
                        style={{
                            borderBottom: "1px solid var(--color-hex-111111)",
                            background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                        }}
                    >
                        <td className="px-[12px] py-[8px] text-base font-bold text-[var(--color-brand)]">
                            {t.id}
                        </td>
                        <td className="px-[12px] py-[8px] text-base text-[var(--color-hex-555555)]">
                            {t.name}
                        </td>
                        <td className="px-[12px] py-[8px]">
                            <span
                                className="text-base-tight font-bold tracking-wide"
                                style={{
                                    color: (() => {
                                        if (t.solved) {
                                            return "var(--color-success)";
                                        }
                                        if (t.partial) {
                                            return "var(--color-warning)";
                                        }
                                        return "var(--color-danger)";
                                    })(),
                                }}
                            >
                                {(() => {
                                    if (t.solved) {
                                        return "SOLVED";
                                    }
                                    if (t.partial) {
                                        return "PARTIAL";
                                    }
                                    return "FAILED";
                                })()}
                            </span>
                        </td>
                        <td className="px-[12px] py-[8px] text-base text-[var(--color-hex-444444)]">
                            {t.cost}
                        </td>
                        <td className="px-[12px] py-[8px] text-base text-[var(--color-hex-444444)]">
                            {t.time}
                        </td>
                        <td className="px-[12px] py-[8px] text-base text-[var(--color-hex-555555)]">
                            {t.eord}/5
                        </td>
                        <td
                            className="px-[12px] py-[8px] text-base"
                            style={{
                                color:
                                    t.attempts > 2
                                        ? "var(--color-warning)"
                                        : "var(--color-hex-444444)",
                            }}
                        >
                            {t.attempts}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
