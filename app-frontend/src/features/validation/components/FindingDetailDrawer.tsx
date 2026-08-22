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
            onClick={() => setSelected(null)}
        >
            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-[400px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[28px] py-[24px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex justify-between">
                    <div>
                        <div className="text-[13px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                            {selected.id}
                        </div>
                        <div className="text-[9px] tracking-[0.14em] text-[var(--color-hex-666666)]">
                            {selected.type}
                        </div>
                    </div>
                    <button
                        onClick={() => setSelected(null)}
                        className="cursor-pointer border-none bg-[transparent] text-[14px] text-[var(--color-hex-444444)]"
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
                            <div className="mb-[1px] text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                {r.k}
                            </div>
                            <div className="text-[10px] text-[var(--color-hex-888888)]">{r.v}</div>
                        </div>
                    ))}

                    {selected.id in guardrails && (
                        <div className="mt-4 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-0a0a0a)] px-[12px] py-[10px]">
                            <div className="mb-2 text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                SUPERVISOR GUARDRAIL
                            </div>
                            <div
                                className="text-[10px] font-bold"
                                style={{
                                    color:
                                        guardrails[selected.id].verdict === "PASS"
                                            ? "var(--color-hex-3fb950)"
                                            : "var(--color-hex-ff2a32)",
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
                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-3fb95044)] bg-[transparent] px-[16px] py-[6px] text-[9.5px] tracking-[0.14em] text-[var(--color-hex-3fb950)] hover:border-[var(--color-hex-3fb950)] hover:bg-[var(--color-hex-0a1a0c)]"
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
                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-ff2a3244)] bg-[transparent] px-[16px] py-[6px] text-[9.5px] tracking-[0.14em] text-[var(--color-hex-ff2a32)] hover:border-[var(--color-hex-ff2a32)] hover:bg-[var(--color-hex-130408)]"
                        >
                            REJECT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
