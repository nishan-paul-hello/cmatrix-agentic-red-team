import { useState } from "react";

import { TYPE_C, type Bench } from "@/features/benchmarks/data/benchmarksMockData";
import { useBenchmarkDetailData } from "@/features/benchmarks/hooks/useBenchmarkDetailData";

export default function BenchmarkDetail({ bench, onBack }: { bench: Bench; onBack: () => void }) {
    const [tab, setTab] = useState<"OVERVIEW" | "TASKS" | "CATEGORIES">("OVERVIEW");
    const { tasks, catStats } = useBenchmarkDetailData();
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-0"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <button
                    onClick={onBack}
                    className="font-inherit mb-[10px] cursor-pointer border-none bg-[transparent] p-[0px] text-[9px] tracking-[0.14em] text-[var(--color-hex-666666)] hover:text-[var(--color-hex-a0a0a0)]"
                >
                    ← BENCHMARKS
                </button>
                <div className="mb-3 flex items-baseline gap-3">
                    <h1 className="text-[18px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                        {bench.id}
                    </h1>
                    <span
                        className="text-[9px] font-semibold tracking-[0.12em]"
                        style={{
                            color: TYPE_C[bench.type],
                        }}
                    >
                        {bench.type}
                    </span>
                    <span className="ml-auto text-[14px] font-bold text-[var(--color-hex-3fb950)]">
                        {(bench.score * 100).toFixed(1)}%
                    </span>
                </div>
                <div className="mb-[12px] text-[11px] tracking-[0.04em] text-[var(--color-hex-555555)]">
                    {bench.name}
                </div>
                <div className="flex">
                    {(["OVERVIEW", "TASKS", "CATEGORIES"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className="font-inherit cursor-pointer border-none bg-[transparent] px-[14px] py-[5px] text-[9px] tracking-[0.14em]"
                            style={{
                                borderBottom:
                                    t === tab
                                        ? "2px solid var(--color-hex-e31b23)"
                                        : "2px solid transparent",
                                color:
                                    t === tab
                                        ? "var(--color-hex-f2f2f2)"
                                        : "var(--color-hex-444444)",
                                marginBottom: -1,
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {tab === "OVERVIEW" && (
                    <>
                        <div className="mb-6 grid grid-cols-4 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                            {(
                                [
                                    {
                                        k: "TASKS",
                                        v: String(bench.tasks),
                                    },
                                    {
                                        k: "SOLVED",
                                        v: String(bench.solved),
                                        green: true,
                                    },
                                    {
                                        k: "PARTIAL",
                                        v: String(bench.partial),
                                        warn: true,
                                    },
                                    {
                                        k: "FAILED",
                                        v: String(bench.tasks - bench.solved - bench.partial),
                                        red: true,
                                    },
                                ] as {
                                    k: string;
                                    v: string;
                                    green?: boolean;
                                    warn?: boolean;
                                    red?: boolean;
                                }[]
                            ).map((m, i, a) => (
                                <div
                                    key={m.k}
                                    className="bg-[var(--color-hex-0d0d0d)] px-[18px] py-[14px]"
                                    style={{
                                        borderRight:
                                            i < a.length - 1
                                                ? "1px solid var(--color-hex-1a1a1a)"
                                                : "none",
                                    }}
                                >
                                    <div className="mb-[5px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        {m.k}
                                    </div>
                                    <div
                                        className="text-[22px] font-bold"
                                        style={{
                                            color: (() => {
                                                if (m.green) {
                                                    return "var(--color-hex-3fb950)";
                                                }
                                                if (m.warn) {
                                                    return "var(--color-hex-d29922)";
                                                }
                                                if (m.red) {
                                                    return "var(--color-hex-ff2a32)";
                                                }
                                                return "var(--color-hex-f2f2f2)";
                                            })(),
                                        }}
                                    >
                                        {m.v}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Score breakdown */}
                        <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                            SCORE BREAKDOWN
                        </div>
                        {[
                            {
                                l: "SOLVED (1.0 pts each)",
                                v: bench.solved,
                                max: bench.tasks,
                                c: "var(--color-hex-3fb950)",
                            },
                            {
                                l: "PARTIAL (0.5 pts each)",
                                v: bench.partial,
                                max: bench.tasks,
                                c: "var(--color-hex-d29922)",
                            },
                            {
                                l: "OVERALL SCORE",
                                v: Math.round(bench.score * 100),
                                max: 100,
                                c: "var(--color-hex-e31b23)",
                                pct: true,
                            },
                        ].map((b) => (
                            <div key={b.l} className="mb-[14px]">
                                <div className="mb-2 flex justify-between">
                                    <span className="text-[9px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                                        {b.l}
                                    </span>
                                    <span
                                        className="text-[10px] font-bold"
                                        style={{
                                            color: b.c,
                                        }}
                                    >
                                        {b.pct ? `${b.v}%` : b.v}
                                    </span>
                                </div>
                                <div className="h-[4px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                    <div
                                        className="h-full rounded-[2px]"
                                        style={{
                                            width: `${(b.v / b.max) * 100}%`,
                                            background: b.c,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        <div className="mt-5 grid grid-cols-3 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                            {[
                                {
                                    k: "AVG COST",
                                    v: bench.avgCost,
                                },
                                {
                                    k: "AVG TIME",
                                    v: bench.avgTime,
                                },
                                {
                                    k: "DATE",
                                    v: bench.date,
                                },
                            ].map((m, i, a) => (
                                <div
                                    key={m.k}
                                    className="bg-[var(--color-hex-0d0d0d)] px-[16px] py-[12px]"
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
                                    <div className="text-[14px] font-bold text-[var(--color-hex-f2f2f2)]">
                                        {m.v}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {tab === "TASKS" && (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-[var(--color-hex-0f0f0f)]">
                                {[
                                    "TASK",
                                    "CATEGORY",
                                    "RESULT",
                                    "COST",
                                    "TIME",
                                    "E_ORD",
                                    "ATTEMPTS",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-[12px] py-[5px] text-left text-[7.5px] font-semibold tracking-[0.16em] text-[var(--color-hex-444444)]"
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
                            {tasks.map((t, i) => (
                                <tr
                                    key={t.id}
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-111111)",
                                        background:
                                            i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                                    }}
                                >
                                    <td className="px-[12px] py-[8px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                        {t.id}
                                    </td>
                                    <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-555555)]">
                                        {t.name}
                                    </td>
                                    <td className="px-[12px] py-[8px]">
                                        <span
                                            className="text-[8.5px] font-bold tracking-[0.12em]"
                                            style={{
                                                color: (() => {
                                                    if (t.solved) {
                                                        return "var(--color-hex-3fb950)";
                                                    }
                                                    if (t.partial) {
                                                        return "var(--color-hex-d29922)";
                                                    }
                                                    return "var(--color-hex-ff2a32)";
                                                })(),
                                            }}
                                        >
                                            {(() => {
                                                if (t.solved) {
                                                    return "SOLVED";
                                                }
                                                if (t.partial) {
                                                    return "PARTIAL";
                                                }
                                                return "FAILED";
                                            })()}
                                        </span>
                                    </td>
                                    <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                                        {t.cost}
                                    </td>
                                    <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                                        {t.time}
                                    </td>
                                    <td className="px-[12px] py-[8px] text-[9px] text-[var(--color-hex-555555)]">
                                        {t.eord}/5
                                    </td>
                                    <td
                                        className="px-[12px] py-[8px] text-[9px]"
                                        style={{
                                            color:
                                                t.attempts > 2
                                                    ? "var(--color-hex-d29922)"
                                                    : "var(--color-hex-444444)",
                                        }}
                                    >
                                        {t.attempts}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {tab === "CATEGORIES" && (
                    <div className="flex flex-col gap-3">
                        {catStats
                            .filter((c) => c.tasks.length > 0)
                            .map((c) => {
                                const pct =
                                    c.tasks.length > 0
                                        ? Math.round((c.solved / c.tasks.length) * 100)
                                        : 0;
                                return (
                                    <div
                                        key={c.cat}
                                        className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] px-[16px] py-[12px]"
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-[10px] font-semibold tracking-[0.08em] text-[var(--color-hex-a0a0a0)]">
                                                {c.cat}
                                            </span>
                                            <span
                                                className="text-[10px] font-bold"
                                                style={{
                                                    color: (() => {
                                                        if (pct > 80) {
                                                            return "var(--color-hex-3fb950)";
                                                        }
                                                        if (pct > 50) {
                                                            return "var(--color-hex-d29922)";
                                                        }
                                                        return "var(--color-hex-ff2a32)";
                                                    })(),
                                                }}
                                            >
                                                {pct}%
                                            </span>
                                        </div>
                                        <div className="h-[3px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                            <div
                                                className="h-full"
                                                style={{
                                                    width: `${pct}%`,
                                                    background: (() => {
                                                        if (pct > 80) {
                                                            return "var(--color-hex-3fb950)";
                                                        }
                                                        if (pct > 50) {
                                                            return "var(--color-hex-d29922)";
                                                        }
                                                        return "var(--color-hex-ff2a32)";
                                                    })(),
                                                }}
                                            />
                                        </div>
                                        <div className="mt-[4px] text-[8px] text-[var(--color-hex-333333)]">
                                            {c.solved}/{c.tasks.length} SOLVED
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    );
}
