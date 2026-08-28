import { type Task } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function BenchmarkTasksTab({ tasks }: { tasks: Task[] }) {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-card">
                    {["TASK", "CATEGORY", "RESULT", "COST", "TIME", "E_ORD", "ATTEMPTS"].map(
                        (h) => (
                            <th
                                key={h}
                                className="text-muted-foreground border-border border-b px-3 py-1 text-left text-xs font-semibold tracking-widest"
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
                            borderBottom: "1px solid var(--border)",
                            background: i % 2 ? "var(--background)" : "transparent",
                        }}
                    >
                        <td className="text-primary px-3 py-2 text-base font-bold">{t.id}</td>
                        <td className="text-muted-foreground px-3 py-2 text-base">{t.name}</td>
                        <td className="px-3 py-2">
                            <span
                                className="text-sm font-bold tracking-wide"
                                style={{
                                    color: (() => {
                                        if (t.solved) {
                                            return "var(--success)";
                                        }
                                        if (t.partial) {
                                            return "var(--warning)";
                                        }
                                        return "var(--destructive)";
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
                        <td className="text-muted-foreground px-3 py-2 text-base">{t.cost}</td>
                        <td className="text-muted-foreground px-3 py-2 text-base">{t.time}</td>
                        <td className="text-muted-foreground px-3 py-2 text-base">{t.eord}/5</td>
                        <td
                            className="px-3 py-2 text-base"
                            style={{
                                color:
                                    t.attempts > 2 ? "var(--warning)" : "var(--muted-foreground)",
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
