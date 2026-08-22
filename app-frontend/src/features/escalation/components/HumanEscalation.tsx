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
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <div className="flex items-baseline gap-4">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        HUMAN ESCALATION
                    </h1>
                    <div className="flex items-center gap-2">
                        <div
                            className="h-[7px] w-[7px] bg-[var(--color-hex-ff2a32)]"
                            style={{
                                borderRadius: "50%",
                                animation: "pulse 1.2s ease infinite",
                            }}
                        />
                        <span className="text-[9px] font-bold tracking-[0.16em] text-[var(--color-hex-ff2a32)]">
                            AWAITING RESPONSE
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* Left: escalation detail */}
                <div className="max-w-[680px] flex-1 overflow-y-auto px-6 py-6">
                    {/* Alert banner */}
                    <div
                        className="mb-[24px] rounded-[2px] px-[18px] py-[14px]"
                        style={{
                            border: `1px solid ${reason.color}44`,
                            background: `${reason.color}0D`,
                            borderLeft: `3px solid ${reason.color}`,
                        }}
                    >
                        <div
                            className="mb-[4px] text-[8.5px] font-bold tracking-[0.2em]"
                            style={{
                                color: reason.color,
                            }}
                        >
                            ESCALATION REASON
                        </div>
                        <div className="mb-[6px] text-[13px] font-bold tracking-[0.08em] text-[var(--color-hex-f2f2f2)]">
                            {reason.label}
                        </div>
                        <div className="text-[10px] leading-[1.8] text-[var(--color-hex-888888)]">
                            {reason.desc}
                        </div>
                    </div>

                    {/* Reason selector */}
                    <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        ESCALATION CATEGORY
                    </div>
                    <div className="mb-6 flex flex-col gap-2">
                        {ESCALATION_CATEGORIES.map((r) => (
                            <div
                                key={r.id}
                                onClick={() => setActiveReason(r.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        setActiveReason(r.id);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                                className="cursor-pointer rounded-[2px] px-[14px] py-[10px]"
                                style={{
                                    border: `1px solid ${activeReason === r.id ? `${r.color}66` : "var(--color-hex-1e1e1e)"}`,
                                    background:
                                        activeReason === r.id
                                            ? "var(--color-hex-0d0d0d)"
                                            : "transparent",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        activeReason === r.id
                                            ? "var(--color-hex-0d0d0d)"
                                            : "transparent")
                                }
                            >
                                <div
                                    className="h-[8px] w-[8px] shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                        border: `2px solid ${r.color}`,
                                        background: activeReason === r.id ? r.color : "transparent",
                                    }}
                                />
                                <div className="flex-1">
                                    <div
                                        className="text-[9.5px] font-bold tracking-[0.08em]"
                                        style={{
                                            color:
                                                activeReason === r.id
                                                    ? "var(--color-hex-f2f2f2)"
                                                    : "var(--color-hex-555555)",
                                        }}
                                    >
                                        {r.label}
                                    </div>
                                    {activeReason === r.id && (
                                        <div className="mt-[2px] text-[8.5px] leading-[1.5] text-[var(--color-hex-444444)]">
                                            {r.desc}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mission context */}
                    <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        MISSION CONTEXT
                    </div>
                    <div className="mb-[24px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                        {contextBlocks.map((b, i, a) => (
                            <div
                                key={b.k}
                                className="flex"
                                style={{
                                    borderBottom:
                                        i < a.length - 1
                                            ? "1px solid var(--color-hex-141414)"
                                            : "none",
                                    background:
                                        i % 2
                                            ? "var(--color-hex-0b0b0b)"
                                            : "var(--color-hex-0d0d0d)",
                                }}
                            >
                                <div
                                    className="w-[120px] shrink-0 px-[14px] py-[8px] text-[8px] font-semibold tracking-[0.18em] text-[var(--color-hex-444444)]"
                                    style={{
                                        borderRight: "1px solid var(--color-hex-141414)",
                                    }}
                                >
                                    {b.k}
                                </div>
                                <div className="flex-1 px-[14px] py-[8px] text-[10px] text-[var(--color-hex-888888)]">
                                    {b.v}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Agent question */}
                    <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        AGENT QUESTION
                    </div>
                    <div className="mb-[20px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-0a0a0a)] px-[18px] py-[16px]">
                        <p
                            className="text-[11px] leading-[1.9] text-[var(--color-hex-a0a0a0)]"
                            style={{
                                margin: 0,
                            }}
                        >
                            I have confirmed SQL injection in{" "}
                            <span className="font-bold text-[var(--color-hex-f2f2f2)]">
                                /api/users?id=
                            </span>{" "}
                            via time-based blind technique (E_ord 4, CONFIRMED). The next step is
                            full schema extraction which will issue approximately{" "}
                            <span className="text-[var(--color-hex-d29922)]">
                                800–1200 additional timed requests
                            </span>{" "}
                            over 15–20 minutes, incurring an estimated{" "}
                            <span className="text-[var(--color-hex-e31b23)]">$0.40–0.60</span>{" "}
                            additional cost.
                            <br />
                            <br />
                            Do you authorize proceeding with database schema dump, or should I halt
                            at current evidence level and proceed to oracle validation only?
                        </p>
                    </div>

                    {/* Response input */}
                    <div className="mb-[8px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                        YOUR RESPONSE
                    </div>
                    <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="Type your instructions…"
                        className="font-inherit min-h-[96px] w-full rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)] px-[14px] py-[10px] text-[10px] leading-[1.8] tracking-[0.04em] text-[var(--color-hex-a0a0a0)] outline-none"
                        style={{
                            resize: "vertical",
                            boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "var(--color-hex-e31b23)")}
                        onBlur={(e) => (e.target.style.borderColor = "var(--color-hex-292929)")}
                    />
                    <div className="mt-4 flex gap-3">
                        <button
                            onClick={() => response.trim() && handleSubmit("RESPONSE")}
                            disabled={!response.trim() || !canApprove("RESPONSE")}
                            className="font-inherit rounded-[2px] border-none px-[20px] py-[8px] text-[9.5px] tracking-[0.14em] text-[var(--color-hex-f2f2f2)]"
                            style={{
                                background: response.trim()
                                    ? "var(--color-hex-e31b23)"
                                    : "var(--color-hex-1a1a1a)",
                                cursor: response.trim() ? "pointer" : "not-allowed",
                                transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) =>
                                response.trim() &&
                                (e.currentTarget.style.background = "var(--color-hex-ff2a32)")
                            }
                            onMouseLeave={(e) =>
                                response.trim() &&
                                (e.currentTarget.style.background = "var(--color-hex-e31b23)")
                            }
                        >
                            SEND RESPONSE
                        </button>
                        <button
                            onClick={() => handleSubmit("AUTHORIZE_ALL")}
                            disabled={!canApprove("AUTHORIZE_ALL")}
                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-3fb95044)] bg-[transparent] px-[18px] py-[8px] text-[9.5px] tracking-[0.14em] text-[var(--color-hex-3fb950)]"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-hex-3fb950)";
                                e.currentTarget.style.background = "var(--color-hex-0a1a0c)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-hex-3fb95044)";
                                e.currentTarget.style.background = "transparent";
                            }}
                        >
                            AUTHORIZE ALL
                        </button>
                        <button
                            onClick={() => handleSubmit("HALT")}
                            disabled={!canApprove("HALT")}
                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-ff2a3244)] bg-[transparent] px-[18px] py-[8px] text-[9.5px] tracking-[0.14em] text-[var(--color-hex-ff2a32)]"
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-hex-ff2a32)";
                                e.currentTarget.style.background = "var(--color-hex-130408)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = "var(--color-hex-ff2a3244)";
                                e.currentTarget.style.background = "transparent";
                            }}
                        >
                            HALT MISSION
                        </button>
                    </div>
                    {!response.trim() && (
                        <div className="mt-[4px] text-[8.5px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                            TYPE A RESPONSE TO ENABLE SUBMIT
                        </div>
                    )}
                </div>

                {/* Right: escalation history */}
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
            </div>
            <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
        </div>
    );
}
function EscalationSubmitted() {
    return (
        <div className="flex h-full min-h-[0px] flex-col items-center justify-center gap-5">
            <div
                className="h-[40px] w-[40px] border-[2px] border-solid border-[var(--color-hex-3fb950)]"
                style={{
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <span className="text-[18px] text-[var(--color-hex-3fb950)]">✓</span>
            </div>
            <div className="text-[13px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                RESPONSE SUBMITTED
            </div>
            <div className="text-[9px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                AGENT RESUMING — SPECIALISTS REACTIVATED
            </div>
        </div>
    );
}
