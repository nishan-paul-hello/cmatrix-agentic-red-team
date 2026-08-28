import { useState } from "react";

import { emitAuditEvent } from "@/features/audit/emitAuditEvent";
import {
    ESCALATION_CATEGORIES,
    globalEscalationManager,
    shouldEscalate,
    type EscalationReason,
} from "@/features/escalation/domain/EscalationManager";
import { useEscalationData } from "@/features/escalation/hooks/useEscalationData";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useAuth } from "@/lib/auth-context";
import { useServices } from "@/lib/services-context";
import { type RiskAssessment } from "@/types/domain-types";

import { EscalationDetailPane } from "./EscalationDetailPane";
import { EscalationHistorySidebar } from "./EscalationHistorySidebar";

export default function HumanEscalation() {
    const [activeReason, setActiveReason] = useState<EscalationReason>("HIGH_RISK_ACTION");
    const [response, setResponse] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [, setError] = useState<string | null>(null);
    const { logEvent } = useTelemetry();
    const { eventBus } = useServices();
    const { canApprove } = useAuth();
    const reason = ESCALATION_CATEGORIES.find((r) => r.id === activeReason);
    const history = globalEscalationManager.getHistory();

    const { contextBlocks } = useEscalationData();

    const [assessment] = useState<RiskAssessment>({ score: 85, threshold: 80 });

    if (!shouldEscalate(assessment)) {
        return null;
    }

    const handleSubmit = (type: "RESPONSE" | "AUTHORIZE_ALL" | "HALT") => {
        setSubmitted(true);
        setError(null);

        // Optimistic update wrapper
        Promise.resolve()
            .then(() => {
                // Mock network delay
                return new Promise((resolve) => setTimeout(resolve, 500));
            })
            .then(() => {
                logEvent("ESCALATION_APPROVED", { reason: activeReason, type, response });
                emitAuditEvent(eventBus, {
                    type: "ESCALATION",
                    actor: "user",
                    action: type,
                    resource: `escalation/${activeReason}`,
                    result: type === "HALT" ? "FAILURE" : "SUCCESS",
                    detail: `Human escalation resolved via ${type}`,
                });
            })
            .catch((_err) => {
                setSubmitted(false);
                setError("Failed to apply decision. Please try again.");
            });
    };

    if (!reason) {
        return null;
    }
    if (submitted) {
        return <EscalationSubmitted />;
    }
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Header */}
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="tracking-widest-2 mb-[3px] text-base text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <div className="flex items-baseline gap-4">
                    <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        HUMAN ESCALATION
                    </h1>
                    <div className="flex items-center gap-2">
                        <div
                            className="h-[7px] w-[7px] bg-[var(--color-danger)]"
                            style={{
                                borderRadius: "50%",
                                animation: "pulse 1.2s ease infinite",
                            }}
                        />
                        <span className="tracking-wider-2 text-base font-bold text-[var(--color-danger)]">
                            AWAITING RESPONSE
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* Left: escalation detail */}
                <EscalationDetailPane
                    reason={reason}
                    activeReason={activeReason}
                    setActiveReason={setActiveReason}
                    contextBlocks={contextBlocks}
                    response={response}
                    setResponse={setResponse}
                    handleSubmit={handleSubmit}
                    canApprove={canApprove}
                />

                {/* Right: escalation history */}
                <EscalationHistorySidebar history={history} />
            </div>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
        </div>
    );
}
function EscalationSubmitted() {
    return (
        <div className="flex h-full min-h-[0px] flex-col items-center justify-center gap-5">
            <div
                className="h-[40px] w-[40px] border-[2px] border-solid border-[var(--color-success)]"
                style={{
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span className="text-8xl text-[var(--color-success)]">✓</span>
            </div>
            <div className="text-3xl font-bold tracking-normal text-[var(--color-fg)]">
                RESPONSE SUBMITTED
            </div>
            <div className="tracking-wider-1 text-base text-[var(--color-hex-444444)]">
                AGENT RESUMING — SPECIALISTS REACTIVATED
            </div>
        </div>
    );
}
