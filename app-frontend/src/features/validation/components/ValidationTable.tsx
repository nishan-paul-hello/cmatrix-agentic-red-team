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
            <table className="text-xl-tight w-full border-collapse">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                        {["FINDING", "TYPE", "EVIDENCE", "RETRY", "STATUS", "ORACLE", ""].map(
                            (h) => (
                                <th
                                    key={h}
                                    className="tracking-wider-3 px-[16px] py-[6px] text-left text-sm font-semibold whitespace-nowrap text-[var(--color-hex-444444)]"
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
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelected(f);
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = isSelected
                                        ? "var(--color-hex-0f0f0f)"
                                        : "transparent")
                                }
                            >
                                <td className="px-[16px] py-[8px] font-bold tracking-tight text-[var(--color-brand)]">
                                    {f.id}
                                </td>
                                <td className="px-[16px] py-[8px] text-[var(--color-hex-a0a0a0)]">
                                    {f.type}
                                </td>
                                <td className="px-[16px] py-[8px] text-base text-[var(--color-hex-666666)]">
                                    {f.evidence}
                                </td>
                                <td
                                    className="px-[16px] py-[8px] text-right"
                                    style={{
                                        color:
                                            f.retry > 0
                                                ? "var(--color-warning)"
                                                : "var(--color-hex-444444)",
                                    }}
                                >
                                    {f.retry}
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    <span
                                        className="rounded-[2px] px-[6px] py-[1px] text-base font-semibold tracking-wide"
                                        style={{
                                            color: sb.color,
                                            background: sb.bg,
                                            border: `1px solid ${sb.border}`,
                                        }}
                                    >
                                        {f.status}
                                    </span>
                                </td>
                                <td className="px-[16px] py-[8px] text-base text-[var(--color-hex-555555)]">
                                    {f.oracle}
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelected(f);
                                        }}
                                        className="font-inherit text-base-tight cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[8px] py-[2px] tracking-normal text-[var(--color-hex-666666)] hover:border-[var(--color-brand)]"
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
