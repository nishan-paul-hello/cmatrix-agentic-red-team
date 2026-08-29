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
        COMPACTED: "text-warning",
        ACTIVE: "text-success",
        IDLE: "text-muted-foreground",
    };

    if (!sel) {
        return (
            <div className="flex h-full flex-1 items-center justify-center">
                <EmptyState message="LOADING COST DATA..." />
            </div>
        );
    }

    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* KPIs */}
                <KPIStrip
                    className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
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
                            return "bg-destructive";
                        }
                        if (pct > 60) {
                            return "bg-warning";
                        }
                        return "bg-success";
                    })();
                    const tc = (() => {
                        if (pct > 85) {
                            return "text-destructive";
                        }
                        if (pct > 60) {
                            return "text-warning";
                        }
                        return "text-success";
                    })();
                    const isSel = sel.id === s.id;
                    return (
                        <button
                            type="button"
                            key={s.id}
                            onClick={() => setSel(s)}
                            className={`border-border hover:bg-background focus:ring-primary mb-2 w-full cursor-pointer rounded-sm border-[1px] border-solid px-4 py-3.5 text-left focus:ring-1 focus:outline-none ${isSel ? "bg-background" : "bg-transparent"}`}
                        >
                            <div className="mb-3 flex items-center gap-3">
                                <span className="text-muted-foreground flex-1 text-xs font-bold tracking-tight">
                                    {s.role}
                                </span>
                                <span
                                    className={`text-sm font-semibold tracking-widest ${stc[s.state]}`}
                                >
                                    {s.state}
                                </span>
                                {s.compacted > 0 && (
                                    <span className="text-warning text-sm tracking-normal">
                                        COMPACTED x{s.compacted}
                                    </span>
                                )}
                                <span className={`text-base font-bold ${tc}`}>{pct}%</span>
                            </div>
                            <div className="bg-card mb-1.5 h-1 overflow-hidden rounded-sm">
                                <div
                                    className={`h-full rounded-sm ${bc}`}
                                    style={{
                                        width: `${pct}%`,
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
                        </button>
                    );
                })}
            </div>

            {/* Detail */}
            <div className="border-border lg:w-panel-sm-alt flex w-full flex-shrink-0 flex-col overflow-y-auto border-t px-3.5 py-4 lg:border-t-0 lg:border-l">
                <div className="text-foreground mb-1 text-xs font-bold tracking-normal">
                    {sel.role}
                </div>
                <div className={`mb-4 text-sm font-semibold tracking-widest ${stc[sel.state]}`}>
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
                        "-> COMPACTION TRIGGER",
                        "SUMMARY GENERATED",
                        "-> CONTEXT REPLACED",
                        "ACTIVE TASK PRESERVED",
                    ].map((node, i) => (
                        <div key={`lifecycle-${node}`} className="flex flex-col items-start">
                            {i > 0 && <div className="bg-muted ml-2 h-3 w-px" />}
                            <div className="flex items-center gap-2">
                                <div
                                    className={`h-1.5 w-1.5 shrink-0 rounded-full border border-solid ${(() => {
                                        if (sel.compacted > 0 && i === 4) {
                                            return "border-success bg-success";
                                        }
                                        if (i === 0 && sel.state === "ACTIVE") {
                                            return "border-primary bg-transparent";
                                        }
                                        return "border-border bg-transparent";
                                    })()}`}
                                />
                                <span
                                    className={`text-sm tracking-tight ${(() => {
                                        if (i === 0 && sel.state === "ACTIVE") {
                                            return "text-primary";
                                        }
                                        if (i === 4 && sel.compacted > 0) {
                                            return "text-success";
                                        }
                                        return "text-border";
                                    })()}`}
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
