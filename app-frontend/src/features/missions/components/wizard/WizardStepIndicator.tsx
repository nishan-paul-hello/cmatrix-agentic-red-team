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
        <div
            className="flex-shrink-0 bg-[var(--color-hex-0b0b0b)] px-6 py-4"
            style={{
                borderBottom: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div className="flex items-center">
                {steps.map((s, i) => {
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
    );
}
