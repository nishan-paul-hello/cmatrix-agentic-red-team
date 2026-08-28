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
                                    className="h-px w-5 shrink-0 sm:w-10"
                                    style={{
                                        background: done ? "var(--primary)" : "var(--border)",
                                    }}
                                />
                            )}
                            {done ? (
                                <Button
                                    variant="ghost"
                                    onClick={() => setStep(s.index)}
                                    title={`Go back to Step ${s.index}`}
                                    className="h-auto flex-col items-center gap-1.5 p-0 hover:bg-transparent"
                                >
                                    <div
                                        className="border-border bg-muted text-muted-foreground h-6 w-6 shrink-0 border-[1px] border-solid text-xs font-bold tracking-tight"
                                        style={{
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                        }}
                                    >
                                        ✓
                                    </div>
                                    <span className="text-muted-foreground hidden text-xs tracking-widest whitespace-nowrap sm:block">
                                        {s.label}
                                    </span>
                                </Button>
                            ) : (
                                <div className="flex flex-col items-center gap-1.5">
                                    <div
                                        className="h-6 w-6 shrink-0 text-xs font-bold tracking-tight"
                                        style={{
                                            borderRadius: "50%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: active
                                                ? "1px solid var(--primary)"
                                                : "1px solid var(--border)",
                                            background: active ? "var(--border)" : "var(--border)",
                                            color: active
                                                ? "var(--destructive)"
                                                : "var(--muted-foreground)",
                                        }}
                                    >
                                        {s.index}
                                    </div>
                                    <span
                                        className="hidden text-xs tracking-widest whitespace-nowrap sm:block"
                                        style={{
                                            color: active
                                                ? "var(--muted-foreground)"
                                                : "var(--border)",
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
    );
}
