import { useEffect, useState } from "react";

import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { type EnvFailureLogEntry } from "@/types/domain-types";

export default function FailuresPanel() {
    const [FAILURE_LOG, setData] = useState<EnvFailureLogEntry[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<EnvFailureLogEntry>({ collection: "FAILURE_LOG", limit: 1000 })
            .then(setData);
    }, []);

    const [selId, setSelId] = useState<string | null>(null);

    if (FAILURE_LOG.length === 0) {
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
                        SPECIALIST FAILURE LOG
                    </span>
                    <span className="ml-auto text-sm tracking-wide text-[var(--color-warning)]">
                        {FAILURE_LOG.filter((f) => !f.resolved).length} UNRESOLVED
                    </span>
                </div>
                <table className="text-xl-tight w-full border-collapse">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                            {[
                                "ID",
                                "TIMESTAMP",
                                "SPECIALIST",
                                "ACTION",
                                "TARGET",
                                "ERROR",
                                "E_ORD",
                                "RESOLVED",
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
                        {FAILURE_LOG.map((f, i) => (
                            <tr
                                key={f.id}
                                onClick={() => setSelId(f.id === selId ? null : f.id)}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                    background: (() => {
                                        if (selId === f.id) {
                                            return "var(--color-hex-110808)";
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
                                        if (selId === f.id) {
                                            return "var(--color-hex-110808)";
                                        }
                                        if (i % 2) {
                                            return "var(--color-hex-0b0b0b)";
                                        }
                                        return "transparent";
                                    })())
                                }
                            >
                                <td className="px-[12px] py-[7px] text-base font-bold text-[var(--color-brand)]">
                                    {f.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-444444)]">
                                    {f.ts}
                                </td>
                                <td className="px-[12px] py-[7px] text-base font-semibold text-[var(--color-hex-a0a0a0)]">
                                    {f.spec}
                                </td>
                                <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-666666)]">
                                    {f.action}
                                </td>
                                <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-555555)]">
                                    {f.target}
                                </td>
                                <td className="px-[12px] py-[7px] text-base text-[var(--color-hex-666666)]">
                                    {f.error}
                                </td>
                                <td className="px-[12px] py-[7px] text-[var(--color-hex-555555)]">
                                    {f.eord}/5
                                </td>
                                <td className="px-[12px] py-[7px]">
                                    <span
                                        className="text-base-tight font-semibold tracking-wide"
                                        style={{
                                            color: f.resolved
                                                ? "var(--color-success)"
                                                : "var(--color-warning)",
                                        }}
                                    >
                                        {f.resolved ? "YES" : "NO"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {selId && (
                <div
                    className="w-panel-sm shrink-0 overflow-y-auto bg-[var(--color-hex-0a0a0a)] px-[14px] py-[16px]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    {(() => {
                        const f = FAILURE_LOG.find((x) => x.id === selId);
                        if (!f) {
                            return null;
                        }
                        return (
                            <>
                                <div className="mb-[12px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                                    FAILURE DETAIL
                                </div>
                                {[
                                    {
                                        k: "ID",
                                        v: f.id,
                                    },
                                    {
                                        k: "TIMESTAMP",
                                        v: f.ts,
                                    },
                                    {
                                        k: "SPECIALIST",
                                        v: f.spec,
                                    },
                                    {
                                        k: "ACTION",
                                        v: f.action,
                                    },
                                    {
                                        k: "TARGET",
                                        v: (f as unknown as Record<string, string>).target,
                                    },
                                    {
                                        k: "E_ORD",
                                        v: `${f.eord}/5`,
                                    },
                                    {
                                        k: "RESOLVED",
                                        v: f.resolved ? "YES" : "NO",
                                    },
                                ].map((r) => (
                                    <div key={r.k} className="mb-[8px]">
                                        <div className="text-sm-tight tracking-wider-2 mb-[2px] text-[var(--color-hex-444444)]">
                                            {r.k}
                                        </div>
                                        <div
                                            className="text-lg"
                                            style={{
                                                color: (() => {
                                                    if (r.k === "RESOLVED" && f.resolved) {
                                                        return "var(--color-success)";
                                                    }
                                                    if (r.k === "RESOLVED") {
                                                        return "var(--color-warning)";
                                                    }
                                                    return "var(--color-hex-888888)";
                                                })(),
                                            }}
                                        >
                                            {r.v}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-[12px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[10px] py-[8px] text-base leading-relaxed text-[var(--color-danger)]">
                                    {f.error}
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
