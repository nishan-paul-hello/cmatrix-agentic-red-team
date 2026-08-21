import { useState } from "react";

import { useReportsData } from "@/features/reports/hooks/useReportsData";

export default function ReportsPage() {
    const { sel, setSel, reports, previewSections } = useReportsData();
    const [filter, setFilter] = useState<string>("ALL");
    const types = ["ALL", "EXECUTIVE SUMMARY", "TECHNICAL DETAIL", "BENCHMARK REPORT"];

    const filtered = filter === "ALL" ? reports : reports.filter((r) => r.type === filter);

    if (!sel) {
        return null;
    }
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
                        REPORTS
                    </h1>
                    <div className="flex gap-2">
                        {types.map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className="font-inherit cursor-pointer rounded-[2px] px-[10px] py-[3px] text-[8px] tracking-[0.12em]"
                                style={{
                                    background:
                                        filter === t ? "var(--color-hex-120608)" : "transparent",
                                    border: `1px solid ${filter === t ? "var(--color-hex-e31b23)" : "var(--color-hex-1e1e1e)"}`,
                                    color:
                                        filter === t
                                            ? "var(--color-hex-e31b23)"
                                            : "var(--color-hex-444444)",
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* List */}
                <div
                    className="flex w-[300px] flex-shrink-0 flex-col overflow-y-auto"
                    style={{
                        borderRight: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    {filtered.map((r) => (
                        <div
                            key={r.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSel(r)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setSel(r);
                                }
                            }}
                            className="cursor-pointer px-[16px] py-[13px]"
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                                background:
                                    sel.id === r.id ? "var(--color-hex-0d0d0d)" : "transparent",
                                borderLeft:
                                    sel.id === r.id
                                        ? "2px solid var(--color-hex-e31b23)"
                                        : "2px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                                if (sel.id !== r.id) {
                                    e.currentTarget.style.background = "var(--color-hex-0a0a0a)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (sel.id !== r.id) {
                                    e.currentTarget.style.background = "transparent";
                                }
                            }}
                        >
                            <div className="mb-1 flex items-center justify-between">
                                <span className="text-[9px] font-bold tracking-[0.08em] text-[var(--color-hex-e31b23)]">
                                    {r.id}
                                </span>
                                <span
                                    className="text-[8px] font-semibold tracking-[0.12em]"
                                    style={{
                                        color:
                                            r.status === "READY"
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-d29922)",
                                    }}
                                >
                                    {r.status}
                                </span>
                            </div>
                            <div className="mb-[2px] text-[10px] tracking-[0.04em] text-[var(--color-hex-a0a0a0)]">
                                {r.type}
                            </div>
                            <div className="text-[8.5px] tracking-[0.06em] text-[var(--color-hex-333333)]">
                                {r.mission} · {r.generated}
                            </div>
                            <div className="mt-2 flex gap-3">
                                <span className="text-[7.5px] tracking-[0.1em] text-[var(--color-hex-555555)]">
                                    {r.findings} FINDINGS
                                </span>
                                {r.critical > 0 && (
                                    <span className="text-[7.5px] tracking-[0.1em] text-[var(--color-hex-ff2a32)]">
                                        {r.critical} CRITICAL
                                    </span>
                                )}
                                {r.pages > 0 && (
                                    <span className="text-[7.5px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                        {r.pages} PAGES
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Preview */}
                <div className="flex min-h-[0px] flex-1 flex-col overflow-hidden">
                    {/* Preview header */}
                    <div
                        className="flex flex-shrink-0 items-center justify-between bg-[var(--color-hex-0a0a0a)] px-6 py-3"
                        style={{
                            borderBottom: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        <div>
                            <div className="text-[11px] font-bold tracking-[0.08em] text-[var(--color-hex-f2f2f2)]">
                                {sel.id} — {sel.type}
                            </div>
                            <div className="mt-[2px] text-[8.5px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                                {sel.mission} · {sel.generated}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {["DOWNLOAD PDF", "COPY LINK"].map((a) => (
                                <button
                                    key={a}
                                    className="font-inherit rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[transparent] px-[12px] py-[5px] text-[8.5px] tracking-[0.1em] text-[var(--color-hex-a0a0a0)]"
                                    style={{
                                        cursor: sel.status === "READY" ? "pointer" : "not-allowed",
                                        opacity: sel.status === "READY" ? 1 : 0.4,
                                    }}
                                >
                                    {a}
                                </button>
                            ))}
                        </div>
                    </div>
                    {sel.status === "GENERATING" ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3">
                            <div
                                style={{
                                    borderRadius: "50%",
                                }}
                                className="h-[8px] w-[8px] animate-pulse bg-[var(--color-hex-e31b23)]"
                            />
                            <div className="text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                GENERATING REPORT…
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-[720px] flex-1 overflow-y-auto px-8 py-6">
                            {/* Report cover block */}
                            <div className="mb-[24px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[24px] py-[20px]">
                                <div className="mb-[6px] text-[8.5px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                    CMATRIX REPORT
                                </div>
                                <div className="mb-[4px] text-[18px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                                    {sel.type}
                                </div>
                                <div className="mb-[12px] text-[9px] tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                                    MISSION {sel.mission}
                                </div>
                                <div className="flex gap-6">
                                    {(
                                        [
                                            {
                                                k: "FINDINGS",
                                                v: String(sel.findings),
                                            },
                                            {
                                                k: "CRITICAL",
                                                v: String(sel.critical),
                                                red: sel.critical > 0,
                                            },
                                            {
                                                k: "PAGES",
                                                v: String(sel.pages),
                                            },
                                            {
                                                k: "GENERATED",
                                                v: sel.generated,
                                            },
                                        ] as {
                                            k: string;
                                            v: string;
                                            red?: boolean;
                                        }[]
                                    ).map((m) => (
                                        <div key={m.k}>
                                            <div className="mb-[2px] text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                                {m.k}
                                            </div>
                                            <div
                                                className="text-[12px] font-bold"
                                                style={{
                                                    color: m.red
                                                        ? "var(--color-hex-ff2a32)"
                                                        : "var(--color-hex-f2f2f2)",
                                                }}
                                            >
                                                {m.v}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {previewSections.map((s, i) => (
                                <div key={s.title} className="mb-[24px]">
                                    <div className="mb-4 flex items-center gap-3">
                                        <div className="h-[14px] w-[2px] bg-[var(--color-hex-e31b23)]" />
                                        <span className="text-[9px] font-bold tracking-[0.2em] text-[var(--color-hex-f2f2f2)]">
                                            {s.title}
                                        </span>
                                    </div>
                                    {s.content && (
                                        <p
                                            className="text-[10.5px] leading-[1.9] text-[var(--color-hex-666666)]"
                                            style={{
                                                margin: 0,
                                                whiteSpace: "pre-line",
                                            }}
                                        >
                                            {s.content}
                                        </p>
                                    )}
                                    {s.items && (
                                        <div className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                                            {s.items.map((item, j, a) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center gap-4 px-[14px] py-[9px]"
                                                    style={{
                                                        borderBottom:
                                                            j < a.length - 1
                                                                ? "1px solid var(--color-hex-111111)"
                                                                : "none",
                                                        background:
                                                            j % 2
                                                                ? "var(--color-hex-0b0b0b)"
                                                                : "transparent",
                                                    }}
                                                >
                                                    <span
                                                        className="min-w-[60px] text-[8.5px] font-bold tracking-[0.12em]"
                                                        style={{
                                                            color:
                                                                item.sev === "CRITICAL"
                                                                    ? "var(--color-hex-ff2a32)"
                                                                    : "var(--color-hex-e31b23)",
                                                        }}
                                                    >
                                                        {item.sev}
                                                    </span>
                                                    <span className="min-w-[50px] text-[9.5px] font-bold text-[var(--color-hex-e31b23)]">
                                                        {item.id}
                                                    </span>
                                                    <span className="flex-1 text-[10px] text-[var(--color-hex-888888)]">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[9px] text-[var(--color-hex-444444)]">
                                                        {item.target}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-[var(--color-hex-3fb950)]">
                                                        E_ord {item.eord}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {i < previewSections.length - 1 && (
                                        <div className="mt-[20px] h-[1px] bg-[var(--color-hex-141414)]" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
