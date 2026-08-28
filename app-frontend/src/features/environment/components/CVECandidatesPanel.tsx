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
            <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2">
                <span className="text-muted-foreground text-sm tracking-widest">
                    VDG HYPOTHESIS CANDIDATES
                </span>
                <span className="text-warning ml-auto text-sm tracking-wide">
                    {CVE_CANDIDATES.filter((c) => c.poc).length} WITH PoC
                </span>
            </div>
            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="bg-card sticky top-0">
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
                                className="text-muted-foreground border-border border-b px-3 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
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
                                    borderBottom: "1px solid var(--border)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--border)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td className="text-primary px-3 py-1.5 text-base font-bold tracking-tight">
                                    {c.id}
                                </td>
                                <td className="text-muted-foreground px-3 py-1.5">{c.tech}</td>
                                <td className="text-muted-foreground px-3 py-1.5 text-base">
                                    {c.class}
                                </td>
                                <td className="px-3 py-1.5">
                                    <span
                                        className="text-xs font-bold"
                                        style={{
                                            color: (() => {
                                                if (c.epss > 0.5) {
                                                    return "var(--destructive)";
                                                }
                                                if (c.epss > 0.3) {
                                                    return "var(--warning)";
                                                }
                                                return "var(--muted-foreground)";
                                            })(),
                                        }}
                                    >
                                        {c.epss.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-3 py-1.5">
                                    <span
                                        className="text-sm tracking-wide"
                                        style={{
                                            color: c.poc ? "var(--success)" : "var(--border)",
                                        }}
                                    >
                                        {c.poc ? "YES" : "NO"}
                                    </span>
                                </td>
                                <td
                                    className="px-3 py-1.5 text-base"
                                    style={{
                                        color: c.node !== "—" ? "var(--primary)" : "var(--border)",
                                        fontWeight: c.node !== "—" ? 700 : 400,
                                    }}
                                >
                                    {c.node}
                                </td>
                                <td className="text-muted-foreground px-3 py-1.5">{c.eord}/5</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}
