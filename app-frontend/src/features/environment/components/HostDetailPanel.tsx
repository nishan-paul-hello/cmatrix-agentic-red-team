import { type HostNode } from "@/types/domain-types";

export function HostDetailPanel({ sel }: { sel: HostNode | undefined }) {
    return (
        <div className="lg:w-panel-sm bg-background border-border w-full flex-shrink-0 overflow-y-auto border-t lg:border-t-0 lg:border-l">
            {sel ? (
                <>
                    <div className="border-border border-b px-5 pt-5 pb-4">
                        <div className="text-muted-foreground mb-1.5 text-sm tracking-widest">
                            HOST DETAIL
                        </div>
                        <div className="text-foreground mb-0.5 text-sm font-bold tracking-normal">
                            {sel.ip}
                        </div>
                        <div className="text-primary text-base tracking-widest">{sel.id}</div>
                    </div>
                    <div className="border-border flex flex-col gap-3 border-b px-5 py-4">
                        {[
                            {
                                k: "HOSTNAME",
                                v: sel.hostname,
                            },
                            {
                                k: "ROLE",
                                v: sel.role,
                            },
                            {
                                k: "OS",
                                v: sel.os,
                            },
                            {
                                k: "STATUS",
                                v: sel.status,
                            },
                            {
                                k: "E_ord",
                                v: `${sel.eord} / 5`,
                            },
                        ].map((r) => (
                            <div key={r.k}>
                                <div className="text-muted-foreground mb-px text-xs tracking-widest">
                                    {r.k}
                                </div>
                                <div className="text-muted-foreground text-xs tracking-tight">
                                    {r.v}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-border border-b px-5 py-4">
                        <div className="text-muted-foreground mb-2 text-xs tracking-widest">
                            OPEN SERVICES
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {sel.services.map((s: string) => (
                                <div key={s} className="flex items-center gap-2">
                                    <div className="bg-success h-1 w-1 shrink-0 rounded-full" />
                                    <span className="text-muted-foreground text-base tracking-tight">
                                        {s}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {sel.edges.length > 0 && (
                        <div className="px-5 py-4">
                            <div className="text-muted-foreground mb-2 text-xs tracking-widest">
                                LATERAL EDGES
                            </div>
                            {sel.edges.map((e) => (
                                <div
                                    key={e.to}
                                    className="border-border bg-background rounded-sm border-[1px] border-solid px-2.5 py-2"
                                >
                                    <div className="text-primary mb-0.5 text-base tracking-normal">
                                        → {e.to}
                                    </div>
                                    <div className="text-muted-foreground mb-0.5 text-sm tracking-tight">
                                        {e.label}
                                    </div>
                                    <div className="text-muted-foreground text-sm tracking-tight">
                                        {e.detail}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-xs tracking-widest">
                    SELECT A HOST
                </div>
            )}
        </div>
    );
}
