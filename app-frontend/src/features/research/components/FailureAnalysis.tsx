import React, { useState } from "react";

import { FAILURE_CLUSTERS, FAILURE_TIMELINE } from "../data/researchMockData";

export default function FailureAnalysis() {
    const [sel, setSel] = useState<(typeof FAILURE_CLUSTERS)[0] | null>(null);
    const total = FAILURE_CLUSTERS.reduce((s, c) => s + c.count, 0);
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* KPIs */}
                <div className="mb-5 grid grid-cols-3 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                    {[
                        {
                            k: "TOTAL FAILURES",
                            v: String(total),
                        },
                        {
                            k: "UNIQUE CLUSTERS",
                            v: String(FAILURE_CLUSTERS.length),
                        },
                        {
                            k: "FIXABLE",
                            v: String(
                                FAILURE_CLUSTERS.slice(0, 4).reduce((s, c) => s + c.count, 0),
                            ),
                        },
                    ].map((m, i, a) => (
                        <div
                            key={m.k}
                            className="bg-[var(--color-hex-0d0d0d)] px-[18px] py-[12px]"
                            style={{
                                borderRight:
                                    i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            }}
                        >
                            <div className="mb-[5px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                {m.k}
                            </div>
                            <div className="text-[20px] font-bold text-[var(--color-hex-f2f2f2)]">
                                {m.v}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Failure clusters */}
                <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    FAILURE CLUSTERS
                </div>
                {FAILURE_CLUSTERS.map((c) => (
                    <div
                        key={c.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSel(sel?.id === c.id ? null : c)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setSel(sel?.id === c.id ? null : c);
                            }
                        }}
                        className="mb-[8px] cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]"
                        style={{
                            background:
                                sel?.id === c.id ? "var(--color-hex-0d0d0d)" : "transparent",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                sel?.id === c.id ? "var(--color-hex-0d0d0d)" : "transparent")
                        }
                    >
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div
                                className="h-[10px] w-[10px] shrink-0 rounded-[2px]"
                                style={{
                                    background: c.color,
                                }}
                            />
                            <span className="flex-1 text-[10px] font-bold tracking-[0.08em] text-[var(--color-hex-a0a0a0)]">
                                {c.label}
                            </span>
                            <span
                                className="text-[14px] font-bold"
                                style={{
                                    color: c.color,
                                }}
                            >
                                {c.count}
                            </span>
                            <span className="min-w-[32px] text-right text-[9px] text-[var(--color-hex-444444)]">
                                {c.pct}%
                            </span>
                        </div>
                        <div
                            className="h-[3px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]"
                            style={{
                                margin: "0 16px 0",
                                marginBottom: sel?.id === c.id ? 0 : 10,
                            }}
                        >
                            <div
                                className="h-full"
                                style={{
                                    width: `${c.pct}%`,
                                    background: c.color,
                                }}
                            />
                        </div>
                        {sel?.id === c.id && (
                            <div
                                className="mt-[8px] px-[16px] py-[12px]"
                                style={{
                                    borderTop: "1px solid var(--color-hex-141414)",
                                }}
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-[8px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                        {c.id} DETAIL
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSel(null);
                                        }}
                                        className="cursor-pointer border-none bg-[transparent] text-[13px] leading-[1] text-[var(--color-hex-444444)]"
                                        style={{
                                            padding: "0 2px",
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="mb-[10px] text-[9.5px] leading-[1.8] text-[var(--color-hex-555555)]">
                                    {c.desc}
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="shrink-0 text-[8px] font-bold tracking-[0.14em] text-[var(--color-hex-3fb950)]">
                                        FIX →
                                    </span>
                                    <span className="text-[9.5px] leading-[1.7] text-[var(--color-hex-3fb950)]">
                                        {c.fix}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {/* Failure timeline */}
                <div className="mt-[20px] mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    RECENT FAILURES
                </div>
                <div className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                    <div
                        className="flex bg-[var(--color-hex-0f0f0f)]"
                        style={{
                            borderBottom: "1px solid var(--color-hex-1a1a1a)",
                        }}
                    >
                        {["TIME", "TYPE", "RUN", "TASK", "COST", "ATTEMPTS", "RESOLVED"].map(
                            (h) => (
                                <div
                                    key={h}
                                    className="px-[12px] py-[5px] text-[7.5px] font-semibold tracking-[0.14em] text-[var(--color-hex-444444)]"
                                    style={{
                                        flex: h === "TYPE" ? 2 : 1,
                                    }}
                                >
                                    {h}
                                </div>
                            ),
                        )}
                    </div>
                    {FAILURE_TIMELINE.map((f, i) => (
                        <div
                            key={f.ts}
                            className="flex items-center"
                            style={{
                                borderBottom:
                                    i < FAILURE_TIMELINE.length - 1
                                        ? "1px solid var(--color-hex-111111)"
                                        : "none",
                                background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                            }}
                        >
                            <div className="flex-1 px-[12px] py-[7px] text-[8.5px] text-[var(--color-hex-333333)]">
                                {f.ts}
                            </div>
                            <div
                                className="px-[12px] py-[7px] text-[9px] font-semibold tracking-[0.06em] text-[var(--color-hex-a0a0a0)]"
                                style={{
                                    flex: 2,
                                }}
                            >
                                {f.type}
                            </div>
                            <div className="flex-1 px-[12px] py-[7px] text-[9px] text-[var(--color-hex-e31b23)]">
                                {f.run}
                            </div>
                            <div className="flex-1 px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                {f.task}
                            </div>
                            <div className="flex-1 px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                {f.cost}
                            </div>
                            <div
                                className="flex-1 px-[12px] py-[7px] text-[9px]"
                                style={{
                                    color:
                                        f.attempts > 2
                                            ? "var(--color-hex-d29922)"
                                            : "var(--color-hex-444444)",
                                }}
                            >
                                {f.attempts}
                            </div>
                            <div className="flex-1 px-[12px] py-[7px]">
                                <span
                                    className="text-[8.5px] font-bold"
                                    style={{
                                        color: f.resolved
                                            ? "var(--color-hex-3fb950)"
                                            : "var(--color-hex-333333)",
                                    }}
                                >
                                    {f.resolved ? "YES" : "—"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
