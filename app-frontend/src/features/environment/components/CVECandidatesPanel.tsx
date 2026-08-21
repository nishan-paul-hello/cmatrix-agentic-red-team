import { CVE_CANDIDATES } from "@/features/environment/data/mockData";

export default function CVECandidatesPanel() {
    return (
        <div className="flex-1 overflow-auto">
            <div
                className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                }}
            >
                <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                    VDG HYPOTHESIS CANDIDATES
                </span>
                <span className="ml-auto text-[8px] tracking-[0.12em] text-[var(--color-hex-d29922)]">
                    {CVE_CANDIDATES.filter((c) => c.poc).length} WITH PoC
                </span>
            </div>
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                        {[
                            "CVE ID",
                            "TECHNOLOGY",
                            "VULN CLASS",
                            "EPSS",
                            "PoC",
                            "LINKED VDG NODE",
                            "E_ORD",
                        ].map((h) => (
                            <th
                                key={h}
                                className="px-[12px] py-[6px] text-left text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...CVE_CANDIDATES]
                        .sort((a, b) => b.epss - a.epss)
                        .map((c) => (
                            <tr
                                key={c.id}
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td className="px-[12px] py-[7px] text-[9px] font-bold tracking-[0.06em] text-[var(--color-hex-e31b23)]">
                                    {c.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-[var(--color-hex-a0a0a0)]">
                                    {c.tech}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                    {c.class}
                                </td>
                                <td className="px-[12px] py-[7px]">
                                    <span
                                        className="text-[10px] font-bold"
                                        style={{
                                            color: (() => {
                                                if (c.epss > 0.5) {
                                                    return "var(--color-hex-ff2a32)";
                                                }
                                                if (c.epss > 0.3) {
                                                    return "var(--color-hex-d29922)";
                                                }
                                                return "var(--color-hex-555555)";
                                            })(),
                                        }}
                                    >
                                        {c.epss.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-[12px] py-[7px]">
                                    <span
                                        className="text-[8.5px] tracking-[0.12em]"
                                        style={{
                                            color: c.poc
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-333333)",
                                        }}
                                    >
                                        {c.poc ? "YES" : "NO"}
                                    </span>
                                </td>
                                <td
                                    className="px-[12px] py-[7px] text-[9px]"
                                    style={{
                                        color:
                                            c.node !== "—"
                                                ? "var(--color-hex-e31b23)"
                                                : "var(--color-hex-333333)",
                                        fontWeight: c.node !== "—" ? 700 : 400,
                                    }}
                                >
                                    {c.node}
                                </td>
                                <td className="px-[12px] py-[7px] text-[var(--color-hex-666666)]">
                                    {c.eord}/5
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
