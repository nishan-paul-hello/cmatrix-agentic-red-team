import { useEffect, useState } from "react";

import { EmptyState } from "@/components/ui/EmptyState";
import { CostRepository } from "@/features/cost/data/CostRepository";
import { type ModelRow } from "@/features/cost/data/fixtures/costMockData";

export default function ModelBreakdown() {
    const [models, setModels] = useState<ModelRow[]>([]);
    useEffect(() => {
        void CostRepository.getModels().then((data) => setModels(data));
    }, []);

    const MODEL_C: Record<string, string | undefined> = {
        "claude-sonnet-5": "var(--primary)",
        "claude-haiku-4-5": "var(--warning)",
        "claude-opus-5": "var(--success)",
    };

    if (models.length === 0) {
        return (
            <div className="flex h-full flex-1 items-center justify-center">
                <EmptyState message="LOADING MODEL DATA..." />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* Model cards */}
            <div className="mb-6 flex flex-col gap-4">
                {models.map((m) => (
                    <div
                        key={m.model}
                        className="border-border overflow-hidden rounded-sm border-[1px] border-solid"
                    >
                        <div className="bg-background border-border flex items-center gap-4 border-b px-5 py-3">
                            <div
                                className="h-2 w-2 shrink-0"
                                style={{
                                    borderRadius: "50%",
                                    background: MODEL_C[m.model] ?? "var(--muted-foreground)",
                                }}
                            />
                            <span className="text-foreground flex-1 text-xs font-bold tracking-tight">
                                {m.model}
                            </span>
                            <span className="text-muted-foreground text-base tracking-normal">
                                {m.provider}
                            </span>
                            <span
                                className="text-sm font-bold"
                                style={{
                                    color: MODEL_C[m.model] ?? "var(--muted-foreground)",
                                }}
                            >
                                ${m.total.toFixed(4)}
                            </span>
                        </div>
                        <div className="px-5 py-4">
                            <div className="bg-card mb-4 h-0.5 overflow-hidden rounded-sm">
                                <div
                                    className="h-full rounded-sm"
                                    style={{
                                        width: `${m.pct}%`,
                                        background: MODEL_C[m.model] ?? "var(--muted-foreground)",
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    {
                                        k: "CALLS",
                                        v: String(m.calls),
                                    },
                                    {
                                        k: "INPUT TOKENS",
                                        v: `${(m.inputTok / 1000).toFixed(0)}K`,
                                    },
                                    {
                                        k: "OUTPUT TOKENS",
                                        v: `${(m.outputTok / 1000).toFixed(0)}K`,
                                    },
                                    {
                                        k: "SHARE",
                                        v: `${m.pct}%`,
                                    },
                                ].map((stat, i, a) => (
                                    <div
                                        key={stat.k}
                                        style={{
                                            paddingRight: i < a.length - 1 ? 24 : 0,
                                        }}
                                    >
                                        <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                                            {stat.k}
                                        </div>
                                        <div className="text-muted-foreground text-sm font-bold">
                                            {stat.v}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-border mt-4 grid grid-cols-1 gap-4 border-t sm:grid-cols-2">
                                <div>
                                    <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                                        INPUT COST
                                    </div>
                                    <div className="text-muted-foreground text-xs font-bold">
                                        ${m.inputCost.toFixed(4)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                                        OUTPUT COST
                                    </div>
                                    <div className="text-muted-foreground text-xs font-bold">
                                        ${m.outputCost.toFixed(4)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Summary table */}
            <div className="text-muted-foreground mb-2.5 text-sm tracking-widest">
                PRICING REFERENCE
            </div>
            <div className="border-border overflow-hidden rounded-sm border-[1px] border-solid">
                <div className="bg-card border-border flex border-b">
                    {["MODEL", "INPUT $/1M", "OUTPUT $/1M"].map((h) => (
                        <div
                            key={h}
                            className="text-muted-foreground px-3.5 py-1 text-xs font-semibold tracking-widest"
                            style={{
                                flex: h === "MODEL" ? 2 : 1,
                            }}
                        >
                            {h}
                        </div>
                    ))}
                </div>
                {[
                    {
                        m: "claude-sonnet-5",
                        i: "$3.00",
                        o: "$15.00",
                    },
                    {
                        m: "claude-haiku-4-5",
                        i: "$0.80",
                        o: "$4.00",
                    },
                    {
                        m: "claude-opus-5",
                        i: "$15.00",
                        o: "$75.00",
                    },
                ].map((r) => (
                    <div key={r.m} className="border-border flex border-b">
                        <div
                            className="text-muted-foreground px-3.5 py-2 text-xs font-semibold"
                            style={{
                                flex: 2,
                            }}
                        >
                            {r.m}
                        </div>
                        <div className="text-muted-foreground flex-1 px-3.5 py-2 text-xs">
                            {r.i}
                        </div>
                        <div className="text-muted-foreground flex-1 px-3.5 py-2 text-xs">
                            {r.o}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
