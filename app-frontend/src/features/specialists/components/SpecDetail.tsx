import React, { useEffect, useState } from "react";

import { BADGE_BG, DOT } from "@/features/specialists/components/SpecGrid";
import { getStrategyForRole } from "@/features/specialists/domain/SpecialistStrategy";
import { SpecialistRepository } from "@/repositories/SpecialistRepository";
import { type Specialist } from "@/types/domain-types";

export function Sidebar({
    label,
    children,
    last,
}: {
    label: string;
    children: React.ReactNode;
    last?: boolean;
}) {
    return (
        <div
            className="px-4 py-4"
            style={{
                borderBottom: last ? "none" : "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div className="mb-[8px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                {label}
            </div>
            {children}
        </div>
    );
}

export function SpecDetail({ spec, onBack }: { spec: Specialist; onBack: () => void }) {
    const dot = DOT[spec.status];
    const strategy = getStrategyForRole(spec.role);
    const [timeline, setTimeline] = useState<{ ts: string; event: string; detail: string }[]>([]);

    useEffect(() => {
        void SpecialistRepository.getTimeline().then(setTimeline);
    }, []);

    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <button
                    onClick={onBack}
                    className="font-inherit mb-[10px] cursor-pointer border-none bg-[transparent] p-[0px] text-[9px] tracking-[0.14em] text-[var(--color-hex-666666)] hover:text-[var(--color-hex-a0a0a0)]"
                >
                    ← SPECIALISTS
                </button>
                <div className="flex items-center gap-3">
                    <h1 className="text-[18px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        {spec.role}
                    </h1>
                    <span
                        className="rounded-[2px] px-[7px] py-[2px] text-[8.5px] font-semibold tracking-[0.14em]"
                        style={{
                            color: dot,
                            background: BADGE_BG[spec.status],
                            border: `1px solid ${dot}44`,
                        }}
                    >
                        {spec.status}
                    </span>
                </div>
            </div>

            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* Main */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Key-value block */}
                    <div className="mb-[20px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                        {[
                            {
                                k: "CURRENT TASK",
                                v: spec.task,
                            },
                            {
                                k: "ASSIGNED NODE",
                                v: spec.node,
                            },
                            {
                                k: "CONTEXT",
                                v: spec.context,
                            },
                            {
                                k: "EL SNAPSHOT",
                                v: `${spec.evidence} facts`,
                            },
                            {
                                k: "FAILURE MEMORY",
                                v: `${spec.failures} relevant reflections`,
                            },
                            {
                                k: "SKILL LIBRARY",
                                v: `${spec.skills} matching skills`,
                            },
                        ].map((r, i, a) => (
                            <div
                                key={r.k}
                                className="flex"
                                style={{
                                    borderBottom:
                                        i < a.length - 1
                                            ? "1px solid var(--color-hex-141414)"
                                            : "none",
                                    background:
                                        i % 2
                                            ? "var(--color-hex-0b0b0b)"
                                            : "var(--color-hex-0d0d0d)",
                                }}
                            >
                                <div
                                    className="w-[140px] shrink-0 px-[14px] py-[9px] text-[8.5px] font-semibold tracking-[0.18em] text-[var(--color-hex-444444)]"
                                    style={{
                                        borderRight: "1px solid var(--color-hex-141414)",
                                    }}
                                >
                                    {r.k}
                                </div>
                                <div className="flex-1 px-[14px] py-[9px] text-[10px] tracking-[0.04em] text-[var(--color-hex-888888)]">
                                    {r.v}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Invocation timeline */}
                    <div className="mb-[14px] text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        INVOCATION TIMELINE
                    </div>
                    <div
                        className="flex flex-col"
                        style={{
                            gap: 0,
                        }}
                    >
                        {timeline.map((t, i) => (
                            <div key={t.event} className="flex items-start gap-4">
                                <div className="flex flex-shrink-0 flex-col items-center">
                                    <div
                                        className="mt-[2px] h-[8px] w-[8px] rounded-[1px]"
                                        style={{
                                            border: `1px solid ${i === timeline.length - 1 ? "var(--color-hex-e31b23)" : "var(--color-hex-333333)"}`,
                                            background: (() => {
                                                if (i === timeline.length - 1) {
                                                    return "var(--color-hex-e31b23)";
                                                }
                                                if (i < timeline.length - 1) {
                                                    return "var(--color-hex-1a1a1a)";
                                                }
                                                return "transparent";
                                            })(),
                                        }}
                                    />
                                    {i < timeline.length - 1 && (
                                        <div className="h-[28px] w-[1px] bg-[var(--color-hex-1e1e1e)]" />
                                    )}
                                </div>
                                <div
                                    className="mb-[4px]"
                                    style={{
                                        paddingBottom: i < timeline.length - 1 ? 0 : 0,
                                    }}
                                >
                                    <div className="mb-0.5 flex items-center gap-3">
                                        <span className="text-[8.5px] tracking-[0.06em] text-[var(--color-hex-333333)]">
                                            {t.ts}
                                        </span>
                                        <span
                                            className="text-[9.5px] font-semibold tracking-[0.12em]"
                                            style={{
                                                color:
                                                    i === timeline.length - 1
                                                        ? "var(--color-hex-e31b23)"
                                                        : "var(--color-hex-666666)",
                                            }}
                                        >
                                            {t.event}
                                        </span>
                                    </div>
                                    <div className="text-[9px] tracking-[0.04em] text-[var(--color-hex-444444)]">
                                        {t.detail}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right sidebar */}
                <div
                    className="w-[240px] flex-shrink-0 overflow-y-auto bg-[var(--color-hex-0b0b0b)]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <Sidebar label="AGENT ID">
                        <span className="text-[10px] text-[var(--color-hex-666666)]">
                            {spec.id}
                        </span>
                    </Sidebar>
                    <Sidebar label="SKILL LIBRARY">
                        {strategy.capabilities.slice(0, Math.max(1, spec.skills)).map((sk) => (
                            <div key={sk} className="mb-1 flex items-center gap-2">
                                <span className="text-[8px] text-[var(--color-hex-e31b23)]">◈</span>
                                <span className="text-[9px] tracking-[0.06em] text-[var(--color-hex-555555)]">
                                    {sk}()
                                </span>
                            </div>
                        ))}
                    </Sidebar>
                    <Sidebar label="FAILURE MEMORY">
                        {spec.failures === 0 ? (
                            <span className="text-[9px] text-[var(--color-hex-333333)]">
                                No failures recorded
                            </span>
                        ) : (
                            Array.from(
                                { length: spec.failures },
                                (_, i) => `fail-${spec.id}-${i}`,
                            ).map((failId, i) => (
                                <div
                                    key={failId}
                                    className="mb-[4px] text-[9px] leading-[1.5] text-[var(--color-hex-555555)]"
                                >
                                    Reflection #{i + 1}: payload timeout on FILTERED port
                                </div>
                            ))
                        )}
                    </Sidebar>
                    <Sidebar label="CONTEXT UTILIZATION" last>
                        <div className="h-[6px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)]">
                            <div
                                className="h-full bg-[var(--color-hex-e31b23)]"
                                style={{
                                    width: `${(() => {
                                        if (spec.context === "FRESH") {
                                            return 12;
                                        }
                                        if (spec.context === "COMPACTED") {
                                            return 31;
                                        }
                                        return 0;
                                    })()}%`,
                                }}
                            />
                        </div>
                        <div className="mt-[4px] text-[8px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                            {(() => {
                                if (spec.context === "FRESH") {
                                    return "12%";
                                }
                                if (spec.context === "COMPACTED") {
                                    return "31% (post-compaction)";
                                }
                                return "—";
                            })()}
                        </div>
                    </Sidebar>
                </div>
            </div>
        </div>
    );
}
