import { AUDIT_EVENT } from "@/features/audit/hooks/useAuditFeed";
import { Step1 } from "@/features/missions/components/wizard/Step1";
import { Step2 } from "@/features/missions/components/wizard/Step2";
import { Step3 } from "@/features/missions/components/wizard/Step3";
import { Step4 } from "@/features/missions/components/wizard/Step4";
import { Step5 } from "@/features/missions/components/wizard/Step5";
import {
    WizardContext,
    type WizardContextType,
} from "@/features/missions/components/wizard/WizardContext";
import { AUDIT_RESULT, type AuditEntry } from "@/types/domain-types";

import { WizardMissionSummary } from "./WizardMissionSummary";
import { WizardStepIndicator } from "./WizardStepIndicator";

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
                <WizardStepIndicator step={step} setStep={setStep} />

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
                    <WizardMissionSummary
                        target={target}
                        targetType={targetType}
                        surface={surface}
                        mode={mode}
                        runtimeNum={runtimeNum}
                        runtimeLabel={runtimeLabel}
                        costNum={costNum}
                        timeoutNum={timeoutNum}
                        step={step}
                        roe={roe}
                    />
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
        </WizardContext.Provider>
    );
}

NewMissionWizardView.Step1 = Step1;
NewMissionWizardView.Step2 = Step2;
NewMissionWizardView.Step3 = Step3;
NewMissionWizardView.Step4 = Step4;
NewMissionWizardView.Step5 = Step5;
