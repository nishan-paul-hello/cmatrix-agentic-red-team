import { useState } from "react";

import { useReportsData } from "@/features/reports/hooks/useReportsData";

import { ReportListSidebar } from "./ReportListSidebar";
import { ReportPreviewPane } from "./ReportPreviewPane";

export default function ReportsPage() {
    const [page, setPage] = useState(1);
    const { sel, setSel, reports, previewSections } = useReportsData(page, 50);
    const [filter, setFilter] = useState<string>("ALL");
    const types = ["ALL", "EXECUTIVE SUMMARY", "TECHNICAL DETAIL", "BENCHMARK REPORT"];

    const filtered = filter === "ALL" ? reports : reports.filter((r) => r.type === filter);

    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="tracking-widest-2 mb-[3px] text-base text-[var(--color-hex-666666)]">
                    RESEARCH
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        REPORTS
                    </h1>
                    <div className="flex gap-2">
                        {types.map((t) => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                aria-pressed={filter === t}
                                aria-label={t === "ALL" ? "Show all reports" : `Filter by ${t}`}
                                className="font-inherit cursor-pointer rounded-[2px] px-[10px] py-[3px] text-sm tracking-wide"
                                style={{
                                    background:
                                        filter === t ? "var(--color-hex-120608)" : "transparent",
                                    border: `1px solid ${filter === t ? "var(--color-brand)" : "var(--color-hex-1e1e1e)"}`,
                                    color:
                                        filter === t
                                            ? "var(--color-brand)"
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
                <ReportListSidebar
                    filtered={filtered}
                    sel={sel}
                    setSel={setSel}
                    page={page}
                    setPage={setPage}
                    reportsLength={reports.length}
                />
                {/* Preview */}
                <ReportPreviewPane sel={sel} previewSections={previewSections} />
            </div>
        </div>
    );
}
