import { RadioGroupItem, RadioGroup as ShadcnRadioGroup } from "@/components/ui/radio-group";
import { type ModeType } from "@/features/missions/data/fixtures/wizardMockData";
import { useWizardData } from "@/features/missions/hooks/useWizardData";

export default function ModeCards({
    value,
    onChange,
}: {
    value?: ModeType;
    onChange?: (v: ModeType) => void;
}) {
    const { modeOptions } = useWizardData();

    return (
        <ShadcnRadioGroup
            value={value}
            onValueChange={onChange}
            className="flex items-stretch gap-5"
        >
            {modeOptions.map((opt) => {
                const selected = value === opt.value;
                return (
                    <label
                        key={opt.value}
                        htmlFor={`mode-${opt.value}`}
                        className={`flex h-auto flex-1 cursor-pointer flex-col items-stretch justify-start rounded-sm border border-solid text-left whitespace-normal transition-colors duration-100 ${selected ? "border-primary bg-muted" : "border-border bg-background hover:border-muted-foreground hover:bg-card"}`}
                        style={{
                            padding: "22px 20px 18px",
                        }}
                    >
                        <RadioGroupItem
                            value={opt.value}
                            id={`mode-${opt.value}`}
                            className="sr-only"
                        />
                        {/* Top row: icon + title + selected dot */}
                        <div className="mb-1 flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                                <span
                                    className="text-xs leading-none"
                                    style={{
                                        color: selected
                                            ? "var(--primary)"
                                            : "var(--muted-foreground)",
                                    }}
                                >
                                    {opt.icon}
                                </span>
                                <span
                                    className="text-base font-bold tracking-widest"
                                    style={{
                                        color: selected
                                            ? "var(--foreground)"
                                            : "var(--muted-foreground)",
                                    }}
                                >
                                    {opt.value}
                                </span>
                            </div>
                            {selected && (
                                <div
                                    className="bg-primary mt-1 h-2 w-2 shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                    }}
                                />
                            )}
                        </div>

                        {/* Hint + badges row */}
                        <div className="mb-5 flex items-center gap-2">
                            <span
                                className="text-base font-semibold tracking-widest"
                                style={{
                                    color: selected ? "var(--border)" : "var(--border)",
                                }}
                            >
                                {opt.hint}
                            </span>
                            <span
                                className="rounded-sm px-1.5 py-px text-sm font-semibold tracking-widest"
                                style={{
                                    color: opt.badgeColor,
                                    background: `${opt.badgeColor}18`,
                                    border: `1px solid ${opt.badgeColor}44`,
                                }}
                            >
                                {opt.badge}
                            </span>
                            <span className="border-border bg-muted text-muted-foreground rounded-sm border-[1px] border-solid px-1.5 py-px text-sm tracking-widest">
                                {opt.difficulty}
                            </span>
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-4 h-px"
                            style={{
                                background: selected ? "var(--border)" : "var(--border)",
                            }}
                        />

                        {/* Description */}
                        <div className="text-muted-foreground mb-5 grow text-xs leading-relaxed tracking-tighter">
                            {opt.description}
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-3.5 h-px"
                            style={{
                                background: selected ? "var(--border)" : "var(--border)",
                            }}
                        />

                        {/* Implications list */}
                        <div className="flex flex-col gap-2">
                            {opt.implications.map((imp: { label: string; detail: string }) => (
                                <div key={imp.label} className="flex items-start gap-2">
                                    <span
                                        className="min-w-[96px] shrink-0 text-sm font-semibold tracking-widest"
                                        style={{
                                            color: selected ? "var(--primary)" : "var(--border)",
                                        }}
                                    >
                                        {imp.label}
                                    </span>
                                    <span className="text-muted-foreground text-sm leading-snug tracking-tight">
                                        {imp.detail}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </label>
                );
            })}
        </ShadcnRadioGroup>
    );
}
