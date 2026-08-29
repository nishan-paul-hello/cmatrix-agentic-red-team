import { type EscalationHistoryEntry } from "@/features/escalation/domain/EscalationManager";

export function EscalationHistorySidebar({ history }: { history: EscalationHistoryEntry[] }) {
    return (
        <div className="border-border lg:w-panel-sm flex w-full flex-shrink-0 flex-col overflow-y-auto border-t px-3.5 py-4 lg:border-t-0 lg:border-l">
            <div className="text-muted-foreground mb-3.5 text-sm tracking-widest">
                ESCALATION HISTORY
            </div>
            {history.map((h) => (
                <div key={h.ts} className="border-border mb-3 border-b">
                    <div className="text-muted-foreground mb-0.5 text-sm tracking-normal">
                        {h.ts}
                    </div>
                    <div className="text-muted-foreground mb-0.5 text-base font-semibold tracking-tight">
                        {h.type}
                    </div>
                    <div className="text-success mb-px text-sm tracking-normal">{h.status}</div>
                    <div className="text-muted-foreground text-sm italic">
                        &quot;{h.response}&quot;
                    </div>
                </div>
            ))}
            <div className="border-border bg-muted mt-2 rounded-sm border-[1px] border-solid px-3 py-2.5">
                <div className="text-warning mb-1 text-sm tracking-widest">AGENT PAUSED</div>
                <div className="text-muted-foreground text-sm leading-relaxed">
                    All specialist threads suspended. Execution agent idle. Awaiting human
                    authorization.
                </div>
            </div>
        </div>
    );
}
