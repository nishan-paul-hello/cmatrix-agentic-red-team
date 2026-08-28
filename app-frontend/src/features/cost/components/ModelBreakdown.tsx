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
        "claude-sonnet-5": "var(--color-brand)",
        "claude-haiku-4-5": "var(--color-warning)",
        "claude-opus-5": "var(--color-success)",
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
                        className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]"
                    >
                        <div
                            className="flex items-center gap-4 bg-[var(--color-hex-0d0d0d)] px-5 py-3"
                            style={{
                                borderBottom: "1px solid var(--color-hex-141414)",
                            }}
                        >
                            <div
                                className="h-[8px] w-[8px] shrink-0"
                                style={{
                                    borderRadius: "50%",
                                    background: MODEL_C[m.model] ?? "var(--color-hex-555555)",
                                }}
                            />
                            <span className="flex-1 text-2xl font-bold tracking-tight text-[var(--color-fg)]">
                                {m.model}
                            </span>
                            <span className="text-base tracking-normal text-[var(--color-hex-444444)]">
                                {m.provider}
                            </span>
                            <span
                                className="text-4xl font-bold"
                                style={{
                                    color: MODEL_C[m.model] ?? "var(--color-hex-555555)",
                                }}
                            >
                                ${m.total.toFixed(4)}
                            </span>
                        </div>
                        <div className="px-5 py-4">
                            <div className="mb-[16px] h-[3px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full rounded-[2px]"
                                    style={{
                                        width: `${m.pct}%`,
                                        background: MODEL_C[m.model] ?? "var(--color-hex-555555)",
                                    }}
                                />
                            </div>
                            <div className="grid grid-cols-4 gap-0">
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
                                        <div className="text-sm-tight tracking-wider-3 mb-[3px] text-[var(--color-hex-444444)]">
                                            {stat.k}
                                        </div>
                                        <div className="text-4xl font-bold text-[var(--color-hex-a0a0a0)]">
                                            {stat.v}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div
                                className="mt-4 grid grid-cols-2 gap-4"
                                style={{
                                    borderTop: "1px solid var(--color-hex-141414)",
                                    paddingTop: 12,
                                }}
                            >
                                <div>
                                    <div className="text-sm-tight tracking-wider-3 mb-[2px] text-[var(--color-hex-444444)]">
                                        INPUT COST
                                    </div>
                                    <div className="text-2xl font-bold text-[var(--color-hex-555555)]">
                                        ${m.inputCost.toFixed(4)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm-tight tracking-wider-3 mb-[2px] text-[var(--color-hex-444444)]">
                                        OUTPUT COST
                                    </div>
                                    <div className="text-2xl font-bold text-[var(--color-hex-555555)]">
                                        ${m.outputCost.toFixed(4)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* Summary table */}
            <div className="mb-[10px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                PRICING REFERENCE
            </div>
            <div className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                <div
                    className="flex bg-[var(--color-hex-0f0f0f)]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                    }}
                >
                    {["MODEL", "INPUT $/1M", "OUTPUT $/1M"].map((h) => (
                        <div
                            key={h}
                            className="text-sm-tight tracking-wider-2 px-[14px] py-[5px] font-semibold text-[var(--color-hex-444444)]"
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
                ].map((r, i, a) => (
                    <div
                        key={r.m}
                        className="flex"
                        style={{
                            borderBottom:
                                i < a.length - 1 ? "1px solid var(--color-hex-111111)" : "none",
                            background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                        }}
                    >
                        <div
                            className="px-[14px] py-[8px] text-lg font-semibold text-[var(--color-hex-666666)]"
                            style={{
                                flex: 2,
                            }}
                        >
                            {r.m}
                        </div>
                        <div className="flex-1 px-[14px] py-[8px] text-lg text-[var(--color-hex-555555)]">
                            {r.i}
                        </div>
                        <div className="flex-1 px-[14px] py-[8px] text-lg text-[var(--color-hex-555555)]">
                            {r.o}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
