import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { SB, type VFinding } from "@/features/validation/data/fixtures/validationMockData";

export function ValidationTable({
    findings,
    selected,
    setSelected,
}: {
    findings: VFinding[];
    selected: VFinding | null;
    setSelected: (f: VFinding) => void;
}) {
    return (
        <div className="flex-1 overflow-auto">
            <div className="w-full overflow-x-auto">
                <Table className="text-xs">
                    <TableHeader>
                        <TableRow className="bg-card hover:bg-card sticky top-0">
                            {["FINDING", "TYPE", "EVIDENCE", "RETRY", "STATUS", "ORACLE", ""].map(
                                (h) => (
                                    <TableHead
                                        key={h}
                                        className="text-muted-foreground border-border border-b px-4 py-1.5 text-left text-sm font-semibold tracking-widest"
                                    >
                                        {h}
                                    </TableHead>
                                ),
                            )}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {findings.map((f) => {
                            const sb = SB[f.status];
                            const isSelected = selected?.id === f.id;
                            return (
                                <TableRow
                                    key={f.id}
                                    className={`border-border hover:bg-border focus-visible:bg-border cursor-pointer border-b focus-visible:outline-none ${isSelected ? "bg-border" : "bg-transparent"}`}
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelected(f);
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelected(f);
                                    }}
                                >
                                    <TableCell className="text-primary px-4 py-2 font-bold tracking-tight">
                                        {f.id}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-4 py-2">
                                        {f.type}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-4 py-2 text-base">
                                        {f.evidence}
                                    </TableCell>
                                    <TableCell
                                        className={`px-4 py-2 text-right ${f.retry > 0 ? "text-warning" : "text-muted-foreground"}`}
                                    >
                                        {f.retry}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        <span
                                            className="rounded-sm px-1.5 py-px text-base font-semibold tracking-wide"
                                            style={{
                                                color: sb.color,
                                                background: sb.bg,
                                                border: `1px solid ${sb.border}`,
                                            }}
                                        >
                                            {f.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground px-4 py-2 text-base">
                                        {f.oracle}
                                    </TableCell>
                                    <TableCell className="px-4 py-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelected(f);
                                            }}
                                            className="text-muted-foreground hover:border-primary text-xs tracking-normal"
                                        >
                                            DETAIL
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
