import React from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { MetricTile } from "@/components/ui/MetricTile";
import { CostRepository } from "@/features/cost/data/CostRepository";
import { type CostTimeline, type SpecialistCost } from "@/features/cost/data/fixtures/costMockData";

export default function CostUsage() {
    const [costData, setCostData] = React.useState<{
        TOTAL: number;
        CEILING: number;
        TIMELINE: CostTimeline[];
        SPECIALISTS_COST: SpecialistCost[];
    } | null>(null);

    React.useEffect(() => {
        void CostRepository.getCostData().then(setCostData);
    }, []);

    if (!costData) {
        return (
            <div className="flex h-full flex-1 items-center justify-center">
                <EmptyState message="LOADING COST DATA..." />
            </div>
        );
    }
    const { TOTAL, CEILING, TIMELINE, SPECIALISTS_COST } = costData;

    return (
        <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* KPI row */}
            <div className="mb-6 grid grid-cols-4 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                {[
                    {
                        k: "TOTAL COST",
                        v: `$${TOTAL.toFixed(4)}`,
                        sub: `${((TOTAL / CEILING) * 100).toFixed(1)}% of ceiling`,
                        red: true,
                    },
                    {
                        k: "COST CEILING",
                        v: `$${CEILING.toFixed(2)}`,
                        sub: "mission limit",
                    },
                    {
                        k: "TOTAL CALLS",
                        v: "56",
                        sub: "LLM calls",
                    },
                    {
                        k: "TOTAL TOKENS",
                        v: "462K",
                        sub: "input + output",
                    },
                ].map((m, i, a) => (
                    <MetricTile
                        key={m.k}
                        label={m.k}
                        value={m.v}
                        sub={m.sub}
                        valueColor={m.red ? "var(--color-hex-e31b23)" : "var(--color-hex-f2f2f2)"}
                        variant="dashboard"
                        borderRight={i < a.length - 1}
                    />
                ))}
            </div>

            {/* Burn rate bar */}
            <div className="mb-[24px]">
                <div className="mb-2 flex justify-between">
                    <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                        COST CEILING UTILIZATION
                    </span>
                    <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-3fb950)]">
                        {((TOTAL / CEILING) * 100).toFixed(1)}%
                    </span>
                </div>
                <div className="h-[6px] overflow-hidden rounded-[3px] bg-[var(--color-hex-1a1a1a)]">
                    <div
                        className="h-full rounded-[3px] bg-[var(--color-hex-3fb950)]"
                        style={{
                            width: `${(TOTAL / CEILING) * 100}%`,
                        }}
                    />
                </div>
                <div className="mt-1 flex justify-between">
                    <span className="text-[7.5px] text-[var(--color-hex-333333)]">
                        ${TOTAL.toFixed(4)} spent
                    </span>
                    <span className="text-[7.5px] text-[var(--color-hex-333333)]">
                        ${CEILING.toFixed(2)} ceiling
                    </span>
                </div>
            </div>

            {/* Cost by specialist */}
            <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                COST BY SPECIALIST
            </div>
            <div className="mb-[24px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                <div
                    className="flex bg-[var(--color-hex-0f0f0f)]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                    }}
                >
                    {["SPECIALIST", "MODEL", "CALLS", "INPUT", "OUTPUT", "COST", "SHARE"].map(
                        (h) => (
                            <div
                                key={h}
                                className="px-[12px] py-[5px] text-[7.5px] font-semibold tracking-[0.16em] text-[var(--color-hex-444444)]"
                                style={{
                                    flex: h === "SPECIALIST" || h === "MODEL" ? 2 : 1,
                                    textAlign:
                                        h === "COST" || h === "SHARE" || h === "CALLS"
                                            ? "right"
                                            : "left",
                                }}
                            >
                                {h}
                            </div>
                        ),
                    )}
                </div>
                {SPECIALISTS_COST.length === 0 ? (
                    <EmptyState message="NO SPECIALIST COST DATA" />
                ) : (
                    SPECIALISTS_COST.map((s, i) => (
                        <div
                            key={s.id}
                            className="flex items-center"
                            style={{
                                borderBottom:
                                    i < SPECIALISTS_COST.length - 1
                                        ? "1px solid var(--color-hex-111111)"
                                        : "none",
                                background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                            }}
                        >
                            <div
                                className="px-[12px] py-[8px] text-[10px] font-bold tracking-[0.06em] text-[var(--color-hex-e31b23)]"
                                style={{
                                    flex: 2,
                                }}
                            >
                                {s.role}
                            </div>
                            <div
                                className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]"
                                style={{
                                    flex: 2,
                                }}
                            >
                                {s.model}
                            </div>
                            <div className="flex-1 px-[12px] py-[8px] text-right text-[9px] text-[var(--color-hex-666666)]">
                                {s.calls}
                            </div>
                            <div className="flex-1 px-[12px] py-[8px] text-right text-[9px] text-[var(--color-hex-555555)]">
                                {(s.inputTok / 1000).toFixed(0)}K
                            </div>
                            <div className="flex-1 px-[12px] py-[8px] text-right text-[9px] text-[var(--color-hex-555555)]">
                                {(s.outputTok / 1000).toFixed(0)}K
                            </div>
                            <div className="flex-1 px-[12px] py-[8px] text-right text-[10px] font-bold text-[var(--color-hex-f2f2f2)]">
                                ${s.cost.toFixed(4)}
                            </div>
                            <div className="flex-1 px-[12px] py-[8px] text-right">
                                <div
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 6,
                                    }}
                                >
                                    <div className="h-[3px] w-[40px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                        <div
                                            className="h-full bg-[var(--color-hex-e31b23)]"
                                            style={{
                                                width: `${s.pct}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-[8.5px] text-[var(--color-hex-555555)]">
                                        {s.pct}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Cost timeline */}
            <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                SPEND TIMELINE
            </div>
            <div className="relative mb-[4px] h-[80px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-0a0a0a)]">
                {/* Bar chart */}
                {TIMELINE.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                        <EmptyState message="NO TIMELINE DATA" />
                    </div>
                ) : (
                    (() => {
                        const maxCost = Math.max(...TIMELINE.map((x) => x.cost));
                        return TIMELINE.map((t, i) => {
                            const barH = maxCost > 0 ? Math.round((t.cost / maxCost) * 60) : 0;
                            return (
                                <div
                                    key={`timeline-${t.ts}-${t.event}`}
                                    title={`${t.ts} · ${t.event} · $${t.cost.toFixed(4)}`}
                                    className="absolute bottom-0 cursor-default"
                                    style={{
                                        left: `${(i / TIMELINE.length) * 100}%`,
                                        width: `${(1 / TIMELINE.length) * 100 - 1}%`,
                                        height: barH > 0 ? `${barH}px` : "1px",
                                        background:
                                            barH > 0
                                                ? "var(--color-hex-e31b23)"
                                                : "var(--color-hex-292929)",
                                        borderRadius: "1px 1px 0 0",
                                    }}
                                />
                            );
                        });
                    })()
                )}
            </div>
            <div className="flex justify-between text-[7.5px] text-[var(--color-hex-333333)]">
                {TIMELINE.length > 0 ? (
                    <>
                        <span>{TIMELINE[0].ts}</span>
                        <span>{TIMELINE[TIMELINE.length - 1].ts}</span>
                    </>
                ) : null}
            </div>
        </div>
    );
}
