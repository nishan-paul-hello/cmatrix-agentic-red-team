import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { MetricTile } from "@/components/ui/MetricTile";
import { type ContextEntry } from "@/features/cost/data/costMockData";
import { CostRepository } from "@/features/cost/data/CostRepository";

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
        COMPACTED: "var(--color-hex-d29922)",
        ACTIVE: "var(--color-hex-3fb950)",
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
                            return "var(--color-hex-ff2a32)";
                        }
                        if (pct > 60) {
                            return "var(--color-hex-d29922)";
                        }
                        return "var(--color-hex-3fb950)";
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
                                <span className="flex-1 text-[10px] font-bold tracking-[0.08em] text-[var(--color-hex-a0a0a0)]">
                                    {s.role}
                                </span>
                                <span
                                    className="text-[8px] font-semibold tracking-[0.14em]"
                                    style={{
                                        color: stc[s.state],
                                    }}
                                >
                                    {s.state}
                                </span>
                                {s.compacted > 0 && (
                                    <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-d29922)]">
                                        COMPACTED ×{s.compacted}
                                    </span>
                                )}
                                <span
                                    className="text-[9px] font-bold"
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
                                <span className="text-[8px] text-[var(--color-hex-333333)]">
                                    {(s.used / 1024).toFixed(0)}K / {s.max / 1024}K tokens
                                </span>
                                <span className="text-[8px] text-[var(--color-hex-333333)]">
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
                <div className="mb-[4px] text-[11px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                    {sel.role}
                </div>
                <div
                    className="mb-[16px] text-[8.5px] font-semibold tracking-[0.14em]"
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
                        <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {r.k}
                        </div>
                        <div className="text-[13px] font-bold text-[var(--color-hex-f2f2f2)]">
                            {r.v}
                        </div>
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
                    <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
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
                                                return "var(--color-hex-3fb950)";
                                            }
                                            if (i === 0 && sel.state === "ACTIVE") {
                                                return "var(--color-hex-e31b23)";
                                            }
                                            return "var(--color-hex-333333)";
                                        })(),
                                        background:
                                            i === 4 && sel.compacted > 0
                                                ? "var(--color-hex-3fb950)"
                                                : "transparent",
                                    }}
                                />
                                <span
                                    className="text-[8.5px] tracking-[0.06em]"
                                    style={{
                                        color: (() => {
                                            if (i === 0 && sel.state === "ACTIVE") {
                                                return "var(--color-hex-e31b23)";
                                            }
                                            if (i === 4 && sel.compacted > 0) {
                                                return "var(--color-hex-3fb950)";
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
