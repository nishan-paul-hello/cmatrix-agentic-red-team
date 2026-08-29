import { useState } from "react";

import { Button } from "@/components/ui/button";
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
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    RESEARCH
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">REPORTS</h1>
                    <div className="flex gap-2">
                        {types.map((t) => (
                            <Button
                                key={t}
                                variant="outline"
                                onClick={() => setFilter(t)}
                                aria-pressed={filter === t}
                                aria-label={t === "ALL" ? "Show all reports" : `Filter by ${t}`}
                                className={`h-auto rounded-sm border border-solid px-2.5 py-0.5 text-sm tracking-wide ${filter === t ? "bg-border border-primary text-primary" : "border-border text-muted-foreground bg-transparent"}`}
                            >
                                {t}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
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
