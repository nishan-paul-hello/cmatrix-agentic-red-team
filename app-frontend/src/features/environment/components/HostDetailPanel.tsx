import { type HostNode } from "@/types/domain-types";

export function HostDetailPanel({ sel }: { sel: HostNode | undefined }) {
    return (
        <div className="w-panel-sm flex-shrink-0 overflow-y-auto bg-[var(--color-hex-0b0b0b)]">
            {sel ? (
                <>
                    <div
                        className="px-5 pt-5 pb-4"
                        style={{
                            borderBottom: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        <div className="mb-[6px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                            HOST DETAIL
                        </div>
                        <div className="mb-[2px] text-3xl font-bold tracking-normal text-[var(--color-fg)]">
                            {sel.ip}
                        </div>
                        <div className="tracking-wider-1 text-base text-[var(--color-brand)]">
                            {sel.id}
                        </div>
                    </div>
                    <div
                        className="flex flex-col gap-3 px-5 py-4"
                        style={{
                            borderBottom: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
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
                                <div className="text-sm-tight tracking-wider-3 mb-[1px] text-[var(--color-hex-444444)]">
                                    {r.k}
                                </div>
                                <div className="tracking-tight-1 text-lg text-[var(--color-hex-888888)]">
                                    {r.v}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        className="px-5 py-4"
                        style={{
                            borderBottom: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        <div className="text-sm-tight mb-[8px] tracking-widest text-[var(--color-hex-444444)]">
                            OPEN SERVICES
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {sel.services.map((s: string) => (
                                <div key={s} className="flex items-center gap-2">
                                    <div
                                        className="h-[5px] w-[5px] shrink-0 bg-[var(--color-success)]"
                                        style={{
                                            borderRadius: "50%",
                                        }}
                                    />
                                    <span className="text-lg-tight tracking-tight-1 text-[var(--color-hex-666666)]">
                                        {s}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {sel.edges.length > 0 && (
                        <div className="px-5 py-4">
                            <div className="text-sm-tight mb-[8px] tracking-widest text-[var(--color-hex-444444)]">
                                LATERAL EDGES
                            </div>
                            {sel.edges.map((e) => (
                                <div
                                    key={e.to}
                                    className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[10px] py-[8px]"
                                >
                                    <div className="mb-[3px] text-base tracking-normal text-[var(--color-brand)]">
                                        → {e.to}
                                    </div>
                                    <div className="text-base-tight tracking-tight-1 mb-[2px] text-[var(--color-hex-555555)]">
                                        {e.label}
                                    </div>
                                    <div className="tracking-tight-1 text-sm text-[var(--color-hex-444444)]">
                                        {e.detail}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="tracking-wider-2 flex h-full items-center justify-center text-lg text-[var(--color-hex-222222)]">
                    SELECT A HOST
                </div>
            )}
        </div>
    );
}
