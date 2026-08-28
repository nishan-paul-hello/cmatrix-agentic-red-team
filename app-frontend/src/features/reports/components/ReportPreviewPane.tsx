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
                            <div className="text-xl font-bold tracking-tight text-[var(--color-fg)]">
                                {sel.id} — {sel.type}
                            </div>
                            <div className="text-base-tight mt-[2px] tracking-normal text-[var(--color-hex-444444)]">
                                {sel.mission} · {sel.generated}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {["DOWNLOAD PDF", "COPY LINK"].map((a) => (
                                <button
                                    key={a}
                                    className="font-inherit text-base-tight rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[transparent] px-[12px] py-[5px] tracking-normal text-[var(--color-hex-a0a0a0)]"
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
                                className="h-[8px] w-[8px] animate-pulse bg-[var(--color-brand)]"
                            />
                            <div className="text-base tracking-widest text-[var(--color-hex-444444)]">
                                GENERATING REPORT…
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto">
                            <div className="mx-auto max-w-[720px] px-8 py-6">
                                {/* Report cover block */}
                                <div className="mb-[24px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[24px] py-[20px]">
                                    <div className="text-base-tight mb-[6px] tracking-widest text-[var(--color-hex-444444)]">
                                        RedGrid REPORT
                                    </div>
                                    <div className="mb-[4px] text-8xl font-bold tracking-normal text-[var(--color-fg)]">
                                        {sel.type}
                                    </div>
                                    <div className="mb-[12px] text-base tracking-normal text-[var(--color-brand)]">
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
                                                <div className="text-sm-tight tracking-wider-2 mb-[2px] text-[var(--color-hex-444444)]">
                                                    {m.k}
                                                </div>
                                                <div
                                                    className="text-2xl font-bold"
                                                    style={{
                                                        color: m.red
                                                            ? "var(--color-danger)"
                                                            : "var(--color-fg)",
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
                                            <div className="h-[14px] w-[2px] bg-[var(--color-brand)]" />
                                            <span className="text-base font-bold tracking-widest text-[var(--color-fg)]">
                                                {s.title}
                                            </span>
                                        </div>
                                        {s.content && (
                                            <p
                                                className="text-xl-tight leading-loose-2 text-[var(--color-hex-666666)]"
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
                                                            className="text-base-tight min-w-[60px] font-bold tracking-wide"
                                                            style={{
                                                                color:
                                                                    item.sev === "CRITICAL"
                                                                        ? "var(--color-danger)"
                                                                        : "var(--color-brand)",
                                                            }}
                                                        >
                                                            {item.sev}
                                                        </span>
                                                        <span className="text-lg-tight min-w-[50px] font-bold text-[var(--color-brand)]">
                                                            {item.id}
                                                        </span>
                                                        <span className="flex-1 text-lg text-[var(--color-hex-888888)]">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-base text-[var(--color-hex-444444)]">
                                                            {item.target}
                                                        </span>
                                                        <span className="text-base font-bold text-[var(--color-success)]">
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
