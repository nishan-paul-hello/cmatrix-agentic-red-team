import React from "react";
import { FocusTrap } from "focus-trap-react";

import { Button } from "@/components/ui/button";
import { type VFinding } from "@/features/validation/data/fixtures/validationMockData";
import { type TelemetryEventName } from "@/hooks/useTelemetry";
import { type GuardrailResult } from "@/types/domain-types";

export function FindingDetailDrawer({
    selected,
    setSelected,
    guardrails,
    updateFindingStatus,
    addGuardrailResult,
    logEvent,
}: {
    selected: VFinding;
    setSelected: (f: VFinding | null) => void;
    guardrails: Record<string, GuardrailResult>;
    updateFindingStatus: (f: VFinding, status: "VALIDATED" | "RULED_OUT") => boolean;
    addGuardrailResult: (r: GuardrailResult) => void;
    logEvent: (event: TelemetryEventName, meta?: Record<string, unknown>) => void;
}) {
    return (
        <FocusTrap focusTrapOptions={{ escapeDeactivates: false }}>
            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Escape" || e.key === "Enter") {
                        setSelected(null);
                    }
                }}
                className="bg-muted fixed inset-0 flex items-center justify-center"
                style={{
                    zIndex: 50,
                }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setSelected(null);
                    }
                }}
            >
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="finding-detail-title"
                    className="border-border bg-card w-full max-w-[400px] rounded-sm border-[1px] border-solid px-7 py-6 sm:w-[400px]"
                >
                    <div className="mb-4 flex justify-between">
                        <div>
                            <div
                                id="finding-detail-title"
                                className="text-foreground text-sm font-bold tracking-normal"
                            >
                                {selected.id}
                            </div>
                            <div className="text-muted-foreground text-base tracking-widest">
                                {selected.type}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => setSelected(null)}
                            className="text-muted-foreground"
                        >
                            ✕
                        </Button>
                    </div>
                    <div className="flex flex-col gap-3">
                        {[
                            {
                                k: "STATUS",
                                v: selected.status,
                            },
                            {
                                k: "EVIDENCE",
                                v: selected.evidence,
                            },
                            {
                                k: "ORACLE",
                                v: selected.oracle,
                            },
                            {
                                k: "RETRY COUNT",
                                v: String(selected.retry),
                            },
                        ].map((r) => (
                            <div key={r.k}>
                                <div className="text-muted-foreground mb-px text-sm tracking-widest">
                                    {r.k}
                                </div>
                                <div className="text-muted-foreground text-xs">{r.v}</div>
                            </div>
                        ))}

                        {selected.id in guardrails && (
                            <div className="border-border bg-background mt-4 rounded-sm border-[1px] border-solid px-3 py-2.5">
                                <div className="text-muted-foreground mb-2 text-sm tracking-widest">
                                    SUPERVISOR GUARDRAIL
                                </div>
                                <div
                                    className="text-xs font-bold"
                                    style={{
                                        color:
                                            guardrails[selected.id].verdict === "PASS"
                                                ? "var(--success)"
                                                : "var(--destructive)",
                                    }}
                                >
                                    {guardrails[selected.id].verdict}
                                </div>
                            </div>
                        )}
                        <div className="mt-5 flex gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (updateFindingStatus(selected, "VALIDATED")) {
                                        addGuardrailResult({
                                            findingId: selected.id,
                                            verifiedBy: "SUPERVISOR",
                                            verdict: "PASS",
                                        });
                                        logEvent("FINDING_VERIFIED", {
                                            findingId: selected.id,
                                        });
                                    }
                                }}
                                className="text-success hover:border-success hover:bg-muted text-xs tracking-widest"
                            >
                                VERIFY
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (updateFindingStatus(selected, "RULED_OUT")) {
                                        addGuardrailResult({
                                            findingId: selected.id,
                                            verifiedBy: "SUPERVISOR",
                                            verdict: "FAIL",
                                        });
                                        logEvent("FINDING_REJECTED", {
                                            findingId: selected.id,
                                        });
                                    }
                                }}
                                className="text-destructive hover:border-destructive hover:bg-muted text-xs tracking-widest"
                            >
                                REJECT
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </FocusTrap>
    );
}
