import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { KPIStrip } from "@/components/ui/KPIStrip";
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
        COMPACTED: "var(--warning)",
        ACTIVE: "var(--success)",
        IDLE: "var(--muted-foreground)",
    };

    if (!sel) {
        return (
            <div className="flex h-full flex-1 items-center justify-center">
                <EmptyState message="LOADING COST DATA..." />
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* KPIs */}
                <KPIStrip
                    className="mb-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    items={[
                        { k: "TOTAL CONTEXT", v: "346K", sub: "across specialists" },
                        { k: "COMPACTION EVENTS", v: "3", sub: "context saves" },
                        { k: "TOKENS SAVED", v: "184K", sub: "via compaction" },
                    ]}
                />

                {/* Context bars */}
                {entries.map((s) => {
                    const pct = Math.round((s.used / s.max) * 100);
                    const bc = (() => {
                        if (pct > 85) {
                            return "var(--destructive)";
                        }
                        if (pct > 60) {
                            return "var(--warning)";
                        }
                        return "var(--success)";
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
                            className="border-border mb-2 cursor-pointer rounded-sm border-[1px] border-solid px-4 py-3.5"
                            style={{
                                background: isSel ? "var(--background)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--background)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background = isSel
                                    ? "var(--background)"
                                    : "transparent")
                            }
                        >
                            <div className="mb-3 flex items-center gap-3">
                                <span className="text-muted-foreground flex-1 text-xs font-bold tracking-tight">
                                    {s.role}
                                </span>
                                <span
                                    className="text-sm font-semibold tracking-widest"
                                    style={{
                                        color: stc[s.state],
                                    }}
                                >
                                    {s.state}
                                </span>
                                {s.compacted > 0 && (
                                    <span className="text-warning text-sm tracking-normal">
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
                            <div className="bg-card mb-1.5 h-1 overflow-hidden rounded-sm">
                                <div
                                    className="h-full rounded-sm"
                                    style={{
                                        width: `${pct}%`,
                                        background: bc,
                                    }}
                                />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground text-sm">
                                    {(s.used / 1024).toFixed(0)}K / {s.max / 1024}K tokens
                                </span>
                                <span className="text-muted-foreground text-sm">
                                    ${s.cost.toFixed(4)} this session
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Detail */}
            <div className="border-border flex w-[260px] flex-shrink-0 flex-col overflow-y-auto border-l px-3.5 py-4">
                <div className="text-foreground mb-1 text-xs font-bold tracking-normal">
                    {sel.role}
                </div>
                <div
                    className="mb-4 text-sm font-semibold tracking-widest"
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
                    <div key={r.k} className="mb-3">
                        <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                            {r.k}
                        </div>
                        <div className="text-foreground text-sm font-bold">{r.v}</div>
                    </div>
                ))}
                {/* Context state diagram */}
                <div className="border-border mt-2 border-t">
                    <div className="text-muted-foreground mb-3 text-sm tracking-widest">
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
                            {i > 0 && <div className="bg-muted ml-2 h-3 w-px" />}
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <div
                                    className="h-1.5 w-1.5 shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                        border: "1px solid",
                                        borderColor: (() => {
                                            if (sel.compacted > 0 && i === 4) {
                                                return "var(--success)";
                                            }
                                            if (i === 0 && sel.state === "ACTIVE") {
                                                return "var(--primary)";
                                            }
                                            return "var(--border)";
                                        })(),
                                        background:
                                            i === 4 && sel.compacted > 0
                                                ? "var(--success)"
                                                : "transparent",
                                    }}
                                />
                                <span
                                    className="text-sm tracking-tight"
                                    style={{
                                        color: (() => {
                                            if (i === 0 && sel.state === "ACTIVE") {
                                                return "var(--primary)";
                                            }
                                            if (i === 4 && sel.compacted > 0) {
                                                return "var(--success)";
                                            }
                                            return "var(--border)";
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
