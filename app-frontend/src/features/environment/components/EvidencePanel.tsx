import { useEffect, useState } from "react";

import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { type EvidenceArtifact } from "@/types/domain-types";

export default function EvidencePanel() {
    const [EVIDENCE_ARTIFACTS, setData] = useState<EvidenceArtifact[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<EvidenceArtifact>({ collection: "EVIDENCE_ARTIFACTS", limit: 1000 })
            .then(setData);
    }, []);

    const [sel, setSel] = useState<string | null>(null);

    if (EVIDENCE_ARTIFACTS.length === 0) {
        return null;
    }
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex min-w-[0px] flex-1 flex-col overflow-y-auto">
                <div
                    className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                    style={{
                        borderBottom: "1px solid var(--color-hex-141414)",
                    }}
                >
                    <span className="tracking-wider-3 text-sm text-[var(--color-hex-444444)]">
                        RAW EVIDENCE ARTIFACTS
                    </span>
                    <span className="ml-auto text-sm text-[var(--color-hex-555555)]">
                        {EVIDENCE_ARTIFACTS.length} ARTIFACTS
                    </span>
                </div>
                <table className="text-xl-tight w-full border-collapse">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                            {["ARTIFACT ID", "TYPE", "FINDING", "TIMESTAMP", "SIZE", "NOTE"].map(
                                (h) => (
                                    <th
                                        key={h}
                                        className="tracking-wider-2 px-[12px] py-[6px] text-left text-sm font-semibold whitespace-nowrap text-[var(--color-hex-444444)]"
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
                        {EVIDENCE_ARTIFACTS.map((a, i) => (
                            <tr
                                key={a.id}
                                onClick={() => setSel(a.id === sel ? null : a.id)}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                    background: (() => {
                                        if (sel === a.id) {
                                            return "var(--color-hex-0f0f0f)";
                                        }
                                        if (i % 2) {
                                            return "var(--color-hex-0b0b0b)";
                                        }
                                        return "transparent";
                                    })(),
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = (() => {
                                        if (sel === a.id) {
                                            return "var(--color-hex-0f0f0f)";
                                        }
                                        if (i % 2) {
                                            return "var(--color-hex-0b0b0b)";
                                        }
                                        return "transparent";
                                    })())
                                }
                            >
                                <td className="px-[12px] py-[7px] text-base font-bold text-[var(--color-brand)]">
                                    {a.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-666666)]">
                                    {a.type}
                                </td>
                                <td className="px-[12px] py-[7px] text-base font-bold text-[var(--color-brand)]">
                                    {a.finding}
                                </td>
                                <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-444444)]">
                                    {a.ts}
                                </td>
                                <td className="px-[12px] py-[7px] text-right text-base text-[var(--color-hex-444444)]">
                                    {a.size}
                                </td>
                                <td className="px-[12px] py-[7px] text-[var(--color-hex-555555)]">
                                    {a.note}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sel && (
                <div
                    className="w-panel-sm shrink-0 overflow-y-auto bg-[var(--color-hex-0a0a0a)] px-[14px] py-[16px]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    {(() => {
                        const a = EVIDENCE_ARTIFACTS.find((x) => x.id === sel);
                        if (!a) {
                            return null;
                        }
                        return (
                            <>
                                <div className="mb-[12px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                                    ARTIFACT DETAIL
                                </div>
                                {[
                                    {
                                        k: "ID",
                                        v: a.id,
                                    },
                                    {
                                        k: "TYPE",
                                        v: a.type,
                                    },
                                    {
                                        k: "FINDING",
                                        v: a.finding,
                                    },
                                    {
                                        k: "TIMESTAMP",
                                        v: a.ts,
                                    },
                                    {
                                        k: "SIZE",
                                        v: a.size,
                                    },
                                ].map((r) => (
                                    <div key={r.k} className="mb-[8px]">
                                        <div className="text-sm-tight tracking-wider-2 mb-[2px] text-[var(--color-hex-444444)]">
                                            {r.k}
                                        </div>
                                        <div className="text-lg text-[var(--color-hex-888888)]">
                                            {r.v}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-[12px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[10px] py-[8px] text-base leading-loose text-[var(--color-hex-555555)]">
                                    {a.note}
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
