import { useState } from "react";

interface Bench {
    id: string;
    name: string;
    type: "CVE-BENCH" | "PREDIQL" | "MHBENCH";
    tasks: number;
    solved: number;
    partial: number;
    score: number;
    avgCost: string;
    avgTime: string;
    date: string;
    status: "COMPLETE" | "RUNNING" | "QUEUED";
}
const BENCHMARKS: Bench[] = [
    {
        id: "B-041",
        name: "CVE-BENCH v2 Full",
        type: "CVE-BENCH",
        tasks: 50,
        solved: 38,
        partial: 6,
        score: 0.812,
        avgCost: "$0.184",
        avgTime: "18m",
        date: "Today",
        status: "COMPLETE",
    },
    {
        id: "B-038",
        name: "PrediQL Reasoning",
        type: "PREDIQL",
        tasks: 30,
        solved: 21,
        partial: 4,
        score: 0.741,
        avgCost: "$0.091",
        avgTime: "9m",
        date: "Yesterday",
        status: "COMPLETE",
    },
    {
        id: "B-035",
        name: "MH-Bench Multi-Host",
        type: "MHBENCH",
        tasks: 20,
        solved: 11,
        partial: 3,
        score: 0.622,
        avgCost: "$0.321",
        avgTime: "34m",
        date: "2d ago",
        status: "COMPLETE",
    },
    {
        id: "B-033",
        name: "CVE-BENCH v2 Fast",
        type: "CVE-BENCH",
        tasks: 20,
        solved: 16,
        partial: 2,
        score: 0.848,
        avgCost: "$0.072",
        avgTime: "11m",
        date: "3d ago",
        status: "COMPLETE",
    },
    {
        id: "B-042",
        name: "CVE-BENCH v2 Nightly",
        type: "CVE-BENCH",
        tasks: 50,
        solved: 0,
        partial: 3,
        score: 0,
        avgCost: "—",
        avgTime: "—",
        date: "Running",
        status: "RUNNING",
    },
    {
        id: "B-043",
        name: "PrediQL v2 Beta",
        type: "PREDIQL",
        tasks: 40,
        solved: 0,
        partial: 0,
        score: 0,
        avgCost: "—",
        avgTime: "—",
        date: "Queued",
        status: "QUEUED",
    },
];
const TYPE_C: Record<Bench["type"], string> = {
    "CVE-BENCH": "var(--color-hex-e31b23)",
    PREDIQL: "var(--color-hex-d29922)",
    MHBENCH: "var(--color-hex-3fb950)",
};
const TASK_DATA = [
    {
        id: "T-001",
        name: "CVE-2024-1234 SQLi",
        category: "SQL INJECTION",
        solved: true,
        partial: false,
        cost: "$0.082",
        time: "14m",
        eord: 5,
        attempts: 2,
    },
    {
        id: "T-002",
        name: "CVE-2024-5678 AuthBypass",
        category: "AUTH",
        solved: true,
        partial: false,
        cost: "$0.054",
        time: "9m",
        eord: 5,
        attempts: 1,
    },
    {
        id: "T-003",
        name: "CVE-2024-9012 RCE",
        category: "RCE",
        solved: false,
        partial: true,
        cost: "$0.211",
        time: "22m",
        eord: 3,
        attempts: 3,
    },
    {
        id: "T-004",
        name: "CVE-2024-3456 IDOR",
        category: "ACCESS CTRL",
        solved: true,
        partial: false,
        cost: "$0.021",
        time: "5m",
        eord: 4,
        attempts: 1,
    },
    {
        id: "T-005",
        name: "CVE-2024-7890 XSS",
        category: "XSS",
        solved: true,
        partial: false,
        cost: "$0.031",
        time: "6m",
        eord: 5,
        attempts: 1,
    },
    {
        id: "T-006",
        name: "CVE-2024-2468 SSRF",
        category: "SSRF",
        solved: false,
        partial: false,
        cost: "$0.148",
        time: "18m",
        eord: 1,
        attempts: 3,
    },
    {
        id: "T-007",
        name: "CVE-2024-1357 XXE",
        category: "XXE",
        solved: true,
        partial: false,
        cost: "$0.061",
        time: "11m",
        eord: 4,
        attempts: 2,
    },
    {
        id: "T-008",
        name: "CVE-2024-8024 PathTrv",
        category: "PATH TRAVERSAL",
        solved: true,
        partial: false,
        cost: "$0.018",
        time: "4m",
        eord: 5,
        attempts: 1,
    },
];
export default function BenchmarksHub() {
    const [detail, setDetail] = useState<Bench | null>(null);
    return detail ? (
        <BenchmarkDetail bench={detail} onBack={() => setDetail(null)} />
    ) : (
        <BenchmarkList onSelect={setDetail} />
    );
}
function BenchmarkList({ onSelect }: { onSelect: (b: Bench) => void }) {
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
                                            ? (TYPE_C[t as Bench["type"]] ??
                                              "var(--color-hex-120608)")
                                            : "transparent",
                                    border: `1px solid ${filter === t ? (TYPE_C[t as Bench["type"]] ?? "var(--color-hex-e31b23)") : "var(--color-hex-1e1e1e)"}`,
                                    color:
                                        filter === t
                                            ? (TYPE_C[t as Bench["type"]] ??
                                              "var(--color-hex-f2f2f2)")
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
                                const scoreColor =
                                    t.score === null
                                        ? "var(--color-hex-333333)"
                                        : t.score >= 0.75
                                          ? "var(--color-hex-3fb950)"
                                          : t.score >= 0.5
                                            ? "var(--color-hex-d29922)"
                                            : "var(--color-hex-333333)";
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
                                                        color:
                                                            b.score > 0.8
                                                                ? "var(--color-hex-3fb950)"
                                                                : b.score > 0.6
                                                                  ? "var(--color-hex-d29922)"
                                                                  : "var(--color-hex-e31b23)",
                                                    }}
                                                >
                                                    {(b.score * 100).toFixed(1)}%
                                                </span>
                                                <div className="h-[3px] w-[36px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                                    <div
                                                        className="h-full"
                                                        style={{
                                                            width: `${pct}%`,
                                                            background:
                                                                b.score > 0.8
                                                                    ? "var(--color-hex-3fb950)"
                                                                    : b.score > 0.6
                                                                      ? "var(--color-hex-d29922)"
                                                                      : "var(--color-hex-e31b23)",
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
                                                color:
                                                    b.status === "COMPLETE"
                                                        ? "var(--color-hex-3fb950)"
                                                        : b.status === "RUNNING"
                                                          ? "var(--color-hex-ff2a32)"
                                                          : "var(--color-hex-333333)",
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

/* ── screen 40: BENCHMARK DETAIL ── */
function BenchmarkDetail({ bench, onBack }: { bench: Bench; onBack: () => void }) {
    const [tab, setTab] = useState<"OVERVIEW" | "TASKS" | "CATEGORIES">("OVERVIEW");
    const cats = [
        "SQL INJECTION",
        "AUTH",
        "RCE",
        "ACCESS CTRL",
        "XSS",
        "SSRF",
        "XXE",
        "PATH TRAVERSAL",
    ];
    const catStats = cats.map((c) => ({
        cat: c,
        tasks: TASK_DATA.filter((t) => t.category === c),
        solved: TASK_DATA.filter((t) => t.category === c && t.solved).length,
    }));
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
                                            color: m.green
                                                ? "var(--color-hex-3fb950)"
                                                : m.warn
                                                  ? "var(--color-hex-d29922)"
                                                  : m.red
                                                    ? "var(--color-hex-ff2a32)"
                                                    : "var(--color-hex-f2f2f2)",
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
                            {TASK_DATA.map((t, i) => (
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
                                                color: t.solved
                                                    ? "var(--color-hex-3fb950)"
                                                    : t.partial
                                                      ? "var(--color-hex-d29922)"
                                                      : "var(--color-hex-ff2a32)",
                                            }}
                                        >
                                            {t.solved ? "SOLVED" : t.partial ? "PARTIAL" : "FAILED"}
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
                                                    color:
                                                        pct > 80
                                                            ? "var(--color-hex-3fb950)"
                                                            : pct > 50
                                                              ? "var(--color-hex-d29922)"
                                                              : "var(--color-hex-ff2a32)",
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
                                                    background:
                                                        pct > 80
                                                            ? "var(--color-hex-3fb950)"
                                                            : pct > 50
                                                              ? "var(--color-hex-d29922)"
                                                              : "var(--color-hex-ff2a32)",
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
