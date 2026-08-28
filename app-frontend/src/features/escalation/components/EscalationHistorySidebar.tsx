import { type EscalationHistoryEntry } from "@/features/escalation/domain/EscalationManager";

export function EscalationHistorySidebar({ history }: { history: EscalationHistoryEntry[] }) {
    return (
        <div
            className="flex w-[240px] flex-shrink-0 flex-col overflow-y-auto px-[14px] py-[16px]"
            style={{
                borderLeft: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div className="mb-[14px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                ESCALATION HISTORY
            </div>
            {history.map((h) => (
                <div
                    key={h.ts}
                    className="mb-[12px]"
                    style={{
                        paddingBottom: 12,
                        borderBottom: "1px solid var(--color-hex-141414)",
                    }}
                >
                    <div className="mb-[3px] text-sm tracking-normal text-[var(--color-hex-333333)]">
                        {h.ts}
                    </div>
                    <div className="mb-[2px] text-base font-semibold tracking-tight text-[var(--color-hex-666666)]">
                        {h.type}
                    </div>
                    <div className="text-base-tight mb-[1px] tracking-normal text-[var(--color-success)]">
                        {h.status}
                    </div>
                    <div className="text-base-tight text-[var(--color-hex-444444)] italic">
                        &quot;{h.response}&quot;
                    </div>
                </div>
            ))}
            <div className="mt-[8px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-d2992233)] bg-[var(--color-hex-110e00)] px-[12px] py-[10px]">
                <div className="tracking-wider-2 mb-[4px] text-sm text-[var(--color-warning)]">
                    AGENT PAUSED
                </div>
                <div className="text-base-tight leading-relaxed text-[var(--color-hex-444444)]">
                    All specialist threads suspended. Execution agent idle. Awaiting human
                    authorization.
                </div>
            </div>
        </div>
    );
}
