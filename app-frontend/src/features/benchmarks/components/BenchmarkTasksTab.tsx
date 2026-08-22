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
                                className="px-[12px] py-[5px] text-left text-[7.5px] font-semibold tracking-[0.16em] text-[var(--color-hex-444444)]"
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
                        <td className="px-[12px] py-[8px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                            {t.id}
                        </td>
                        <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-555555)]">
                            {t.name}
                        </td>
                        <td className="px-[12px] py-[8px]">
                            <span
                                className="text-[8.5px] font-bold tracking-[0.12em]"
                                style={{
                                    color: (() => {
                                        if (t.solved) {
                                            return "var(--color-hex-3fb950)";
                                        }
                                        if (t.partial) {
                                            return "var(--color-hex-d29922)";
                                        }
                                        return "var(--color-hex-ff2a32)";
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
                        <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                            {t.cost}
                        </td>
                        <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                            {t.time}
                        </td>
                        <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-555555)]">
                            {t.eord}/5
                        </td>
                        <td
                            className="px-[12px] py-[8px] text-[9px]"
                            style={{
                                color:
                                    t.attempts > 2
                                        ? "var(--color-hex-d29922)"
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
