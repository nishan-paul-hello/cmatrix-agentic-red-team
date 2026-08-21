import { useState } from "react";

import { BENCHMARKS, TYPE_C, type Bench } from "@/features/benchmarks/data/benchmarksMockData";
import { BENCHMARK_STATUS } from "@/types/domain-types";

export default function BenchmarkList({ onSelect }: { onSelect: (b: Bench) => void }) {
    const [filter, setFilter] = useState<string>("ALL");
    const types = ["ALL", "CVE-BENCH", "PREDIQL", "MHBENCH"];
    const filtered = filter === "ALL" ? BENCHMARKS : BENCHMARKS.filter((b) => b.type === filter);
    const best = BENCHMARKS.filter((b) => b.status === "COMPLETE").reduce(
        (a, b) => (b.score > a.score ? b : a),
        BENCHMARKS[0],
    );
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    RESEARCH
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        BENCHMARKS
                    </h1>
                    <div className="flex gap-2">
                        {types.map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className="font-inherit cursor-pointer rounded-[2px] px-[10px] py-[3px] text-[8px] tracking-[0.12em]"
                                style={{
                                    background:
                                        filter === t
                                            ? ((TYPE_C as Partial<Record<string, string>>)[
                                                  t as Bench["type"]
                                              ] ?? "var(--color-hex-120608)")
                                            : "transparent",
                                    border: `1px solid ${filter === t ? ((TYPE_C as Partial<Record<string, string>>)[t as Bench["type"]] ?? "var(--color-hex-e31b23)") : "var(--color-hex-1e1e1e)"}`,
                                    color:
                                        filter === t
                                            ? ((TYPE_C as Partial<Record<string, string>>)[
                                                  t as Bench["type"]
                                              ] ?? "var(--color-hex-f2f2f2)")
                                            : "var(--color-hex-444444)",
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            {/* KPI strip */}
            <div
                className="grid flex-shrink-0 grid-cols-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                {(
                    [
                        {
                            k: "BEST SCORE",
                            v: `${(best.score * 100).toFixed(1)}%`,
                            sub: best.id,
                            red: true,
                        },
                        {
                            k: "BENCHMARKS RUN",
                            v: String(BENCHMARKS.filter((b) => b.status === "COMPLETE").length),
                        },
                        {
                            k: "TOTAL TASKS",
                            v: String(
                                BENCHMARKS.filter((b) => b.status === "COMPLETE").reduce(
                                    (s, b) => s + b.tasks,
                                    0,
                                ),
                            ),
                        },
                        {
                            k: "AVG SOLVE RATE",
                            v: `${Math.round((BENCHMARKS.filter((b) => b.status === "COMPLETE").reduce((s, b) => s + b.solved / b.tasks, 0) / BENCHMARKS.filter((b) => b.status === "COMPLETE").length) * 100)}%`,
                        },
                    ] as {
                        k: string;
                        v: string;
                        sub?: string;
                        red?: boolean;
                    }[]
                ).map((m, i, a) => (
                    <div
                        key={m.k}
                        className="bg-[var(--color-hex-0d0d0d)] px-[20px] py-[12px]"
                        style={{
                            borderRight:
                                i < a.length - 1 ? "1px solid var(--color-hex-1e1e1e)" : "none",
                        }}
                    >
                        <div className="mb-[5px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {m.k}
                        </div>
                        <div
                            className="mb-[2px] text-[20px] font-bold"
                            style={{
                                color: m.red
                                    ? "var(--color-hex-e31b23)"
                                    : "var(--color-hex-f2f2f2)",
                            }}
                        >
                            {m.v}
                        </div>
                        {m.sub && (
                            <div className="text-[7.5px] text-[var(--color-hex-333333)]">
                                {m.sub}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {/* E1: BENCHMARK SUITES — 7 tier tiles */}
            {(() => {
                const TIERS = [
                    {
                        n: 0,
                        name: "FANG SANDBOX",
                        desc: "Internal sandbox",
                        score: null,
                    },
                    {
                        n: 1,
                        name: "PENTESTEVAL",
                        desc: "Basic web pentesting",
                        score: 0.821,
                    },
                    {
                        n: 2,
                        name: "CVE-BENCH",
                        desc: "40 critical CVEs",
                        score: 0.812,
                    },
                    {
                        n: 3,
                        name: "PREDIQL",
                        desc: "IDOR + GraphQL",
                        score: 0.741,
                    },
                    {
                        n: 4,
                        name: "MHBENCH",
                        desc: "Multi-host lateral",
                        score: 0.634,
                    },
                    {
                        n: 5,
                        name: "BOUNTYBENCH",
                        desc: "Real bug bounty targets",
                        score: 0.488,
                    },
                    {
                        n: 6,
                        name: "PENTESTGPT/HTB",
                        desc: "HackTheBox integration",
                        score: null,
                    },
                ];
                return (
                    <div
                        className="shrink-0 px-[24px] py-[16px]"
                        style={{
                            borderBottom: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                            BENCHMARK SUITES
                        </div>
                        <div
                            style={{
                                display: "flex",
                                gap: 8,
                            }}
                        >
                            {TIERS.map((t) => {
                                const scoreColor = (() => {
                                    if (t.score === null) {
                                        return "var(--color-hex-333333)";
                                    }
                                    if (t.score >= 0.75) {
                                        return "var(--color-hex-3fb950)";
                                    }
                                    if (t.score >= 0.5) {
                                        return "var(--color-hex-d29922)";
                                    }
                                    return "var(--color-hex-333333)";
                                })();
                                return (
                                    <div
                                        key={t.n}
                                        className="min-w-[0px] flex-1 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[12px] py-[10px]"
                                    >
                                        <div className="text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                            TIER {t.n}
                                        </div>
                                        <div
                                            className="mt-[4px] overflow-hidden text-[10px] font-bold tracking-[0.1em] whitespace-nowrap text-[var(--color-hex-f2f2f2)]"
                                            style={{
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {t.name}
                                        </div>
                                        <div className="mt-[2px] text-[8.5px] text-[var(--color-hex-444444)]">
                                            {t.desc}
                                        </div>
                                        <div
                                            className="mt-[6px] text-[11px] font-bold"
                                            style={{
                                                color: scoreColor,
                                            }}
                                        >
                                            {t.score !== null
                                                ? `${(t.score * 100).toFixed(1)}%`
                                                : "—"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })()}
            {/* Table */}
            <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                            {[
                                "ID",
                                "NAME",
                                "TYPE",
                                "TASKS",
                                "SOLVED",
                                "PARTIAL",
                                "SCORE",
                                "AVG COST",
                                "AVG TIME",
                                "DATE",
                                "STATUS",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-[14px] py-[5px] text-left text-[7.5px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
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
                        {filtered.map((b) => {
                            const pct = b.tasks > 0 ? Math.round((b.solved / b.tasks) * 100) : 0;
                            return (
                                <tr
                                    key={b.id}
                                    onClick={() => onSelect(b)}
                                    className="cursor-pointer"
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-111111)",
                                        opacity: b.status === "QUEUED" ? 0.5 : 1,
                                    }}
                                    onMouseEnter={(e) =>
                                        (e.currentTarget.style.background =
                                            "var(--color-hex-0d0d0d)")
                                    }
                                    onMouseLeave={(e) =>
                                        (e.currentTarget.style.background = "transparent")
                                    }
                                >
                                    <td className="px-[14px] py-[9px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                        {b.id}
                                    </td>
                                    <td className="px-[14px] py-[9px] text-[10px] text-[var(--color-hex-a0a0a0)]">
                                        {b.name}
                                    </td>
                                    <td className="px-[14px] py-[9px]">
                                        <span
                                            className="text-[8.5px] font-semibold tracking-[0.1em]"
                                            style={{
                                                color: TYPE_C[b.type],
                                            }}
                                        >
                                            {b.type}
                                        </span>
                                    </td>
                                    <td className="px-[14px] py-[9px] text-[9px] text-[var(--color-hex-555555)]">
                                        {b.tasks}
                                    </td>
                                    <td className="px-[14px] py-[9px] text-[9px] font-bold text-[var(--color-hex-3fb950)]">
                                        {b.solved}
                                    </td>
                                    <td className="px-[14px] py-[9px] text-[9px] text-[var(--color-hex-d29922)]">
                                        {b.partial}
                                    </td>
                                    <td className="px-[14px] py-[9px]">
                                        {b.score > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <span
                                                    className="text-[10px] font-bold"
                                                    style={{
                                                        color: (() => {
                                                            if (b.score > 0.8) {
                                                                return "var(--color-hex-3fb950)";
                                                            }
                                                            if (b.score > 0.6) {
                                                                return "var(--color-hex-d29922)";
                                                            }
                                                            return "var(--color-hex-e31b23)";
                                                        })(),
                                                    }}
                                                >
                                                    {(b.score * 100).toFixed(1)}%
                                                </span>
                                                <div className="h-[3px] w-[36px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                                    <div
                                                        className="h-full"
                                                        style={{
                                                            width: `${pct}%`,
                                                            background: (() => {
                                                                if (b.score > 0.8) {
                                                                    return "var(--color-hex-3fb950)";
                                                                }
                                                                if (b.score > 0.6) {
                                                                    return "var(--color-hex-d29922)";
                                                                }
                                                                return "var(--color-hex-e31b23)";
                                                            })(),
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[9px] text-[var(--color-hex-333333)]">
                                                —
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-[14px] py-[9px] text-[9px] text-[var(--color-hex-444444)]">
                                        {b.avgCost}
                                    </td>
                                    <td className="px-[14px] py-[9px] text-[9px] text-[var(--color-hex-444444)]">
                                        {b.avgTime}
                                    </td>
                                    <td className="px-[14px] py-[9px] text-[9px] text-[var(--color-hex-444444)]">
                                        {b.date}
                                    </td>
                                    <td className="px-[14px] py-[9px]">
                                        <span
                                            className="text-[8.5px] font-semibold tracking-[0.12em]"
                                            style={{
                                                color: (() => {
                                                    if (b.status === "COMPLETE") {
                                                        return "var(--color-hex-3fb950)";
                                                    }
                                                    if (b.status === BENCHMARK_STATUS.RUNNING) {
                                                        return "var(--color-hex-ff2a32)";
                                                    }
                                                    return "var(--color-hex-333333)";
                                                })(),
                                            }}
                                        >
                                            {b.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
