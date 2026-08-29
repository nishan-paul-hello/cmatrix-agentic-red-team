import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
            <Table>
                <TableHeader>
                    <TableRow className="bg-card hover:bg-card sticky top-0">
                        {["ID", "NAME", "TIER", "AVG COST", "AVG TIME", "DATE", "STATUS"].map(
                            (h) => (
                                <TableHead
                                    key={h}
                                    className="text-muted-foreground border-border border-b px-3.5 py-1 text-left text-xs font-semibold tracking-widest"
                                >
                                    {h}
                                </TableHead>
                            ),
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filtered.map((b) => {
                        const tierMeta = TIER_META[b.tier];
                        return (
                            <TableRow
                                key={b.id}
                                onClick={() => onSelect(b)}
                                className="border-border hover:bg-background focus-visible:bg-background cursor-pointer border-b focus-visible:outline-none"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault();
                                        onSelect(b);
                                    }
                                }}
                            >
                                <TableCell className="text-primary px-3.5 py-2 text-base font-bold">
                                    {b.id}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3.5 py-2 text-xs">
                                    {b.name}
                                </TableCell>
                                <TableCell className="px-3.5 py-2">
                                    <span
                                        className="text-sm font-semibold tracking-normal"
                                        style={{ color: tierMeta.color }}
                                    >
                                        {tierMeta.label}
                                    </span>
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3.5 py-2 text-base">
                                    {b.avgCost}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3.5 py-2 text-base">
                                    {b.avgTime}
                                </TableCell>
                                <TableCell className="text-muted-foreground px-3.5 py-2 text-base">
                                    {b.date}
                                </TableCell>
                                <TableCell className="px-3.5 py-2">
                                    <span
                                        className={`text-sm font-semibold tracking-wide ${(() => {
                                            if (b.status === BENCHMARK_STATUS.COMPLETE) {
                                                return "text-success";
                                            }
                                            if (b.status === BENCHMARK_STATUS.RUNNING) {
                                                return "text-destructive";
                                            }
                                            return "text-border";
                                        })()}`}
                                    >
                                        {b.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
