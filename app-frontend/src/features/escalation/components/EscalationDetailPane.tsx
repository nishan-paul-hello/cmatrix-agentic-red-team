import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    ESCALATION_CATEGORIES,
    type EscalationCategory,
    type EscalationReason,
} from "@/features/escalation/domain/EscalationManager";

export function EscalationDetailPane({
    reason,
    activeReason,
    setActiveReason,
    contextBlocks,
    response,
    setResponse,
    handleSubmit,
    canApprove,
}: {
    reason: EscalationCategory;
    activeReason: EscalationReason;
    setActiveReason: (id: EscalationReason) => void;
    contextBlocks: { k: string; v: string }[];
    response: string;
    setResponse: (r: string) => void;
    handleSubmit: (type: "RESPONSE" | "AUTHORIZE_ALL" | "HALT") => void;
    canApprove: (action: string) => boolean;
}) {
    return (
        <div className="max-w-[680px] flex-1 overflow-y-auto px-6 py-6">
            {/* Alert banner */}
            <div
                className="mb-6 rounded-sm px-4 py-3.5"
                style={{
                    border: `1px solid ${reason.color}44`,
                    background: `${reason.color}0D`,
                    borderLeft: `3px solid ${reason.color}`,
                }}
            >
                <div
                    className="mb-1 text-sm font-bold tracking-widest"
                    style={{
                        color: reason.color,
                    }}
                >
                    ESCALATION REASON
                </div>
                <div className="text-foreground mb-1.5 text-sm font-bold tracking-tight">
                    {reason.label}
                </div>
                <div className="text-muted-foreground text-xs leading-loose">{reason.desc}</div>
            </div>

            {/* Reason selector */}
            <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                ESCALATION CATEGORY
            </div>
            <div className="mb-6 flex flex-col gap-2">
                {ESCALATION_CATEGORIES.map((r) => (
                    <button
                        type="button"
                        key={r.id}
                        onClick={() => setActiveReason(r.id)}
                        className={`focus:ring-primary hover:bg-background flex w-full cursor-pointer items-center gap-3 rounded-sm border border-solid px-3.5 py-2.5 text-left transition-colors focus:ring-1 focus:outline-none ${activeReason === r.id ? "bg-background" : "border-border bg-transparent"}`}
                        style={activeReason === r.id ? { borderColor: `${r.color}66` } : undefined}
                    >
                        <div
                            className={`h-2 w-2 shrink-0 rounded-full ${activeReason === r.id ? "" : "bg-transparent"}`}
                            style={{
                                border: `2px solid ${r.color}`,
                                backgroundColor: activeReason === r.id ? r.color : undefined,
                            }}
                        />
                        <div className="flex-1">
                            <div
                                className={`text-base font-bold tracking-tight ${activeReason === r.id ? "text-foreground" : "text-muted-foreground"}`}
                            >
                                {r.label}
                            </div>
                            {activeReason === r.id && (
                                <div className="text-muted-foreground mt-0.5 text-sm leading-snug">
                                    {r.desc}
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Mission context */}
            <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                MISSION CONTEXT
            </div>
            <div className="border-border mb-6 overflow-hidden rounded-sm border-[1px] border-solid">
                {contextBlocks.map((b) => (
                    <div key={b.k} className="border-border flex border-b">
                        <div className="text-muted-foreground border-border w-[120px] shrink-0 border-r px-3.5 py-2 text-sm font-semibold tracking-widest">
                            {b.k}
                        </div>
                        <div className="text-muted-foreground flex-1 px-3.5 py-2 text-xs">
                            {b.v}
                        </div>
                    </div>
                ))}
            </div>

            {/* Agent question */}
            <div className="text-muted-foreground mb-3 text-sm tracking-widest">AGENT QUESTION</div>
            <div className="border-border bg-background mb-5 rounded-sm border-[1px] border-solid px-4 py-4">
                <p className="leading-loose-2 text-muted-foreground m-0 text-xs">
                    I have confirmed SQL injection in{" "}
                    <span className="text-foreground font-bold">/api/users?id=</span> via time-based
                    blind technique (E_ord 4, CONFIRMED). The next step is full schema extraction
                    which will issue approximately{" "}
                    <span className="text-warning">800–1200 additional timed requests</span> over
                    15–20 minutes, incurring an estimated{" "}
                    <span className="text-primary">$0.40–0.60</span> additional cost.
                    <br />
                    <br />
                    Do you authorize proceeding with database schema dump, or should I halt at
                    current evidence level and proceed to oracle validation only?
                </p>
            </div>

            {/* Response input */}
            <div className="text-muted-foreground mb-2 text-sm tracking-widest">YOUR RESPONSE</div>
            <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Type your instructions…"
                className="bg-background text-muted-foreground focus-visible:border-primary box-border min-h-[96px] w-full resize-y rounded-sm px-3.5 py-2.5 text-xs leading-loose tracking-tighter shadow-none"
            />
            <div className="mt-4 flex gap-3">
                <Button
                    onClick={() => response.trim() && handleSubmit("RESPONSE")}
                    disabled={!response.trim() || !canApprove("RESPONSE")}
                    className={`text-foreground h-auto rounded-sm border-none px-5 py-2 text-base tracking-widest transition-colors duration-150 ${response.trim() ? "bg-primary hover:bg-destructive cursor-pointer" : "bg-border hover:bg-border cursor-not-allowed"}`}
                >
                    SEND RESPONSE
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleSubmit("AUTHORIZE_ALL")}
                    disabled={!canApprove("AUTHORIZE_ALL")}
                    className="text-success hover:border-success hover:bg-border hover:text-success h-auto cursor-pointer rounded-sm bg-transparent px-4 py-2 text-base tracking-widest"
                >
                    AUTHORIZE ALL
                </Button>
                <Button
                    variant="outline"
                    onClick={() => handleSubmit("HALT")}
                    disabled={!canApprove("HALT")}
                    className="text-destructive hover:border-destructive hover:bg-border hover:text-destructive h-auto cursor-pointer rounded-sm bg-transparent px-4 py-2 text-base tracking-widest"
                >
                    HALT MISSION
                </Button>
            </div>
            {!response.trim() && (
                <div className="text-muted-foreground mt-1 text-sm tracking-normal">
                    TYPE A RESPONSE TO ENABLE SUBMIT
                </div>
            )}
        </div>
    );
}
