import React from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { KPIStrip } from "@/components/ui/KPIStrip";
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
            <KPIStrip
                className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
                items={[
                    {
                        k: "TOTAL COST",
                        v: `$${TOTAL.toFixed(4)}`,
                        sub: `${((TOTAL / CEILING) * 100).toFixed(1)}% of ceiling`,
                        c: "text-primary",
                    },
                    { k: "COST CEILING", v: `$${CEILING.toFixed(2)}`, sub: "mission limit" },
                    { k: "TOTAL CALLS", v: "56", sub: "LLM calls" },
                    { k: "TOTAL TOKENS", v: "462K", sub: "input + output" },
                ]}
            />

            {/* Burn rate bar */}
            <div className="mb-6">
                <div className="mb-2 flex justify-between">
                    <span className="text-muted-foreground text-sm tracking-widest">
                        COST CEILING UTILIZATION
                    </span>
                    <span className="text-success text-sm tracking-normal">
                        {((TOTAL / CEILING) * 100).toFixed(1)}%
                    </span>
                </div>
                <div className="bg-card h-1.5 overflow-hidden rounded-xs">
                    <div
                        className="bg-success h-full rounded-xs"
                        style={{
                            width: `${(TOTAL / CEILING) * 100}%`,
                        }}
                    />
                </div>
                <div className="mt-1 flex justify-between">
                    <span className="text-muted-foreground text-xs">${TOTAL.toFixed(4)} spent</span>
                    <span className="text-muted-foreground text-xs">
                        ${CEILING.toFixed(2)} ceiling
                    </span>
                </div>
            </div>

            {/* Cost by specialist */}
            <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                COST BY SPECIALIST
            </div>
            <div className="border-border mb-6 overflow-x-auto rounded-sm border-[1px] border-solid">
                <div className="bg-card border-border flex w-full min-w-fit border-b">
                    {["SPECIALIST", "MODEL", "CALLS", "INPUT", "OUTPUT", "COST", "SHARE"].map(
                        (h) => (
                            <div
                                key={h}
                                className={`text-muted-foreground px-3 py-1 text-xs font-semibold tracking-widest ${h === "SPECIALIST" || h === "MODEL" ? "flex-[2]" : "flex-1"} ${h === "COST" || h === "SHARE" || h === "CALLS" ? "text-right" : "text-left"}`}
                            >
                                {h}
                            </div>
                        ),
                    )}
                </div>
                {SPECIALISTS_COST.length === 0 ? (
                    <EmptyState message="NO SPECIALIST COST DATA" />
                ) : (
                    SPECIALISTS_COST.map((s) => (
                        <div
                            key={s.id}
                            className="border-border flex w-full min-w-fit items-center border-b"
                        >
                            <div className="text-primary cell-truncate flex-[2] px-3 py-2 text-xs font-bold tracking-tight">
                                {s.role}
                            </div>
                            <div className="text-muted-foreground cell-truncate flex-[2] px-3 py-2 text-base">
                                {s.model}
                            </div>
                            <div className="text-muted-foreground cell-truncate flex-1 px-3 py-2 text-right text-base">
                                {s.calls}
                            </div>
                            <div className="text-muted-foreground cell-truncate flex-1 px-3 py-2 text-right text-base">
                                {(s.inputTok / 1000).toFixed(0)}K
                            </div>
                            <div className="text-muted-foreground cell-truncate flex-1 px-3 py-2 text-right text-base">
                                {(s.outputTok / 1000).toFixed(0)}K
                            </div>
                            <div className="text-foreground cell-truncate flex-1 px-3 py-2 text-right text-xs font-bold">
                                ${s.cost.toFixed(4)}
                            </div>
                            <div className="flex-1 px-3 py-2 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                    <div className="bg-card h-0.5 w-10 overflow-hidden rounded-sm">
                                        <div
                                            className="bg-primary h-full"
                                            style={{
                                                width: `${s.pct}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-muted-foreground text-sm">{s.pct}%</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Cost timeline */}
            <div className="text-muted-foreground mb-3 text-sm tracking-widest">SPEND TIMELINE</div>
            <div className="border-border bg-background relative mb-1 h-[80px] overflow-hidden rounded-sm border-[1px] border-solid">
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
                                    className={`absolute bottom-0 cursor-default rounded-t-[1px] ${barH > 0 ? "bg-primary" : "bg-border"}`}
                                    style={{
                                        left: `${(i / TIMELINE.length) * 100}%`,
                                        width: `${(1 / TIMELINE.length) * 100 - 1}%`,
                                        height: barH > 0 ? `${barH}px` : "1px",
                                    }}
                                />
                            );
                        });
                    })()
                )}
            </div>
            <div className="text-muted-foreground flex justify-between text-xs">
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
