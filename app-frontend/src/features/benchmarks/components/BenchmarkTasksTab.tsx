import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { type Task } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function BenchmarkTasksTab({ tasks }: { tasks: Task[] }) {
    return (
        <Table className="w-full border-collapse">
            <TableHeader>
                <TableRow className="bg-card">
                    {["TASK", "CATEGORY", "RESULT", "COST", "TIME", "E_ORD", "ATTEMPTS"].map(
                        (h) => (
                            <TableHead
                                key={h}
                                className="text-muted-foreground border-border border-b px-3 py-1 text-left text-xs font-semibold tracking-widest"
                            >
                                {h}
                            </TableHead>
                        ),
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.map((t, i) => (
                    <TableRow
                        key={t.id}
                        className={`border-border border-b ${i % 2 ? "bg-background" : "bg-transparent"}`}
                    >
                        <TableCell className="text-primary px-3 py-2 text-base font-bold">
                            {t.id}
                        </TableCell>
                        <TableCell className="text-muted-foreground px-3 py-2 text-base">
                            {t.name}
                        </TableCell>
                        <TableCell className="px-3 py-2">
                            <span
                                className={`text-sm font-bold tracking-wide ${(() => {
                                    if (t.solved) {
                                        return "text-success";
                                    }
                                    if (t.partial) {
                                        return "text-warning";
                                    }
                                    return "text-destructive";
                                })()}`}
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
                        </TableCell>
                        <TableCell className="text-muted-foreground px-3 py-2 text-base">
                            {t.cost}
                        </TableCell>
                        <TableCell className="text-muted-foreground px-3 py-2 text-base">
                            {t.time}
                        </TableCell>
                        <TableCell className="text-muted-foreground px-3 py-2 text-base">
                            {t.eord}/5
                        </TableCell>
                        <TableCell
                            className={`px-3 py-2 text-base ${t.attempts > 2 ? "text-warning" : "text-muted-foreground"}`}
                        >
                            {t.attempts}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
