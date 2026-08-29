import React from "react";

import { EOrdIndicator } from "@/features/missions/components/workspace/EOrdIndicator";
import { Section } from "@/features/missions/components/workspace/Section";
import { useNodeDrawerContext } from "@/features/missions/components/workspace/VDGNodeDrawerContext";

export function VDGNodeDrawerIntent() {
    const { detail } = useNodeDrawerContext();
    return (
        <Section label="ATTACK INTENT">
            <p className="text-muted-foreground text-xs leading-relaxed tracking-tighter">
                {detail.intent}
            </p>
        </Section>
    );
}

export function VDGNodeDrawerMetrics() {
    const { node } = useNodeDrawerContext();
    return (
        <Section label="SCORES & METRICS">
            <div className="border-border grid grid-cols-1 gap-0 overflow-hidden rounded-sm border-[1px] border-solid sm:grid-cols-2">
                {[
                    {
                        k: "UCB SCORE",
                        v: node.ucb > 0 ? node.ucb.toFixed(3) : "—",
                        red: true,
                    },
                    {
                        k: "PATH SCORE",
                        v: "0.612",
                        red: false,
                    },
                    {
                        k: "PROMISE φ",
                        v: "0.81",
                        red: false,
                    },
                    {
                        k: "DIFFICULTY δ",
                        v: "0.32",
                        red: false,
                    },
                    {
                        k: "E_ord",
                        v: `${node.eord} / 5`,
                        red: true,
                    },
                    {
                        k: "EPSS PRIOR",
                        v: "0.42",
                        red: false,
                    },
                    {
                        k: "RETRY",
                        v: "1 / 3",
                        red: false,
                    },
                    {
                        k: "COST EST.",
                        v: "$0.18",
                        red: false,
                    },
                ].map((r) => (
                    <div key={r.k} className="border-border border-b px-2.5 py-1.5">
                        <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                            {r.k}
                        </div>
                        <div
                            className="text-xs font-bold"
                            style={{
                                color: r.red ? "var(--primary)" : "var(--muted-foreground)",
                            }}
                        >
                            {r.v}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}

export function VDGNodeDrawerEvidence() {
    const { node } = useNodeDrawerContext();
    return (
        <Section label="EVIDENCE LEVEL">
            <EOrdIndicator value={node.eord} />
        </Section>
    );
}

export function VDGNodeDrawerPrerequisites() {
    const { detail } = useNodeDrawerContext();
    return (
        <Section label="PREREQUISITES">
            <div className="flex flex-col gap-1.5">
                {detail.prerequisites.length === 0 ? (
                    <span className="text-muted-foreground text-xs tracking-tight">None</span>
                ) : (
                    detail.prerequisites.map((p) => (
                        <div key={p.id} className="flex items-center gap-2">
                            <span
                                className="text-xs"
                                style={{
                                    color: p.done ? "var(--success)" : "var(--muted-foreground)",
                                }}
                            >
                                {p.done ? "✓" : "○"}
                            </span>
                            <span
                                className="text-xs tracking-tight"
                                style={{
                                    color: p.done
                                        ? "var(--foreground)"
                                        : "var(--muted-foreground)",
                                }}
                            >
                                {p.id}
                            </span>
                            <span
                                className="ml-auto text-sm tracking-wide"
                                style={{
                                    color: p.done ? "var(--success)" : "var(--border)",
                                }}
                            >
                                {p.done ? "SATISFIED" : "PENDING"}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </Section>
    );
}

export function VDGNodeDrawerEnables() {
    const { detail } = useNodeDrawerContext();
    return (
        <Section label="ENABLES">
            <div className="flex flex-col gap-1.5">
                {detail.enables.length === 0 ? (
                    <span className="text-muted-foreground text-xs tracking-tight">None</span>
                ) : (
                    detail.enables.map((id) => (
                        <div key={id} className="flex items-center gap-2">
                            <span className="text-primary text-base">→</span>
                            <span className="text-muted-foreground text-xs tracking-tight">
                                {id}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </Section>
    );
}

export function VDGNodeDrawerFacts() {
    const { detail } = useNodeDrawerContext();
    return (
        <Section label="SOURCE ENVIRONMENT FACTS">
            <div className="border-border flex flex-col gap-0 overflow-hidden rounded-sm border-[1px] border-solid">
                {detail.facts.length === 0 ? (
                    <div className="text-muted-foreground px-2.5 py-1.5 text-base">
                        No facts available
                    </div>
                ) : (
                    detail.facts.map((r) => (
                        <div
                            key={r.k}
                            className="bg-background border-border flex gap-3 border-b px-2.5 py-1.5"
                        >
                            <span className="text-muted-foreground min-w-[72px] shrink-0 text-sm tracking-widest">
                                {r.k}
                            </span>
                            <span className="text-muted-foreground text-base leading-tight tracking-tighter">
                                {r.v}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </Section>
    );
}

export function VDGNodeDrawerLifecycle() {
    return (
        <Section label="NODE LIFECYCLE" last>
            <div className="flex flex-col gap-0">
                {[
                    {
                        ts: "06:12:04",
                        event: "CANDIDATE",
                        color: "var(--muted-foreground)",
                    },
                    {
                        ts: "06:18:31",
                        event: "ELIGIBLE",
                        color: "var(--primary)",
                    },
                    {
                        ts: "06:28:47",
                        event: "IN_PROGRESS",
                        color: "var(--destructive)",
                    },
                    {
                        ts: "06:29:03",
                        event: "RETRY 1",
                        color: "var(--warning)",
                    },
                    {
                        ts: "06:30:58",
                        event: "IN_PROGRESS",
                        color: "var(--destructive)",
                    },
                ].map((t, i, a) => (
                    <div key={t.ts} className="flex items-start gap-3">
                        <div className="flex shrink-0 flex-col items-center">
                            <div
                                className="mt-0.5 h-1.5 w-1.5 rounded-full"
                                style={{
                                    border: `1px solid ${t.color}`,
                                    background: i === a.length - 1 ? t.color : "transparent",
                                }}
                            />
                            {i < a.length - 1 && <div className="bg-muted h-4 w-px" />}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-sm tracking-tight">
                                {t.ts}
                            </span>
                            <span
                                className="text-base font-semibold tracking-wide"
                                style={{
                                    color: t.color,
                                }}
                            >
                                {t.event}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}
