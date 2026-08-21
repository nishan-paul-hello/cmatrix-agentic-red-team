import { useState } from "react";

import {
    ABLATION_FLAG_KEYS,
    ABLATION_RUNS,
    COMPONENTS,
} from "@/features/research/data/researchMockData";

export default function AblationLab() {
    const [sel, setSel] = useState(ABLATION_RUNS[0]);
    const baseline = ABLATION_RUNS[ABLATION_RUNS.length - 1];
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            {/* Left: config + results */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-[14px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    ABLATION RUNS — SELECT TO COMPARE
                </div>
                <table className="mb-[24px] w-full border-collapse">
                    <thead>
                        <tr className="bg-[var(--color-hex-0f0f0f)]">
                            {[
                                "RUN",
                                "NAME",
                                "UCB",
                                "E_ORD",
                                "COMPACT",
                                "PARALLEL",
                                "SCORE",
                                "Δ SCORE",
                                "COST",
                                "TIME",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-[12px] py-[5px] text-left text-[7.5px] font-semibold tracking-[0.14em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ABLATION_RUNS.map((r) => (
                            <tr
                                key={r.id}
                                onClick={() => setSel(r)}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                    background:
                                        sel.id === r.id ? "var(--color-hex-0d0d0d)" : "transparent",
                                    borderLeft:
                                        sel.id === r.id
                                            ? "2px solid var(--color-hex-e31b23)"
                                            : "2px solid transparent",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        sel.id === r.id ? "var(--color-hex-0d0d0d)" : "transparent")
                                }
                            >
                                <td className="px-[12px] py-[8px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                    {r.id}
                                </td>
                                <td className="px-[12px] py-[8px] text-[9.5px] text-[var(--color-hex-888888)]">
                                    {r.name}
                                </td>
                                {ABLATION_FLAG_KEYS.map((k) => (
                                    <td key={k} className="px-[12px] py-[8px] text-center">
                                        <span
                                            className="text-[10px] font-bold"
                                            style={{
                                                color: r[k]
                                                    ? "var(--color-hex-3fb950)"
                                                    : "var(--color-hex-333333)",
                                            }}
                                        >
                                            {r[k] ? "✓" : "✗"}
                                        </span>
                                    </td>
                                ))}
                                <td
                                    className="px-[12px] py-[8px] text-[10px] font-bold"
                                    style={{
                                        color: (() => {
                                            if (r.score > 0.75) {
                                                return "var(--color-hex-3fb950)";
                                            }
                                            if (r.score > 0.55) {
                                                return "var(--color-hex-d29922)";
                                            }
                                            return "var(--color-hex-ff2a32)";
                                        })(),
                                    }}
                                >
                                    {(r.score * 100).toFixed(1)}%
                                </td>
                                <td
                                    className="px-[12px] py-[8px] text-[9px] font-bold"
                                    style={{
                                        color: (() => {
                                            if (r.delta === 0) {
                                                return "var(--color-hex-555555)";
                                            }
                                            if (r.delta > -0.05) {
                                                return "var(--color-hex-d29922)";
                                            }
                                            return "var(--color-hex-ff2a32)";
                                        })(),
                                    }}
                                >
                                    {r.delta === 0 ? "—" : `${(r.delta * 100).toFixed(1)}%`}
                                </td>
                                <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                                    {r.cost}
                                </td>
                                <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                                    {r.time}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Component impact summary */}
                <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                    COMPONENT IMPACT (vs baseline)
                </div>
                {COMPONENTS.map((c) => {
                    const withComp = ABLATION_RUNS.find(
                        (r) =>
                            r[c.key] === true &&
                            Object.values(r).filter((v) => v === false).length === 0,
                    );
                    const withoutComp = ABLATION_RUNS.find(
                        (r) => r[c.key] === false && ABLATION_RUNS[0].score > r.score + 0.05,
                    );
                    const impact = withComp && withoutComp ? withComp.score - withoutComp.score : 0;
                    return (
                        <div key={c.key} className="mb-[14px]">
                            <div className="mb-1 flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] font-semibold tracking-[0.1em] text-[var(--color-hex-a0a0a0)]">
                                        {c.label}
                                    </span>
                                    <span className="ml-[8px] text-[8px] text-[var(--color-hex-333333)]">
                                        {c.desc}
                                    </span>
                                </div>
                                <span
                                    className="text-[10px] font-bold"
                                    style={{
                                        color: (() => {
                                            if (impact > 0.1) {
                                                return "var(--color-hex-e31b23)";
                                            }
                                            if (impact > 0.05) {
                                                return "var(--color-hex-d29922)";
                                            }
                                            return "var(--color-hex-555555)";
                                        })(),
                                    }}
                                >
                                    -{(impact * 100).toFixed(1)}% if removed
                                </span>
                            </div>
                            <div className="h-[4px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full rounded-[2px]"
                                    style={{
                                        width: `${Math.min(impact * 200, 100)}%`,
                                        background: (() => {
                                            if (impact > 0.1) {
                                                return "var(--color-hex-e31b23)";
                                            }
                                            if (impact > 0.05) {
                                                return "var(--color-hex-d29922)";
                                            }
                                            return "var(--color-hex-555555)";
                                        })(),
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {/* Right: detail */}
            <div
                className="flex w-[260px] flex-shrink-0 flex-col overflow-y-auto px-[14px] py-[16px]"
                style={{
                    borderLeft: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[4px] text-[11px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                    {sel.id}
                </div>
                <div className="mb-[16px] text-[9px] leading-[1.5] text-[var(--color-hex-555555)]">
                    {sel.name}
                </div>
                <div className="mb-[16px]">
                    <div className="mb-[8px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        COMPONENTS
                    </div>
                    {COMPONENTS.map((c) => (
                        <div key={c.key} className="mb-2 flex items-center gap-2">
                            <span
                                className="min-w-[12px] text-[9px] font-bold"
                                style={{
                                    color: sel[c.key]
                                        ? "var(--color-hex-3fb950)"
                                        : "var(--color-hex-333333)",
                                }}
                            >
                                {sel[c.key] ? "✓" : "✗"}
                            </span>
                            <span
                                className="text-[9px]"
                                style={{
                                    color: sel[c.key]
                                        ? "var(--color-hex-666666)"
                                        : "var(--color-hex-333333)",
                                }}
                            >
                                {c.label}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="mb-[16px] h-[1px] bg-[var(--color-hex-1a1a1a)]" />
                {[
                    {
                        k: "SCORE",
                        v: `${(sel.score * 100).toFixed(1)}%`,
                        c: (() => {
                            if (sel.score > 0.75) {
                                return "var(--color-hex-3fb950)";
                            }
                            if (sel.score > 0.55) {
                                return "var(--color-hex-d29922)";
                            }
                            return "var(--color-hex-ff2a32)";
                        })(),
                    },
                    {
                        k: "vs FULL SYSTEM",
                        v: sel.delta === 0 ? "baseline" : `${(sel.delta * 100).toFixed(1)}%`,
                        c: (() => {
                            if (sel.delta < -0.1) {
                                return "var(--color-hex-ff2a32)";
                            }
                            if (sel.delta < -0.05) {
                                return "var(--color-hex-d29922)";
                            }
                            return "var(--color-hex-555555)";
                        })(),
                    },
                    {
                        k: "COST",
                        v: sel.cost,
                    },
                    {
                        k: "RUNTIME",
                        v: sel.time,
                    },
                ].map((r) => (
                    <div key={r.k} className="mb-[12px]">
                        <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {r.k}
                        </div>
                        <div
                            className="text-[14px] font-bold"
                            style={{
                                color: r.c ?? "var(--color-hex-f2f2f2)",
                            }}
                        >
                            {r.v}
                        </div>
                    </div>
                ))}
                <div className="mt-[8px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-e31b2333)] bg-[var(--color-hex-120608)] px-[12px] py-[10px]">
                    <div className="mb-[4px] text-[8px] tracking-[0.16em] text-[var(--color-hex-e31b23)]">
                        SCORE DELTA vs BASELINE
                    </div>
                    <div
                        className="text-[16px] font-bold"
                        style={{
                            color:
                                sel.delta > -0.05
                                    ? "var(--color-hex-d29922)"
                                    : "var(--color-hex-ff2a32)",
                        }}
                    >
                        {sel.delta === 0
                            ? "baseline"
                            : `${((sel.score - baseline.score) * 100).toFixed(1)}pp`}
                    </div>
                </div>
            </div>
        </div>
    );
}
