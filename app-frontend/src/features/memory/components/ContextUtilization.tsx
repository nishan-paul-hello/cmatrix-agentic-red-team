import { useEffect, useState } from "react";

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
        COMPACTED: "var(--color-hex-d29922)",
        ACTIVE: "var(--color-hex-3fb950)",
        IDLE: "var(--color-hex-444444)",
    };
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-6 grid grid-cols-3 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                    {[
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
                    ].map((m, i, a) => (
                        <div
                            key={m.k}
                            className="bg-[var(--color-hex-0d0d0d)] px-[18px] py-[14px]"
                            style={{
                                borderRight:
                                    i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            }}
                        >
                            <div className="mb-[6px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                {m.k}
                            </div>
                            <div className="mb-[2px] text-[22px] font-bold text-[var(--color-hex-f2f2f2)]">
                                {m.v}
                            </div>
                            <div className="text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                {m.sub}
                            </div>
                        </div>
                    ))}
                </div>
                {CTX_SPECS.map((s) => {
                    const pct = Math.round((s.used / s.max) * 100);
                    const barColor = (() => {
                        if (pct > 85) {
                            return "var(--color-hex-ff2a32)";
                        }
                        if (pct > 60) {
                            return "var(--color-hex-d29922)";
                        }
                        return "var(--color-hex-3fb950)";
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
                            className="mb-[8px] cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] px-[16px] py-[12px]"
                            style={{
                                background:
                                    sel.id === s.id ? "var(--color-hex-0d0d0d)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    sel.id === s.id ? "var(--color-hex-0d0d0d)" : "transparent")
                            }
                        >
                            <div className="mb-3 flex items-center gap-3">
                                <span className="text-[10px] font-bold tracking-[0.08em] text-[var(--color-hex-a0a0a0)]">
                                    {s.role}
                                </span>
                                <span
                                    className="ml-auto text-[8px] font-semibold tracking-[0.14em]"
                                    style={{
                                        color: stc[s.state],
                                    }}
                                >
                                    {s.state}
                                </span>
                                <span className="text-[8.5px] text-[var(--color-hex-555555)]">
                                    {pct}%
                                </span>
                            </div>
                            <div className="h-[4px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full rounded-[2px]"
                                    style={{
                                        width: `${pct}%`,
                                        background: barColor,
                                        transition: "width 0.3s",
                                    }}
                                />
                            </div>
                            <div className="mt-2 flex items-center gap-4">
                                <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                    {(s.used / 1024).toFixed(0)}K / {s.max / 1024}K tokens
                                </span>
                                {s.compacted > 0 && (
                                    <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-d29922)]">
                                        COMPACTED ×{s.compacted}
                                    </span>
                                )}
                                <span className="ml-auto text-[8px] text-[var(--color-hex-333333)]">
                                    THIS SESSION: {(s.tokens / 1000).toFixed(1)}K
                                </span>
                            </div>
                        </div>
                    );
                })}

                <div className="mt-8 mb-4 border-b border-solid border-[var(--color-hex-1e1e1e)] pb-2 text-[10px] tracking-[0.16em] text-[var(--color-hex-a0a0a0)]">
                    MEMORY TIERS (BLACKBOARD)
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] p-4">
                        <div className="mb-2 text-[8.5px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                            SHORT_TERM
                        </div>
                        <div className="text-[14px] font-bold text-[var(--color-hex-f2f2f2)]">
                            {shortTerm.length} Contexts Active
                        </div>
                    </div>
                    <div className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] p-4">
                        <div className="mb-2 text-[8.5px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                            LONG_TERM
                        </div>
                        <div className="text-[14px] font-bold text-[var(--color-hex-f2f2f2)]">
                            {longTermSkills.length} Skills · {longTermFailures.length} Failures
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="flex w-[280px] flex-shrink-0 flex-col overflow-y-auto p-[16px]"
                style={{
                    borderLeft: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[4px] text-[11px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                    {sel.role}
                </div>
                <div className="mb-[16px] text-[8.5px] tracking-[0.14em] text-[var(--color-hex-444444)]">
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
                    <div key={r.k} className="mb-[12px]">
                        <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {r.k}
                        </div>
                        <div className="text-[13px] font-bold text-[var(--color-hex-f2f2f2)]">
                            {r.v}
                        </div>
                    </div>
                ))}
                {sel.compacted > 0 && (
                    <div className="mt-[8px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-d2992244)] bg-[var(--color-hex-110e00)] px-[12px] py-[10px]">
                        <div className="mb-[4px] text-[8px] tracking-[0.16em] text-[var(--color-hex-d29922)]">
                            COMPACTION NOTE
                        </div>
                        <div className="text-[9px] leading-[1.7] text-[var(--color-hex-666666)]">
                            Context was compacted {sel.compacted}× to preserve working memory.
                            Historical tool outputs summarized. Active state preserved.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
