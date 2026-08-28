import { useEffect, useState } from "react";

import { KPIStrip } from "@/components/ui/KPIStrip";
import { MemoryRepository } from "@/features/memory/data/MemoryRepository";
import { type FailureRecord, type SkillRecord } from "@/features/memory/data/mockData";
import { type ContextRecord } from "@/features/memory/domain/Blackboard";
import { useServices } from "@/lib/services-context";
import { type CtxSpecEntry } from "@/types/domain-types";

export default function ContextUtilization() {
    const { blackboard } = useServices();
    const [CTX_SPECS, setData] = useState<CtxSpecEntry[]>([]);
    useEffect(() => {
        void new MemoryRepository()
            .fetchAll<CtxSpecEntry>({ collection: "CTX_SPECS", limit: 1000 })
            .then(setData);
    }, []);

    const [selId, setSelId] = useState<string | null>(null);
    if (CTX_SPECS.length === 0) {
        return null;
    }
    const sel = (selId
        ? CTX_SPECS.find((s) => s.id === selId)
        : (CTX_SPECS[2] ?? CTX_SPECS[0])) as unknown as CtxSpecEntry;

    const shortTerm: (ContextRecord & { tier: string })[] = blackboard.readAllContexts();
    const longTermSkills: (SkillRecord & { tier: string })[] = blackboard.readSkills();
    const longTermFailures: (FailureRecord & { tier: string })[] = blackboard.readFailures();
    const stc: Record<string, string> = {
        COMPACTED: "var(--warning)",
        ACTIVE: "var(--success)",
        IDLE: "var(--muted-foreground)",
    };
    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <KPIStrip
                    className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    items={[
                        {
                            k: "TOTAL CONTEXT USED",
                            v: "346K",
                            sub: "across all specialists",
                        },
                        {
                            k: "COMPACTION EVENTS",
                            v: "3",
                            sub: "context refreshes",
                        },
                        {
                            k: "TOKENS SAVED",
                            v: "184K",
                            sub: "via compaction",
                        },
                    ]}
                />
                {CTX_SPECS.map((s) => {
                    const pct = Math.round((s.used / s.max) * 100);
                    const barColor = (() => {
                        if (pct > 85) {
                            return "var(--destructive)";
                        }
                        if (pct > 60) {
                            return "var(--warning)";
                        }
                        return "var(--success)";
                    })();
                    return (
                        <div
                            key={s.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSelId(s.id)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setSelId(s.id);
                                }
                            }}
                            className="border-border mb-2 cursor-pointer rounded-sm border-[1px] border-solid px-4 py-3"
                            style={{
                                background: sel.id === s.id ? "var(--background)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--background)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    sel.id === s.id ? "var(--background)" : "transparent")
                            }
                        >
                            <div className="mb-3 flex items-center gap-3">
                                <span className="text-muted-foreground text-xs font-bold tracking-tight">
                                    {s.role}
                                </span>
                                <span
                                    className="ml-auto text-sm font-semibold tracking-widest"
                                    style={{
                                        color: stc[s.state],
                                    }}
                                >
                                    {s.state}
                                </span>
                                <span className="text-muted-foreground text-sm">{pct}%</span>
                            </div>
                            <div className="bg-card h-1 overflow-hidden rounded-sm">
                                <div
                                    className="h-full rounded-sm"
                                    style={{
                                        width: `${pct}%`,
                                        background: barColor,
                                        transition: "width 0.3s",
                                    }}
                                />
                            </div>
                            <div className="mt-2 flex items-center gap-4">
                                <span className="text-muted-foreground text-sm tracking-normal">
                                    {(s.used / 1024).toFixed(0)}K / {s.max / 1024}K tokens
                                </span>
                                {s.compacted > 0 && (
                                    <span className="text-warning text-sm tracking-normal">
                                        COMPACTED ×{s.compacted}
                                    </span>
                                )}
                                <span className="text-muted-foreground ml-auto text-sm">
                                    THIS SESSION: {(s.tokens / 1000).toFixed(1)}K
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div className="border-border text-muted-foreground mt-8 mb-4 border-b border-solid pb-2 text-xs tracking-widest">
                    MEMORY TIERS (BLACKBOARD)
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="border-border bg-background rounded-sm border-[1px] border-solid p-4">
                        <div className="text-muted-foreground mb-2 text-sm tracking-widest">
                            SHORT_TERM
                        </div>
                        <div className="text-foreground text-sm font-bold">
                            {shortTerm.length} Contexts Active
                        </div>
                    </div>
                    <div className="border-border bg-background rounded-sm border-[1px] border-solid p-4">
                        <div className="text-muted-foreground mb-2 text-sm tracking-widest">
                            LONG_TERM
                        </div>
                        <div className="text-foreground text-sm font-bold">
                            {longTermSkills.length} Skills · {longTermFailures.length} Failures
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-panel-sm border-border flex flex-shrink-0 flex-col overflow-y-auto border-l p-4">
                <div className="text-foreground mb-1 text-xs font-bold tracking-normal">
                    {sel.role}
                </div>
                <div className="text-muted-foreground mb-4 text-sm tracking-widest">
                    {sel.id} · {sel.state}
                </div>
                {[
                    {
                        k: "TOKENS USED",
                        v: `${(sel.used / 1024).toFixed(0)}K`,
                    },
                    {
                        k: "CONTEXT LIMIT",
                        v: `${sel.max / 1024}K`,
                    },
                    {
                        k: "UTILIZATION",
                        v: `${Math.round((sel.used / sel.max) * 100)}%`,
                    },
                    {
                        k: "COMPACTION EVENTS",
                        v: String(sel.compacted),
                    },
                    {
                        k: "SESSION TOKENS",
                        v: `${(sel.tokens / 1000).toFixed(1)}K`,
                    },
                ].map((r) => (
                    <div key={r.k} className="mb-3">
                        <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                            {r.k}
                        </div>
                        <div className="text-foreground text-sm font-bold">{r.v}</div>
                    </div>
                ))}
                {sel.compacted > 0 && (
                    <div className="border-border bg-muted mt-2 rounded-sm border-[1px] border-solid px-3 py-2.5">
                        <div className="text-warning mb-1 text-sm tracking-widest">
                            COMPACTION NOTE
                        </div>
                        <div className="text-muted-foreground text-base leading-relaxed">
                            Context was compacted {sel.compacted}× to preserve working memory.
                            Historical tool outputs summarized. Active state preserved.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
