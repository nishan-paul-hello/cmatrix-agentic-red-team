import { Button } from "@/components/ui/button";
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
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            {!sel ? (
                <div className="flex flex-1 items-center justify-center">
                    <EmptyState message="SELECT A REPORT TO PREVIEW" />
                </div>
            ) : (
                <>
                    {/* Preview header */}
                    <div className="bg-background border-border flex flex-shrink-0 items-center justify-between border-b px-6 py-3">
                        <div>
                            <div className="text-foreground text-xs font-bold tracking-tight">
                                {sel.id} - {sel.type}
                            </div>
                            <div className="text-muted-foreground mt-0.5 text-sm tracking-normal">
                                {sel.mission} · {sel.generated}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {["DOWNLOAD PDF", "COPY LINK"].map((a) => (
                                <Button
                                    key={a}
                                    variant="outline"
                                    className="h-auto rounded-sm px-3 py-1 text-sm tracking-normal"
                                    disabled={sel.status !== "READY"}
                                >
                                    {a}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {sel.status === "GENERATING" ? (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3">
                            <div className="bg-primary h-2 w-2 pulse-dot rounded-full" />
                            <div className="text-muted-foreground text-base tracking-widest">
                                GENERATING REPORT...
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto">
                            <div className="mx-auto max-w-[720px] px-8 py-6">
                                {/* Report cover block */}
                                <div className="border-border bg-background mb-6 rounded-sm border-[1px] border-solid px-6 py-5">
                                    <div className="text-muted-foreground mb-1.5 text-sm tracking-widest">
                                        RedGrid REPORT
                                    </div>
                                    <div className="text-foreground mb-1 text-xs font-bold tracking-normal">
                                        {sel.type}
                                    </div>
                                    <div className="text-primary mb-3 text-base tracking-normal">
                                        MISSION {sel.mission}
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
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
                                                <div className="text-muted-foreground mb-0.5 text-xs tracking-widest">
                                                    {m.k}
                                                </div>
                                                <div
                                                    className={`text-xs font-bold ${m.red ? "text-destructive" : "text-foreground"}`}
                                                >
                                                    {m.v}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {previewSections.map((s, i) => (
                                    <div key={s.title} className="mb-6">
                                        <div className="mb-4 flex items-center gap-3">
                                            <div className="bg-primary h-3.5 w-0.5" />
                                            <span className="text-foreground text-base font-bold tracking-widest">
                                                {s.title}
                                            </span>
                                        </div>
                                        {s.content && (
                                            <p className="text-muted-foreground mb-3 text-sm leading-relaxed break-words whitespace-pre-line last:mb-0">
                                                {s.content}
                                            </p>
                                        )}
                                        {s.items && (
                                            <div className="border-border overflow-hidden rounded-sm border-[1px] border-solid">
                                                {s.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="border-border grid grid-cols-[auto_auto_1fr_auto_auto] items-center gap-4 border-b px-3.5 py-2 text-sm sm:grid-cols-[60px_50px_1fr_auto_auto]"
                                                    >
                                                        <span
                                                            className={`min-w-[60px] text-sm font-bold tracking-wide ${item.sev === "CRITICAL" ? "text-destructive" : "text-primary"}`}
                                                        >
                                                            {item.sev}
                                                        </span>
                                                        <span className="text-primary font-bold">
                                                            {item.id}
                                                        </span>
                                                        <span className="text-muted-foreground truncate">
                                                            {item.name}
                                                        </span>
                                                        <span className="text-muted-foreground">
                                                            {item.target}
                                                        </span>
                                                        <span className="text-success font-bold">
                                                            E_ord {item.eord}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {i < previewSections.length - 1 && (
                                            <div className="bg-card mt-5 h-px" />
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
