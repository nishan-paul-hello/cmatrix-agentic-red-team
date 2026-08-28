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
        <div
            className="w-panel-md flex flex-shrink-0 flex-col"
            style={{
                borderRight: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
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
                            className="cursor-pointer px-[16px] py-[13px]"
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                                background:
                                    sel?.id === r.id ? "var(--color-hex-0d0d0d)" : "transparent",
                                borderLeft:
                                    sel?.id === r.id
                                        ? "2px solid var(--color-brand)"
                                        : "2px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                                if (sel?.id !== r.id) {
                                    e.currentTarget.style.background = "var(--color-hex-0a0a0a)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (sel?.id !== r.id) {
                                    e.currentTarget.style.background = "transparent";
                                }
                            }}
                        >
                            <div className="mb-1 flex items-center justify-between">
                                <span className="text-base font-bold tracking-tight text-[var(--color-brand)]">
                                    {r.id}
                                </span>
                                <span
                                    className="text-sm font-semibold tracking-wide"
                                    style={{
                                        color:
                                            r.status === "READY"
                                                ? "var(--color-success)"
                                                : "var(--color-warning)",
                                    }}
                                >
                                    {r.status}
                                </span>
                            </div>
                            <div className="mb-[2px] text-lg tracking-tighter text-[var(--color-hex-a0a0a0)]">
                                {r.type}
                            </div>
                            <div className="text-base-tight tracking-tight-1 text-[var(--color-hex-333333)]">
                                {r.mission} · {r.generated}
                            </div>
                            <div className="mt-2 flex gap-3">
                                <span className="text-sm-tight tracking-normal text-[var(--color-hex-555555)]">
                                    {r.findings} FINDINGS
                                </span>
                                {r.critical > 0 && (
                                    <span className="text-sm-tight tracking-normal text-[var(--color-danger)]">
                                        {r.critical} CRITICAL
                                    </span>
                                )}
                                {r.pages > 0 && (
                                    <span className="text-sm-tight tracking-normal text-[var(--color-hex-333333)]">
                                        {r.pages} PAGES
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
            {/* Pagination Controls */}
            <div className="flex flex-shrink-0 items-center justify-between border-t border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0a0a0a)] px-6 py-4">
                <div className="text-lg tracking-normal text-[var(--color-hex-666666)]">
                    PAGE {page}
                </div>
                <div className="flex gap-2">
                    <button
                        className="font-inherit tracking-wider-2 cursor-pointer rounded-[2px] border-none bg-[var(--color-hex-111111)] px-[12px] py-[6px] text-base font-semibold text-[var(--color-fg)]"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{ opacity: page === 1 ? 0.5 : 1 }}
                    >
                        PREV
                    </button>
                    <button
                        className="font-inherit tracking-wider-2 cursor-pointer rounded-[2px] border-none bg-[var(--color-hex-111111)] px-[12px] py-[6px] text-base font-semibold text-[var(--color-fg)]"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={reportsLength < 50}
                        style={{ opacity: reportsLength < 50 ? 0.5 : 1 }}
                    >
                        NEXT
                    </button>
                </div>
            </div>
        </div>
    );
}
