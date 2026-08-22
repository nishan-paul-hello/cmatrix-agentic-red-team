import { AUDIT_EVENT } from "@/features/audit/hooks/useAuditFeed";
import MetaRow from "@/features/missions/components/wizard/MetaRow";
import { Step1 } from "@/features/missions/components/wizard/Step1";
import { Step2 } from "@/features/missions/components/wizard/Step2";
import { Step3 } from "@/features/missions/components/wizard/Step3";
import { Step4 } from "@/features/missions/components/wizard/Step4";
import { Step5 } from "@/features/missions/components/wizard/Step5";
import {
    WizardContext,
    type WizardContextType,
} from "@/features/missions/components/wizard/WizardContext";
import { STEPS } from "@/features/missions/data/wizardMockData";
import { AUDIT_RESULT, type AuditEntry } from "@/types/domain-types";

export default function NewMissionWizardView(props: WizardContextType) {
    const { eventBus, logEvent } = props;
    const {
        step,
        setStep,
        targetType,
        mode,
        target,
        surface,
        roe,
        maxRuntime,
        costCeiling,
        toolTimeout,
        onCancel,
        onStart,
    } = props;
    const costNum = parseFloat(costCeiling) || 0;
    const runtimeNum = parseInt(maxRuntime) || 0;
    const timeoutNum = parseInt(toolTimeout) || 0;
    function runtimeLabel() {
        if (!runtimeNum) {
            return "—";
        }
        return `${runtimeNum} min / vulnerability`;
    }
    return (
        <WizardContext.Provider value={props}>
            <div className="flex h-full min-h-[0px] flex-col">
                {/* Page header */}
                <div
                    className="flex-shrink-0 px-6 pt-5 pb-4"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                        MISSIONS
                    </div>
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                            NEW MISSION
                        </h1>
                        <span className="text-[10px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            MISSION CONFIGURATION WIZARD
                        </span>
                    </div>
                </div>

                {/* Step indicator */}
                <div
                    className="flex-shrink-0 bg-[var(--color-hex-0b0b0b)] px-6 py-4"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div className="flex items-center">
                        {STEPS.map((s, i) => {
                            const active = s.index === step;
                            const done = s.index < step;
                            return (
                                <div key={s.id} className="flex items-center">
                                    {i > 0 && (
                                        <div
                                            className="h-[1px] w-[40px] shrink-0"
                                            style={{
                                                background: done
                                                    ? "var(--color-hex-e31b23)"
                                                    : "var(--color-hex-292929)",
                                            }}
                                        />
                                    )}
                                    {done ? (
                                        <button
                                            onClick={() => setStep(s.index)}
                                            title={`Go back to Step ${s.index}`}
                                            className="font-inherit cursor-pointer border-none bg-[none] p-[0px]"
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                gap: 6,
                                            }}
                                        >
                                            <div
                                                className="h-[26px] w-[26px] shrink-0 border-[1px] border-solid border-[var(--color-hex-9e1118)] bg-[var(--color-hex-120608)] text-[10px] font-bold tracking-[0.06em] text-[var(--color-hex-9e1118)]"
                                                style={{
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                ✓
                                            </div>
                                            <span className="text-[7.5px] tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-6f171b)]">
                                                {s.label}
                                            </span>
                                        </button>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1.5">
                                            <div
                                                className="h-[26px] w-[26px] shrink-0 text-[10px] font-bold tracking-[0.06em]"
                                                style={{
                                                    borderRadius: "50%",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border: active
                                                        ? "1px solid var(--color-hex-e31b23)"
                                                        : "1px solid var(--color-hex-292929)",
                                                    background: active
                                                        ? "var(--color-hex-1a0a0b)"
                                                        : "var(--color-hex-111111)",
                                                    color: active
                                                        ? "var(--color-hex-ff2a32)"
                                                        : "var(--color-hex-444444)",
                                                }}
                                            >
                                                {s.index}
                                            </div>
                                            <span
                                                className="text-[7.5px] tracking-[0.16em] whitespace-nowrap"
                                                style={{
                                                    color: active
                                                        ? "var(--color-hex-a0a0a0)"
                                                        : "var(--color-hex-333333)",
                                                }}
                                            >
                                                {s.label}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Body */}
                <div className="flex min-h-[0px] flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 py-8">
                        <div className="max-w-[600px]">
                            {/* ── STEPS ── */}
                            {step === 1 && <NewMissionWizardView.Step1 />}
                            {step === 2 && <NewMissionWizardView.Step2 />}
                            {step === 3 && <NewMissionWizardView.Step3 />}
                            {step === 4 && <NewMissionWizardView.Step4 />}
                            {step === 5 && <NewMissionWizardView.Step5 />}
                        </div>
                    </div>

                    {/* Right: mission summary */}
                    <div
                        className="flex w-[264px] flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0b0b0b)]"
                        style={{
                            borderLeft: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        <div
                            className="px-5 pt-5 pb-4"
                            style={{
                                borderBottom: "1px solid var(--color-hex-1e1e1e)",
                            }}
                        >
                            <div className="mb-[10px] text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                MISSION SUMMARY
                            </div>
                            <div className="flex flex-col gap-3">
                                <MetaRow label="TARGET" value={target || "—"} highlight />
                                <MetaRow label="TARGET TYPE" value={targetType} />
                                <MetaRow label="SURFACE" value={step >= 3 ? surface : "—"} />
                                <MetaRow label="MODE" value={step >= 4 ? mode : "—"} />
                                <MetaRow
                                    label="MAX RUNTIME"
                                    value={runtimeNum ? runtimeLabel() : "—"}
                                />
                                <MetaRow
                                    label="COST CEILING"
                                    value={costNum ? `$${costNum.toFixed(2)}` : "—"}
                                    highlight={costNum > 0}
                                />
                                <MetaRow
                                    label="TOOL TIMEOUT"
                                    value={timeoutNum ? `${timeoutNum}s` : "—"}
                                />
                            </div>
                        </div>

                        {/* ROE preview */}
                        {step >= 2 && roe && (
                            <div
                                className="px-5 pt-4 pb-4"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                                }}
                            >
                                <div className="mb-[8px] text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                    ROE PREVIEW
                                </div>
                                <div
                                    className="overflow-hidden text-[9px] leading-[1.7] tracking-[0.06em] text-[var(--color-hex-333333)]"
                                    style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 6,
                                        WebkitBoxOrient: "vertical" as const,
                                    }}
                                >
                                    {roe}
                                </div>
                            </div>
                        )}

                        <div className="px-5 pt-4">
                            <div className="mb-[8px] text-[9px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                VALIDATION
                            </div>
                            <div className="text-[9px] leading-[1.8] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                Oracle validation available for BENCHMARK ENVIRONMENT targets.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div
                    className="flex flex-shrink-0 items-center justify-between bg-[var(--color-hex-0b0b0b)] px-6 py-4"
                    style={{
                        borderTop: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <button
                        onClick={onCancel}
                        className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[transparent] px-[18px] py-[7px] text-[10px] tracking-[0.18em] text-[var(--color-hex-666666)] hover:border-[var(--color-hex-444444)]"
                    >
                        CANCEL
                    </button>
                    <div className="flex items-center gap-3">
                        {step > 1 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[transparent] px-[18px] py-[7px] text-[10px] tracking-[0.18em] text-[var(--color-hex-a0a0a0)] hover:border-[var(--color-hex-444444)]"
                            >
                                ← BACK
                            </button>
                        )}
                        <button
                            onClick={() => {
                                if (step < 5) {
                                    setStep(step + 1);
                                } else {
                                    logEvent("MISSION_CREATED", {
                                        target,
                                        targetType,
                                        surface,
                                        mode,
                                    });
                                    eventBus.publish<AuditEntry>(AUDIT_EVENT, {
                                        id: `EV-${Date.now().toString().slice(-6)}`,
                                        ts: new Date().toLocaleTimeString("en-US", {
                                            hour12: false,
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        }),
                                        type: "MISSION",
                                        actor: "user",
                                        action: "CREATE",
                                        resource: `mission/${target}`,
                                        result: AUDIT_RESULT.SUCCESS,
                                        ip: "127.0.0.1",
                                        detail: `Created mission for ${target} (${surface}, ${mode})`,
                                    });
                                    onStart?.();
                                }
                            }}
                            className="font-inherit cursor-pointer rounded-[2px] border-none bg-[var(--color-hex-e31b23)] text-[10px] font-semibold tracking-[0.18em] text-[var(--color-hex-f2f2f2)] hover:bg-[var(--color-hex-ff2a32)]"
                            style={{
                                padding: step === 5 ? "8px 32px" : "8px 24px",
                            }}
                        >
                            {step === 5 ? "START MISSION →" : "NEXT →"}
                        </button>
                    </div>
                </div>
            </div>
            );
        </WizardContext.Provider>
    );
}

NewMissionWizardView.Step1 = Step1;
NewMissionWizardView.Step2 = Step2;
NewMissionWizardView.Step3 = Step3;
NewMissionWizardView.Step4 = Step4;
NewMissionWizardView.Step5 = Step5;
