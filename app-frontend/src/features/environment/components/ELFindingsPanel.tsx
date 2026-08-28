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
            <div
                className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                }}
            >
                <span className="tracking-wider-3 text-sm text-[var(--color-hex-444444)]">
                    EL FINDINGS CROSS-REFERENCE
                </span>
                <span className="ml-[8px] text-sm text-[var(--color-hex-555555)]">
                    confirmed findings linked to EL evidence artifacts
                </span>
            </div>
            <table className="text-xl-tight w-full border-collapse">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
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
                    {EL_FINDINGS.map((f, i) => (
                        <tr
                            key={f.id}
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                                background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    i % 2 ? "var(--color-hex-0b0b0b)" : "transparent")
                            }
                        >
                            <td className="px-[12px] py-[7px] text-base font-bold text-[var(--color-brand)]">
                                {f.id}
                            </td>
                            <td className="px-[12px] py-[7px] text-[var(--color-hex-a0a0a0)]">
                                {f.type}
                            </td>
                            <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-555555)]">
                                {f.target}
                            </td>
                            <td className="px-[12px] py-[7px] text-[var(--color-hex-666666)]">
                                {f.eord}/5
                            </td>
                            <td className="px-[12px] py-[7px] text-base font-bold text-[var(--color-brand)]">
                                {f.vdgNode}
                            </td>
                            <td className="px-[12px] py-[7px]">
                                <div className="flex flex-wrap gap-1">
                                    {f.evidence.map((e: string) => (
                                        <span
                                            key={e}
                                            className="text-sm-tight rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[5px] py-[1px] tracking-tight text-[var(--color-hex-444444)]"
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
