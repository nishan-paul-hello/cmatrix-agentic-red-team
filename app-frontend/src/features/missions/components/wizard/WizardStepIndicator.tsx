import { Button } from "@/components/ui/button";
import { useWizardData } from "@/features/missions/hooks/useWizardData";

export function WizardStepIndicator({
    step,
    setStep,
}: {
    step: number;
    setStep: (s: number) => void;
}) {
    const { steps } = useWizardData();

    return (
        <div className="bg-background border-border flex-shrink-0 border-b px-6 py-4">
            <div className="flex items-center">
                {steps.map((s, i) => {
                    const active = s.index === step;
                    const done = s.index < step;
                    return (
                        <div key={s.id} className="flex items-center">
                            {i > 0 && (
                                <div
                                    className={`h-px w-5 shrink-0 sm:w-10 ${done ? "bg-primary" : "bg-border"}`}
                                />
                            )}
                            {done ? (
                                <Button
                                    variant="ghost"
                                    onClick={() => setStep(s.index)}
                                    title={`Go back to Step ${s.index}`}
                                    className="h-auto flex-col items-center gap-1.5 p-0 hover:bg-transparent"
                                >
                                    <div className="border-border bg-muted text-muted-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1px] border-solid text-xs font-bold tracking-tight">
                                        ✓
                                    </div>
                                    <span className="text-muted-foreground hidden text-xs tracking-widest whitespace-nowrap sm:block">
                                        {s.label}
                                    </span>
                                </Button>
                            ) : (
                                <div className="flex flex-col items-center gap-1.5">
                                    <div
                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-[1px] border-solid text-xs font-bold tracking-tight ${active ? "border-primary bg-border text-destructive" : "border-border bg-border text-muted-foreground"}`}
                                    >
                                        {s.index}
                                    </div>
                                    <span
                                        className={`hidden text-xs tracking-widest whitespace-nowrap sm:block ${active ? "text-muted-foreground" : "text-border"}`}
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
    );
}
