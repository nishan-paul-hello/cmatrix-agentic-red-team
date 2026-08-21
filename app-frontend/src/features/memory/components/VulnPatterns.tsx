import { useState } from "react";

import { PATTERNS } from "../data/mockData";
import Sub from "./Sub";

export default function VulnPatterns() {
    const [sel, setSel] = useState(PATTERNS[0]);
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div
                className="w-[300px] flex-shrink-0 overflow-y-auto"
                style={{
                    borderRight: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div
                    className="text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]"
                    style={{
                        padding: "8px 16px 6px",
                        borderBottom: "1px solid var(--color-hex-111111)",
                    }}
                >
                    {PATTERNS.length} PATTERNS
                </div>
                {PATTERNS.map((p) => (
                    <div
                        key={p.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSel(p)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setSel(p);
                            }
                        }}
                        className="cursor-pointer px-[16px] py-[12px]"
                        style={{
                            borderBottom: "1px solid var(--color-hex-111111)",
                            background: sel.id === p.id ? "var(--color-hex-120608)" : "transparent",
                            borderLeft:
                                sel.id === p.id
                                    ? "2px solid var(--color-hex-e31b23)"
                                    : "2px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                            if (sel.id !== p.id) {
                                e.currentTarget.style.background = "var(--color-hex-0d0d0d)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (sel.id !== p.id) {
                                e.currentTarget.style.background = "transparent";
                            }
                        }}
                    >
                        <div className="mb-1 flex justify-between">
                            <span className="text-[10px] font-bold tracking-[0.08em] text-[var(--color-hex-e31b23)]">
                                {p.id}
                            </span>
                            <span className="text-[8px] text-[var(--color-hex-3fb950)]">
                                ↑{p.score.toFixed(2)}
                            </span>
                        </div>
                        <div className="mb-[2px] text-[10px] text-[var(--color-hex-a0a0a0)]">
                            {p.vuln}
                        </div>
                        <div className="text-[8.5px] text-[var(--color-hex-444444)]">
                            {p.subtype}
                        </div>
                        <div className="mt-2 flex gap-3">
                            <span className="text-[7.5px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                ×{p.uses} USES
                            </span>
                            <span className="text-[7.5px] text-[var(--color-hex-333333)]">
                                {p.lastSeen}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-5 flex items-baseline gap-3">
                    <h2 className="text-[15px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                        {sel.id}
                    </h2>
                    <span className="text-[9px] tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                        {sel.vuln}
                    </span>
                    <span className="text-[9px] text-[var(--color-hex-444444)]">{sel.subtype}</span>
                </div>
                <div className="mb-5 grid grid-cols-3 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                    {[
                        {
                            k: "RELEVANCE",
                            v: sel.score.toFixed(2),
                            red: true,
                        },
                        {
                            k: "USES",
                            v: String(sel.uses),
                        },
                        {
                            k: "LAST APPLIED",
                            v: sel.lastSeen,
                        },
                    ].map((m, i, a) => (
                        <div
                            key={m.k}
                            className="bg-[var(--color-hex-0d0d0d)] px-[14px] py-[10px]"
                            style={{
                                borderRight:
                                    i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            }}
                        >
                            <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                {m.k}
                            </div>
                            <div
                                className="text-[17px] font-bold"
                                style={{
                                    color: m.red
                                        ? "var(--color-hex-e31b23)"
                                        : "var(--color-hex-f2f2f2)",
                                }}
                            >
                                {m.v}
                            </div>
                        </div>
                    ))}
                </div>
                <Sub label="TECHNIQUE SEQUENCE">
                    {sel.techniques.map((t, i) => (
                        <div key={t} className="mb-2 flex items-center gap-3">
                            <div
                                className="h-[17px] w-[17px] shrink-0 border-[1px] border-solid border-[var(--color-hex-1e1e1e)]"
                                style={{
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <span className="text-[7.5px] text-[var(--color-hex-444444)]">
                                    {i + 1}
                                </span>
                            </div>
                            <span className="text-[10px] text-[var(--color-hex-888888)]">{t}</span>
                        </div>
                    ))}
                </Sub>
                <Sub label="DETECTION INDICATORS">
                    {sel.indicators.map((ind) => (
                        <div key={ind} className="mb-2 flex items-center gap-2">
                            <div
                                className="h-[5px] w-[5px] shrink-0 bg-[var(--color-hex-e31b23)]"
                                style={{
                                    borderRadius: "50%",
                                }}
                            />
                            <span className="text-[10px] text-[var(--color-hex-666666)]">
                                {ind}
                            </span>
                        </div>
                    ))}
                </Sub>
                <Sub label="PATTERN EVOLUTION" last>
                    {sel.evolution.map((ev, i, a) => (
                        <div key={ev.ts} className="flex items-start gap-3">
                            <div className="flex shrink-0 flex-col items-center">
                                <div
                                    className="mt-[2px] h-[7px] w-[7px] border-[1px] border-solid border-[var(--color-hex-e31b23)]"
                                    style={{
                                        borderRadius: "50%",
                                        background:
                                            i === a.length - 1
                                                ? "var(--color-hex-e31b23)"
                                                : "transparent",
                                    }}
                                />
                                {i < a.length - 1 && (
                                    <div className="h-[20px] w-[1px] bg-[var(--color-hex-1e1e1e)]" />
                                )}
                            </div>
                            <div>
                                <span className="mr-[8px] text-[8px] text-[var(--color-hex-333333)]">
                                    {ev.ts}
                                </span>
                                <span className="text-[9.5px] leading-[1.6] text-[var(--color-hex-666666)]">
                                    {ev.note}
                                </span>
                            </div>
                        </div>
                    ))}
                </Sub>
            </div>
        </div>
    );
}
