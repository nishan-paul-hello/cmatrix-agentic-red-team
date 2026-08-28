import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { MetricTile } from "@/components/ui/MetricTile";
import { CostRepository } from "@/features/cost/data/CostRepository";
import { type ContextEntry } from "@/features/cost/data/fixtures/costMockData";

export default function ContextState() {
    const [entries, setEntries] = useState<ContextEntry[]>([]);
    const [sel, setSel] = useState<ContextEntry | null>(null);

    useEffect(() => {
        void CostRepository.getContextEntries().then((data) => {
            setEntries(data);
            setSel(data[2]);
        });
    }, []);

    const stc: Record<string, string | undefined> = {
        COMPACTED: "var(--color-warning)",
        ACTIVE: "var(--color-success)",
        IDLE: "var(--color-hex-444444)",
    };

    if (!sel) {
        return (
            <div className="flex h-full flex-1 items-center justify-center">
                <EmptyState message="LOADING COST DATA..." />
            </div>
        );
    }

    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* KPIs */}
                <div className="mb-6 grid grid-cols-3 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                    {[
                        {
                            k: "TOTAL CONTEXT",
                            v: "346K",
                            sub: "across specialists",
                        },
                        {
                            k: "COMPACTION EVENTS",
                            v: "3",
                            sub: "context saves",
                        },
                        {
                            k: "TOKENS SAVED",
                            v: "184K",
                            sub: "via compaction",
                        },
                    ].map((m, i, a) => (
                        <MetricTile
                            key={m.k}
                            label={m.k}
                            value={m.v}
                            sub={m.sub}
                            variant="dashboard"
                            borderRight={i < a.length - 1}
                        />
                    ))}
                </div>

                {/* Context bars */}
                {entries.map((s) => {
                    const pct = Math.round((s.used / s.max) * 100);
                    const bc = (() => {
                        if (pct > 85) {
                            return "var(--color-danger)";
                        }
                        if (pct > 60) {
                            return "var(--color-warning)";
                        }
                        return "var(--color-success)";
                    })();
                    const isSel = sel.id === s.id;
                    return (
                        <div
                            key={s.id}
                            onClick={() => setSel(s)}
                            onKeyDown={(ev) => {
                                if (ev.key === "Enter" || ev.key === " ") {
                                    setSel(s);
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            className="mb-[8px] cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] px-[16px] py-[14px]"
                            style={{
                                background: isSel ? "var(--color-hex-0d0d0d)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = isSel
                                    ? "var(--color-hex-0d0d0d)"
                                    : "transparent")
                            }
                        >
                            <div className="mb-3 flex items-center gap-3">
                                <span className="flex-1 text-lg font-bold tracking-tight text-[var(--color-hex-a0a0a0)]">
                                    {s.role}
                                </span>
                                <span
                                    className="tracking-wider-1 text-sm font-semibold"
                                    style={{
                                        color: stc[s.state],
                                    }}
                                >
                                    {s.state}
                                </span>
                                {s.compacted > 0 && (
                                    <span className="text-sm tracking-normal text-[var(--color-warning)]">
                                        COMPACTED ×{s.compacted}
                                    </span>
                                )}
                                <span
                                    className="text-base font-bold"
                                    style={{
                                        color: bc,
                                    }}
                                >
                                    {pct}%
                                </span>
                            </div>
                            <div className="mb-[6px] h-[5px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full rounded-[2px]"
                                    style={{
                                        width: `${pct}%`,
                                        background: bc,
                                    }}
                                />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-[var(--color-hex-333333)]">
                                    {(s.used / 1024).toFixed(0)}K / {s.max / 1024}K tokens
                                </span>
                                <span className="text-sm text-[var(--color-hex-333333)]">
                                    ${s.cost.toFixed(4)} this session
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail */}
            <div
                className="flex w-[260px] flex-shrink-0 flex-col overflow-y-auto px-[14px] py-[16px]"
                style={{
                    borderLeft: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[4px] text-xl font-bold tracking-normal text-[var(--color-fg)]">
                    {sel.role}
                </div>
                <div
                    className="text-base-tight tracking-wider-1 mb-[16px] font-semibold"
                    style={{
                        color: stc[sel.state],
                    }}
                >
                    {sel.state}
                </div>
                {[
                    {
                        k: "CONTEXT USED",
                        v: `${(sel.used / 1024).toFixed(0)}K tokens`,
                    },
                    {
                        k: "CONTEXT MAX",
                        v: `${sel.max / 1024}K tokens`,
                    },
                    {
                        k: "UTILIZATION",
                        v: `${Math.round((sel.used / sel.max) * 100)}%`,
                    },
                    {
                        k: "COMPACTIONS",
                        v: String(sel.compacted),
                    },
                    {
                        k: "SESSION SPEND",
                        v: `$${sel.cost.toFixed(4)}`,
                    },
                    {
                        k: "SESSION TOKENS",
                        v: `${(sel.sessionTok / 1000).toFixed(1)}K`,
                    },
                ].map((r) => (
                    <div key={r.k} className="mb-[12px]">
                        <div className="text-sm-tight tracking-wider-3 mb-[3px] text-[var(--color-hex-444444)]">
                            {r.k}
                        </div>
                        <div className="text-3xl font-bold text-[var(--color-fg)]">{r.v}</div>
                    </div>
                ))}
                {/* Context state diagram */}
                <div
                    className="mt-[8px]"
                    style={{
                        borderTop: "1px solid var(--color-hex-1a1a1a)",
                        paddingTop: 14,
                    }}
                >
                    <div className="mb-[12px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                        CONTEXT LIFECYCLE
                    </div>
                    {[
                        "FULL CONTEXT",
                        "→ COMPACTION TRIGGER",
                        "SUMMARY GENERATED",
                        "→ CONTEXT REPLACED",
                        "ACTIVE TASK PRESERVED",
                    ].map((node, i) => (
                        <div key={`lifecycle-${node}`} className="flex flex-col items-start">
                            {i > 0 && (
                                <div className="ml-[9px] h-[12px] w-[1px] bg-[var(--color-hex-1e1e1e)]" />
                            )}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <div
                                    className="h-[6px] w-[6px] shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                        border: "1px solid",
                                        borderColor: (() => {
                                            if (sel.compacted > 0 && i === 4) {
                                                return "var(--color-success)";
                                            }
                                            if (i === 0 && sel.state === "ACTIVE") {
                                                return "var(--color-brand)";
                                            }
                                            return "var(--color-hex-333333)";
                                        })(),
                                        background:
                                            i === 4 && sel.compacted > 0
                                                ? "var(--color-success)"
                                                : "transparent",
                                    }}
                                />
                                <span
                                    className="text-base-tight tracking-tight-1"
                                    style={{
                                        color: (() => {
                                            if (i === 0 && sel.state === "ACTIVE") {
                                                return "var(--color-brand)";
                                            }
                                            if (i === 4 && sel.compacted > 0) {
                                                return "var(--color-success)";
                                            }
                                            return "var(--color-hex-333333)";
                                        })(),
                                    }}
                                >
                                    {node}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
