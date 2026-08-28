import { Button } from "@/components/ui/button";
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
            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="bg-card sticky top-0">
                        {["FINDING", "TYPE", "EVIDENCE", "RETRY", "STATUS", "ORACLE", ""].map(
                            (h) => (
                                <th
                                    key={h}
                                    className="text-muted-foreground border-border border-b px-4 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
                                >
                                    {h}
                                </th>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {findings.map((f) => {
                        const sb = SB[f.status];
                        const isSelected = selected?.id === f.id;
                        return (
                            <tr
                                key={f.id}
                                className="border-border cursor-pointer border-b"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelected(f);
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--border)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = isSelected
                                        ? "var(--border)"
                                        : "transparent")
                                }
                            >
                                <td className="text-primary px-4 py-2 font-bold tracking-tight">
                                    {f.id}
                                </td>
                                <td className="text-muted-foreground px-4 py-2">{f.type}</td>
                                <td className="text-muted-foreground px-4 py-2 text-base">
                                    {f.evidence}
                                </td>
                                <td
                                    className="px-4 py-2 text-right"
                                    style={{
                                        color:
                                            f.retry > 0
                                                ? "var(--warning)"
                                                : "var(--muted-foreground)",
                                    }}
                                >
                                    {f.retry}
                                </td>
                                <td className="px-4 py-2">
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
                                </td>
                                <td className="text-muted-foreground px-4 py-2 text-base">
                                    {f.oracle}
                                </td>
                                <td className="px-4 py-2">
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
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
