/* eslint-disable import/no-cycle */
import React, { useEffect } from "react";

import { type VDGEntry } from "@/features/specialists/data/fixtures/teamDashboardMockData";

import { STATUS_C } from "./TeamManagerDashboardView";

export function UCBModal({
    entry,
    totalVisits,
    onClose,
}: {
    entry: VDGEntry;
    totalVisits: number;
    onClose: () => void;
}) {
    // F10: ESC key closes modal
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    const epss = 0.42;
    const bars = [
        {
            label: "EXPLOIT TERM",
            value: entry.exploit,
            color: "var(--color-hex-e31b23)",
            desc: "Q(s,a) — average reward from past attempts",
        },
        {
            label: "EXPLORE TERM",
            value: entry.explore,
            color: "var(--color-hex-3fb950)",
            desc: "c × √(ln N / n) — exploration bonus",
        },
        {
            label: "EPSS PRIOR",
            value: epss,
            color: "var(--color-hex-d29922)",
            desc: "λ × EPSS score — initial exploitability prior from NVD/FIRST API",
        },
        {
            label: "UCB SCORE",
            value: entry.ucb,
            color: "var(--color-hex-ff2a32)",
            desc: "Combined final selection score",
        },
    ];
    const C = 0.4;
    const N = totalVisits;
    const n = entry.visits;
    return (
        <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Enter") {
                    onClose();
                }
            }}
            className="fixed inset-0 flex items-center justify-center bg-[var(--color-hex-00000099)]"
            style={{
                zIndex: 60,
            }}
            onClick={onClose}
        >
            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-[540px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-start justify-between px-5 pt-4 pb-3"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div>
                        <div className="mb-[2px] text-[14px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                            UCB BREAKDOWN
                        </div>
                        <div className="text-[9px] tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                            {entry.id} — {entry.type}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer border-none bg-[transparent] text-[16px] text-[var(--color-hex-444444)]"
                    >
                        ✕
                    </button>
                </div>
                <div className="px-5 py-5">
                    {/* Formula */}
                    <div className="mb-[20px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-080808)] px-[16px] py-[12px] text-center">
                        <div className="mb-[6px] text-[11px] tracking-[0.08em] text-[var(--color-hex-555555)]">
                            UCB FORMULA
                        </div>
                        <div className="text-[13px] tracking-[0.06em] text-[var(--color-hex-a0a0a0)]">
                            UCB(s) = <span className="text-[var(--color-hex-e31b23)]">Q(s,a)</span>{" "}
                            +{" "}
                            <span className="text-[var(--color-hex-3fb950)]">c × √(ln N / n)</span>
                        </div>
                        <div className="mt-[8px] text-[9px] tracking-[0.08em] text-[var(--color-hex-333333)]">
                            c={C} · N={N} total visits · n={n === 0 ? "0 (new node)" : n} visits ·
                            ln(N)=
                            {Math.log(N || 1).toFixed(3)}
                        </div>
                        {/* G1: c constant note */}
                        <div className="mt-[6px] text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                            UCB POLICY c = {C.toFixed(2)} — configurable in Settings → VDG
                        </div>
                    </div>
                    {/* Score bars */}
                    {bars.map((b) => (
                        <div key={b.label} className="mb-[16px]">
                            <div className="mb-2 flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] font-semibold tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        {b.label}
                                    </span>
                                    <div className="mt-[2px] text-[8.5px] text-[var(--color-hex-333333)]">
                                        {b.desc}
                                    </div>
                                </div>
                                <span
                                    className="text-[16px] font-bold"
                                    style={{
                                        color: b.color,
                                    }}
                                >
                                    {b.value.toFixed(3)}
                                </span>
                            </div>
                            <div className="h-[5px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full rounded-[2px]"
                                    style={{
                                        width: `${b.value * 100}%`,
                                        background: b.color,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    {/* G3: EPSS ONE-DAY mode footnote */}
                    <div className="mt-[6px] text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                        ONE-DAY mode: Q(s,a) seeded from EPSS prior
                    </div>
                    {/* Stats grid */}
                    <div className="mt-4 grid grid-cols-4 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                        {[
                            {
                                k: "E_ORD",
                                v: `${entry.eord}/5`,
                            },
                            {
                                k: "VISITS",
                                v: String(entry.visits),
                            },
                            {
                                k: "STATUS",
                                v: entry.status,
                            },
                            {
                                k: "COST",
                                v: entry.cost,
                            },
                        ].map((m, i, a) => (
                            <div
                                key={m.k}
                                className="bg-[var(--color-hex-0b0b0b)] px-[12px] py-[10px]"
                                style={{
                                    borderRight:
                                        i < a.length - 1
                                            ? "1px solid var(--color-hex-1a1a1a)"
                                            : "none",
                                }}
                            >
                                <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                    {m.k}
                                </div>
                                <div
                                    className="text-[13px] font-bold"
                                    style={{
                                        color:
                                            m.k === "STATUS"
                                                ? STATUS_C[entry.status]
                                                : "var(--color-hex-f2f2f2)",
                                    }}
                                >
                                    {m.v}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
