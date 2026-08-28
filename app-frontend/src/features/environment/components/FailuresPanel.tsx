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
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
                <div className="bg-background border-border flex flex-shrink-0 items-center gap-2 border-b px-4 py-2">
                    <span className="text-muted-foreground text-sm tracking-widest">
                        SPECIALIST FAILURE LOG
                    </span>
                    <span className="text-warning ml-auto text-sm tracking-wide">
                        {FAILURE_LOG.filter((f) => !f.resolved).length} UNRESOLVED
                    </span>
                </div>
                <table className="w-full border-collapse text-xs">
                    <thead>
                        <tr className="bg-card sticky top-0">
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
                                    className="text-muted-foreground border-border border-b px-3 py-1.5 text-left text-sm font-semibold tracking-widest whitespace-nowrap"
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
                                    borderBottom: "1px solid var(--border)",
                                    background: (() => {
                                        if (selId === f.id) {
                                            return "var(--border)";
                                        }
                                        if (i % 2) {
                                            return "var(--background)";
                                        }
                                        return "transparent";
                                    })(),
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--border)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = (() => {
                                        if (selId === f.id) {
                                            return "var(--border)";
                                        }
                                        if (i % 2) {
                                            return "var(--background)";
                                        }
                                        return "transparent";
                                    })())
                                }
                            >
                                <td className="text-primary px-3 py-1.5 text-base font-bold">
                                    {f.id}
                                </td>
                                <td className="text-muted-foreground px-3 py-1.5 text-base">
                                    {f.ts}
                                </td>
                                <td className="text-muted-foreground px-3 py-1.5 text-base font-semibold">
                                    {f.spec}
                                </td>
                                <td className="text-muted-foreground px-3 py-1.5 text-base">
                                    {f.action}
                                </td>
                                <td className="text-muted-foreground px-3 py-1.5 text-base">
                                    {f.target}
                                </td>
                                <td className="text-muted-foreground px-3 py-1.5 text-base">
                                    {f.error}
                                </td>
                                <td className="text-muted-foreground px-3 py-1.5">{f.eord}/5</td>
                                <td className="px-3 py-1.5">
                                    <span
                                        className="text-sm font-semibold tracking-wide"
                                        style={{
                                            color: f.resolved ? "var(--success)" : "var(--warning)",
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
                <div className="w-panel-sm bg-background border-border shrink-0 overflow-y-auto border-l px-3.5 py-4">
                    {(() => {
                        const f = FAILURE_LOG.find((x) => x.id === selId);
                        if (!f) {
                            return null;
                        }
                        return (
                            <>
                                <div className="text-muted-foreground mb-3 text-sm tracking-widest">
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
                                    <div key={r.k} className="mb-2">
                                        <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                                            {r.k}
                                        </div>
                                        <div
                                            className="text-xs"
                                            style={{
                                                color: (() => {
                                                    if (r.k === "RESOLVED" && f.resolved) {
                                                        return "var(--success)";
                                                    }
                                                    if (r.k === "RESOLVED") {
                                                        return "var(--warning)";
                                                    }
                                                    return "var(--muted-foreground)";
                                                })(),
                                            }}
                                        >
                                            {r.v}
                                        </div>
                                    </div>
                                ))}
                                <div className="border-border bg-card text-destructive mt-3 rounded-sm border-[1px] border-solid px-2.5 py-2 text-base leading-relaxed">
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
