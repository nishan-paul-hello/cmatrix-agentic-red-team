import { useEffect, useState } from "react";

import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { type CveCandidate } from "@/types/domain-types";

export default function CVECandidatesPanel() {
    const [CVE_CANDIDATES, setData] = useState<CveCandidate[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<CveCandidate>({ collection: "CVE_CANDIDATES", limit: 1000 })
            .then(setData);
    }, []);

    if (CVE_CANDIDATES.length === 0) {
        return null;
    }

    return (
        <div className="flex-1 overflow-auto">
            <div
                className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                }}
            >
                <span className="tracking-wider-3 text-sm text-[var(--color-hex-444444)]">
                    VDG HYPOTHESIS CANDIDATES
                </span>
                <span className="ml-auto text-sm tracking-wide text-[var(--color-warning)]">
                    {CVE_CANDIDATES.filter((c) => c.poc).length} WITH PoC
                </span>
            </div>
            <table className="text-xl-tight w-full border-collapse">
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
                                className="tracking-wider-2 px-[12px] py-[6px] text-left text-sm font-semibold whitespace-nowrap text-[var(--color-hex-444444)]"
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
                                <td className="tracking-tight-1 px-[12px] py-[7px] text-base font-bold text-[var(--color-brand)]">
                                    {c.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-[var(--color-hex-a0a0a0)]">
                                    {c.tech}
                                </td>
                                <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-666666)]">
                                    {c.class}
                                </td>
                                <td className="px-[12px] py-[7px]">
                                    <span
                                        className="text-lg font-bold"
                                        style={{
                                            color: (() => {
                                                if (c.epss > 0.5) {
                                                    return "var(--color-danger)";
                                                }
                                                if (c.epss > 0.3) {
                                                    return "var(--color-warning)";
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
                                        className="text-base-tight tracking-wide"
                                        style={{
                                            color: c.poc
                                                ? "var(--color-success)"
                                                : "var(--color-hex-333333)",
                                        }}
                                    >
                                        {c.poc ? "YES" : "NO"}
                                    </span>
                                </td>
                                <td
                                    className="px-[12px] py-[7px] text-base"
                                    style={{
                                        color:
                                            c.node !== "—"
                                                ? "var(--color-brand)"
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
