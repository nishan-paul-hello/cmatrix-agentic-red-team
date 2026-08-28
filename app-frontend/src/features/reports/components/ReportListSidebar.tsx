import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { type Report } from "@/features/reports/data/fixtures/reportsMockData";

export function ReportListSidebar({
    filtered,
    sel,
    setSel,
    page,
    setPage,
    reportsLength,
}: {
    filtered: Report[];
    sel: Report | null;
    setSel: (r: Report) => void;
    page: number;
    setPage: (updater: (p: number) => number) => void;
    reportsLength: number;
}) {
    return (
        <div className="border-border lg:w-panel-md flex w-full flex-shrink-0 flex-col border-b lg:border-r lg:border-b-0">
            <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                    <EmptyState message="NO REPORTS FOUND" />
                ) : (
                    filtered.map((r) => (
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
                            className="border-border cursor-pointer border-b px-4 py-3"
                            onMouseEnter={(e) => {
                                if (sel?.id !== r.id) {
                                    e.currentTarget.style.background = "var(--background)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (sel?.id !== r.id) {
                                    e.currentTarget.style.background = "transparent";
                                }
                            }}
                        >
                            <div className="mb-1 flex items-center justify-between">
                                <span className="text-primary text-base font-bold tracking-tight">
                                    {r.id}
                                </span>
                                <span
                                    className="text-sm font-semibold tracking-wide"
                                    style={{
                                        color:
                                            r.status === "READY"
                                                ? "var(--success)"
                                                : "var(--warning)",
                                    }}
                                >
                                    {r.status}
                                </span>
                            </div>
                            <div className="text-muted-foreground mb-0.5 text-xs tracking-tighter">
                                {r.type}
                            </div>
                            <div className="text-muted-foreground text-sm tracking-tight">
                                {r.mission} · {r.generated}
                            </div>
                            <div className="mt-2 flex gap-3">
                                <span className="text-muted-foreground text-xs tracking-normal">
                                    {r.findings} FINDINGS
                                </span>
                                {r.critical > 0 && (
                                    <span className="text-destructive text-xs tracking-normal">
                                        {r.critical} CRITICAL
                                    </span>
                                )}
                                {r.pages > 0 && (
                                    <span className="text-muted-foreground text-xs tracking-normal">
                                        {r.pages} PAGES
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Pagination Controls */}
            <div className="border-border bg-background flex flex-shrink-0 items-center justify-between border-t border-solid px-6 py-4">
                <div className="text-muted-foreground text-xs tracking-normal">PAGE {page}</div>
                <div className="flex gap-2">
                    <Button
                        variant="secondary"
                        className="bg-card text-foreground hover:bg-card/80 h-auto rounded-sm px-3 py-1.5 text-base font-semibold tracking-widest"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        PREV
                    </Button>
                    <Button
                        variant="secondary"
                        className="bg-card text-foreground hover:bg-card/80 h-auto rounded-sm px-3 py-1.5 text-base font-semibold tracking-widest"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={reportsLength < 50}
                    >
                        NEXT
                    </Button>
                </div>
            </div>
        </div>
    );
}
