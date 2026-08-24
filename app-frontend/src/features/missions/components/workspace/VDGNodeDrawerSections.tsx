import React from "react";

import { EOrdIndicator } from "@/features/missions/components/workspace/EOrdIndicator";
import { Section } from "@/features/missions/components/workspace/Section";
import { useNodeDrawerContext } from "@/features/missions/components/workspace/VDGNodeDrawerContext";

export function VDGNodeDrawerIntent() {
    const { detail } = useNodeDrawerContext();
    return (
        <Section label="ATTACK INTENT">
            <p className="text-[10px] leading-[1.7] tracking-[0.04em] text-[var(--color-hex-666666)]">
                {detail.intent}
            </p>
        </Section>
    );
}

export function VDGNodeDrawerMetrics() {
    const { node } = useNodeDrawerContext();
    return (
        <Section label="SCORES & METRICS">
            <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
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
                ].map((r, i) => (
                    <div
                        key={r.k}
                        className="px-[10px] py-[7px]"
                        style={{
                            borderRight: i % 2 === 0 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            borderBottom: i < 6 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            background:
                                i % 2 === 0 ? "var(--color-hex-0d0d0d)" : "var(--color-hex-0b0b0b)",
                        }}
                    >
                        <div className="mb-[2px] text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                            {r.k}
                        </div>
                        <div
                            className="text-[12px] font-bold"
                            style={{
                                color: r.red
                                    ? "var(--color-hex-e31b23)"
                                    : "var(--color-hex-a0a0a0)",
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
                    <span className="text-[10px] tracking-[0.08em] text-[var(--color-hex-333333)]">
                        None
                    </span>
                ) : (
                    detail.prerequisites.map((p) => (
                        <div key={p.id} className="flex items-center gap-2">
                            <span
                                className="text-[10px]"
                                style={{
                                    color: p.done
                                        ? "var(--color-hex-3fb950)"
                                        : "var(--color-hex-444444)",
                                }}
                            >
                                {p.done ? "✓" : "○"}
                            </span>
                            <span
                                className="text-[10px] tracking-[0.08em]"
                                style={{
                                    color: p.done
                                        ? "var(--color-hex-a0a0a0)"
                                        : "var(--color-hex-444444)",
                                }}
                            >
                                {p.id}
                            </span>
                            <span
                                className="ml-auto text-[8px] tracking-[0.12em]"
                                style={{
                                    color: p.done
                                        ? "var(--color-hex-3fb950)"
                                        : "var(--color-hex-333333)",
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
                    <span className="text-[10px] tracking-[0.08em] text-[var(--color-hex-333333)]">
                        None
                    </span>
                ) : (
                    detail.enables.map((id) => (
                        <div key={id} className="flex items-center gap-2">
                            <span className="text-[9px] text-[var(--color-hex-e31b23)]">→</span>
                            <span className="text-[10px] tracking-[0.08em] text-[var(--color-hex-666666)]">
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
            <div className="flex flex-col gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                {detail.facts.length === 0 ? (
                    <div className="px-[10px] py-[6px] text-[9px] text-[var(--color-hex-333333)]">
                        No facts available
                    </div>
                ) : (
                    detail.facts.map((r, i, a) => (
                        <div
                            key={r.k}
                            className="flex gap-3 bg-[var(--color-hex-0b0b0b)] px-[10px] py-[6px]"
                            style={{
                                borderBottom:
                                    i < a.length - 1 ? "1px solid var(--color-hex-141414)" : "none",
                            }}
                        >
                            <span className="min-w-[72px] shrink-0 text-[8.5px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                                {r.k}
                            </span>
                            <span className="text-[9px] leading-[1.4] tracking-[0.04em] text-[var(--color-hex-666666)]">
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
                        color: "var(--color-hex-444444)",
                    },
                    {
                        ts: "06:18:31",
                        event: "ELIGIBLE",
                        color: "var(--color-hex-e31b23)",
                    },
                    {
                        ts: "06:28:47",
                        event: "IN_PROGRESS",
                        color: "var(--color-hex-ff2a32)",
                    },
                    {
                        ts: "06:29:03",
                        event: "RETRY 1",
                        color: "var(--color-hex-d29922)",
                    },
                    {
                        ts: "06:30:58",
                        event: "IN_PROGRESS",
                        color: "var(--color-hex-ff2a32)",
                    },
                ].map((t, i, a) => (
                    <div key={t.ts} className="flex items-start gap-3">
                        <div className="flex shrink-0 flex-col items-center">
                            <div
                                className="mt-[2px] h-[6px] w-[6px]"
                                style={{
                                    borderRadius: "50%",
                                    border: `1px solid ${t.color}`,
                                    background: i === a.length - 1 ? t.color : "transparent",
                                }}
                            />
                            {i < a.length - 1 && (
                                <div className="h-[18px] w-[1px] bg-[var(--color-hex-1e1e1e)]" />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[8.5px] tracking-[0.06em] text-[var(--color-hex-333333)]">
                                {t.ts}
                            </span>
                            <span
                                className="text-[9px] font-semibold tracking-[0.12em]"
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
