import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
import { WizardMissionSummary } from "@/features/missions/components/wizard/WizardMissionSummary";
import { WizardStepIndicator } from "@/features/missions/components/wizard/WizardStepIndicator";
import { AUDIT_RESULT, type AuditEntry } from "@/types/domain-types";

export default function NewMissionWizardView(props: WizardContextType) {
    const { eventBus, logEvent } = props;
    const { step, setStep, form, onCancel, onStart } = props;

    const target = form.watch("target");
    const targetType = form.watch("targetType");
    const surface = form.watch("surface");
    const mode = form.watch("mode");
    const roe = form.watch("roe");
    const maxRuntime = form.watch("maxRuntime");
    const costCeiling = form.watch("costCeiling");
    const toolTimeout = form.watch("toolTimeout");

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
            <Form {...form}>
                <div className="flex h-full min-h-0 flex-col">
                    {/* Page header */}
                    <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                        <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                            MISSIONS
                        </div>
                        <div className="flex items-baseline gap-3">
                            <h1 className="text-foreground text-xs font-bold tracking-wide">
                                NEW MISSION
                            </h1>
                            <span className="text-muted-foreground text-xs tracking-widest">
                                MISSION CONFIGURATION WIZARD
                            </span>
                        </div>
                    </div>

                    {/* Step indicator */}
                    <WizardStepIndicator step={step} setStep={setStep} />

                    {/* Body */}
                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
                        <div className="flex-1 overflow-y-auto px-6 py-8">
                            <div className="max-w-panel-xl">
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
                    <div className="bg-background border-border flex flex-shrink-0 items-center justify-between border-t px-6 py-4">
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            className="text-muted-foreground hover:text-foreground h-auto cursor-pointer rounded-sm px-4 py-1.5 text-xs tracking-widest"
                        >
                            CANCEL
                        </Button>
                        <div className="flex items-center gap-3">
                            {step > 1 && (
                                <Button
                                    variant="outline"
                                    onClick={() => setStep(step - 1)}
                                    className="text-muted-foreground hover:text-foreground h-auto cursor-pointer rounded-sm px-4 py-1.5 text-xs tracking-widest"
                                >
                                    ← BACK
                                </Button>
                            )}
                            <Button
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
                                className={`text-foreground hover:bg-destructive h-auto rounded-sm py-2 text-xs font-semibold tracking-widest ${step === 5 ? "px-8" : "px-6"} cursor-pointer`}
                            >
                                {step === 5 ? "START MISSION →" : "NEXT →"}
                            </Button>
                        </div>
                    </div>
                </div>
            </Form>
        </WizardContext.Provider>
    );
}

NewMissionWizardView.Step1 = Step1;
NewMissionWizardView.Step2 = Step2;
NewMissionWizardView.Step3 = Step3;
NewMissionWizardView.Step4 = Step4;
NewMissionWizardView.Step5 = Step5;
