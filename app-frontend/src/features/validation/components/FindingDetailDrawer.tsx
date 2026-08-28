import React from "react";
import { FocusTrap } from "focus-trap-react";

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
                className="fixed inset-0 flex items-center justify-center bg-[var(--color-hex-00000088)]"
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
                    className="w-[400px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[28px] py-[24px]"
                >
                    <div className="mb-4 flex justify-between">
                        <div>
                            <div
                                id="finding-detail-title"
                                className="text-3xl font-bold tracking-normal text-[var(--color-fg)]"
                            >
                                {selected.id}
                            </div>
                            <div className="tracking-wider-1 text-base text-[var(--color-hex-666666)]">
                                {selected.type}
                            </div>
                        </div>
                        <button
                            onClick={() => setSelected(null)}
                            className="cursor-pointer border-none bg-[transparent] text-4xl text-[var(--color-hex-444444)]"
                        >
                            ✕
                        </button>
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
                                <div className="tracking-wider-3 mb-[1px] text-sm text-[var(--color-hex-444444)]">
                                    {r.k}
                                </div>
                                <div className="text-lg text-[var(--color-hex-888888)]">{r.v}</div>
                            </div>
                        ))}

                        {selected.id in guardrails && (
                            <div className="mt-4 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-0a0a0a)] px-[12px] py-[10px]">
                                <div className="mb-2 text-sm tracking-widest text-[var(--color-hex-444444)]">
                                    SUPERVISOR GUARDRAIL
                                </div>
                                <div
                                    className="text-lg font-bold"
                                    style={{
                                        color:
                                            guardrails[selected.id].verdict === "PASS"
                                                ? "var(--color-success)"
                                                : "var(--color-danger)",
                                    }}
                                >
                                    {guardrails[selected.id].verdict}
                                </div>
                            </div>
                        )}
                        <div className="mt-5 flex gap-3">
                            <button
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
                                className="font-inherit text-lg-tight tracking-wider-1 cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-3fb95044)] bg-[transparent] px-[16px] py-[6px] text-[var(--color-success)] hover:border-[var(--color-success)] hover:bg-[var(--color-hex-0a1a0c)]"
                            >
                                VERIFY
                            </button>
                            <button
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
                                className="font-inherit text-lg-tight tracking-wider-1 cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-ff2a3244)] bg-[transparent] px-[16px] py-[6px] text-[var(--color-danger)] hover:border-[var(--color-danger)] hover:bg-[var(--color-hex-130408)]"
                            >
                                REJECT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </FocusTrap>
    );
}
