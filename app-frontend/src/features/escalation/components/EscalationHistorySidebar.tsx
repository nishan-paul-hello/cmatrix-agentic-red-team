import { type EscalationHistoryEntry } from "@/features/escalation/domain/EscalationManager";

export function EscalationHistorySidebar({ history }: { history: EscalationHistoryEntry[] }) {
    return (
        <div
            className="flex w-[240px] flex-shrink-0 flex-col overflow-y-auto px-[14px] py-[16px]"
            style={{
                borderLeft: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div className="mb-[14px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
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
                    <div className="mb-[3px] text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                        {h.ts}
                    </div>
                    <div className="mb-[2px] text-[9px] font-semibold tracking-[0.08em] text-[var(--color-hex-666666)]">
                        {h.type}
                    </div>
                    <div className="mb-[1px] text-[8.5px] tracking-[0.1em] text-[var(--color-hex-3fb950)]">
                        {h.status}
                    </div>
                    <div className="text-[8.5px] text-[var(--color-hex-444444)] italic">
                        &quot;{h.response}&quot;
                    </div>
                </div>
            ))}
            <div className="mt-[8px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-d2992233)] bg-[var(--color-hex-110e00)] px-[12px] py-[10px]">
                <div className="mb-[4px] text-[8px] tracking-[0.16em] text-[var(--color-hex-d29922)]">
                    AGENT PAUSED
                </div>
                <div className="text-[8.5px] leading-[1.7] text-[var(--color-hex-444444)]">
                    All specialist threads suspended. Execution agent idle. Awaiting human
                    authorization.
                </div>
            </div>
        </div>
    );
}
