import { useEffect, useState } from "react";

import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { type ElFinding } from "@/types/domain-types";

export default function ELFindingsPanel() {
    const [EL_FINDINGS, setData] = useState<ElFinding[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<ElFinding>({ collection: "EL_FINDINGS", limit: 1000 })
            .then(setData);
    }, []);

    if (EL_FINDINGS.length === 0) {
        return null;
    }

    return (
        <div className="flex-1 overflow-auto">
            <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2">
                <span className="text-muted-foreground text-sm tracking-widest">
                    EL FINDINGS CROSS-REFERENCE
                </span>
                <span className="text-muted-foreground ml-2 text-sm">
                    confirmed findings linked to EL evidence artifacts
                </span>
            </div>
            <table className="w-full border-collapse text-xs">
                <thead>
                    <tr className="bg-card sticky top-0">
                        {[
                            "FINDING",
                            "TYPE",
                            "TARGET",
                            "E_ORD",
                            "LINKED VDG NODE",
                            "EVIDENCE ARTIFACTS",
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
                    {EL_FINDINGS.map((f, i) => (
                        <tr
                            key={f.id}
                            style={{
                                borderBottom: "1px solid var(--border)",
                                background: i % 2 ? "var(--background)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--border)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    i % 2 ? "var(--background)" : "transparent")
                            }
                        >
                            <td className="text-primary px-3 py-1.5 text-base font-bold">{f.id}</td>
                            <td className="text-muted-foreground px-3 py-1.5">{f.type}</td>
                            <td className="text-muted-foreground px-3 py-1.5 text-base">
                                {f.target}
                            </td>
                            <td className="text-muted-foreground px-3 py-1.5">{f.eord}/5</td>
                            <td className="text-primary px-3 py-1.5 text-base font-bold">
                                {f.vdgNode}
                            </td>
                            <td className="px-3 py-1.5">
                                <div className="flex flex-wrap gap-1">
                                    {f.evidence.map((e: string) => (
                                        <span
                                            key={e}
                                            className="border-border bg-card text-muted-foreground rounded-sm border-[1px] border-solid px-1 py-px text-xs tracking-tight"
                                        >
                                            {e}
                                        </span>
                                    ))}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
