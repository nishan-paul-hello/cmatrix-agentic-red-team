import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { BADGE_BG, DOT } from "@/features/specialists/components/SpecGrid";
import { getStrategyForRole } from "@/features/specialists/domain/SpecialistStrategy";
import { SpecialistRepository } from "@/repositories/SpecialistRepository";
import { type Specialist } from "@/types/domain-types";

export function Sidebar({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="border-border border-b px-4 py-4">
            <div className="text-muted-foreground mb-2 text-sm tracking-widest">{label}</div>
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
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-muted-foreground hover:text-muted-foreground mb-2.5 flex h-auto cursor-pointer justify-start p-0 text-base tracking-widest hover:bg-transparent"
                >
                    ← SPECIALISTS
                </Button>
                <div className="flex items-center gap-3">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">{spec.role}</h1>
                    <span
                        className="rounded-sm px-1.5 py-0.5 text-sm font-semibold tracking-widest"
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

            <div className="flex min-h-0 flex-1 overflow-hidden">
                {/* Main */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                    {/* Key-value block */}
                    <div className="border-border mb-5 overflow-hidden rounded-sm border-[1px] border-solid">
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
                        ].map((r) => (
                            <div key={r.k} className="border-border flex border-b">
                                <div className="text-muted-foreground border-border w-panel-2xs shrink-0 border-r px-3.5 py-2 text-sm font-semibold tracking-widest">
                                    {r.k}
                                </div>
                                <div className="text-muted-foreground flex-1 px-3.5 py-2 text-xs tracking-tighter">
                                    {r.v}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Invocation timeline */}
                    <div className="text-muted-foreground mb-3.5 text-base tracking-widest">
                        INVOCATION TIMELINE
                    </div>
                    <div className="flex flex-col gap-0">
                        {timeline.map((t, i) => {
                            let dotBorder = "border-transparent bg-transparent";
                            if (i === timeline.length - 1) {
                                dotBorder = "border-primary bg-primary";
                            } else if (i < timeline.length - 1) {
                                dotBorder = "border-border bg-border";
                            }
                            return (
                                <div key={t.event} className="flex items-start gap-4">
                                    <div className="flex flex-shrink-0 flex-col items-center">
                                        <div
                                            className={`mt-0.5 h-2 w-2 rounded-none border border-solid ${dotBorder}`}
                                        />
                                        {i < timeline.length - 1 && (
                                            <div className="bg-muted h-7 w-px" />
                                        )}
                                    </div>
                                    <div className="mb-1">
                                        <div className="mb-0.5 flex items-center gap-3">
                                            <span className="text-muted-foreground text-sm tracking-tight">
                                                {t.ts}
                                            </span>
                                            <span
                                                className={`text-base font-semibold tracking-wide ${i === timeline.length - 1 ? "text-primary" : "text-muted-foreground"}`}
                                            >
                                                {t.event}
                                            </span>
                                        </div>
                                        <div className="text-muted-foreground text-base tracking-tighter">
                                            {t.detail}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right sidebar */}
                <div className="bg-background border-border lg:w-panel-sm w-full flex-shrink-0 overflow-y-auto border-t lg:border-t-0 lg:border-l">
                    <Sidebar label="AGENT ID">
                        <span className="text-muted-foreground text-xs">{spec.id}</span>
                    </Sidebar>
                    <Sidebar label="SKILL LIBRARY">
                        {strategy.capabilities.slice(0, Math.max(1, spec.skills)).map((sk) => (
                            <div key={sk} className="mb-1 flex items-center gap-2">
                                <span className="text-primary text-sm">◈</span>
                                <span className="text-muted-foreground text-base tracking-tight">
                                    {sk}()
                                </span>
                            </div>
                        ))}
                    </Sidebar>
                    <Sidebar label="FAILURE MEMORY">
                        {spec.failures === 0 ? (
                            <span className="text-muted-foreground text-base">
                                No failures recorded
                            </span>
                        ) : (
                            Array.from(
                                { length: spec.failures },
                                (_, i) => `fail-${spec.id}-${i}`,
                            ).map((failId, i) => (
                                <div
                                    key={failId}
                                    className="text-muted-foreground mb-1 text-base leading-snug"
                                >
                                    Reflection #{i + 1}: payload timeout on FILTERED port
                                </div>
                            ))
                        )}
                    </Sidebar>
                    <Sidebar label="CONTEXT UTILIZATION">
                        <div className="border-border bg-card h-1.5 overflow-hidden rounded-sm border-[1px] border-solid">
                            <div
                                className="bg-primary h-full"
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
                        <div className="text-muted-foreground mt-1 text-sm tracking-normal">
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
