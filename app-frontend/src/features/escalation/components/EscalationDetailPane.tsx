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
                                activeReason === r.id ? "var(--color-hex-0d0d0d)" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                activeReason === r.id ? "var(--color-hex-0d0d0d)" : "transparent")
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
                                i < a.length - 1 ? "1px solid var(--color-hex-141414)" : "none",
                            background:
                                i % 2 ? "var(--color-hex-0b0b0b)" : "var(--color-hex-0d0d0d)",
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
                    <span className="font-bold text-[var(--color-hex-f2f2f2)]">/api/users?id=</span>{" "}
                    via time-based blind technique (E_ord 4, CONFIRMED). The next step is full
                    schema extraction which will issue approximately{" "}
                    <span className="text-[var(--color-hex-d29922)]">
                        800–1200 additional timed requests
                    </span>{" "}
                    over 15–20 minutes, incurring an estimated{" "}
                    <span className="text-[var(--color-hex-e31b23)]">$0.40–0.60</span> additional
                    cost.
                    <br />
                    <br />
                    Do you authorize proceeding with database schema dump, or should I halt at
                    current evidence level and proceed to oracle validation only?
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
    );
}
