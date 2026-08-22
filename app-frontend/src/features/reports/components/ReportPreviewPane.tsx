import { EmptyState } from "@/components/ui/EmptyState";
import { type Report } from "@/features/reports/data/fixtures/reportsMockData";

export function ReportPreviewPane({
    sel,
    previewSections,
}: {
    sel: Report | null;
    previewSections: {
        title: string;
        content?: string;
        items?: { id: string; name: string; target: string; sev: string; eord: string }[];
    }[];
}) {
    return (
        <div className="flex min-h-[0px] flex-1 flex-col overflow-hidden">
            {!sel ? (
                <div className="flex flex-1 items-center justify-center">
                    <EmptyState message="SELECT A REPORT TO PREVIEW" />
                </div>
            ) : (
                <>
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
                        <div className="flex-1 overflow-y-auto">
                            <div className="mx-auto max-w-[720px] px-8 py-6">
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
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
