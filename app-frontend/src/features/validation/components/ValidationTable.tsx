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
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                        {["FINDING", "TYPE", "EVIDENCE", "RETRY", "STATUS", "ORACLE", ""].map(
                            (h) => (
                                <th
                                    key={h}
                                    className="px-[16px] py-[6px] text-left text-[8px] font-semibold tracking-[0.18em] whitespace-nowrap text-[var(--color-hex-444444)]"
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
                    {findings.map((f) => {
                        const sb = SB[f.status];
                        const isSelected = selected?.id === f.id;
                        return (
                            <tr
                                key={f.id}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                    background: isSelected
                                        ? "var(--color-hex-0f0f0f)"
                                        : "transparent",
                                }}
                                onClick={() => setSelected(f)}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = isSelected
                                        ? "var(--color-hex-0f0f0f)"
                                        : "transparent")
                                }
                            >
                                <td className="px-[16px] py-[8px] font-bold tracking-[0.08em] text-[var(--color-hex-e31b23)]">
                                    {f.id}
                                </td>
                                <td className="px-[16px] py-[8px] text-[var(--color-hex-a0a0a0)]">
                                    {f.type}
                                </td>
                                <td className="px-[16px] py-[8px] text-[9px] text-[var(--color-hex-666666)]">
                                    {f.evidence}
                                </td>
                                <td
                                    className="px-[16px] py-[8px] text-right"
                                    style={{
                                        color:
                                            f.retry > 0
                                                ? "var(--color-hex-d29922)"
                                                : "var(--color-hex-444444)",
                                    }}
                                >
                                    {f.retry}
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    <span
                                        className="rounded-[2px] px-[6px] py-[1px] text-[9px] font-semibold tracking-[0.12em]"
                                        style={{
                                            color: sb.color,
                                            background: sb.bg,
                                            border: `1px solid ${sb.border}`,
                                        }}
                                    >
                                        {f.status}
                                    </span>
                                </td>
                                <td className="px-[16px] py-[8px] text-[9px] text-[var(--color-hex-555555)]">
                                    {f.oracle}
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelected(f);
                                        }}
                                        className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[8px] py-[2px] text-[8.5px] tracking-[0.1em] text-[var(--color-hex-666666)] hover:border-[var(--color-hex-e31b23)]"
                                    >
                                        DETAIL
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
